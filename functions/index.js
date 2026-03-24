const { onRequest } = require('firebase-functions/v2/https')
const admin = require('firebase-admin')
const cors = require('cors')
const Stripe = require('stripe')

admin.initializeApp()

const corsHandler = cors({ origin: true })

const parseBody = (req) => {
  if (!req.body || typeof req.body !== 'object') {
    return {}
  }

  return req.body
}

const isValidUid = (value) => typeof value === 'string' && value.length > 3
const getEnv = (name) => (typeof process.env[name] === 'string' ? process.env[name] : '')
const DEMO_TARGET_EMAIL = 'hugo.kaba@gmail.com'

const activateSubscription = async ({ uid, plan, customerId, subscriptionId }) => {
  await admin
    .firestore()
    .collection('users')
    .doc(uid)
    .set(
      {
        subscriptionPlan: plan,
        subscriptionStatus: 'active',
        stripeCustomerId: customerId ?? null,
        stripeSubscriptionId: subscriptionId ?? null,
        updatedAt: Date.now(),
      },
      { merge: true },
    )
}

exports.stripeApi = onRequest(
  {
    region: 'europe-west1',
  },
  async (req, res) => {
    return corsHandler(req, res, async () => {
      if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' })
        return
      }

      const secretKey = getEnv('STRIPE_SECRET_KEY')
      const priceId = getEnv('STRIPE_PRICE_ID')
      const baseUrl = getEnv('APP_BASE_URL')

      if (!secretKey || !priceId || !baseUrl) {
        res.status(500).json({ error: 'Stripe backend non configuré (STRIPE_SECRET_KEY / STRIPE_PRICE_ID / APP_BASE_URL).' })
        return
      }

      const stripe = new Stripe(secretKey)
      const body = parseBody(req)

      try {
        if (req.path.endsWith('/create-checkout-session')) {
          const uid = typeof body.uid === 'string' ? body.uid : ''
          const email = typeof body.email === 'string' ? body.email : undefined

          if (!isValidUid(uid)) {
            res.status(400).json({ error: 'uid manquant' })
            return
          }

          const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            ui_mode: 'embedded',
            line_items: [{ price: priceId, quantity: 1 }],
            client_reference_id: uid,
            customer_email: email,
            return_url: `${baseUrl}/billing?session_id={CHECKOUT_SESSION_ID}`,
          })

          res.status(200).json({
            clientSecret: session.client_secret,
            sessionId: session.id,
          })
          return
        }

        if (req.path.endsWith('/verify-session')) {
          const uid = typeof body.uid === 'string' ? body.uid : ''
          const sessionId = typeof body.sessionId === 'string' ? body.sessionId : ''

          if (!isValidUid(uid) || sessionId.length < 4) {
            res.status(400).json({ error: 'paramètres invalides' })
            return
          }

          const session = await stripe.checkout.sessions.retrieve(sessionId)
          const paid =
            session.status === 'complete' &&
            (session.payment_status === 'paid' || session.payment_status === 'no_payment_required')

          if (paid) {
            await activateSubscription({
              uid,
              plan: 'pro',
              customerId: typeof session.customer === 'string' ? session.customer : undefined,
              subscriptionId: typeof session.subscription === 'string' ? session.subscription : undefined,
            })

            res.status(200).json({ status: 'active', plan: 'pro' })
            return
          }

          res.status(200).json({ status: 'inactive', plan: 'free' })
          return
        }

        res.status(404).json({ error: 'not_found' })
      } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Stripe error' })
      }
    })
  },
)

const clearCollectionByUser = async (collectionName, userId) => {
  const snapshot = await admin.firestore().collection(collectionName).where('userId', '==', userId).get()
  if (snapshot.empty) {
    return
  }

  const batch = admin.firestore().batch()
  snapshot.docs.forEach((docSnapshot) => {
    batch.delete(docSnapshot.ref)
  })
  await batch.commit()
}

const getAuthHeaderToken = (req) => {
  const raw = req.headers.authorization
  if (typeof raw !== 'string' || !raw.startsWith('Bearer ')) {
    return ''
  }
  return raw.slice('Bearer '.length).trim()
}

const ensureAuthenticatedUid = async (req, uid) => {
  const bearer = getAuthHeaderToken(req)
  if (!bearer) {
    throw new Error('auth_missing')
  }
  const decoded = await admin.auth().verifyIdToken(bearer)
  if (decoded.uid !== uid) {
    throw new Error('auth_forbidden')
  }
}

const getGithubConfig = () => ({
  clientId: getEnv('GITHUB_CLIENT_ID'),
  clientSecret: getEnv('GITHUB_CLIENT_SECRET'),
})

const exchangeGithubCode = async ({ code, redirectUri }) => {
  const { clientId, clientSecret } = getGithubConfig()
  if (!clientId || !clientSecret) {
    throw new Error('github_not_configured')
  }

  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  })

  if (!tokenResponse.ok) {
    throw new Error('github_exchange_failed')
  }

  const tokenData = await tokenResponse.json()
  if (!tokenData || typeof tokenData.access_token !== 'string' || tokenData.access_token.length < 8) {
    throw new Error('github_token_invalid')
  }

  return {
    accessToken: tokenData.access_token,
    scope: typeof tokenData.scope === 'string' ? tokenData.scope : '',
  }
}

const fetchGithubUser = async (accessToken) => {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'User-Agent': 'flexpilot-app',
      Accept: 'application/vnd.github+json',
    },
  })

  if (!response.ok) {
    throw new Error('github_user_failed')
  }

  const data = await response.json()
  return {
    id: typeof data.id === 'number' ? String(data.id) : '',
    login: typeof data.login === 'string' ? data.login : '',
    avatarUrl: typeof data.avatar_url === 'string' ? data.avatar_url : '',
    profileUrl: typeof data.html_url === 'string' ? data.html_url : '',
  }
}

const fetchGithubRepos = async (accessToken) => {
  const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=20', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'User-Agent': 'flexpilot-app',
      Accept: 'application/vnd.github+json',
    },
  })

  if (!response.ok) {
    throw new Error('github_repos_failed')
  }

  const repos = await response.json()
  if (!Array.isArray(repos)) {
    return []
  }

  return repos.map((repo) => ({
    id: typeof repo.id === 'number' ? String(repo.id) : '',
    name: typeof repo.name === 'string' ? repo.name : '',
    fullName: typeof repo.full_name === 'string' ? repo.full_name : '',
    private: Boolean(repo.private),
    defaultBranch: typeof repo.default_branch === 'string' ? repo.default_branch : 'main',
    updatedAt: typeof repo.updated_at === 'string' ? repo.updated_at : '',
    url: typeof repo.html_url === 'string' ? repo.html_url : '',
  }))
}

const generateDemoSprints = () => {
  const now = Date.now()
  return [
    {
      name: 'Sprint 31 - Core Delivery',
      goal: 'Stabiliser le board et la priorisation produit.',
      startDate: '2026-03-03',
      endDate: '2026-03-16',
      status: 'closed',
      createdAt: now - 1000 * 60 * 60 * 24 * 16,
      updatedAt: now - 1000 * 60 * 60 * 24 * 8,
    },
    {
      name: 'Sprint 32 - Payment & Team',
      goal: 'Paiement Stripe embedded + invitations équipe.',
      startDate: '2026-03-17',
      endDate: '2026-03-30',
      status: 'active',
      createdAt: now - 1000 * 60 * 60 * 24 * 7,
      updatedAt: now - 1000 * 60 * 60 * 24 * 1,
    },
    {
      name: 'Sprint 33 - Reporting Boost',
      goal: 'Ajout rapports avancés et objectifs trimestriels.',
      startDate: '2026-03-31',
      endDate: '2026-04-13',
      status: 'planned',
      createdAt: now - 1000 * 60 * 60 * 24 * 1,
      updatedAt: now - 1000 * 60 * 60 * 24 * 1,
    },
  ]
}

const generateDemoWorkItems = (userId, sprintIds) => {
  const now = Date.now()
  const assignees = ['Hugo Kaba', 'Alex PM', 'Maya Dev', 'Nina QA']
  const labels = [
    ['core', 'delivery'],
    ['stripe', 'payment'],
    ['team', 'collab'],
    ['reporting', 'kpi'],
    ['ux', 'polish'],
  ]
  const statuses = ['todo', 'in_progress', 'review', 'done']
  const priorities = ['low', 'medium', 'high', 'critical']
  const types = ['feature', 'story', 'task', 'bug']

  const items = []
  for (let i = 0; i < 36; i += 1) {
    const status = statuses[i % statuses.length]
    const sprintId = i < 24 ? sprintIds[i % 2] : sprintIds[2]
    items.push({
      userId,
      title: `Work Item ${i + 1} - ${status.toUpperCase()}`,
      description: `Item de démonstration ${i + 1} pour charger backlog, board et team.`,
      type: types[i % types.length],
      status,
      priority: priorities[i % priorities.length],
      estimate: (i % 8) + 1,
      assignee: assignees[i % assignees.length],
      labels: labels[i % labels.length],
      sprintId,
      parentId: null,
      rank: i,
      createdAt: now - i * 1000 * 60 * 20,
      updatedAt: now - i * 1000 * 60 * 10,
    })
  }

  return items
}

exports.workspaceApi = onRequest(
  {
    region: 'europe-west1',
  },
  async (req, res) => {
    return corsHandler(req, res, async () => {
      if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' })
        return
      }

      const body = parseBody(req)

      try {
        if (req.path.endsWith('/github/exchange-code')) {
          const uid = typeof body.uid === 'string' ? body.uid : ''
          const code = typeof body.code === 'string' ? body.code : ''
          const redirectUri = typeof body.redirectUri === 'string' ? body.redirectUri : ''

          if (!isValidUid(uid) || code.length < 6 || redirectUri.length < 8) {
            res.status(400).json({ error: 'github_invalid_payload' })
            return
          }

          await ensureAuthenticatedUid(req, uid)

          const exchanged = await exchangeGithubCode({ code, redirectUri })
          const ghUser = await fetchGithubUser(exchanged.accessToken)

          if (!ghUser.login) {
            res.status(502).json({ error: 'github_user_not_found' })
            return
          }

          await admin
            .firestore()
            .collection('users')
            .doc(uid)
            .set(
              {
                github: {
                  connected: true,
                  accountId: ghUser.id,
                  login: ghUser.login,
                  avatarUrl: ghUser.avatarUrl,
                  profileUrl: ghUser.profileUrl,
                  accessToken: exchanged.accessToken,
                  scope: exchanged.scope,
                  connectedAt: Date.now(),
                },
                updatedAt: Date.now(),
              },
              { merge: true },
            )

          res.status(200).json({
            connected: true,
            login: ghUser.login,
            avatarUrl: ghUser.avatarUrl,
            profileUrl: ghUser.profileUrl,
          })
          return
        }

        if (req.path.endsWith('/github/status')) {
          const uid = typeof body.uid === 'string' ? body.uid : ''
          if (!isValidUid(uid)) {
            res.status(400).json({ error: 'github_invalid_uid' })
            return
          }

          await ensureAuthenticatedUid(req, uid)

          const snapshot = await admin.firestore().collection('users').doc(uid).get()
          const github = snapshot.exists ? snapshot.data().github : null

          if (!github || github.connected !== true) {
            res.status(200).json({ connected: false })
            return
          }

          res.status(200).json({
            connected: true,
            login: typeof github.login === 'string' ? github.login : '',
            avatarUrl: typeof github.avatarUrl === 'string' ? github.avatarUrl : '',
            profileUrl: typeof github.profileUrl === 'string' ? github.profileUrl : '',
            scope: typeof github.scope === 'string' ? github.scope : '',
          })
          return
        }

        if (req.path.endsWith('/github/repos')) {
          const uid = typeof body.uid === 'string' ? body.uid : ''
          if (!isValidUid(uid)) {
            res.status(400).json({ error: 'github_invalid_uid' })
            return
          }

          await ensureAuthenticatedUid(req, uid)

          const snapshot = await admin.firestore().collection('users').doc(uid).get()
          const github = snapshot.exists ? snapshot.data().github : null

          if (!github || github.connected !== true || typeof github.accessToken !== 'string' || github.accessToken.length < 8) {
            res.status(200).json({ repos: [] })
            return
          }

          const repos = await fetchGithubRepos(github.accessToken)
          res.status(200).json({ repos })
          return
        }

        if (req.path.endsWith('/github/disconnect')) {
          const uid = typeof body.uid === 'string' ? body.uid : ''
          if (!isValidUid(uid)) {
            res.status(400).json({ error: 'github_invalid_uid' })
            return
          }

          await ensureAuthenticatedUid(req, uid)
          await admin
            .firestore()
            .collection('users')
            .doc(uid)
            .set(
              {
                github: {
                  connected: false,
                  accountId: null,
                  login: '',
                  avatarUrl: '',
                  profileUrl: '',
                  accessToken: '',
                  scope: '',
                  connectedAt: null,
                },
                updatedAt: Date.now(),
              },
              { merge: true },
            )
          res.status(200).json({ connected: false })
          return
        }

        if (req.path.endsWith('/seed-demo')) {
          const email = typeof body.email === 'string' ? body.email.toLowerCase() : ''

          if (email !== DEMO_TARGET_EMAIL) {
            res.status(403).json({ error: 'Seed autorisé uniquement pour le compte de démonstration.' })
            return
          }

          const userRecord = await admin.auth().getUserByEmail(email)
          const uid = userRecord.uid

          await Promise.all([clearCollectionByUser('workItems', uid), clearCollectionByUser('sprints', uid)])

          const sprints = generateDemoSprints()
          const batch = admin.firestore().batch()
          const sprintRefs = sprints.map(() => admin.firestore().collection('sprints').doc())

          sprints.forEach((sprint, index) => {
            batch.set(sprintRefs[index], {
              ...sprint,
              userId: uid,
            })
          })

          const sprintIds = sprintRefs.map((ref) => ref.id)
          const workItems = generateDemoWorkItems(uid, sprintIds)
          const workItemRefs = workItems.map(() => admin.firestore().collection('workItems').doc())
          workItems.forEach((item, index) => {
            batch.set(workItemRefs[index], item)
          })

          batch.set(
            admin.firestore().collection('users').doc(uid),
            {
              subscriptionPlan: 'pro',
              subscriptionStatus: 'active',
              updatedAt: Date.now(),
            },
            { merge: true },
          )

          await batch.commit()

          res.status(200).json({
            ok: true,
            seededSprints: sprints.length,
            seededWorkItems: workItems.length,
            uid,
          })
          return
        }

        res.status(404).json({ error: 'not_found' })
      } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Workspace API error' })
      }
    })
  },
)

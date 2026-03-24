import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const baseUrl = process.env.SCREENSHOT_BASE_URL || 'https://archi-front.web.app'
const outDir = process.env.SCREENSHOT_OUT_DIR || 'docs/screenshots'

const main = async () => {
  await mkdir(outDir, { recursive: true })
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1728, height: 1080 } })

  await context.addInitScript(() => {
    const state = {
      displayName: 'Demo User',
      role: 'Product Manager',
      timezone: 'Europe/Paris',
      currency: 'EUR',
      density: 'comfortable',
      emailNotifications: true,
      pushNotifications: true,
      weeklyDigest: true,
      boardWipLimit: 5,
      defaultSprintDurationDays: 14,
      showStoryPoints: true,
      subscriptionPlan: 'pro',
      subscriptionStatus: 'active',
    }
    localStorage.setItem('saas-preferences', JSON.stringify({ state, version: 2 }))
    localStorage.setItem('saas-theme', JSON.stringify({ state: { mode: 'dark' }, version: 0 }))
    localStorage.setItem('saas-language', JSON.stringify({ state: { language: 'fr' }, version: 0 }))
  })

  const page = await context.newPage()

  await page.goto(`${baseUrl}/auth`, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForTimeout(2000)
  await page.screenshot({ path: `${outDir}/01-auth.png`, fullPage: true })

  const email = `demo_${Date.now()}@flexpilot.app`
  const password = 'FlexPilot123!'

  const switchToRegister = page.getByRole('button', { name: /Créer un compte|Create account/i }).first()
  await switchToRegister.click()
  await page.locator('input[type="email"]').fill(email)
  await page.locator('input[type="password"]').fill(password)
  const submitButton = page.getByRole('button', { name: /Créer un compte|Create account/i }).first()
  await submitButton.click()
  await page.waitForURL((url) => !url.pathname.includes('/auth'), { timeout: 20000 })

  const routes = [
    { path: '/dashboard', file: '02-dashboard.png' },
    { path: '/backlog', file: '03-backlog.png' },
    { path: '/board', file: '04-board.png' },
    { path: '/sprints', file: '05-sprints.png' },
    { path: '/settings', file: '06-settings.png' },
    { path: '/billing', file: '07-billing.png' },
    { path: '/integrations', file: '08-integrations.png' },
  ]

  for (const route of routes) {
    await page.goto(`${baseUrl}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(2500)
    await page.screenshot({ path: `${outDir}/${route.file}`, fullPage: true })
  }

  await browser.close()
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
  process.exit(1)
})

export const queryKeys = {
  projects: {
    all: ['projects'] as const,
    list: (userId: string) => ['projects', userId] as const,
    detail: (userId: string, projectId: string) => ['projects', userId, projectId] as const,
  },
  workItems: {
    all: ['workItems'] as const,
    list: (userId: string) => ['workItems', userId] as const,
    detail: (userId: string, itemId: string) => ['workItems', userId, itemId] as const,
    board: (userId: string) => ['workItems', 'board', userId] as const,
  },
  sprints: {
    all: ['sprints'] as const,
    list: (userId: string) => ['sprints', userId] as const,
    detail: (userId: string, sprintId: string) => ['sprints', userId, sprintId] as const,
  },
  subscriptions: {
    all: ['subscriptions'] as const,
    user: (uid: string) => ['subscriptions', uid] as const,
    verifySession: (uid: string, sessionId: string) => ['subscriptions', 'verify', uid, sessionId] as const,
  },
  github: {
    all: ['github'] as const,
    status: (uid: string) => ['github', 'status', uid] as const,
    repos: (uid: string) => ['github', 'repos', uid] as const,
    exchange: (uid: string, code: string) => ['github', 'exchange', uid, code] as const,
  },
} as const

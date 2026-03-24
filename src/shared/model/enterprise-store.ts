import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type PortfolioLevel = 'initiative' | 'program' | 'release'
export type DependencyType = 'blocks' | 'relates' | 'depends_on'
export type RoleLevel = 'owner' | 'admin' | 'manager' | 'contributor' | 'viewer'

export interface PortfolioNode {
  id: string
  title: string
  level: PortfolioLevel
  owner: string
  progress: number
}

export interface PortfolioDependency {
  id: string
  fromId: string
  toId: string
  type: DependencyType
}

export interface WorkflowDefinition {
  type: 'epic' | 'feature' | 'story' | 'task' | 'bug'
  statuses: string[]
  transitions: Array<{ from: string; to: string }>
}

export interface AutomationRule {
  id: string
  name: string
  trigger: 'on_status_change' | 'daily' | 'on_sprint_closed'
  condition: string
  action: string
  enabled: boolean
}

export interface DevopsIntegration {
  id: string
  provider: 'github' | 'gitlab' | 'ci_suite'
  status: 'connected' | 'disconnected'
  repo: string
  syncedPullRequests: number
  syncedPipelines: number
}

export interface ReportWidget {
  id: string
  type: 'burnup' | 'lead_time' | 'flow' | 'velocity'
  title: string
  formula: string
  visible: boolean
}

export interface TeamAccess {
  id: string
  member: string
  role: RoleLevel
  scope: 'workspace' | 'team' | 'project'
}

export interface TeamDefinition {
  id: string
  name: string
  lead: string
  productOwner: string
  members: string[]
}

interface EnterpriseState {
  portfolio: PortfolioNode[]
  dependencies: PortfolioDependency[]
  workflows: WorkflowDefinition[]
  rules: AutomationRule[]
  integrations: DevopsIntegration[]
  widgets: ReportWidget[]
  access: TeamAccess[]
  teams: TeamDefinition[]
  addPortfolioNode: (payload: Omit<PortfolioNode, 'id'>) => void
  addDependency: (payload: Omit<PortfolioDependency, 'id'>) => void
  addRule: (payload: Omit<AutomationRule, 'id'>) => void
  toggleRule: (id: string) => void
  updateWorkflowStatuses: (type: WorkflowDefinition['type'], statuses: string[]) => void
  setIntegrationStatus: (id: string, status: DevopsIntegration['status']) => void
  toggleWidget: (id: string) => void
  setRole: (id: string, role: RoleLevel) => void
  addTeam: (payload: Omit<TeamDefinition, 'id'>) => void
  addTeamMember: (teamId: string, member: string) => void
}

const defaultWorkflows: WorkflowDefinition[] = [
  {
    type: 'epic',
    statuses: ['todo', 'in_progress', 'review', 'done'],
    transitions: [
      { from: 'todo', to: 'in_progress' },
      { from: 'in_progress', to: 'review' },
      { from: 'review', to: 'done' },
    ],
  },
  {
    type: 'feature',
    statuses: ['todo', 'in_progress', 'review', 'done'],
    transitions: [
      { from: 'todo', to: 'in_progress' },
      { from: 'in_progress', to: 'review' },
      { from: 'review', to: 'done' },
    ],
  },
  {
    type: 'story',
    statuses: ['todo', 'in_progress', 'review', 'done'],
    transitions: [
      { from: 'todo', to: 'in_progress' },
      { from: 'in_progress', to: 'review' },
      { from: 'review', to: 'done' },
    ],
  },
  {
    type: 'task',
    statuses: ['todo', 'in_progress', 'review', 'done'],
    transitions: [
      { from: 'todo', to: 'in_progress' },
      { from: 'in_progress', to: 'review' },
      { from: 'review', to: 'done' },
    ],
  },
  {
    type: 'bug',
    statuses: ['todo', 'in_progress', 'review', 'done'],
    transitions: [
      { from: 'todo', to: 'in_progress' },
      { from: 'in_progress', to: 'review' },
      { from: 'review', to: 'done' },
    ],
  },
]

const makeId = (prefix: string): string => `${prefix}_${Math.random().toString(36).slice(2, 9)}`

export const useEnterpriseStore = create<EnterpriseState>()(
  persist(
    (set) => ({
      portfolio: [
        { id: 'init_1', title: 'Initiative Growth 2026', level: 'initiative', owner: 'Hugo Kaba', progress: 42 },
        { id: 'prog_1', title: 'Program Payment Experience', level: 'program', owner: 'Alex PM', progress: 58 },
        { id: 'rel_1', title: 'Release Q2.1', level: 'release', owner: 'Maya Dev', progress: 67 },
      ],
      dependencies: [{ id: 'dep_1', fromId: 'prog_1', toId: 'rel_1', type: 'depends_on' }],
      workflows: defaultWorkflows,
      rules: [
        {
          id: 'rule_1',
          name: 'Auto assign QA on review',
          trigger: 'on_status_change',
          condition: "status == 'review'",
          action: 'assignTo(Nina QA)',
          enabled: true,
        },
      ],
      integrations: [
        {
          id: 'int_gh',
          provider: 'github',
          status: 'connected',
          repo: 'hugokaba/flexpilot',
          syncedPullRequests: 128,
          syncedPipelines: 72,
        },
        {
          id: 'int_gl',
          provider: 'gitlab',
          status: 'disconnected',
          repo: 'group/flexpilot-ui',
          syncedPullRequests: 0,
          syncedPipelines: 0,
        },
        {
          id: 'int_az',
          provider: 'ci_suite',
          status: 'connected',
          repo: 'FlexPilot/DeliveryBoard',
          syncedPullRequests: 94,
          syncedPipelines: 144,
        },
      ],
      widgets: [
        { id: 'w1', type: 'burnup', title: 'Burn-up Delivery', formula: 'done_points / total_points', visible: true },
        { id: 'w2', type: 'lead_time', title: 'Lead Time', formula: 'avg(doneAt - createdAt)', visible: true },
        { id: 'w3', type: 'flow', title: 'Flow Efficiency', formula: 'active_time / total_time', visible: true },
        { id: 'w4', type: 'velocity', title: 'Velocity Forecast', formula: 'sum(done_points per sprint)', visible: false },
      ],
      access: [
        { id: 'a1', member: 'Hugo Kaba', role: 'owner', scope: 'workspace' },
        { id: 'a2', member: 'Alex PM', role: 'manager', scope: 'team' },
        { id: 'a3', member: 'Maya Dev', role: 'contributor', scope: 'project' },
        { id: 'a4', member: 'Nina QA', role: 'viewer', scope: 'team' },
      ],
      teams: [
        {
          id: 't1',
          name: 'Core Platform',
          lead: 'Maya Dev',
          productOwner: 'Alex PM',
          members: ['Hugo Kaba', 'Maya Dev', 'Nina QA'],
        },
        {
          id: 't2',
          name: 'Growth Delivery',
          lead: 'Léo Lead',
          productOwner: 'Emma PO',
          members: ['Léo Lead', 'Emma PO', 'Nora Dev'],
        },
      ],
      addPortfolioNode: (payload) =>
        set((state) => ({
          portfolio: [
            ...state.portfolio,
            {
              ...payload,
              id: makeId('portfolio'),
            },
          ],
        })),
      addDependency: (payload) =>
        set((state) => ({
          dependencies: [
            ...state.dependencies,
            {
              ...payload,
              id: makeId('dep'),
            },
          ],
        })),
      addRule: (payload) =>
        set((state) => ({
          rules: [
            ...state.rules,
            {
              ...payload,
              id: makeId('rule'),
            },
          ],
        })),
      toggleRule: (id) =>
        set((state) => ({
          rules: state.rules.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)),
        })),
      updateWorkflowStatuses: (type, statuses) =>
        set((state) => ({
          workflows: state.workflows.map((workflow) =>
            workflow.type === type
              ? {
                  ...workflow,
                  statuses,
                  transitions: statuses
                    .slice(0, -1)
                    .map((status, index) => ({ from: status, to: statuses[index + 1] })),
                }
              : workflow,
          ),
        })),
      setIntegrationStatus: (id, status) =>
        set((state) => ({
          integrations: state.integrations.map((integration) => (integration.id === id ? { ...integration, status } : integration)),
        })),
      toggleWidget: (id) =>
        set((state) => ({
          widgets: state.widgets.map((widget) => (widget.id === id ? { ...widget, visible: !widget.visible } : widget)),
        })),
      setRole: (id, role) =>
        set((state) => ({
          access: state.access.map((entry) => (entry.id === id ? { ...entry, role } : entry)),
        })),
      addTeam: (payload) =>
        set((state) => ({
          teams: [
            ...state.teams,
            {
              ...payload,
              id: makeId('team'),
            },
          ],
        })),
      addTeamMember: (teamId, member) =>
        set((state) => ({
          teams: state.teams.map((team) =>
            team.id === teamId && !team.members.includes(member)
              ? { ...team, members: [...team.members, member] }
              : team,
          ),
        })),
    }),
    {
      name: 'enterprise-studio',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

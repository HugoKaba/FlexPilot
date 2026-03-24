import { useEnterpriseStore, type RoleLevel } from '@/shared/model'
import { Card, FieldSelect } from '@/shared/ui'

export const GovernancePanel = () => {
  const access = useEnterpriseStore((state) => state.access)
  const setRole = useEnterpriseStore((state) => state.setRole)

  return (
    <Card className="enterprise-card">
      <h2>Governance & RBAC</h2>
      <p className="page-subtitle">Rôles détaillés, scopes workspace/team/project et contrôle de visibilité.</p>

      <div className="enterprise-list">
        {access.map((entry) => (
          <article key={entry.id} className="enterprise-item enterprise-row">
            <div>
              <p><strong>{entry.member}</strong></p>
              <p className="page-subtitle">Scope: {entry.scope}</p>
            </div>
            <FieldSelect value={entry.role} onChange={(event) => setRole(entry.id, event.target.value as RoleLevel)}>
              <option value="owner">owner</option>
              <option value="admin">admin</option>
              <option value="manager">manager</option>
              <option value="contributor">contributor</option>
              <option value="viewer">viewer</option>
            </FieldSelect>
          </article>
        ))}
      </div>
    </Card>
  )
}

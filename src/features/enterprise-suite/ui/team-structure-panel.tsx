import { useState } from 'react'
import { useEnterpriseStore } from '@/shared/model'
import { Button, Card, FieldInput, FieldSelect } from '@/shared/ui'

export const TeamStructurePanel = () => {
  const teams = useEnterpriseStore((state) => state.teams)
  const addTeam = useEnterpriseStore((state) => state.addTeam)
  const addTeamMember = useEnterpriseStore((state) => state.addTeamMember)

  const [name, setName] = useState('')
  const [lead, setLead] = useState('')
  const [productOwner, setProductOwner] = useState('')
  const [memberName, setMemberName] = useState('')
  const [selectedTeamId, setSelectedTeamId] = useState('')

  return (
    <section className="page">
      <Card className="enterprise-card">
        <h2>Organisation Multi-Teams</h2>
        <p className="page-subtitle">Crée des équipes, nomme un Team Lead et un Product Owner, puis ajoute les membres.</p>

        <div className="grid-4">
          <label className="field">
            Nom équipe
            <FieldInput value={name} onChange={(event) => setName(event.target.value)} placeholder="Squad Checkout" />
          </label>
          <label className="field">
            Team Lead
            <FieldInput value={lead} onChange={(event) => setLead(event.target.value)} placeholder="Lead name" />
          </label>
          <label className="field">
            Product Owner
            <FieldInput value={productOwner} onChange={(event) => setProductOwner(event.target.value)} placeholder="PO name" />
          </label>
          <div className="field">
            <span>&nbsp;</span>
            <Button
              type="button"
              tone="primary"
              disabled={!name.trim() || !lead.trim() || !productOwner.trim()}
              onClick={() => {
                addTeam({
                  name: name.trim(),
                  lead: lead.trim(),
                  productOwner: productOwner.trim(),
                  members: [lead.trim(), productOwner.trim()],
                })
                setName('')
                setLead('')
                setProductOwner('')
              }}
            >
              Créer équipe
            </Button>
          </div>
        </div>
      </Card>

      <Card className="enterprise-card">
        <h3>Ajouter membre à une équipe</h3>
        <div className="grid-3">
          <label className="field">
            Équipe
            <FieldSelect value={selectedTeamId} onChange={(event) => setSelectedTeamId(event.target.value)}>
              <option value="">Choisir une équipe</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </FieldSelect>
          </label>
          <label className="field">
            Membre
            <FieldInput value={memberName} onChange={(event) => setMemberName(event.target.value)} placeholder="Nouveau membre" />
          </label>
          <div className="field">
            <span>&nbsp;</span>
            <Button
              type="button"
              tone="muted"
              disabled={!selectedTeamId || !memberName.trim()}
              onClick={() => {
                addTeamMember(selectedTeamId, memberName.trim())
                setMemberName('')
              }}
            >
              Ajouter membre
            </Button>
          </div>
        </div>
      </Card>

      <section className="grid-2">
        {teams.map((team) => (
          <Card key={team.id} className="enterprise-card">
            <h3>{team.name}</h3>
            <p className="page-subtitle">Team Lead: <strong>{team.lead}</strong></p>
            <p className="page-subtitle">PO: <strong>{team.productOwner}</strong></p>
            <div className="enterprise-list">
              {team.members.map((member) => (
                <article key={`${team.id}_${member}`} className="enterprise-item">
                  <p>{member}</p>
                </article>
              ))}
            </div>
          </Card>
        ))}
      </section>
    </section>
  )
}

import { useMemo, useState } from 'react'
import { useEnterpriseStore, type DependencyType, type PortfolioLevel } from '@/shared/model'
import { Button, Card, FieldInput, FieldSelect } from '@/shared/ui'

export const PortfolioStudioPanel = () => {
  const portfolio = useEnterpriseStore((state) => state.portfolio)
  const dependencies = useEnterpriseStore((state) => state.dependencies)
  const addPortfolioNode = useEnterpriseStore((state) => state.addPortfolioNode)
  const addDependency = useEnterpriseStore((state) => state.addDependency)

  const [title, setTitle] = useState('')
  const [owner, setOwner] = useState('Hugo Kaba')
  const [level, setLevel] = useState<PortfolioLevel>('initiative')
  const [progress, setProgress] = useState(0)
  const [fromId, setFromId] = useState('')
  const [toId, setToId] = useState('')
  const [dependencyType, setDependencyType] = useState<DependencyType>('depends_on')

  const levels = useMemo(
    () => ({
      initiative: portfolio.filter((node) => node.level === 'initiative'),
      program: portfolio.filter((node) => node.level === 'program'),
      release: portfolio.filter((node) => node.level === 'release'),
    }),
    [portfolio],
  )

  return (
    <section className="page">
      <Card className="enterprise-card">
        <h2>Portfolio Studio</h2>
        <p className="page-subtitle">Hiérarchie Initiative {'>'} Program {'>'} Release avec dépendances inter-équipes.</p>

        <div className="grid-4">
          <label className="field">
            Titre
            <FieldInput value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Initiative AI Delivery" />
          </label>
          <label className="field">
            Level
            <FieldSelect value={level} onChange={(event) => setLevel(event.target.value as PortfolioLevel)}>
              <option value="initiative">Initiative</option>
              <option value="program">Program</option>
              <option value="release">Release</option>
            </FieldSelect>
          </label>
          <label className="field">
            Owner
            <FieldInput value={owner} onChange={(event) => setOwner(event.target.value)} />
          </label>
          <label className="field">
            Progress %
            <FieldInput type="number" value={progress} min={0} max={100} onChange={(event) => setProgress(Number(event.target.value))} />
          </label>
        </div>

        <Button
          type="button"
          tone="primary"
          disabled={!title.trim()}
          onClick={() => {
            addPortfolioNode({
              title: title.trim(),
              level,
              owner,
              progress: Math.max(0, Math.min(progress, 100)),
            })
            setTitle('')
            setProgress(0)
          }}
        >
          Ajouter noeud portfolio
        </Button>
      </Card>

      <section className="grid-3">
        {(['initiative', 'program', 'release'] as const).map((listLevel) => (
          <Card key={listLevel} className="enterprise-card">
            <h3>{listLevel.toUpperCase()}</h3>
            <div className="enterprise-list">
              {levels[listLevel].map((node) => (
                <article key={node.id} className="enterprise-item">
                  <p><strong>{node.title}</strong></p>
                  <p className="page-subtitle">{node.owner}</p>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${node.progress}%` }} />
                  </div>
                </article>
              ))}
            </div>
          </Card>
        ))}
      </section>

      <Card className="enterprise-card">
        <h3>Dépendances</h3>
        <div className="grid-4">
          <label className="field">
            From
            <FieldSelect value={fromId} onChange={(event) => setFromId(event.target.value)}>
              <option value="">Choisir</option>
              {portfolio.map((node) => (
                <option key={node.id} value={node.id}>{node.title}</option>
              ))}
            </FieldSelect>
          </label>
          <label className="field">
            Type
            <FieldSelect value={dependencyType} onChange={(event) => setDependencyType(event.target.value as DependencyType)}>
              <option value="depends_on">depends_on</option>
              <option value="blocks">blocks</option>
              <option value="relates">relates</option>
            </FieldSelect>
          </label>
          <label className="field">
            To
            <FieldSelect value={toId} onChange={(event) => setToId(event.target.value)}>
              <option value="">Choisir</option>
              {portfolio.map((node) => (
                <option key={node.id} value={node.id}>{node.title}</option>
              ))}
            </FieldSelect>
          </label>
          <div className="field">
            <span>&nbsp;</span>
            <Button
              type="button"
              tone="muted"
              disabled={!fromId || !toId || fromId === toId}
              onClick={() => {
                addDependency({ fromId, toId, type: dependencyType })
                setFromId('')
                setToId('')
              }}
            >
              Lier dépendance
            </Button>
          </div>
        </div>

        <div className="enterprise-list">
          {dependencies.map((dep) => {
            const from = portfolio.find((node) => node.id === dep.fromId)
            const to = portfolio.find((node) => node.id === dep.toId)
            return (
              <article key={dep.id} className="enterprise-item">
                <p><strong>{from?.title ?? dep.fromId}</strong> {dep.type} <strong>{to?.title ?? dep.toId}</strong></p>
              </article>
            )
          })}
        </div>
      </Card>
    </section>
  )
}

import { useToggleFavoriteMutation } from '@/features/toggle-favorite/model/use-toggle-favorite'

interface FavoriteButtonProps {
  userId: string
  projectId: string
  favorite: boolean
}

export const FavoriteButton = ({ userId, projectId, favorite }: FavoriteButtonProps) => {
  const mutation = useToggleFavoriteMutation(userId, projectId)

  return (
    <button
      type="button"
      className="btn btn-muted"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
    >
      {favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    </button>
  )
}

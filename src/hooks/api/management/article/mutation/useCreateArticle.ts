import { useMutation, useQueryClient } from 'react-query'
import { ArticleService } from 'src/api/services'
import { QUERY_KEY } from 'src/constants'

export default () => {
  const client = useQueryClient()
  return useMutation({
    mutationKey: QUERY_KEY.MANAGEMENT.ARTICLE.ADD,
    mutationFn: (variables: {
      product: string
      createdBy: string
      warehouse: string
      storehousePrice: number
      size: number
      sku: string
    }) =>
      ArticleService.createArticle(
        variables.product,
        variables.createdBy,
        variables.warehouse,
        variables.storehousePrice,
        variables.size,
        variables.sku,
      ),
    onSuccess: () => client.invalidateQueries(QUERY_KEY.MANAGEMENT.ARTICLE.GET),
  })
}

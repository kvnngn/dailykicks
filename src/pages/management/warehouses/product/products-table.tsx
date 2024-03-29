import { FC, useMemo } from 'react'
import { Divider, Card } from '@mui/material'

import { DataPaginationTable, DKTableColumnInfo } from 'src/components/Table'
import { useGetWarehouseInventory } from '../../../../hooks/api/management/article'
import ProductsFilter from '../../products/products-filter'

type ProductsTableProps = {
  id: string
}

const ProductsTable: FC<ProductsTableProps> = ({ id }) => {
  const { data, onPageChange } = useGetWarehouseInventory(id)

  const columnInfo = useMemo<Array<DKTableColumnInfo>>(
    () => [
      {
        Header: 'Product',
        accessor: 'product' as const,
        disableSortBy: true,
        Cell: ({ value }) => `${value.name} (${value.sku})`,
      },
      {
        Header: 'Quantity',
        accessor: 'total' as const,
        disableSortBy: true,
      },
      {
        Header: 'Available sizes',
        accessor: 'sizes' as const,
        disableSortBy: true,
        Cell: ({ value }) => value.join(', '),
      },
    ],
    [],
  )

  return (
    <Card>
      <Divider />
      <DataPaginationTable
        data={data.body.data}
        columnInfo={columnInfo}
        onPageChange={onPageChange}
        FilterElement={ProductsFilter}
        totalCount={data.body.meta.itemCount}
        enableSort
        noDataText="No existing article."
      />
    </Card>
  )
}

export default ProductsTable

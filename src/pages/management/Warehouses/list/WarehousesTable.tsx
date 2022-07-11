import { FC, useMemo, useState } from 'react'
import { format } from 'date-fns'
import {
  Tooltip,
  Divider,
  Card,
  IconButton,
  useTheme,
  Button,
  Link,
} from '@mui/material'

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone'
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone'
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'
import { fr } from 'date-fns/locale'
import { DataPaginationTable, DKTableColumnInfo } from 'src/components/Table'
import {
  useDeleteWarehouse,
  useGetWarehouses,
} from 'src/hooks/api/management/warehouse'
import { useNavigate } from 'react-router'
import { ConfirmDialog } from '../../../../components/modal'
import { ROUTES } from '../../../../routes'
import AddWarehouseModal from '../add/AddWarehouseModal'
import EditWarehouseModal from '../edit/EditWarehouseModal'

const WarehousesTable: FC = () => {
  const theme = useTheme()
  const { data, onPageChange } = useGetWarehouses()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [openEditModal, setOpenEditModal] = useState<boolean>(false)
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
  const [warehouseId, setWarehouseId] = useState<string>(null)
  const { mutateAsync: deleteWarehouse } = useDeleteWarehouse()
  const navigate = useNavigate()

  const handleOpen = () => {
    if (!openModal) {
      setOpenModal(true)
    }
  }

  const handleOpenEditModal = (id: string) => {
    if (!openEditModal) {
      setWarehouseId(id)
      setOpenEditModal(true)
    }
  }

  const handleOpenDeleteModal = (id: string) => {
    if (!openDeleteModal) {
      setWarehouseId(id)
      setOpenDeleteModal(true)
    }
  }

  const handleDeleteWarehouse = async () => {
    await deleteWarehouse({ id: warehouseId })
  }

  const columnInfo = useMemo<Array<DKTableColumnInfo>>(
    () => [
      {
        Header: 'ID',
        accessor: '_id' as const,
        minWidth: 130,
        maxWidth: 130,
        disableSortBy: true,
      },
      {
        Header: 'Added on',
        accessor: 'createdAt' as const,
        minWidth: 140,
        maxWidth: 140,
        disableSortBy: false,
        Cell: ({ value }) => {
          return format(new Date(value), 'dd/MM/yyyy HH:mm')
        },
      },
      {
        Header: 'Warehouse name',
        accessor: 'name' as const,
        disableSortBy: true,
        Cell: ({ value, row }) => {
          return (
            <Link
              onClick={(e) => {
                e.preventDefault()
                navigate(`${ROUTES.MANAGEMENT.WAREHOUSES}/${row.values._id}`)
              }}
            >
              {value}
            </Link>
          )
        },
      },
      {
        Header: 'Number of articles',
        accessor: 'articles' as const,
        disableSortBy: true,
      },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <>
            <Tooltip title="Modify warehouse" arrow>
              <IconButton
                sx={{
                  '&:hover': {
                    background: theme.colors.primary.lighter,
                  },
                  color: theme.palette.primary.main,
                }}
                color="inherit"
                size="small"
                onClick={() => handleOpenEditModal(row.values._id)}
              >
                <EditTwoToneIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete warehouse" arrow>
              <IconButton
                sx={{
                  '&:hover': { background: theme.colors.error.lighter },
                  color: theme.palette.error.main,
                }}
                color="inherit"
                size="small"
                onClick={() => handleOpenDeleteModal(row.values._id)}
              >
                <DeleteTwoToneIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        ),
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
        totalCount={data.body.meta.itemCount}
        enableSort
        enableSelect
        noDataText="No existing warehouse."
        ExtraElement={
          <Button
            sx={{ mt: { xs: 2, md: 0 } }}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
            onClick={() => handleOpen()}
          >
            Add warehouse
          </Button>
        }
      />
      {openModal && (
        <AddWarehouseModal open={openModal} onClose={setOpenModal} />
      )}
      {warehouseId && openEditModal && (
        <EditWarehouseModal
          open={openEditModal}
          onClose={setOpenEditModal}
          warehouseId={warehouseId}
        />
      )}
      {warehouseId && openDeleteModal && (
        <ConfirmDialog
          title="Warehouse deletion"
          open={openDeleteModal}
          setOpen={setOpenDeleteModal}
          onConfirm={handleDeleteWarehouse}
        >
          Are you sure you want to delete this warehouse?
        </ConfirmDialog>
      )}
    </Card>
  )
}

export default WarehousesTable

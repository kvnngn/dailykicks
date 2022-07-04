import { FC, useMemo, useState } from 'react'
import { format } from 'date-fns'
import {
  Tooltip,
  Divider,
  Card,
  IconButton,
  useTheme,
  Button,
} from '@mui/material'

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone'
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone'
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'
import { fr } from 'date-fns/locale'
import { DataPaginationTable, DKTableColumnInfo } from 'src/components/Table'
import { useNavigate } from 'react-router'
import { ConfirmDialog } from '../../../../components/modal'
import EditArticleModal from '../edit/EditArticleModal'
import AddArticleModal from '../add/AddArticleModal'
import useDeleteArticle from '../../../../hooks/api/management/article/mutation/useDeleteArticle'
import { useGetArticles } from '../../../../hooks/api/management/article'
import ArticlesFilter from './ArticlesFilter'
import SellIcon from '@mui/icons-material/Sell'
import SellArticleModal from '../sell/SellArticleModal'

type ArticlesTableProps = {
  id: string
}

const ArticlesTable: FC<ArticlesTableProps> = ({ id }) => {
  const theme = useTheme()
  const { data, onPageChange } = useGetArticles(id)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [openEditModal, setOpenEditModal] = useState<boolean>(false)
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
  const [openSellModal, setOpenSellModal] = useState<boolean>(false)
  const [articleId, setArticleId] = useState<string>(null)
  const { mutateAsync: deleteArticle } = useDeleteArticle()
  const navigate = useNavigate()

  const handleOpen = (id: string) => {
    if (!openModal) {
      setArticleId(id)
      setOpenModal(true)
    }
  }

  const handleOpenEditModal = (id: string) => {
    if (!openEditModal) {
      setArticleId(id)
      setOpenEditModal(true)
    }
  }

  const handleOpenDeleteModal = (id: string) => {
    if (!openDeleteModal) {
      setArticleId(id)
      setOpenDeleteModal(true)
    }
  }

  const handleOpenSellModal = (id: string) => {
    if (!openSellModal) {
      setArticleId(id)
      setOpenSellModal(true)
    }
  }

  const handleDeleteWarehouse = async () => {
    await deleteArticle({ id: articleId })
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
        Header: 'Ajouté le',
        accessor: 'createdAt' as const,
        minWidth: 140,
        maxWidth: 140,
        disableSortBy: false,
        Cell: ({ value }) => {
          return format(new Date(value), 'dd MMMM yyyy', {
            locale: fr,
          })
        },
      },
      {
        Header: 'Produit',
        accessor: 'product' as const,
        disableSortBy: true,
        Cell: ({ value }) => value.name,
      },
      {
        Header: 'SKU',
        accessor: 'sku' as const,
        disableSortBy: true,
      },
      {
        Header: 'Prix magasin',
        accessor: 'storePrice' as const,
        disableSortBy: false,
        Cell: ({ value }) => (value ? `${value}€` : 'Non défini'),
      },
      {
        Header: 'Taille',
        accessor: 'size' as const,
        disableSortBy: true,
      },
      {
        Header: 'Vendu ?',
        accessor: 'soldAt' as const,
        disableSortBy: true,
        Cell: ({ value, row }) =>
          value
            ? `${format(new Date(value), 'dd/MM/yyyy', {
                locale: fr,
              })} (${row.original.sellingPrice}€)`
            : 'Non',
      },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <>
            <Tooltip title="Modifier article" arrow>
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
            <Tooltip title="Supprimer l'article" arrow>
              <IconButton
                disabled={row.original.soldAt}
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
            <Tooltip title="Vente de l'article" arrow>
              <IconButton
                disabled={row.original.soldAt}
                sx={{
                  '&:hover': { background: theme.colors.error.lighter },
                  color: theme.palette.error.main,
                }}
                color="inherit"
                size="small"
                onClick={() => handleOpenSellModal(row.values._id)}
              >
                <SellIcon fontSize="small" />
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
        FilterElement={ArticlesFilter}
        data={data.body.data}
        columnInfo={columnInfo}
        onPageChange={onPageChange}
        totalCount={data.body.meta.itemCount}
        enableSort
        enableSelect
        noDataText="Aucun article existant."
        ExtraElement={
          <Button
            sx={{ mt: { xs: 2, md: 0 } }}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
            onClick={() => handleOpen(id)}
          >
            Ajouter un article
          </Button>
        }
      />
      {openModal && (
        <AddArticleModal open={openModal} onClose={setOpenModal} storeId={id} />
      )}
      {articleId && openEditModal && (
        <EditArticleModal
          open={openEditModal}
          onClose={setOpenEditModal}
          articleId={articleId}
        />
      )}
      {articleId && openSellModal && (
        <SellArticleModal
          open={openSellModal}
          onClose={setOpenSellModal}
          articleId={articleId}
        />
      )}
      {articleId && openDeleteModal && (
        <ConfirmDialog
          title="Suppression d'article"
          open={openDeleteModal}
          setOpen={setOpenDeleteModal}
          onConfirm={handleDeleteWarehouse}
        >
          Etes-vous sur de vouloir supprimer cet article?
        </ConfirmDialog>
      )}
    </Card>
  )
}

export default ArticlesTable

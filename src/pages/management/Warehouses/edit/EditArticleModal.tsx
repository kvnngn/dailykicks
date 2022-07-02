import PropTypes from 'prop-types'

import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import {
  DialogContent,
  TextField,
  DialogActions,
  Button,
  DialogContentText,
  InputAdornment,
} from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useSnackbar } from 'src/hooks/common'
import { useCurrentUser } from 'src/hooks/api/common'
import { Dispatch, FC, SetStateAction } from 'react'
import { LoadingButton } from '@mui/lab'
import useUpdateArticle from '../../../../hooks/api/management/article/mutation/useUpdateArticle'
import { useGetArticle } from '../../../../hooks/api/management/article'
import _ from 'lodash'

declare type EditArticleModalProps = {
  onClose: Dispatch<SetStateAction<boolean>>
  open: boolean
  articleId: string
}

const EditArticleModal: FC<EditArticleModalProps> = ({
  onClose,
  open,
  articleId,
}) => {
  const handleClose = () => {
    onClose(false)
  }

  const { mutateAsync: updateArticle } = useUpdateArticle()
  const { data } = useGetArticle(articleId)
  const { showErrorSnackbar } = useSnackbar()
  const currentUser = useCurrentUser()
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
    isValid,
    isSubmitting,
  } = useFormik({
    initialValues: {
      product: _.isObject(data.product) ? data.product._id : data.product,
      updatedBy: currentUser.data._id,
      storehousePrice: data.storehousePrice,
      size: data.size,
      sku: data.sku,
    },
    validationSchema: Yup.object({
      product: Yup.string().required('Le produit est obligatoire'),
      updatedBy: Yup.string().required('Votre utilisateur ID est obligatoire'),
      storehousePrice: Yup.number(),
      size: Yup.number(),
      sku: Yup.string().required('Le SKU est obligatoire'),
    }),

    onSubmit: async (v) => {
      try {
        await updateArticle({
          original: data,
          changes: v,
        })
        handleClose()
      } catch (e: any) {
        if (e.response?.data?.message) {
          switch (e.response.data.message) {
            default:
              showErrorSnackbar('Une erreur est survenue')
              break
          }
        }
      }
    },
  })
  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Modification de l'article</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Veuillez indiquer les informations de l'article.
          </DialogContentText>
          <TextField
            fullWidth
            label="Produit"
            margin="normal"
            name="product"
            disabled={true}
            onBlur={handleBlur}
            onChange={handleChange}
            value={_.isObject(data.product) ? data.product.name : data.product}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.sku && errors.sku)}
            fullWidth
            helperText={touched.sku && errors.sku}
            label="SKU"
            margin="normal"
            name="sku"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.sku}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.storehousePrice && errors.storehousePrice)}
            fullWidth
            helperText={touched.storehousePrice && errors.storehousePrice}
            label="Prix dépot"
            type="number"
            margin="normal"
            name="storehousePrice"
            onBlur={handleBlur}
            onChange={handleChange}
            InputProps={{
              endAdornment: <InputAdornment position="start">€</InputAdornment>,
            }}
            value={values.storehousePrice}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.size && errors.size)}
            fullWidth
            helperText={touched.size && errors.size}
            label="Taille"
            type="number"
            margin="normal"
            name="size"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.size}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <LoadingButton
            loading={isSubmitting}
            type="submit"
            disabled={!isValid || isSubmitting}
          >
            Mettre à jour
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

EditArticleModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  articleId: PropTypes.string.isRequired,
}

export default EditArticleModal

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
  Box,
  Grid,
  Typography,
  MenuItem,
  Autocomplete,
} from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useSnackbar } from 'src/hooks/common'
import { useCurrentUser } from 'src/hooks/api/common'
import { Dispatch, FC, SetStateAction } from 'react'
import { LoadingButton } from '@mui/lab'
import {
  useGetArticle,
  useSellArticle,
  useTransferArticle,
} from '../../../../hooks/api/management/article'
import _ from 'lodash'
import Text from 'src/components/Text'

declare type SellArticleModalProps = {
  onClose: Dispatch<SetStateAction<boolean>>
  open: boolean
  articleId: string
}

const SellArticleModal: FC<SellArticleModalProps> = ({
  onClose,
  open,
  articleId,
}) => {
  const handleClose = () => {
    onClose(false)
  }

  const { mutateAsync: transferArticle } = useSellArticle()

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
    setFieldValue,
  } = useFormik({
    initialValues: {
      articleId: articleId,
      updatedBy: currentUser.data._id,
      sellingPrice: data.storePrice | 0,
    },
    validationSchema: Yup.object({
      articleId: Yup.string().required('ArticleId field is mandatory'),
      updatedBy: Yup.string().required('User ID field is mandatory'),
      sellingPrice: Yup.number().required('Store ID field is mandatory'),
    }),

    onSubmit: async (v) => {
      try {
        await transferArticle(v)
        handleClose()
      } catch (e: any) {
        if (e.response?.data?.message) {
          switch (e.response.data.message) {
            default:
              showErrorSnackbar('An error occured')
              break
          }
        }
      }
    },
  })
  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Sell article</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Product"
            margin="normal"
            name="product"
            disabled={true}
            onBlur={handleBlur}
            onChange={handleChange}
            value={_.isObject(data.product) ? data.product.name : data.product}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Size"
            margin="normal"
            name="size"
            disabled={true}
            onBlur={handleBlur}
            onChange={handleChange}
            value={data.size}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="SKU"
            margin="normal"
            name="sku"
            disabled={true}
            onBlur={handleBlur}
            onChange={handleChange}
            value={_.isObject(data.product) ? data.product.sku : data.product}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Store price"
            margin="normal"
            name="storePrice"
            disabled={true}
            onBlur={handleBlur}
            onChange={handleChange}
            value={data.storePrice}
            variant="outlined"
            InputProps={{
              inputProps: {
                min: 0,
              },
              startAdornment: (
                <InputAdornment position="start">AED</InputAdornment>
              ),
            }}
          />
          <DialogContentText>
            Please indicate the selling price
          </DialogContentText>
          <TextField
            error={Boolean(touched.sellingPrice && errors.sellingPrice)}
            fullWidth
            helperText={
              touched.sellingPrice &&
              errors.sellingPrice &&
              "Selling price field can't be empty"
            }
            label="Selling price"
            type="number"
            margin="normal"
            name="sellingPrice"
            onBlur={handleBlur}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">AED</InputAdornment>
              ),
              inputProps: {
                min: 0,
              },
            }}
            value={values.sellingPrice}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton
            loading={isSubmitting}
            type="submit"
            disabled={!isValid || isSubmitting}
          >
            Confirm
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

SellArticleModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  articleId: PropTypes.string.isRequired,
}

export default SellArticleModal

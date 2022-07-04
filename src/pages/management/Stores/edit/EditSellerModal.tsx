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
import _ from 'lodash'
import {
  useUpdateUser,
  useGetUser,
} from '../../../../hooks/api/management/user'
import { hashPassword } from '../../../../utils'

declare type EditSellerModalProps = {
  onClose: Dispatch<SetStateAction<boolean>>
  open: boolean
  sellerId: string
}

const EditSellerModal: FC<EditSellerModalProps> = ({
  onClose,
  open,
  sellerId,
}) => {
  const handleClose = () => {
    onClose(false)
  }

  const { mutateAsync: updateUser } = useUpdateUser()
  const { data } = useGetUser(sellerId)
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
      email: data.email,
      firstname: data.firstname,
      lastname: data.lastname,
      password: undefined,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("L'email doit etre valide")
        .max(255)
        .required("L'email est obligatoire"),
      firstname: Yup.string().max(255).required('Le prénom est obligatoire'),
      lastname: Yup.string().max(255).required('Le nom est obligatoire'),
      password: Yup.string()
        .max(255)
        .required('Le mot de passe est obligatoire'),
    }),

    onSubmit: async (v) => {
      try {
        await updateUser({
          original: data,
          changes: { ...v, password: hashPassword(v.password) },
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
        <DialogTitle>Modification du vendeur</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Veuillez indiquer les informations du vendeur.
          </DialogContentText>
          <TextField
            error={Boolean(touched.firstname && errors.firstname)}
            fullWidth
            helperText={touched.firstname && errors.firstname}
            label="Nom"
            margin="normal"
            name="firstname"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.firstname}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.lastname && errors.lastname)}
            fullWidth
            helperText={touched.lastname && errors.lastname}
            label="Prenom"
            margin="normal"
            name="lastname"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.lastname}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            label="Adresse Email"
            margin="normal"
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            type="email"
            value={values.email}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            label="Mot de passe"
            margin="normal"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
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

EditSellerModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  sellerId: PropTypes.string.isRequired,
}

export default EditSellerModal
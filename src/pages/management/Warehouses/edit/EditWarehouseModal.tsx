import PropTypes from 'prop-types';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'src/hooks/common';
import { useGetWarehouse } from 'src/hooks/api/management/warehouse';
import { useCurrentUser } from 'src/hooks/api/common';
import { Dispatch, FC, SetStateAction } from 'react';
import useUpdateWarehouse from 'src/hooks/api/management/warehouse/mutation/useUpdateWarehouse';
import { LoadingButton } from '@mui/lab';

declare type EditWarehouseModalProps = {
  onClose: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  warehouseId: string;
};

const EditWarehouseModal: FC<EditWarehouseModalProps> = ({
  onClose,
  open,
  warehouseId
}) => {
  const handleClose = () => {
    onClose(false);
  };

  const { mutateAsync: updateWarehouse } = useUpdateWarehouse();
  const { data } = useGetWarehouse(warehouseId);
  const { showErrorSnackbar } = useSnackbar();
  const currentUser = useCurrentUser();
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
    isValid,
    isSubmitting,
    setFieldError
  } = useFormik({
    initialValues: {
      name: data.name,
      createdBy: currentUser.data._id
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Le nom est obligatoire'),
      createdBy: Yup.string().required('Votre ID est obligatoire')
    }),

    onSubmit: async (v) => {
      try {
        console.log({ v });
        await updateWarehouse({
          original: data,
          changes: v
        });
        handleClose();
      } catch (e: any) {
        if (e.response?.data?.message) {
          switch (e.response.data.message) {
            default:
              showErrorSnackbar('Une erreur est survenue');
              break;
          }
        }
      }
    }
  });
  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Modification du dépot</DialogTitle>
        <DialogContent>
          <TextField
            error={Boolean(touched.name && errors.name)}
            fullWidth
            helperText={touched.name && errors.name}
            label="Nom"
            margin="normal"
            name="name"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.name}
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
  );
};

EditWarehouseModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  warehouseId: PropTypes.string.isRequired
};

export default EditWarehouseModal;
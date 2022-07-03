import React, { useCallback } from 'react'
import * as Yup from 'yup'
import {
  FilterProps,
  FilterWrapper,
  FilterGrid,
  FilterGridItem,
  FilterSelect,
} from '../../../../components/filter'
import useFilterFormik from '../../../../hooks/api/common/useFilterFormik'
import useArticleAutoComplete from '../../../../hooks/api/management/article/query/useArticleAutoComplete'

type ArticlesFilterForm = {
  brands: Array<string>
  brandModels: Array<string>
}

const useArticlesFilterForm = (): UseValidation<ArticlesFilterForm> => ({
  initialValues: {
    brands: [],
    brandModels: [],
  },
  validationSchema: Yup.object({
    brands: Yup.array().of(Yup.string()),
    brandModels: Yup.array().of(Yup.string()),
  }).defined(),
})

const ArticlesFilter: React.FC<FilterProps> = ({
  onClose,
  onFilterChange,
  previousValues,
}) => {
  const { data } = useArticleAutoComplete()
  const { initialValues, validationSchema } = useArticlesFilterForm()
  const { values, handleArrayChange, handleBlur, handleSubmit } =
    useFilterFormik(
      {
        initialValues: previousValues || initialValues,
        validationSchema,
        onSubmit: (v) => {
          onFilterChange(v)
          onClose()
        },
      },
      data,
    )
  if (!Object.keys(data).length) {
    return null
  }
  const { brands, brandModels } = data

  return (
    <FilterWrapper onClose={onClose} onSubmit={handleSubmit}>
      <FilterGrid>
        <FilterGridItem label="Marque">
          <FilterSelect
            name="brands"
            value={values.brands}
            onChange={(e) => handleArrayChange('brands', e.target.value)}
            onBlur={handleBlur}
            renderValue={() => values.brands.join(', ')}
            selected={values.brands}
            candidate={brands}
          />
        </FilterGridItem>
        <FilterGridItem label="Modele">
          <FilterSelect
            name="brandModels"
            value={values.brandModels}
            onChange={(e) => handleArrayChange('brandModels', e.target.value)}
            onBlur={handleBlur}
            renderValue={() => values.brandModels.join(', ')}
            selected={values.brandModels}
            candidate={brandModels}
          />
        </FilterGridItem>
      </FilterGrid>
    </FilterWrapper>
  )
}

export default ArticlesFilter
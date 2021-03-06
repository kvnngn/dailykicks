import React, { useMemo } from 'react';
import { ReactComponent as FilterSortIcon } from '../../assets/icons/common/FilterSortDown.svg';
import { ReactComponent as FilterSortDownIcon } from '../../assets/icons/common/FilterSortDown.svg';
import { ReactComponent as FilterSortUpIcon } from '../../assets/icons/common/FilterSortUp.svg';
import { SvgIcon } from '@mui/material';

export const TableSortIcon = React.memo(
  ({
    isSorted = false,
    isDesc = false
  }: {
    isSorted: boolean | undefined;
    isDesc: boolean | undefined;
  }) => {
    const IconElement = useMemo(() => {
      if (!isSorted) {
        return FilterSortIcon;
      }
      if (isDesc) {
        return FilterSortDownIcon;
      }
      return FilterSortUpIcon;
    }, [isSorted, isDesc]);

    return (
      <SvgIcon
        component={IconElement}
        viewBox="0 0 20 24"
        sx={{
          width: '0.625rem',
          height: '0.75rem',
          verticalAlign: 'middle',
          ml: 1
        }}
      />
    );
  }
);

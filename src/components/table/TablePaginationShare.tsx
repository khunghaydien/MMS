import { TableConstant } from '@/const'
import TablePagination from '@mui/material/TablePagination'
import { ChangeEvent } from 'react'

interface ITablePaginationShare {
  rowsPerPageOptions?: Array<number>
  totalElements: number
  pageLimit: number
  currentPage: number
  onChangePage: (_: unknown, numPage: number) => void
  onChangeLimitPage: (event: ChangeEvent<HTMLInputElement>) => void
}

export default function TablePaginationShare({
  rowsPerPageOptions = TableConstant.ROWS_PER_PAGE_OPTIONS,
  totalElements,
  pageLimit,
  currentPage,
  onChangePage,
  onChangeLimitPage,
}: ITablePaginationShare) {
  return (
    <TablePagination
      rowsPerPageOptions={rowsPerPageOptions}
      component="div"
      count={totalElements}
      rowsPerPage={pageLimit}
      page={Number(currentPage) - 1}
      onPageChange={(_: unknown, numPage: number) =>
        onChangePage(_, Number(numPage) + 1)
      }
      onRowsPerPageChange={onChangeLimitPage}
    />
  )
}

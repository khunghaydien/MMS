import { ROWS_PER_PAGE_OPTIONS } from '@/const/table.const'
import {
  SortChangePayload,
  TableHeaderColumn,
  TablePaginationProps,
} from '@/types'
import {
  Box,
  Table,
  TableContainer,
  TablePagination,
  Theme,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import {
  ChangeEvent,
  ReactElement,
  ReactNode,
  forwardRef,
  useEffect,
} from 'react'
import ConditionalRender from '../ConditionalRender'
import CustomTableBody from './CustomTableBody'
import CustomTableBodyRequest from './CustomTableBodyRequest'
import CustomTableHead from './CustomTableHead'
import TableBodyLoading from './TableBodyLoading'
import { setFirstTextEllipsis } from './tableUtils'

export interface CommonTableProps {
  id?: string
  useCustomizeFirstColEllipsis?: boolean
  rows: any
  doubleFirstCol?: string
  rootClassName?: string
  linkFormat?: string
  rowClassName?: string
  minWidth?: number
  maxHeight?: number
  useOpenNewTab?: boolean
  useCheckbox?: boolean
  checkAll?: boolean
  loading?: boolean
  listChecked?: string[]
  columns: TableHeaderColumn[]
  pagination?: TablePaginationProps
  FooterActions?: ReactElement | ReactNode
  LastRow?: ReactElement | ReactNode
  listFieldAllowRowClick?: string[]
  isUpdateRow?: boolean
  onSortChange?: (payload: SortChangePayload) => void
  onRowClick?: (row: any) => void
  onDeleteClick?: (row: any) => void
  onCopyClick?: (row: any) => void
  onCheckAll?: () => void
  onCheckItem?: ({
    id,
    newListChecked,
  }: {
    id: string
    newListChecked: string[]
  }) => void
  onUpdateRow?: (row: any) => void
  onApproveRequestOT?: (row: any) => void
  onRejectRequestOT?: (row: any) => void
  onUpdateRequestOT?: (row: any) => void
  isRequestTable?: boolean
}

const CustomTable = forwardRef(
  (
    {
      id,
      maxHeight,
      minWidth = 750,
      rootClassName = '',
      linkFormat = '',
      rowClassName = '',
      doubleFirstCol = '',
      useCheckbox = false,
      checkAll = false,
      loading = false,
      useOpenNewTab = false,
      useCustomizeFirstColEllipsis = false,
      columns = [],
      rows = [],
      listChecked = [],
      pagination,
      FooterActions,
      LastRow,
      listFieldAllowRowClick,
      isUpdateRow,
      onCheckItem,
      onCheckAll,
      onSortChange,
      onRowClick,
      onDeleteClick,
      onCopyClick,
      onUpdateRow,
      onApproveRequestOT,
      onRejectRequestOT,
      onUpdateRequestOT,
      isRequestTable,
    }: CommonTableProps,
    ref
  ) => {
    const classes = useStyles()

    const handleCheckItem = (row: any) => {
      const newListChecked = [...listChecked]
      const indexById = listChecked.findIndex(_id => _id === row.id)
      if (indexById !== -1) {
        newListChecked.splice(indexById, 1)
      } else {
        newListChecked.push(row.id)
      }
      if (onCheckItem) {
        onCheckItem({
          id: row?.id,
          newListChecked,
        })
      }
    }

    const handleCheckAll = () => {
      !!onCheckAll && onCheckAll()
    }

    const handlePageChange = (_: unknown, newPage: number) => {
      if (pagination?.onPageChange) {
        pagination?.onPageChange(newPage + 1)
      }
    }

    const handlePageSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (pagination?.onPageSizeChange) {
        pagination?.onPageSizeChange(+e.target.value)
      }
    }

    useEffect(() => {
      if (id && useCustomizeFirstColEllipsis && !!rows.length) {
        const tableContainerEl = document.getElementById(id) as Element
        setFirstTextEllipsis(tableContainerEl)
      }
    }, [rows])

    return (
      <Box
        id={id}
        className={clsx(classes.rootCommonTable, rootClassName)}
        ref={ref}
      >
        <TableContainer sx={{ maxHeight }}>
          <Table
            sx={{
              minWidth,
              position: 'relative',
            }}
          >
            <CustomTableHead
              doubleFirstCol={doubleFirstCol}
              columns={columns}
              useCheckbox={useCheckbox}
              checked={checkAll && !!rows.length}
              onCheckAll={handleCheckAll}
              onSortChange={onSortChange}
            />
            <TableBodyLoading loading={loading}>
              {isRequestTable ? (
                <CustomTableBodyRequest
                  LastRow={LastRow}
                  rowClassName={clsx(
                    rowClassName,
                    doubleFirstCol && 'double-first-col'
                  )}
                  listFieldAllowRowClick={listFieldAllowRowClick}
                  linkFormat={linkFormat}
                  useOpenNewTab={useOpenNewTab}
                  listChecked={listChecked}
                  loading={loading}
                  useCheckbox={useCheckbox}
                  columns={columns}
                  rows={rows}
                  isUpdateRow={isUpdateRow}
                  onCheckItem={handleCheckItem}
                  onRowClick={onRowClick}
                  onDeleteClick={onDeleteClick}
                  onCopyClick={onCopyClick}
                  onUpdateRow={onUpdateRow}
                  onApproveRequestOT={onApproveRequestOT}
                  onRejectRequestOT={onRejectRequestOT}
                  onUpdateRequestOT={onUpdateRequestOT}
                />
              ) : (
                <CustomTableBody
                  LastRow={LastRow}
                  rowClassName={clsx(
                    rowClassName,
                    doubleFirstCol && 'double-first-col'
                  )}
                  listFieldAllowRowClick={listFieldAllowRowClick}
                  linkFormat={linkFormat}
                  useOpenNewTab={useOpenNewTab}
                  listChecked={listChecked}
                  loading={loading}
                  useCheckbox={useCheckbox}
                  columns={columns}
                  rows={rows}
                  isUpdateRow={isUpdateRow}
                  onCheckItem={handleCheckItem}
                  onRowClick={onRowClick}
                  onDeleteClick={onDeleteClick}
                  onCopyClick={onCopyClick}
                  onUpdateRow={onUpdateRow}
                  onApproveRequestOT={onApproveRequestOT}
                  onRejectRequestOT={onRejectRequestOT}
                  onUpdateRequestOT={onUpdateRequestOT}
                />
              )}
            </TableBodyLoading>
          </Table>
        </TableContainer>
        <ConditionalRender
          conditional={!!FooterActions || !!pagination?.totalElements}
        >
          <Box className={classes.footerActions}>
            <Box className={classes.leftActions}>{FooterActions}</Box>
            {!!pagination?.pageNum && (
              <TablePagination
                className={classes.rootPagination}
                component="div"
                rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                count={pagination?.totalElements as number}
                rowsPerPage={pagination?.pageSize as number}
                page={(pagination?.pageNum as number) - 1}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handlePageSizeChange}
              />
            )}
          </Box>
        </ConditionalRender>
      </Box>
    )
  }
)

const useStyles = makeStyles((theme: Theme) => ({
  rootCommonTable: {
    border: `1px solid ${theme.color.grey.secondary}`,
    borderRadius: '4px',
    '& .double-first-col': {
      '& td:first-child': {
        borderRight: `1px solid ${theme.color.grey.secondary}`,
      },
      '& .first-item': {
        display: 'inline-block',
        width: '160px',
      },
    },
  },
  footerActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2, 0),
  },
  leftActions: {
    paddingLeft: theme.spacing(2),
  },
  rootPagination: {
    margin: theme.spacing(-2, 0),
  },
}))

export default CustomTable

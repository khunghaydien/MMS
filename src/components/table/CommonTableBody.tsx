import { TableHeaderColumn } from '@/types'
import { cleanObject, getTextEllipsis } from '@/utils'
import { Edit } from '@mui/icons-material'
import {
  Box,
  Checkbox,
  TableBody,
  TableCell,
  TableRow,
  Theme,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { ReactElement, ReactNode } from 'react'
import ConditionalRender from '../ConditionalRender'
import NoData from '../common/NoData'
import CopyIcon from '../icons/CopyIcon'
import DeleteIcon from '../icons/DeleteIcon'

interface CommonTableBodyProps {
  rows: any
  rowClassName?: string
  linkFormat?: string
  useCheckbox?: boolean
  loading?: boolean
  useOpenNewTab?: boolean
  listChecked?: string[]
  LastRow?: ReactElement | ReactNode
  FirstRow?: ReactElement | ReactNode
  columns: TableHeaderColumn[]
  useClickCode?: boolean
  activeId?: number | string
  onCheckItem?: (row: any) => void
  onRowClick?: (row: any, columnId: string) => void
  onDeleteClick?: (row: any) => void
  onUpdateClick?: (row: any) => void
  onCodeClick?: (row: any, columnId: string) => void
}

const CommonTableBody = ({
  rows,
  rowClassName = '',
  linkFormat = '/{0}',
  useCheckbox = false,
  loading = false,
  useOpenNewTab = false,
  listChecked = [],
  LastRow,
  columns,
  onCheckItem,
  onRowClick,
  onDeleteClick,
  onUpdateClick,
  onCodeClick,
  useClickCode,
  FirstRow,
  activeId,
}: CommonTableBodyProps) => {
  const classes = useStyles()

  const handleCheckboxChange = (row: any) => {
    !!onCheckItem && onCheckItem(row)
  }

  const handleRowClick = (row: any, columnId: string) => {
    if (columnId === 'code' && !!useClickCode && onCodeClick) {
      onCodeClick(row, columnId)
      return
    }
    ;(typeof row.seeDetails === 'undefined' ? true : row.seeDetails) &&
      !!onRowClick &&
      onRowClick(row, columnId)
  }

  const handleLinkClick = (e: any) => {
    e.preventDefault()
  }

  const handleDeleteClick = (row: any) => {
    !!onDeleteClick && onDeleteClick(row)
  }
  const handleUpdateClick = (row: any) => {
    !!onUpdateClick && onUpdateClick(row)
  }

  const checkContractEndDate = (value: any) => {
    switch (value) {
      case 'white':
        return ''
      case 'red':
        return classes.rowDateContractExpired
      case 'yellow':
        return classes.rowDateContract
    }
  }

  return (
    <TableBody
      className={clsx(classes.rootCommonTableBody, loading && 'loading')}
    >
      <ConditionalRender conditional={!loading && !rows.length}>
        <TableRow>
          <TableCell colSpan={100}>
            <NoData />
          </TableCell>
        </TableRow>
      </ConditionalRender>
      <ConditionalRender conditional={!loading && !!rows.length}>
        {!!FirstRow && FirstRow}
        {rows.map((row: any, index: number) => (
          <TableRow
            key={row.id}
            className={clsx(
              classes.row,
              !!onRowClick &&
                (typeof row.seeDetails === 'undefined'
                  ? true
                  : row.seeDetails) &&
                'useOnClick',
              rowClassName,
              row.isError ? classes.rowError : '',
              row[row.useIndex ? 'index' : 'id'] === activeId && 'active'
            )}
          >
            {useCheckbox && (
              <TableCell padding="checkbox">
                <ConditionalRender
                  conditional={!!row['disableRowCheckbox']}
                  fallback={
                    <Checkbox
                      checked={listChecked.includes(row.id)}
                      onChange={() => handleCheckboxChange(row)}
                    />
                  }
                >
                  <></>
                </ConditionalRender>
              </TableCell>
            )}
            {columns.map((column: TableHeaderColumn) => {
              const isHighlight =
                !!column.isHighlight &&
                !!row['background'] &&
                typeof row['background'] === 'string' &&
                row[column.id]?.props?.children?.props?.children !== 0
              return (
                <ConditionalRender
                  key={column.id}
                  conditional={column.id !== 'delete'}
                  fallback={
                    <TableCell key={column.id}>
                      {(!!row['useUpdateIcon'] || !!row['useDeleteIcon']) && (
                        <Box
                          style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '15px',
                          }}
                        >
                          {!!row['useUpdateIcon'] && (
                            <Edit
                              style={{ color: '#666666' }}
                              onClick={() => handleUpdateClick(row)}
                            />
                          )}
                          {!!row['useDeleteIcon'] && (
                            <DeleteIcon
                              onClick={() => handleDeleteClick(row)}
                            />
                          )}
                        </Box>
                      )}
                    </TableCell>
                  }
                >
                  {column.id === 'copy' ? (
                    <TableCell>
                      <CopyIcon content={row.copyContent} />
                    </TableCell>
                  ) : (
                    <TableCell
                      align={column.align}
                      className={clsx(classes.columnBox, column.className)}
                      key={column.id}
                      onClick={() => handleRowClick(row, column.id)}
                      sx={cleanObject({
                        background: isHighlight ? row['background'] : '',
                      })}
                    >
                      {/* {useOpenNewTab && (
                        <a
                          className={classes.link}
                          href={StringFormat(linkFormat, row.id)}
                          onClick={handleLinkClick}
                        />
                      )} */}
                      <Box
                        sx={cleanObject({
                          color: isHighlight && '#d32f2f',
                          fontWeight: isHighlight && 'bold',
                        })}
                        title={
                          typeof row[column.id] === 'string' ||
                          typeof row[column.id] === 'number'
                            ? row[column.id]
                            : ''
                        }
                        className={clsx(
                          classes.column,
                          (column.id === 'id' || column.id === 'code') &&
                            'active first-item',
                          'row-item-text',
                          column.id === 'contractEndDate'
                            ? checkContractEndDate(row.classColorContract)
                            : ''
                        )}
                      >
                        <ConditionalRender
                          conditional={typeof row[column.id] === 'object'}
                          fallback={getTextEllipsis(
                            row[column.id],
                            column.ellipsisNumber
                          )}
                        >
                          {row[column.id]?.key === null &&
                          row[column.id]?.ref === null
                            ? row[column.id]
                            : JSON.stringify(row[column.id])}
                        </ConditionalRender>
                      </Box>
                    </TableCell>
                  )}
                </ConditionalRender>
              )
            })}
          </TableRow>
        ))}
        {!!LastRow && LastRow}
      </ConditionalRender>
    </TableBody>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootCommonTableBody: {},
  columnBox: {
    position: 'relative',
  },
  column: {
    '&.active': {
      color: theme.color.blue.primary,
    },
  },
  row: {
    '&.useOnClick': {
      cursor: 'pointer',
      '&:hover': {
        background: theme.color.grey.tertiary,
      },
    },
    '&.active': {
      background: theme.color.grey.secondary,
      cursor: 'unset',
      '&:hover': {
        background: `${theme.color.grey.secondary} !important`,
      },
    },
  },
  link: {
    position: 'absolute',
    display: 'inline-block',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  rowLoading: {
    position: 'relative',
    '& td': {
      borderBottom: 'unset',
    },
  },
  rowError: {
    backgroundColor: theme.color.error.tertiary,

    '&:hover': {
      backgroundColor: `${theme.color.error.tertiary} !important`,
    },
  },
  rowDateContract: {
    color: theme.color.yellow.primary,
    fontWeight: 'bold',
  },
  rowDateContractExpired: {
    color: theme.color.error.secondary,
    fontWeight: 'bold',
  },
}))

export default CommonTableBody

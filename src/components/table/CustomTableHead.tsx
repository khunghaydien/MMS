import { SortChangePayload, TableHeaderColumn } from '@/types'
import informationImage from '@/ui/images/information.png'
import {
  Box,
  Checkbox,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Theme,
  Tooltip,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { Fragment, useEffect, useMemo, useState } from 'react'
import ConditionalRender from '../ConditionalRender'

interface CustomTableHeadProps {
  doubleFirstCol?: string
  useCheckbox?: boolean
  disabled?: boolean
  checked?: boolean
  columns: TableHeaderColumn[]
  onCheckAll?: () => void
  onSortChange?: ({
    sortBy,
    preOrderBy,
    nextOrderBy,
    newColumns,
  }: SortChangePayload) => void
}

export const CustomTableHead = ({
  doubleFirstCol = '',
  useCheckbox = false,
  disabled = false,
  checked = false,
  columns,
  onCheckAll,
  onSortChange,
}: CustomTableHeadProps) => {
  const classes = useStyles()

  const [sizeFirstCol, setSizeFirstCol] = useState({
    width: 0,
    height: 0,
  })

  const hypotenuseWidth = useMemo(() => {
    return Math.sqrt(
      sizeFirstCol.width * sizeFirstCol.width +
        sizeFirstCol.height * sizeFirstCol.height
    )
  }, [sizeFirstCol])

  const hypotenuseRotate = useMemo(() => {
    const AB = sizeFirstCol.width
    const BC = sizeFirstCol.height
    const BAC = (Math.atan(BC / AB) * 180) / Math.PI
    return BAC
  }, [sizeFirstCol])

  const handleCheckAll = () => {
    !!onCheckAll && onCheckAll()
  }

  const handleSortChange = (index: number, orderBy: string) => {
    const newColumns = structuredClone(columns)
    const newOrderBy = orderBy === 'asc' ? 'desc' : 'asc'
    newColumns[index].orderBy = newOrderBy
    if (onSortChange) {
      onSortChange({
        sortBy: columns[index].sortBy || '',
        preOrderBy: columns[index].orderBy || '',
        nextOrderBy: newOrderBy,
        newColumns,
      })
    }
  }

  const setSizeFirstColHeader = () => {
    const firstColEl = document.getElementById('firstColHeader')
    if (firstColEl) {
      const width = firstColEl?.offsetWidth
      const height = firstColEl?.offsetHeight
      setSizeFirstCol({
        width,
        height,
      })
    }
  }

  useEffect(() => {
    setSizeFirstColHeader()
  }, [columns])

  useEffect(() => {
    function resize() {
      setSizeFirstColHeader()
    }
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  return (
    <TableHead className={classes.rootCommonTableHead}>
      <TableRow className={classes.tableRow}>
        {useCheckbox && (
          <TableCell padding="checkbox">
            <Checkbox
              checked={checked}
              disabled={disabled}
              onChange={handleCheckAll}
            />
          </TableCell>
        )}
        {columns.map((column, index) => (
          <Fragment key={index}>
            {column.type === 'date' ? (
              <TableCell
                id={!index ? 'firstColHeader' : ''}
                key={column.id}
                align={column.align || 'left'}
                sx={{
                  padding: '0px !important',
                }}
              >
                <Box className={classes.date}>{column.label.split(' ')[0]}</Box>
                <Box
                  className={clsx(
                    classes.dayOfWeek,
                    column.isWeekend ? classes.backgroundWeekend : ''
                  )}
                >
                  {column.label.split(' ')[1]}
                </Box>
              </TableCell>
            ) : (
              <TableCell
                id={!index ? 'firstColHeader' : ''}
                key={column.id}
                align={column.align || 'left'}
                sx={{
                  maxWidth: column.maxWidth ? column.maxWidth : 'none',
                }}
                className={clsx(
                  column.id === 'standardWorkingHours'
                    ? classes.borderLeft
                    : '',
                  column.isBlueBackground ? classes.blueBackground : ''
                )}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: column.align,
                  }}
                >
                  <Box className={classes.columnLabel}>
                    {!!column.orderBy && !!column.sortBy ? (
                      <TableSortLabel
                        active
                        direction={column.orderBy}
                        onClick={() =>
                          handleSortChange(index, column.orderBy || '')
                        }
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      <ConditionalRender
                        conditional={!!doubleFirstCol && !index}
                        fallback={
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: column.align,
                            }}
                          >
                            {column.label}
                            {column.tooltip && (
                              <Tooltip title={column.tooltip}>
                                <Box
                                  sx={{
                                    width: '14px',
                                    height: '14px',
                                    objectFit: 'contain',
                                    marginTop: '2px',
                                    marginLeft: '1px',
                                  }}
                                >
                                  <img
                                    style={{ cursor: 'pointer' }}
                                    src={informationImage}
                                    alt="information"
                                  />
                                </Box>
                              </Tooltip>
                            )}
                          </Box>
                        }
                      >
                        <Hypotenuse
                          doubleFirstCol={doubleFirstCol}
                          column={column}
                          sizeFirstCol={sizeFirstCol}
                          hypotenuseRotate={hypotenuseRotate}
                          hypotenuseWidth={hypotenuseWidth}
                        />
                      </ConditionalRender>
                    )}
                  </Box>
                </Box>
              </TableCell>
            )}
          </Fragment>
        ))}
      </TableRow>
    </TableHead>
  )
}

const Hypotenuse = ({
  column,
  doubleFirstCol,
  sizeFirstCol,
  hypotenuseWidth,
  hypotenuseRotate,
}: {
  hypotenuseWidth: number
  doubleFirstCol: string
  hypotenuseRotate: number
  sizeFirstCol: { width: number; height: number }
  column: TableHeaderColumn
}) => {
  const classes = useStyles()
  return (
    <Box
      className={classes.doubleFirstCol}
      sx={{
        width: sizeFirstCol.width,
        height: sizeFirstCol.height,
      }}
    >
      <Box className={classes.labelDoubleFirstCol}>{doubleFirstCol}</Box>
      <Box className={classes.labelFirstColCustom}>{column.label}</Box>
      <Box
        component="span"
        className={classes.hypotenuse}
        sx={{
          width: hypotenuseWidth + 'px',
          transform: `rotate(${hypotenuseRotate}deg)`,
          top: sizeFirstCol.height / 2 - 1 + 'px',
        }}
      />
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootCommonTableHead: {
    position: 'sticky',
    top: 0,
    zIndex: '2',
  },
  backgroundWeekend: {
    background: '#D6DBE4',
  },
  blueBackground: {
    background: '#17469F',
    color: '#fff !important',
  },
  borderLeft: {
    borderLeft: `1px solid ${theme.color.grey.secondary}`,
  },
  date: {
    border: `1px solid ${theme.color.grey.secondary}`,
    borderBottom: 'none',
    borderTop: 'none',
    borderRight: 'none',
    width: '52px',
    height: '52px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayOfWeek: {
    border: `1px solid ${theme.color.grey.secondary}`,
    borderBottom: 'none',
    borderRight: 'none',
    width: '52px',
    height: '52px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnLabel: {
    width: 'max-content',
  },
  doubleFirstCol: {
    borderRight: `1px solid ${theme.color.grey.secondary}`,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  labelDoubleFirstCol: {
    position: 'absolute',
    top: 5,
    right: theme.spacing(2),
  },
  labelFirstColCustom: {
    position: 'absolute',
    bottom: 5,
    left: theme.spacing(2),
  },
  hypotenuse: {
    height: '1px',
    backgroundColor: theme.color.grey.secondary,
    display: 'inline-block',
    position: 'absolute',
    left: -2,
  },
  tableRow: {
    backgroundColor: theme.color.grey.tertiary,
  },
}))

export default CustomTableHead

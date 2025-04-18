import { SortChangePayload, TableHeaderColumn } from '@/types'
import informationImage from '@/ui/images/info.svg'
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
import { useEffect, useMemo, useState } from 'react'
import ConditionalRender from '../ConditionalRender'

interface CommonTableHeadProps {
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

export const CommonTableHead = ({
  doubleFirstCol = '',
  useCheckbox = false,
  disabled = false,
  checked = false,
  columns,
  onCheckAll,
  onSortChange,
}: CommonTableHeadProps) => {
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
    const newColumns = [...columns]
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
          <TableCell
            id={!index ? 'firstColHeader' : ''}
            key={column.id}
            align={column.align || 'left'}
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
                      <>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: column.align,
                          }}
                        >
                          {column.label}
                          {column.tooltip &&
                          typeof column.tooltip === 'string' ? (
                            <Tooltip title={column.tooltip}>
                              <Box
                                sx={{
                                  width: '18px',
                                  height: '18px',
                                  objectFit: 'contain',
                                  marginTop: '-2px',
                                  marginLeft: '3px',
                                }}
                              >
                                <img
                                  style={{ cursor: 'pointer' }}
                                  src={informationImage}
                                  alt="information"
                                />
                              </Box>
                            </Tooltip>
                          ) : (
                            <>{column.tooltip}</>
                          )}
                        </Box>
                        {column.subLabel && (
                          <Box style={{ fontSize: '12px' }}>
                            {column.subLabel}
                          </Box>
                        )}
                      </>
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

export default CommonTableHead

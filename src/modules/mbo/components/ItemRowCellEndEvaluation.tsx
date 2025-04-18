import { cleanObject } from '@/utils'
import { Box, Tooltip } from '@mui/material'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
interface IProps {
  rowLabel: string
  cellData: any[]
  useHighlight?: boolean
  getTooltip?: any
  useTooltip?: boolean
}
const ItemRowCellEndEvaluation = ({
  cellData,
  rowLabel,
  useHighlight = false,
  getTooltip,
  useTooltip = false,
}: IProps) => {
  const classes = useStyles()

  const scores = cellData.map(numStr => +numStr.score).filter(num => !!num)
  const firstScore = scores[0]
  const areAllElementsEqual = scores.every(score => score === firstScore)

  return (
    <TableRow className={classes.rootTableRow}>
      <TableCell
        className={clsx(classes.tableCell, 'average-score')}
        component="th"
        colSpan={2}
        align="center"
      >
        {rowLabel}
      </TableCell>
      {cellData.map((item: any, index: number) => (
        <TableCell
          className={classes.tableCell}
          key={index}
          component="th"
          align="center"
          sx={cleanObject({
            background:
              !areAllElementsEqual &&
              useHighlight &&
              +item.score !== 0 &&
              '#FFE993',
            color:
              !areAllElementsEqual &&
              useHighlight &&
              +item.score !== 0 &&
              '#d32f2f',
          })}
        >
          {!!getTooltip && useTooltip && !!item?.score ? (
            <Tooltip
              title={getTooltip(
                '',
                item?.score,
                item?.label,
                item?.reasonDifficulty
              )}
            >
              <Box>{item?.score || 0}</Box>
            </Tooltip>
          ) : (
            item.score
          )}
        </TableCell>
      ))}
    </TableRow>
  )
}
const useStyles = makeStyles(() => ({
  rootTableRow: {
    fontWeight: '700 !important',
  },
  tableCell: {
    fontWeight: '700 !important',
    '&.average-score': {
      fontSize: '16px !important',
    },
  },
}))

export default ItemRowCellEndEvaluation

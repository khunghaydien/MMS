import { NS_PROJECT } from '@/const/lang.const'
import { formatNumber } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

interface TotalHeadcountProps {
  totalOfBillableManMonth: {
    totalBillableEffort: number
    totalAssignEffort: number
    totalActualEffort: number
    totalShareEffort: number
  }
}

const TotalHeadcount = ({ totalOfBillableManMonth }: TotalHeadcountProps) => {
  const classes = useStyles()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const isAssignEffortError =
    totalOfBillableManMonth.totalAssignEffort >
    totalOfBillableManMonth.totalBillableEffort
  const isActualEffortError =
    totalOfBillableManMonth.totalActualEffort >
    totalOfBillableManMonth.totalAssignEffort

  return (
    <Box className={classes.RootTotalHeadcount}>
      <Box className={clsx(classes.totalItem, 'billable')}>
        <Box className={classes.totalLabel}>
          {`${i18Project('TXT_TOTAL_BILLABLE_EFFORT')} (MM)`}
        </Box>
        <Box className={clsx(classes.totalValue, 'billable')}>
          {formatNumber(totalOfBillableManMonth.totalBillableEffort)}
        </Box>
      </Box>
      <Box
        className={clsx(
          classes.totalItem,
          'assignEffort',
          isAssignEffortError && 'error'
        )}
      >
        <Box className={classes.totalLabel}>
          {`${i18Project('TXT_TOTAL_ASSIGN_EFFORT')} (MM)`}
        </Box>
        <Box
          className={clsx(
            classes.totalValue,
            'assignEffort',
            isAssignEffortError && 'error'
          )}
        >
          {formatNumber(totalOfBillableManMonth.totalAssignEffort)}
        </Box>
      </Box>
      <Box
        className={clsx(
          classes.totalItem,
          'actualEffort',
          isActualEffortError && 'error'
        )}
      >
        <Box className={classes.totalLabel}>
          {`${i18Project('TXT_TOTAL_ACTUAL_EFFORT')} (MM)`}
        </Box>
        <Box
          className={clsx(
            classes.totalValue,
            'actualEffort',
            isActualEffortError && 'error'
          )}
        >
          {formatNumber(totalOfBillableManMonth.totalActualEffort)}
        </Box>
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootTotalHeadcount: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    background: '#f3f6fa',
    borderRadius: '4px',
    padding: theme.spacing(2),
    height: 'max-content',
    width: '320px',
  },
  totalItem: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(4),
    alignItems: 'center',
    borderBottom: '4px solid',
    paddingBottom: theme.spacing(2),
    '&.billable': {
      borderColor: theme.color.blue.primary,
    },
    '&.assignEffort': {
      borderColor: theme.color.green.primary,
    },
    '&.actualEffort': {
      borderColor: theme.color.green.primary,
    },
    '&.error': {
      borderColor: `${theme.color.error.primary} !important`,
    },
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 600,
  },
  totalValue: {
    fontWeight: 700,
    fontSize: 18,
    '&.billable': {
      color: theme.color.blue.primary,
    },
    '&.assignEffort': {
      color: theme.color.green.primary,
    },
    '&.actualEffort': {
      color: theme.color.green.primary,
    },
    '&.error': {
      color: `${theme.color.error.primary} !important`,
    },
  },
  iconError: {
    marginBottom: '-6px !important',
  },
}))

export default TotalHeadcount

import NoData from '@/components/common/NoData'
import ConditionalRender from '@/components/ConditionalRender'
import LoadingSkeleton from '@/components/loading/LoadingSkeleton'
import { NS_DASHBOARD } from '@/const/lang.const'
import { dashboardSelector } from '@/modules/dashboard/reducer/dashboard'
import { formatMonthFromSingleNumber } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

const ProjectAllocationSummaryTable = () => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Dashboard } = useTranslation(NS_DASHBOARD)

  const { dataProjectAllocationSummary } = useSelector(dashboardSelector)

  return (
    <Box className={classes.RootProjectAllocationSummaryTable}>
      <Box className={classes.headerLeft}>
        <Box className={classes.headerCell}>{i18('LB_MONTH')}</Box>
        <Box className={classes.headerCell}>
          {i18Dashboard('TXT_TOTAL_PROJECT')}
        </Box>
        <Box className={classes.headerCell}>
          {i18Dashboard('TXT_TOTAL_STAFF')}
        </Box>
        <Box className={classes.headerCell}>
          {i18Dashboard('TXT_TOTAL_BILLABLE_MM')}
        </Box>
        <Box className={classes.headerCell}>
          {i18Dashboard('TXT_TOTAL_ASSIGN_EFFORT')} (MM)
        </Box>
        <Box className={classes.headerCell}>
          {i18Dashboard('TXT_TOTAL_ACTUAL_EFFORT')} (MM)
        </Box>
        <Box className={classes.headerCell}>
          {i18Dashboard('TXT_USAGE_EFFICIENCY')}
        </Box>
      </Box>
      <ConditionalRender
        conditional={!dataProjectAllocationSummary.loading}
        fallback={<LoadingSkeleton height="350px" />}
      >
        {!!dataProjectAllocationSummary.dataList.length ? (
          <Box className={clsx(classes.contentRight, 'scrollbar')}>
            {dataProjectAllocationSummary.dataList.map((item, index) => (
              <Box
                key={`${index}-${item.year}-${item.month}`}
                className={classes.contentColumn}
              >
                <Box
                  className={classes.monthCol}
                >{`${formatMonthFromSingleNumber(item.month)}/${
                  item.year
                }`}</Box>
                <Box className={classes.valueCol}>{item.totalProject}</Box>
                <Box className={classes.valueCol}>{item.totalStaff}</Box>
                <Box className={classes.valueCol}>{item.totalBillableMM}</Box>
                <Box className={classes.valueCol}>{item.totalAssignEffort}</Box>
                <Box className={classes.valueCol}>{item.totalActualEffort}</Box>
                <Box className={classes.valueCol}>{item.usageEfficiency}</Box>
              </Box>
            ))}
          </Box>
        ) : (
          <NoData className={classes.noDataOutside} />
        )}
      </ConditionalRender>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootProjectAllocationSummaryTable: {
    border: `1px solid ${theme.color.grey.secondary}`,
    borderRadius: '4px',
    display: 'flex',
    fontSize: 14,
    '& .root-loading-skeleton': {
      height: 250,
      width: 'unset',
      flex: 1,
    },
  },
  headerLeft: {
    width: '190px',
  },
  headerCell: {
    background: theme.color.grey.tertiary,
    padding: theme.spacing(2),
    fontWeight: 500,
    borderRight: `1px solid ${theme.color.grey.secondary}`,
    borderBottom: `1px solid ${theme.color.grey.secondary}`,
    '&:last-child': {
      borderBottom: 0,
    },
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  contentRight: {
    display: 'flex',
    width: 'calc(100% - 190px)',
    overflowX: 'auto',
  },
  contentColumn: {
    flex: 1,
  },
  monthCol: {
    background: theme.color.grey.tertiary,
    padding: theme.spacing(2),
    textAlign: 'center',
    borderBottom: `1px solid ${theme.color.grey.secondary}`,
    fontWeight: 500,
  },
  valueCol: {
    padding: theme.spacing(2),
    textAlign: 'center',
    borderBottom: `1px solid ${theme.color.grey.secondary}`,
    '&:last-child': {
      borderBottom: 0,
    },
    height: 50,
  },
  noDataOutside: {
    width: 'unset',
    flex: 1,
    height: 300,
  },
}))

export default ProjectAllocationSummaryTable

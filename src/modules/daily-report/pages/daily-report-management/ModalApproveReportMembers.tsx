import Modal from '@/components/common/Modal'
import LoadingSkeleton from '@/components/loading/LoadingSkeleton'
import CommonTabs from '@/components/tabs'
import { NS_DAILY_REPORT, NS_MBO, NS_PROJECT } from '@/const/lang.const'
import dailyReportService from '@/modules/daily-report/services/dailyReport.service'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import DailyReportListFromMember from './DailyReportListFromMember'

export interface ReportItem {
  dailyReportId: number
  issue: string
  noteStatus: string
  reportDate: number
  status: number
  suggestion: string
  workingDescription: string
  workingHours: number
}

interface ModalApproveReportMembersProps {
  onClose: () => void
  onConfirmSuccess: () => void
  staffId: string | number
  projectId: string | number
  year: number
  month: number
}

export const NOT_APPROVE = 1
export const APPROVED = 2
export const REJECTED = 3

const ModalApproveReportMembers = ({
  onClose,
  staffId,
  projectId,
  year,
  month,
  onConfirmSuccess,
}: ModalApproveReportMembersProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18DailyReport } = useTranslation(NS_DAILY_REPORT)
  const { t: i18Project } = useTranslation(NS_PROJECT)
  const { t: i18Mbo } = useTranslation(NS_MBO)

  const payloadApi = {
    staffId,
    projectId,
    year,
    month,
  }

  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(NOT_APPROVE)
  const [data, setData] = useState<any>({})

  const tabs = useMemo(() => {
    return [
      {
        step: NOT_APPROVE,
        label: `${i18Mbo('LB_NOT_APPROVED')} (${
          data.reportNotApproved?.length
        })`,
      },
      {
        step: APPROVED,
        label: `${i18Mbo('LB_APPROVED')} (${data.reportApproved?.length})`,
      },
      {
        step: REJECTED,
        label: `${i18DailyReport('LB_REJECTED')} (${
          data.reportReject?.length
        })`,
      },
    ]
  }, [i18Mbo, i18DailyReport, data])

  const listReportsByStatus = useMemo(() => {
    if (activeTab === NOT_APPROVE) {
      return data.reportNotApproved
    }
    if (activeTab === APPROVED) {
      return data.reportApproved
    }
    return data.reportReject
  }, [data, activeTab])

  const onTabChange = (value: number) => {
    setActiveTab(value)
  }

  const getDailyReportListFromMember = () => {
    setLoading(true)
    dailyReportService
      .getDailyReportListFromMember(payloadApi)
      .then(({ data }: AxiosResponse) => {
        setData(data)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (staffId && projectId && year && month) {
      getDailyReportListFromMember()
    }
  }, [])

  return (
    <Modal
      open
      hideFooter
      width={1180}
      title={i18DailyReport('TXT_DAILY_REPORT_LIST')}
      onClose={onClose}
    >
      {loading && <LoadingSkeleton />}
      {!loading && (
        <Box className={classes.body}>
          <Box className={classes.sticky}>
            <Box className={classes.listFields}>
              <Box className={classes.option}>
                <Box className={classes.label}>{i18('LB_STAFF_CODE')}</Box>
                <Box className={classes.value}>{data.staffCode}</Box>
              </Box>
              <Box className={classes.option}>
                <Box className={classes.label}>{i18('LB_STAFF_NAME')}</Box>
                <Box className={classes.value}>{data.staffName}</Box>
              </Box>
              <Box className={classes.option}>
                <Box className={classes.label}>
                  {i18Project('LB_PROJECT_CODE')}
                </Box>
                <Box className={classes.value}>{data.projectCode}</Box>
              </Box>
              <Box className={classes.option}>
                <Box className={classes.label}>
                  {i18Project('LB_PROJECT_NAME')}
                </Box>
                <Box className={classes.value}>{data.projectName}</Box>
              </Box>
              <Box className={classes.option}>
                <Box className={classes.label}>
                  {i18DailyReport('TXT_REPORT_MONTH')}
                </Box>
                <Box className={classes.value}>{data.reportMonth}</Box>
              </Box>
              <Box className={classes.option}>
                <Box className={classes.label}>
                  {i18DailyReport('TXT_CREATED_REPORTS')}
                </Box>
                <Box className={classes.value}>
                  {data.totalReportsCreated}/{data.totalReportsNeeded}
                </Box>
              </Box>
            </Box>
            <CommonTabs
              activeTab={activeTab}
              configTabs={tabs}
              onClickTab={onTabChange}
            />
          </Box>
          <DailyReportListFromMember
            staffId={staffId}
            projectId={projectId}
            year={year}
            month={month}
            isNotApprove={activeTab === NOT_APPROVE}
            reportList={listReportsByStatus || []}
            onConfirmSuccess={() => {
              getDailyReportListFromMember()
              onConfirmSuccess()
            }}
          />
        </Box>
      )}
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  body: {},
  listFields: {
    display: 'flex',
    gap: theme.spacing(2.5, 1),
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
    '&::before': {
      content: '" "',
      position: 'absolute',
      width: '100%',
      height: theme.spacing(3),
      background: '#fff',
      top: '-24px',
    },
  },
  option: {
    width: 'max-content',
  },
  label: {
    fontSize: 14,
    color: theme.color.black.secondary,
  },
  value: {
    fontSize: 14,
    marginTop: theme.spacing(0.5),
    fontWeight: 700,
  },
  sticky: {
    position: 'sticky',
    top: 0,
    background: '#fff',
    zIndex: 1,
  },
}))

export default ModalApproveReportMembers

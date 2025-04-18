import CommonButton from '@/components/buttons/CommonButton'
import NoData from '@/components/common/NoData'
import InputCheckbox from '@/components/inputs/InputCheckbox'
import ModalConfirm from '@/components/modal/ModalConfirm'
import { DIVISION_DIRECTOR_ROLE } from '@/const/app.const'
import { NS_DAILY_REPORT } from '@/const/lang.const'
import { selectAuth } from '@/reducer/auth'
import { alertSuccess, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { themeColors } from '@/ui/mui/v5'
import {
  ArrowDropDown,
  ArrowDropUp,
  Cancel,
  TaskAlt,
} from '@mui/icons-material'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { Fragment, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import dailyReportService from '../../services/dailyReport.service'
import {
  APPROVED,
  NOT_APPROVE,
  REJECTED,
  ReportItem,
} from './ModalApproveReportMembers'

interface DailyReportListFromMemberProps {
  reportList: ReportItem[]
  isNotApprove: boolean
  staffId: string | number
  projectId: string | number
  year: number
  month: number
  onConfirmSuccess: () => void
}

const DailyReportListFromMember = ({
  reportList,
  isNotApprove,
  staffId,
  projectId,
  year,
  month,
  onConfirmSuccess,
}: DailyReportListFromMemberProps) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18DailyReport } = useTranslation(NS_DAILY_REPORT)

  const { role } = useSelector(selectAuth)

  const [listNotApproveChecked, setListNotApproveChecked] = useState<number[]>(
    []
  )
  const [modalConfirmOptions, setModalConfirmOptions] = useState({
    open: false,
    option: REJECTED,
    dailyReportId: 0,
  })

  const isNotApproveCheckAll =
    listNotApproveChecked.length === reportList.length

  const isDivisionManager = useMemo(() => {
    return role?.[0]?.name === DIVISION_DIRECTOR_ROLE
  }, [role])

  const getBorderTopColor = (status: number) => {
    if (status === NOT_APPROVE) {
      return themeColors.color.orange.primary
    }
    if (status === APPROVED) {
      return themeColors.color.green.primary
    }
    return themeColors.color.error.primary
  }

  const onCheckAllNotApprove = () => {
    if (isNotApproveCheckAll) {
      setListNotApproveChecked([])
    } else {
      setListNotApproveChecked(
        reportList.map(reportItem => reportItem.dailyReportId)
      )
    }
  }

  const onCheckItemNotApprove = (id: number) => {
    if (listNotApproveChecked.includes(id)) {
      setListNotApproveChecked(listNotApproveChecked.filter(_id => _id !== id))
    } else {
      const newListNotApproveChecked = [...listNotApproveChecked]
      newListNotApproveChecked.push(id)
      setListNotApproveChecked(newListNotApproveChecked)
    }
  }

  const submitModalConfirmation = () => {
    dispatch(updateLoading(true))
    dailyReportService
      .updateStatusDailyReportFromMember({
        month,
        projectId,
        year,
        staffId,
        noteStatus: '',
        status: modalConfirmOptions.option,
        dailyReportDetailIds: modalConfirmOptions.dailyReportId
          ? [modalConfirmOptions.dailyReportId]
          : listNotApproveChecked,
      })
      .then((res: { message: string }) => {
        dispatch(
          alertSuccess({
            message: res.message,
          })
        )
        if (!modalConfirmOptions.dailyReportId) {
          setListNotApproveChecked([])
        }
        onConfirmSuccess()
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  return (
    <Fragment>
      {modalConfirmOptions.open && (
        <ModalConfirm
          open
          title={
            modalConfirmOptions.option === REJECTED
              ? i18DailyReport('TXT_REJECT_CONFIRMATION')
              : i18DailyReport('TXT_APPROVE_CONFIRMATION')
          }
          description={
            modalConfirmOptions.option === REJECTED
              ? i18DailyReport('MSG_CONFIRM_REJECT_REPORT')
              : i18DailyReport('MSG_CONFIRM_APPROVE_REPORT')
          }
          titleSubmit={
            modalConfirmOptions.option === REJECTED
              ? i18DailyReport('TXT_REJECT')
              : i18DailyReport('TXT_APPROVE')
          }
          colorModal={
            modalConfirmOptions.option === REJECTED ? 'error' : 'primary'
          }
          colorButtonSubmit={
            modalConfirmOptions.option === REJECTED ? 'error' : 'primary'
          }
          onClose={() =>
            setModalConfirmOptions({
              open: false,
              option: REJECTED,
              dailyReportId: 0,
            })
          }
          onSubmit={submitModalConfirmation}
        />
      )}
      <Box className={classes.RootDailyReportListFromMember}>
        {isNotApprove && !!reportList.length && !isDivisionManager && (
          <Box className={classes.headerActions}>
            <InputCheckbox
              label={i18('TXT_SELECT_ALL')}
              indeterminate={
                !!listNotApproveChecked.length && !isNotApproveCheckAll
              }
              checked={listNotApproveChecked.length === reportList.length}
              onClick={onCheckAllNotApprove}
            />
            <Box className={classes.buttons}>
              <CommonButton
                lowercase
                color="error"
                disabled={!listNotApproveChecked.length}
                startIcon={<Cancel />}
                onClick={() =>
                  setModalConfirmOptions({
                    open: true,
                    option: REJECTED,
                    dailyReportId: 0,
                  })
                }
              >
                {i18DailyReport('TXT_REJECT_SELECTION')}
              </CommonButton>
              <CommonButton
                lowercase
                color="success"
                disabled={!listNotApproveChecked.length}
                startIcon={<TaskAlt />}
                onClick={() =>
                  setModalConfirmOptions({
                    open: true,
                    option: APPROVED,
                    dailyReportId: 0,
                  })
                }
              >
                {i18DailyReport('TXT_APPROVE_SELECTION')}
              </CommonButton>
            </Box>
          </Box>
        )}
        {reportList.length ? (
          <Box className={classes.reportList}>
            {reportList.map(reportItem => (
              <Box
                key={reportItem.dailyReportId}
                className={classes.reportItem}
                sx={{ borderTopColor: getBorderTopColor(reportItem.status) }}
              >
                <Box className={classes.headerActions}>
                  <Box className={classes.reportDateBox}>
                    {reportItem.status === NOT_APPROVE &&
                      !isDivisionManager && (
                        <InputCheckbox
                          className={classes.dateLabel}
                          label={reportItem.reportDate}
                          checked={listNotApproveChecked.includes(
                            reportItem.dailyReportId
                          )}
                          onClick={() =>
                            onCheckItemNotApprove(reportItem.dailyReportId)
                          }
                        />
                      )}
                    {isDivisionManager && isNotApprove && (
                      <Box className={classes.reportDate}>
                        {reportItem.reportDate}
                      </Box>
                    )}
                    {reportItem.status === APPROVED && (
                      <TaskAlt
                        sx={{ color: themeColors.color.green.primary }}
                      />
                    )}
                    {reportItem.status === REJECTED && (
                      <Cancel sx={{ color: themeColors.color.error.primary }} />
                    )}
                    {reportItem.status !== NOT_APPROVE && (
                      <Box className={classes.reportDate}>
                        {reportItem.reportDate}
                      </Box>
                    )}
                  </Box>
                  {reportItem.status === NOT_APPROVE && !isDivisionManager && (
                    <Box className={classes.buttons}>
                      <CommonButton
                        lowercase
                        color="error"
                        variant="outlined"
                        className={classes.btn}
                        onClick={() =>
                          setModalConfirmOptions({
                            open: true,
                            option: REJECTED,
                            dailyReportId: reportItem.dailyReportId,
                          })
                        }
                      >
                        {i18('LB_REJECT')}
                      </CommonButton>
                      <CommonButton
                        lowercase
                        color="success"
                        variant="outlined"
                        className={classes.btn}
                        onClick={() =>
                          setModalConfirmOptions({
                            open: true,
                            option: APPROVED,
                            dailyReportId: reportItem.dailyReportId,
                          })
                        }
                      >
                        {i18DailyReport('TXT_APPROVE')}
                      </CommonButton>
                    </Box>
                  )}
                </Box>
                <Box className={classes.reportItemBodyContent}>
                  <Box className={classes.listFields}>
                    <Box className={classes.option}>
                      <Box className={classes.label}>
                        {i18DailyReport('LB_WORKING_HOURS')}
                      </Box>
                      <Box className={classes.value}>
                        {reportItem.workingHours}
                      </Box>
                    </Box>
                    {!!reportItem.workingDescription && (
                      <Box className={classes.option}>
                        <Box className={classes.label}>
                          {i18DailyReport('LB_REPORT_DESCRIPTION')}
                        </Box>
                        <Box className={classes.value}>
                          {reportItem.workingDescription}
                        </Box>
                      </Box>
                    )}
                  </Box>
                  {(!!reportItem.issue || !!reportItem.suggestion) && (
                    <IssuesAndSuggestions
                      issue={reportItem.issue}
                      suggestion={reportItem.suggestion}
                    />
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <NoData className={classes.noData} />
        )}
      </Box>
    </Fragment>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootDailyReportListFromMember: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  headerActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing(3),
    flexWrap: 'wrap',
  },
  reportList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(3),
    overflowY: 'auto',
  },
  reportItem: {
    border: `1px solid ${theme.color.grey.secondary}`,
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(1),
    width: 358,
    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;',
    borderTop: '2.5px solid',
  },
  reportDateBox: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
    fontWeight: 500,
  },
  buttons: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  btn: {
    fontSize: '11px !important',
    height: 24,
    padding: theme.spacing(0.5, 1.5),
  },
  reportItemBodyContent: {
    marginTop: theme.spacing(2),
  },
  listFields: {
    display: 'flex',
    gap: theme.spacing(2.5, 2),
    flexWrap: 'wrap',
    marginBottom: theme.spacing(1),
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
    wordBreak: 'break-word',
  },
  labelIssues: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  dateLabel: {
    fontSize: 14,
  },
  noData: {
    border: `1px solid ${theme.color.grey.secondary}`,
  },
  reportDate: {
    fontSize: 14,
  },
}))

export default DailyReportListFromMember

const IssuesAndSuggestions = ({
  issue,
  suggestion,
}: {
  issue: string
  suggestion: string
}) => {
  const classes = useStyles()
  const { t: i18DailyReport } = useTranslation(NS_DAILY_REPORT)

  const [open, setOpen] = useState(false)

  return (
    <Box className={classes.option}>
      <Box
        className={clsx(classes.label, classes.labelIssues)}
        onClick={() => setOpen(!open)}
      >
        {i18DailyReport('LB_ISSUES_AND_SUGGESTIONS')}
        {open ? <ArrowDropUp /> : <ArrowDropDown />}
      </Box>
      {open && (
        <Box className={classes.listFields}>
          <Box className={classes.option}>
            <Box className={classes.label}>{i18DailyReport('LB_ISSUES')}:</Box>
            <Box className={classes.value}>{issue}</Box>
          </Box>
          <Box className={classes.option}>
            <Box className={classes.label}>
              {i18DailyReport('LB_SUGGESTIONS')}:
            </Box>
            <Box className={classes.value}>{suggestion}</Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

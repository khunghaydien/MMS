import CommonButton from '@/components/buttons/CommonButton'
import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import StatusItem, { IStatusType } from '@/components/common/StatusItem'
import CardFormSeeMore from '@/components/Form/CardFormSeeMore'
import InputFilterDatepicker from '@/components/inputs/InputFilterDatepicker'
import InputSearch from '@/components/inputs/InputSearch'
import ModalConfirm from '@/components/modal/ModalConfirm'
import CommonTable from '@/components/table/CommonTable'
import { DIVISION_DIRECTOR_ROLE, INPUT_TIME_DELAY } from '@/const/app.const'
import {
  NS_DAILY_REPORT,
  NS_MBO,
  NS_PROJECT,
  NS_STAFF,
} from '@/const/lang.const'
import { LIMIT_DEFAULT, PAGE_CURRENT_DEFAULT } from '@/const/table.const'
import {
  dailyReportSelector,
  getStaffListDailyReportManagement,
  getStaffListDrmIds,
  setIsStaffListDrmCheckAll,
  setStaffListDrmListChecked,
} from '@/modules/daily-report/reducer/dailyReport'
import dailyReportService from '@/modules/daily-report/services/dailyReport.service'
import { selectAuth } from '@/reducer/auth'
import { alertSuccess, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { TableHeaderColumn } from '@/types'
import { themeColors } from '@/ui/mui/v5'
import { Cancel, TaskAlt } from '@mui/icons-material'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import clsx from 'clsx'
import _ from 'lodash'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import ModalApproveReportMembers, {
  APPROVED,
  REJECTED,
} from './ModalApproveReportMembers'

interface ProjectItemRes {
  approved: number
  notApproved: number
  projectCode: string
  projectId: number
  projectName: string
  rejected: number
}

interface StaffItemRes {
  approved: number
  created: number
  monthlyReportCount: number
  notApproved: number
  rejected: number
  staffCode: string
  staffId: number
  staffName: string
  editable: boolean
}

const DailyReportManagement = () => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18DailyReport } = useTranslation(NS_DAILY_REPORT)
  const { t: i18Project } = useTranslation(NS_PROJECT)
  const { t: i18Mbo } = useTranslation(NS_MBO)
  const { t: i18Staff } = useTranslation(NS_STAFF)
  const { t: i18 } = useTranslation()

  const { role } = useSelector(selectAuth)
  const { staffListDrmListChecked, isStaffListDrmCheckAll } =
    useSelector(dailyReportSelector)

  const [dailyReportManagementQueries, setDailyReportManagementQueries] =
    useState<{
      monthDate: Date | null
    }>({
      monthDate: new Date(),
    })
  const [projectListLoading, setProjectListLoading] = useState(false)
  const [projectList, setProjectList] = useState<ProjectItemRes[]>([])
  const [projectItemSelected, setProjectItemSelected] = useState<any>({})
  const [flagInit, setFlagInit] = useState(false)
  const [staffListLoading, setStaffListLoading] = useState(false)
  const [staffList, setStaffList] = useState<StaffItemRes[]>([])
  const [staffListQueries, setStaffListQueries] = useState({
    keyword: '',
    pageSize: LIMIT_DEFAULT,
    pageNum: PAGE_CURRENT_DEFAULT,
    projectId: '',
    year: 0,
    month: 0,
  })
  const [staffTotalElements, setStaffTotalElements] = useState(0)
  const [staffListValueSearch, setStaffListValueSearch] = useState('')
  const [openModalApproveReports, setOpenModalApproveReports] = useState(false)
  const [staffItemSelected, setStaffItemSelected] = useState<any>({})
  const [modalConfirmOptions, setModalConfirmOptions] = useState({
    open: false,
    option: REJECTED,
    staffId: 0,
  })

  const projectListColumns: TableHeaderColumn[] = [
    {
      id: 'code',
      label: i18Project('LB_PROJECT_CODE'),
      className: classes.projectCode,
    },
    {
      id: 'projectNameEl',
      label: i18Project('LB_PROJECT_NAME'),
    },
  ]

  const isDivisionManager = useMemo(() => {
    return role?.[0]?.name === DIVISION_DIRECTOR_ROLE
  }, [role])

  const staffListColumns: TableHeaderColumn[] = useMemo(() => {
    const columns = [
      {
        id: 'code',
        label: i18('LB_STAFF_CODE'),
      },
      {
        id: 'staffName',
        label: i18('LB_STAFF_NAME'),
      },
      {
        id: 'created',
        label: i18DailyReport('TXT_CREATED'),
        className: classes.lowercase,
      },
      {
        id: 'notApproved',
        label: i18Mbo('LB_NOT_APPROVED'),
        className: classes.lowercase,
      },
      {
        id: 'approved',
        label: i18Mbo('LB_APPROVED'),
        className: classes.lowercase,
      },
      {
        id: 'rejected',
        label: i18DailyReport('LB_REJECTED'),
        className: classes.lowercase,
      },
    ]
    if (staffList.some(staff => !!staff.notApproved)) {
      columns.push({
        id: 'action',
        label: i18('LB_ACTION'),
      })
    }
    return columns
  }, [i18, i18DailyReport, i18Mbo, staffList])

  const staffListRows = useMemo(() => {
    return staffList.map(item => {
      const totalReports = item.notApproved + item.approved + item.rejected
      return {
        id: item.staffId,
        staffId: item.staffId,
        code: item.staffCode,
        staffName: item.staffName,
        disableRowCheckbox: isDivisionManager || !item.notApproved,
        created: (
          <Box className={classes.boxCreated}>
            <Box
              sx={{
                color:
                  totalReports < item.monthlyReportCount
                    ? themeColors.color.error.primary
                    : themeColors.color.blue.primary,
              }}
            >
              {totalReports}
            </Box>
            {!!item.monthlyReportCount && (
              <Box sx={{ color: themeColors.color.blue.primary }}>
                /{item.monthlyReportCount}
              </Box>
            )}
            <Box sx={{ color: themeColors.color.blue.primary }}>
              &nbsp;
              {i18DailyReport(
                Math.max(totalReports, item.monthlyReportCount) === 1
                  ? 'TXT_REPORT'
                  : 'TXT_REPORTS'
              )}
            </Box>
          </Box>
        ),
        notApproved: item.notApproved ? (
          <Box
            sx={{ fontWeight: 500, color: themeColors.color.orange.primary }}
          >
            {item.notApproved}&nbsp;
            {i18DailyReport(
              item.notApproved === 1 ? 'TXT_REPORT' : 'TXT_REPORTS'
            )}
          </Box>
        ) : (
          item.notApproved
        ),
        approved: item.approved ? (
          <Box sx={{ fontWeight: 500, color: themeColors.color.green.primary }}>
            {item.approved}&nbsp;
            {i18DailyReport(item.approved === 1 ? 'TXT_REPORT' : 'TXT_REPORTS')}
          </Box>
        ) : (
          item.approved
        ),
        rejected: item.rejected ? (
          <Box sx={{ fontWeight: 500, color: themeColors.color.error.primary }}>
            {item.rejected}&nbsp;
            {i18DailyReport(item.rejected === 1 ? 'TXT_REPORT' : 'TXT_REPORTS')}
          </Box>
        ) : (
          item.rejected
        ),
        action: item.notApproved ? (
          <Box className={classes.actions}>
            <CommonButton
              lowercase
              color="error"
              variant="outlined"
              className={classes.btn}
              onClick={() => {
                setModalConfirmOptions({
                  open: true,
                  option: REJECTED,
                  staffId: item.staffId,
                })
              }}
            >
              {i18('LB_REJECT')}
            </CommonButton>
            <CommonButton
              lowercase
              color="success"
              variant="outlined"
              className={classes.btn}
              onClick={() => {
                setModalConfirmOptions({
                  open: true,
                  option: APPROVED,
                  staffId: item.staffId,
                })
              }}
            >
              {i18DailyReport('TXT_APPROVE')}
            </CommonButton>
          </Box>
        ) : (
          <Fragment />
        ),
      }
    })
  }, [staffList, isDivisionManager])

  const titleRightContent = useMemo(() => {
    if (projectItemSelected.id) {
      return `${projectItemSelected.projectCode}: ${projectItemSelected.projectName}`
    }
    return i18DailyReport('LB_STAFF_LIST')
  }, [i18DailyReport, projectItemSelected])

  const projectListRows = useMemo(() => {
    return projectList.map(item => {
      let typeStatus: IStatusType = {
        color: '',
        label: '',
      }
      let countReport = 0
      if (!!item.notApproved) {
        typeStatus = {
          color: 'orange',
          label: i18Mbo('LB_NOT_APPROVED'),
        }
        countReport = item.notApproved
      } else if (!!item.rejected) {
        typeStatus = {
          color: 'red',
          label: i18DailyReport('LB_REJECTED'),
        }
        countReport = item.rejected
      } else {
        typeStatus = {
          color: 'green',
          label: i18Mbo('LB_APPROVED'),
        }
        countReport = item.approved
      }

      return {
        id: item.projectId,
        projectId: item.projectId,
        code: item.projectCode,
        projectCode: item.projectCode,
        projectName: item.projectName,
        projectNameEl: (
          <Box className={classes.boxProjectName}>
            <Box>{item.projectName}</Box>
            {!!countReport && (
              <Box className={classes.boxProjectStatus}>
                <StatusItem typeStatus={typeStatus} />
                <Box className={clsx(classes.countReport, typeStatus.color)}>
                  {countReport}&nbsp;
                  {i18DailyReport(
                    countReport === 1 ? 'TXT_REPORT' : 'TXT_REPORTS'
                  )}
                </Box>
              </Box>
            )}
          </Box>
        ),
      }
    })
  }, [projectList])

  function onDebounceFn(keyword: string) {
    const newQueryParameters = {
      ...staffListQueries,
      keyword,
      pageNum: PAGE_CURRENT_DEFAULT,
      pageSize: LIMIT_DEFAULT,
    }
    setStaffListQueries(newQueryParameters)
  }

  const debounceFn = useCallback(_.debounce(onDebounceFn, INPUT_TIME_DELAY), [
    staffListQueries,
  ])

  const onStaffSearchChange = (newValueSearch: string) => {
    setStaffListValueSearch(newValueSearch)
    debounceFn(newValueSearch.trim())
  }

  const onDateChange = (date: Date | null) => {
    setDailyReportManagementQueries({
      ...dailyReportManagementQueries,
      monthDate: date,
    })
    setProjectItemSelected({})
    setStaffListValueSearch('')
    setStaffListQueries({
      ...staffListQueries,
      keyword: '',
    })
    setStaffList([])
  }

  const onProjectRowClick = (project: any) => {
    if (project.projectId !== projectItemSelected.projectId) {
      setProjectItemSelected(project)
      setStaffListQueries({
        ...staffListQueries,
        projectId: project.id.toString(),
      })
    }
  }

  const onStaffRowClick = (staff: any) => {
    setStaffItemSelected(staff)
    setOpenModalApproveReports(true)
  }

  const getProjectListDailyReportManagement = () => {
    setProjectListLoading(true)
    dailyReportService
      .getProjectListDailyReportManagement({
        month:
          (dailyReportManagementQueries.monthDate?.getMonth() as number) + 1,
        year: dailyReportManagementQueries.monthDate?.getFullYear() as number,
      })
      .then((res: AxiosResponse) => {
        setProjectList(res.data)
      })
      .finally(() => {
        setProjectListLoading(false)
      })
  }

  const getStaffList = () => {
    setTimeout(() => {
      setStaffListLoading(true)
    })
    dispatch(getStaffListDailyReportManagement(staffListQueries))
      .unwrap()
      .then((res: AxiosResponse) => {
        setStaffTotalElements(res.data.totalElements)
        setStaffList(res.data.content)
      })
      .finally(() => {
        setStaffListLoading(false)
      })
  }

  const onPageChange = (newPage: number) => {
    setStaffListQueries({
      ...staffListQueries,
      pageNum: newPage,
    })
  }

  const onPageSizeChange = (newPageSize: number) => {
    setStaffListQueries({
      ...staffListQueries,
      pageSize: newPageSize,
      pageNum: 1,
    })
  }

  const onStaffListCheckAll = () => {
    const newIsCheckAll = !isStaffListDrmCheckAll
    if (newIsCheckAll) {
      dispatch(getStaffListDrmIds(staffListQueries))
    } else {
      dispatch(setStaffListDrmListChecked([]))
    }
    dispatch(setIsStaffListDrmCheckAll(newIsCheckAll))
  }

  const onStaffCheckItem = ({
    newListChecked,
  }: {
    newListChecked: string[]
  }) => {
    dispatch(setStaffListDrmListChecked(newListChecked))
  }

  const submitModalConfirmation = () => {
    dispatch(updateLoading(true))
    dailyReportService
      .updateStatusDailyReportFromMembers({
        month:
          (dailyReportManagementQueries.monthDate?.getMonth() as number) + 1,
        noteStatus: '',
        projectId: projectItemSelected.projectId,
        status: modalConfirmOptions.option,
        year: dailyReportManagementQueries.monthDate?.getFullYear() as number,
        staffIds: modalConfirmOptions.staffId
          ? [modalConfirmOptions.staffId]
          : staffListDrmListChecked,
      })
      .then((res: { message: string }) => {
        getProjectListDailyReportManagement()
        getStaffList()
        dispatch(
          alertSuccess({
            message: res.message,
          })
        )
        if (!modalConfirmOptions.staffId) {
          dispatch(setStaffListDrmListChecked([]))
        }
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  useEffect(() => {
    getProjectListDailyReportManagement()
  }, [dailyReportManagementQueries])

  useEffect(() => {
    if (projectItemSelected.id) {
      getStaffList()
    }
  }, [staffListQueries, projectItemSelected])

  useEffect(() => {
    if (!flagInit && !!projectListRows.length) {
      setFlagInit(true)
      setProjectItemSelected(projectListRows[0])
      setStaffListQueries({
        ...staffListQueries,
        projectId: projectListRows[0].id.toString(),
      })
    }
  }, [projectListRows, flagInit])

  useEffect(() => {
    if (dailyReportManagementQueries.monthDate) {
      setStaffListQueries({
        ...staffListQueries,
        year: dailyReportManagementQueries.monthDate?.getFullYear() || 0,
        month:
          (dailyReportManagementQueries.monthDate?.getMonth() as number) + 1,
      })
    }
  }, [dailyReportManagementQueries.monthDate])

  return (
    <Fragment>
      {openModalApproveReports && (
        <ModalApproveReportMembers
          year={dailyReportManagementQueries.monthDate?.getFullYear() as number}
          month={
            (dailyReportManagementQueries.monthDate?.getMonth() as number) + 1
          }
          staffId={staffItemSelected.id}
          projectId={projectItemSelected.id}
          onClose={() => setOpenModalApproveReports(false)}
          onConfirmSuccess={() => {
            getProjectListDailyReportManagement()
            getStaffList()
          }}
        />
      )}
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
              staffId: 0,
            })
          }
          onSubmit={submitModalConfirmation}
        />
      )}
      <CommonScreenLayout>
        <Box className={classes.RootDailyReportManagement}>
          <Box className={classes.boxFilters}>
            <InputFilterDatepicker
              hideFooter
              useUpdateLabel
              readOnly
              inputFormat="MM/YYYY"
              openTo="month"
              views={['year', 'month']}
              value={dailyReportManagementQueries.monthDate}
              onChange={onDateChange}
            />
          </Box>
          <Box className={classes.container}>
            <CardFormSeeMore
              hideSeeMore
              className={classes.projectPointContainer}
              title={i18DailyReport('TXT_PROJECT_LIST')}
            >
              <CommonTable
                activeId={projectItemSelected.id}
                loading={projectListLoading}
                minWidth={360}
                columns={projectListColumns}
                rows={projectListRows}
                onRowClick={onProjectRowClick}
              />
            </CardFormSeeMore>
            <CardFormSeeMore
              hideSeeMore
              className={classes.projectPointRightContainer}
              title={titleRightContent}
            >
              <Box className={classes.bodyContent}>
                <Box className={classes.headerActions}>
                  <InputSearch
                    placeholder={i18Staff('PLH_SEARCH_STAFF')}
                    label={i18('LB_SEARCH')}
                    value={staffListValueSearch}
                    onChange={onStaffSearchChange}
                  />
                  {!isDivisionManager && (
                    <Box className={classes.buttons}>
                      <CommonButton
                        lowercase
                        color="error"
                        disabled={!staffListDrmListChecked.length}
                        startIcon={<Cancel />}
                        onClick={() =>
                          setModalConfirmOptions({
                            open: true,
                            option: REJECTED,
                            staffId: 0,
                          })
                        }
                      >
                        {i18DailyReport('TXT_REJECT_SELECTION')}
                      </CommonButton>
                      <CommonButton
                        lowercase
                        color="success"
                        disabled={!staffListDrmListChecked.length}
                        startIcon={<TaskAlt />}
                        onClick={() =>
                          setModalConfirmOptions({
                            open: true,
                            option: APPROVED,
                            staffId: 0,
                          })
                        }
                      >
                        {i18DailyReport('TXT_APPROVE_SELECTION')}
                      </CommonButton>
                    </Box>
                  )}
                </Box>

                <CommonTable
                  useCheckbox={
                    !!staffTotalElements &&
                    !isDivisionManager &&
                    staffList.some(item => !!item.notApproved)
                  }
                  listChecked={staffListDrmListChecked}
                  checkAll={
                    staffListDrmListChecked.length === staffTotalElements &&
                    !!staffTotalElements
                  }
                  columns={staffListColumns}
                  rows={staffListRows}
                  loading={staffListLoading}
                  onCheckAll={onStaffListCheckAll}
                  onCheckItem={onStaffCheckItem}
                  onRowClick={onStaffRowClick}
                  pagination={{
                    totalElements: staffTotalElements,
                    pageNum: staffListQueries.pageNum,
                    pageSize: staffListQueries.pageSize,
                    onPageChange: onPageChange,
                    onPageSizeChange: onPageSizeChange,
                  }}
                />
              </Box>
            </CardFormSeeMore>
          </Box>
        </Box>
      </CommonScreenLayout>
    </Fragment>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootDailyReportManagement: {},
  container: {
    display: 'flex',
    gap: theme.spacing(3),
    marginTop: theme.spacing(3),
  },
  projectPointContainer: {
    width: '400px',
  },
  projectPointRightContainer: {
    width: 'calc(100% - 400px)',
  },
  bodyContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  titleBodyRightContent: {
    textAlign: 'center',
    color: theme.color.blue.primary,
    fontWeight: 700,
  },
  boxFilters: {
    display: 'flex',
  },
  boxProjectName: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  boxProjectStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  countReport: {
    fontWeight: 700,
    textTransform: 'lowercase',
    '&.orange': {
      color: theme.color.orange.primary,
    },
    '&.red': {
      color: theme.color.error.primary,
    },
    '&.green': {
      color: theme.color.green.primary,
    },
  },
  boxCreated: {
    display: 'flex',
    fontWeight: 500,
  },
  lowercase: {
    textTransform: 'lowercase',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  btn: {
    fontSize: '11px !important',
    height: 24,
    padding: theme.spacing(0.5, 1.5),
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  buttons: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  projectCode: {
    width: 115,
  },
}))

export default DailyReportManagement

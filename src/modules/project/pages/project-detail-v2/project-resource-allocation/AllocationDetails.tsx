import CardFormSeeMore from '@/components/Form/CardFormSeeMore'
import CommonButton from '@/components/buttons/CommonButton'
import CommonTabs from '@/components/tabs'
import { LangConstant, TableConstant } from '@/const'
import { UNIT_OF_TIME } from '@/const/app.const'
import ModaleTimesheet from '@/modules/project/components/ModalTimesheet'
import { projectSelector } from '@/modules/project/reducer/project'
import { getProjectAssignment } from '@/modules/project/reducer/thunk'
import { ProjectService } from '@/modules/project/services'
import { AppDispatch } from '@/store'
import { Pagination } from '@/types'
import { History } from '@mui/icons-material'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import ModalAssignNewStaff from './ModalAssignNewStaff'
import ModalHistoryStaff from './ModalHistoryStaff'
import TableActualEffort from './TableActualEffort'
import TableStaffAssignment from './TableStaffAssignment'

export interface ActualEffortQueryRA {
  toYear: number | null
  fromYear: number | null
  divisionId?: string
  unitOfTime: string
  pageNum: number
  pageSize: number
}

const AllocationDetails = () => {
  const classes = useStyles()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)

  const { queryStaffAssignment, permissionResourceAllocation } =
    useSelector(projectSelector)

  const [activeTab, setActiveTab] = useState(0)
  const [openModalTimeSheet, setOpenModalTimeSheet] = useState(false)
  const [isLoadingListActualEffort, setIsLoadingListActualEffort] =
    useState(false)
  const [actualEffort, setActualEffort] = useState({
    data: [],
    total: 0,
  })
  const [actualEffortQuery, setActualEffortQuery] =
    useState<ActualEffortQueryRA>({
      fromYear: new Date().getTime(),
      toYear: new Date().getTime(),
      divisionId: '',
      unitOfTime: UNIT_OF_TIME[0].value,
      pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
      pageSize: TableConstant.LIMIT_DEFAULT,
    })
  const [isStaffAssignmentLoading, setIsStaffAssignmentLoading] =
    useState(false)
  const [openModalAddAssignStaff, setOpenModalAddAssignStaff] = useState(false)
  const [openModalHistoryStaff, setOpenModalHistoryStaff] = useState(false)

  const isDetailPage = !!params.projectId

  const listTabs = useMemo(() => {
    const data = isDetailPage
      ? [
          {
            step: 0,
            label: i18Project('LB_STAFF_ASSIGNMENT'),
          },
          {
            step: 1,
            label: i18Project('LB_ACTUAL_EFFORT'),
          },
        ]
      : [
          {
            step: 0,
            label: i18Project('LB_STAFF_ASSIGNMENT'),
          },
        ]
    return {
      staffAssignment: 0,
      actualEffort: 1,
      data,
    }
  }, [])

  const handleTabChange = (tab: number) => {
    setActiveTab(tab)
  }

  const getProjectResourceAllocationActualEffort = async (
    actualEffortQuery: ActualEffortQueryRA
  ) => {
    setIsLoadingListActualEffort(true)
    const query: ActualEffortQueryRA = {
      ...actualEffortQuery,
      fromYear: actualEffortQuery.fromYear
        ? new Date(actualEffortQuery.fromYear as number).getFullYear()
        : new Date().getFullYear(),
      toYear: actualEffortQuery.toYear
        ? new Date(actualEffortQuery.toYear as number).getFullYear()
        : new Date().getFullYear(),
    }
    ProjectService.getProjectResourceAllocationActualEffort(
      params.projectId as string,
      query
    )
      .then((res: AxiosResponse) => {
        setActualEffort({
          data: res.data.content,
          total: res.data.totalElements,
        })
      })
      .finally(() => {
        setIsLoadingListActualEffort(false)
      })
  }

  const getListAssignHeadcount = (paginate: Pagination) => {
    const _payload = {
      projectId: params.projectId as string,
      params: {
        ...paginate,
      },
    }
    setIsStaffAssignmentLoading(true)
    dispatch(getProjectAssignment(_payload))
      .unwrap()
      .finally(() => {
        setIsStaffAssignmentLoading(false)
      })
  }

  useEffect(() => {
    getProjectResourceAllocationActualEffort(actualEffortQuery)
  }, [actualEffortQuery])

  useEffect(() => {
    getListAssignHeadcount(queryStaffAssignment)
  }, [queryStaffAssignment])

  return (
    <Fragment>
      {openModalHistoryStaff && (
        <ModalHistoryStaff
          onClose={() => setOpenModalHistoryStaff(false)}
          reGetListAssignHeadcount={() => {
            getListAssignHeadcount(queryStaffAssignment)
            getProjectResourceAllocationActualEffort(actualEffortQuery)
          }}
        />
      )}
      {openModalTimeSheet && (
        <ModaleTimesheet
          open
          onCloseModal={() => setOpenModalTimeSheet(false)}
          projectId={params.projectId as string}
        />
      )}
      {openModalAddAssignStaff && (
        <ModalAssignNewStaff
          onClose={() => setOpenModalAddAssignStaff(false)}
          reGetListAssignHeadcount={() => {
            getListAssignHeadcount(queryStaffAssignment)
            getProjectResourceAllocationActualEffort(actualEffortQuery)
          }}
        />
      )}

      <CardFormSeeMore
        hideSeeMore
        title={i18Project('TXT_RESOURCE_ALLOCATION')}
      >
        <Box className={classes.header}>
          <Box>
            <CommonTabs
              nonLinear
              configTabs={listTabs.data}
              activeTab={activeTab}
              onClickTab={handleTabChange}
            />
          </Box>
          {!!permissionResourceAllocation.viewGeneralStaffAssignment && (
            <CommonButton onClick={() => setOpenModalTimeSheet(true)}>
              {i18Project('TXT_VIEW_TIMESHEET')}
            </CommonButton>
          )}
        </Box>
        {activeTab === listTabs.staffAssignment && (
          <Box className={classes.tableStaffAssignmentBox}>
            <TableStaffAssignment
              loading={isStaffAssignmentLoading}
              setOpenModalAddAssignStaff={setOpenModalAddAssignStaff}
              reGetListAssignHeadcount={() => {
                getListAssignHeadcount(queryStaffAssignment)
              }}
            />
            {!!permissionResourceAllocation.viewHistoryStaff && (
              <Box
                className={classes.buttonHistoryStaff}
                onClick={() => setOpenModalHistoryStaff(true)}
              >
                <History />
                <Box>{i18Project('LB_HISTORY_STAFF')}</Box>
              </Box>
            )}
          </Box>
        )}
        {activeTab === listTabs.actualEffort && isDetailPage && (
          <TableActualEffort
            isLoadingListActualEffort={isLoadingListActualEffort}
            actualEffort={actualEffort}
            actualEffortQuery={actualEffortQuery}
            setActualEffortQuery={setActualEffortQuery}
          />
        )}
      </CardFormSeeMore>
    </Fragment>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  tableStaffAssignmentBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    alignItems: 'flex-end',
  },
  buttonHistoryStaff: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
    color: theme.color.blue.primary,
    fontWeight: 700,
    cursor: 'pointer',
    '& svg': {},
  },
}))

export default AllocationDetails

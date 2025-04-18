import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import StatusItem, { IStatusType } from '@/components/common/StatusItem'
import { AppDispatch } from '@/store'
import { OptionItem, TableHeaderColumn } from '@/types'
import { formatDate } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import i18next from 'i18next'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STAFF_STATUS, STAFF_STEP } from '../../const'
import {
  resetFormStaff,
  setActiveStep,
  staffSelector,
} from '../../reducer/staff'
import { getListStaff } from '../../reducer/thunk'
import { StaffState } from '../../types'
import { ListStaffParams } from '../../types/staff-list'
import StaffListActions from './StaffListActions'
import TableStaffList from './TableStaffList'

const staffListHeadCells: TableHeaderColumn[] = [
  {
    id: 'code',
    align: 'left',
    label: i18next.t('common:LB_STAFF_CODE'),
    sortBy: 'code',
    orderBy: 'desc',
    checked: false,
    isVisible: true,
  },
  {
    id: 'staffName',
    align: 'left',
    label: i18next.t('common:LB_STAFF_NAME'),
    sortBy: 'name',
    orderBy: 'desc',
    checked: false,
    isVisible: true,
  },
  {
    id: 'gender',
    align: 'left',
    label: i18next.t('staff:LB_GENDER'),
    checked: false,
    isVisible: true,
  },
  {
    id: 'email',
    align: 'left',
    label: i18next.t('common:LB_EMAIL'),
    checked: false,
    isVisible: true,
  },
  {
    id: 'branch',
    align: 'left',
    label: i18next.t('common:LB_BRANCH'),
    checked: false,
    isVisible: true,
  },
  {
    id: 'division',
    align: 'left',
    label: i18next.t('common:LB_DIVISION'),
    checked: false,
    isVisible: true,
  },
  {
    id: 'jobType',
    align: 'left',
    label: i18next.t('staff:LB_JOB_TYPE'),
    checked: false,
    isVisible: true,
  },
  {
    id: 'startDate',
    align: 'left',
    label: i18next.t('staff:LB_START_DATE'),
    // orderBy: 'desc',
    // sortBy: 'startDate',
    checked: false,
    isVisible: true,
  },
  {
    id: 'endDate',
    align: 'left',
    label: i18next.t('staff:LB_END_DATE'),
    checked: false,
    isVisible: false,
  },
  {
    id: 'position',
    align: 'left',
    label: i18next.t('common:LB_POSITION'),
    checked: false,
    isVisible: true,
  },
  {
    id: 'status',
    align: 'left',
    label: i18next.t('common:LB_STATUS'),
    checked: false,
    isVisible: true,
  },
]

const convertStaffStatus = (status: any): IStatusType => {
  if (STAFF_STATUS[status?.id]) {
    return STAFF_STATUS[status?.id]
  }
  return {
    color: '',
    label: '',
  }
}

const createData = (item: any) => {
  return {
    id: item.id.toString(),
    code: item.code,
    staffName: item.name,
    gender: item.gender?.name,
    email: item.email,
    branch: item.branch?.name,
    division: item.division?.name,
    startDate: item.startDate ? formatDate(item.startDate) : '',
    jobType: item.jobType?.name,
    position: item.position?.name,
    status: <StatusItem typeStatus={{ ...convertStaffStatus(item.status) }} />,
  }
}

const refactorQueryParameters = (queryParameters: ListStaffParams) => {
  const newQueryParameters = {
    startDate: queryParameters.startDate ?? null,
    endDate: queryParameters.endDate ?? null,
    orderBy: queryParameters.orderBy ?? null,
    sortBy: queryParameters.sortBy ?? null,
    pageNum: queryParameters.pageNum ?? null,
    pageSize: queryParameters.pageSize ?? null,
    status: !!queryParameters.status?.length
      ? queryParameters.status?.map((item: any) => item).join(',')
      : null,
    branchIds: !!queryParameters.branchId?.length
      ? queryParameters.branchId?.map((item: any) => item).join(',')
      : null,
    divisionIds: !!queryParameters.divisionIds?.length
      ? queryParameters.divisionIds?.map((item: any) => item).join(',')
      : null,
    jobType: !!queryParameters.jobType?.length
      ? queryParameters.jobType?.map((item: any) => item).join(',')
      : null,
    skillsId: !!queryParameters.skillsId?.length
      ? queryParameters.skillsId
          .map((skillSet: any) => skillSet.value)
          .join(',')
      : null,
    partnerId: !!queryParameters.partnerId?.length
      ? queryParameters.partnerId
          .map((skillSet: any) => skillSet.value)
          .join(',')
      : null,
    customerId: !!queryParameters.customerId?.length
      ? queryParameters.customerId
          .map((skillSet: any) => skillSet.value)
          .join(',')
      : null,
    positionIds: !!queryParameters.positionIds?.length
      ? queryParameters.positionIds
          .map((position: OptionItem) => position.value)
          .join(',')
      : null,
    keyword: queryParameters.keyword?.trim() || null,
  }
  return newQueryParameters
}

const StaffManagementList = () => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()

  const { staffList, staffQueryParameters, listChecked }: StaffState =
    useSelector(staffSelector)

  const [headCells, setHeadCells] = useState(staffListHeadCells)

  const rows = useMemo(() => {
    return staffList?.map((item: any) => createData(item)) || []
  }, [staffList])

  const getListStaffApi = (params: ListStaffParams) => {
    const newQueryParameters = refactorQueryParameters(params)
    dispatch(getListStaff(newQueryParameters))
  }

  useEffect(() => {
    getListStaffApi(staffQueryParameters)
    dispatch(resetFormStaff({}))
    dispatch(setActiveStep(STAFF_STEP.GENERAL_INFORMATION))
  }, [staffQueryParameters])

  return (
    <CommonScreenLayout title="Staff Management List">
      <Box className={classes.container}>
        <StaffListActions headCells={headCells} listChecked={listChecked} />
        <TableStaffList
          rows={rows}
          headCells={headCells}
          setHeadCells={setHeadCells}
          params={staffQueryParameters}
          refactorQueryParameters={refactorQueryParameters}
        />
      </Box>
    </CommonScreenLayout>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootPartnerList: {},
  title: {
    fontSize: 16,
    fontWeight: 700,
    borderBottom: `1px solid ${theme.color.grey.secondary}`,
    width: 'max-content',
    paddingBottom: '28px',
  },
  container: {
    marginTop: theme.spacing(3),
  },
}))

export default StaffManagementList

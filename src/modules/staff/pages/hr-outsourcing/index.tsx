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
  setHrOsQueryParameters,
  staffSelector,
} from '../../reducer/staff'
import { getListStaffOutsource } from '../../reducer/thunk'
import { StaffState } from '../../types'
import { ListStaffParams } from '../../types/staff-list'
import HrOutsourcingListActions from './HrOutsourcingListActions'
import TableStaffList from './TableStaffList'

const staffListHeadCells: TableHeaderColumn[] = [
  {
    id: 'code',
    align: 'left',
    label: i18next.t('common:LB_STAFF_CODE'),
    sortBy: 'code',
    orderBy: 'desc',
    checked: false,
  },
  {
    id: 'staffName',
    align: 'left',
    label: i18next.t('common:LB_STAFF_NAME'),
    sortBy: 'name',
    orderBy: 'desc',
    checked: false,
  },
  {
    id: 'gender',
    align: 'left',
    label: i18next.t('staff:LB_GENDER'),
    checked: false,
  },
  {
    id: 'email',
    align: 'left',
    label: i18next.t('common:LB_EMAIL'),
    checked: false,
  },
  {
    id: 'partner',
    align: 'left',
    label: i18next.t('common:LB_PARTNER'),
    checked: false,
    tooltip: "Staff's Company",
  },
  {
    id: 'customer',
    align: 'left',
    label: i18next.t('common:LB_CUSTOMER'),
    checked: false,
  },
  {
    id: 'position',
    align: 'left',
    label: i18next.t('common:LB_POSITION'),
    checked: false,
  },
  {
    id: 'onboardDate',
    align: 'left',
    label: i18next.t('staff:LB_ONBOARD_DATE'),
    orderBy: 'desc',
    sortBy: 'onboardDate',
    checked: false,
  },
  {
    id: 'expiredContractDate',
    align: 'left',
    label: i18next.t('staff:LB_CONTRACT_EXPIRED_DATE'),
    checked: false,
    sortBy: 'expiredContractDate',
    orderBy: 'desc',
  },
  {
    id: 'branch',
    align: 'left',
    label: i18next.t('common:LB_BRANCH'),
    checked: false,
  },
  {
    id: 'status',
    align: 'left',
    label: i18next.t('common:LB_STATUS'),
    checked: false,
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
    partner: item.partner?.name,
    customer: item.customer?.name,
    position: item.position?.name,
    onboardDate: item.onboardDate ? formatDate(item.onboardDate) : '',
    expiredContractDate: item.expiredContractDate
      ? formatDate(item.expiredContractDate)
      : '',
    branch: item.branch?.name,
    status: <StatusItem typeStatus={{ ...convertStaffStatus(item.status) }} />,
  }
}

const refactorQueryParameters = (queryParameters: ListStaffParams) => {
  const newQueryParameters = {
    ...structuredClone(queryParameters),
    divisionIds: !!queryParameters.divisionIds?.length
      ? queryParameters.divisionIds
          ?.map((item: OptionItem) => item.id)
          .join(',')
      : null,
    skillsId: !!queryParameters.skillsId?.length
      ? queryParameters.skillsId
          .map((skillSet: any) => skillSet.value)
          .join(',')
      : null,
    positionIds: !!queryParameters.positionIds?.length
      ? queryParameters.positionIds
          .map((position: OptionItem) => position.value)
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
    keyword: queryParameters.keyword?.trim(),
  }
  return newQueryParameters
}

const HrOutsourcingManagementList = () => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()

  const {
    staffListOutsource,
    hrOsQueryParameters,
    listHROutsouceChecked,
  }: StaffState = useSelector(staffSelector)

  const [headCells, setHeadCells] = useState(staffListHeadCells)

  const rows = useMemo(() => {
    return staffListOutsource?.map((item: any) => createData(item)) || []
  }, [staffListOutsource])

  const getListStaffApi = (params: ListStaffParams) => {
    const newQueryParameters = refactorQueryParameters(params)
    dispatch(getListStaffOutsource(newQueryParameters))
  }

  useEffect(() => {
    const newQueryParameters = {
      ...hrOsQueryParameters,
      keyword: '',
    }
    dispatch(setHrOsQueryParameters(newQueryParameters))
  }, [dispatch])

  useEffect(() => {
    getListStaffApi(hrOsQueryParameters)
    dispatch(resetFormStaff({}))
    dispatch(setActiveStep(STAFF_STEP.GENERAL_INFORMATION))
  }, [hrOsQueryParameters])

  return (
    <CommonScreenLayout title="HR Outsourcing Management List">
      <Box className={classes.partnerContainer}>
        <HrOutsourcingListActions
          headCells={headCells}
          listChecked={listHROutsouceChecked}
        />
        <TableStaffList
          rows={rows}
          headCells={headCells}
          setHeadCells={setHeadCells}
          params={hrOsQueryParameters}
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
  partnerContainer: {
    marginTop: theme.spacing(3),
  },
}))

export default HrOutsourcingManagementList

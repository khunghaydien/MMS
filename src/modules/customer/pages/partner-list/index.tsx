import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import PriorityStatus from '@/components/common/PriorityStatus'
import StatusItem from '@/components/common/StatusItem'
import { LangConstant } from '@/const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { AppDispatch } from '@/store'
import { Division, ISkillSet, TableHeaderColumn } from '@/types'
import { formatDate } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { cloneDeep } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  PartnerState,
  getListIds,
  getListPartners,
  selectPartner,
} from '../../reducer/partner'
import { ListPartnersParams } from '../../types'
import { convertDataStatus } from '../customer-list'
import PartnerListActions from './PartnerListActions'
import TablePartnerList from './TablePartnerList'

const partnerListHeadCells: TableHeaderColumn[] = [
  {
    id: 'id',
    align: 'left',
    label: 'Partner Code',
    orderBy: 'desc',
    sortBy: 'id',
    checked: false,
  },
  {
    id: 'partnerName',
    align: 'left',
    label: 'Partner Name',
    checked: false,
  },
  {
    id: 'partnerAbbreviation',
    align: 'left',
    label: 'Partner Abbreviation',
    checked: false,
  },
  {
    id: 'location',
    align: 'left',
    label: 'Location',
    orderBy: 'desc',
    sortBy: 'location',
    checked: false,
  },
  {
    id: 'language',
    align: 'left',
    label: 'Language',
    checked: false,
  },
  {
    id: 'strength',
    align: 'left',
    label: 'Strength',
    checked: false,
  },
  {
    id: 'branch',
    align: 'left',
    label: 'Branch',
    checked: false,
  },
  {
    id: 'division',
    align: 'left',
    label: 'Division',
    checked: false,
  },
  {
    id: 'contactName',
    align: 'left',
    label: 'Contact Name',
    checked: false,
  },
  {
    id: 'collaborationStartDate',
    align: 'left',
    label: 'Collaboration Start Date',
    orderBy: 'desc',
    sortBy: 'collaborationStartDate',
    checked: false,
  },
  {
    id: 'priority',
    align: 'left',
    label: 'Priority',
    orderBy: 'desc',
    sortBy: 'priority',
    checked: false,
  },
  {
    id: 'status',
    align: 'left',
    label: 'Status',
    checked: false,
  },
]

const createData = (item: any) => {
  return {
    id: item.id,
    partnerName: item.name || '',
    strength:
      item.strengths.map((skillSet: ISkillSet) => skillSet.name).join(', ') ||
      '',
    branch: item.branch?.name || '',
    contactName: item.contactName || '',
    collaborationStartDate: item.collaborationStartDate
      ? formatDate(item.collaborationStartDate)
      : '',
    priority: <PriorityStatus priority={item.priority?.id || ''} />,
    status: <StatusItem typeStatus={{ ...convertDataStatus(item.status) }} />,
    location: item.location?.name || '',
    division: item.divisions.map((div: Division) => div.name).join(', ') || '',
    language: JSON.parse(item.languageIds || '[]')
      .join(', ')
      .toUpperCase(),
    partnerAbbreviation: item.abbreviation || '',
  }
}

const refactorQueryParameters = (queryParameters: ListPartnersParams) => {
  const newQueryParameters = structuredClone(queryParameters)
  if (newQueryParameters.skillSetIds?.length) {
    newQueryParameters.skillSetIds = newQueryParameters.skillSetIds
      .map((skillSet: any) => skillSet.value)
      .join(',')
  }
  if (newQueryParameters.languageIds?.length) {
    newQueryParameters.languageIds = newQueryParameters.languageIds
      .map((lang: any) => lang.value)
      .join(',')
  }
  if (newQueryParameters.divisionIds?.length) {
    newQueryParameters.divisionIds = newQueryParameters.divisionIds
      .map((division: any) => division.value)
      .join(',')
  }
  return newQueryParameters
}

const PartnerList = () => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Customer } = useTranslation(LangConstant.NS_CUSTOMER)

  const {
    partnerQueryParameters,
    listPartners,
    listChecked,
    isCheckAll,
  }: PartnerState = useSelector(selectPartner)
  const { permissions }: AuthState = useSelector(selectAuth)

  const [headCells, setHeadCells] = useState(() => {
    const newPartnerListHeadCells = cloneDeep(partnerListHeadCells)
    return permissions.usePartnerDelete
      ? partnerListHeadCells
      : newPartnerListHeadCells.splice(0, newPartnerListHeadCells.length - 1)
  })

  const rows = useMemo(() => {
    return listPartners?.map((item: any) => createData(item)) || []
  }, [listPartners])

  const getListPartnersApi = (params: ListPartnersParams = {}) => {
    const newQueryParameters = refactorQueryParameters(params)
    if (isCheckAll) {
      dispatch(getListIds(newQueryParameters))
    }
    dispatch(getListPartners(newQueryParameters))
  }

  useEffect(() => {
    getListPartnersApi(partnerQueryParameters)
  }, [partnerQueryParameters])

  return (
    <CommonScreenLayout title={i18Customer('TXT_PARTNER_MANAGEMENT_TITLE')}>
      <Box className={classes.partnerContainer}>
        <PartnerListActions headCells={headCells} listChecked={listChecked} />
        <TablePartnerList
          rows={rows}
          refactorQueryParameters={refactorQueryParameters}
          headCells={headCells}
          setHeadCells={setHeadCells}
          params={partnerQueryParameters}
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

export default PartnerList

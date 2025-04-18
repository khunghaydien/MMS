import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import { LangConstant } from '@/const'
import { AppDispatch } from '@/store'
import { TableHeaderColumn } from '@/types'
import { formatDate } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  projectSelector,
  setIsListRequestOTFetching,
} from '../../reducer/project'
import { getListRequestOT } from '../../reducer/thunk'
import { IListRequestParams, ProjectState } from '../../types'
import RequestOTListAction from './RequestOTListAction'
import TableRequestOTList from './TableRequestOTList'

const requestOTListHeadCells: TableHeaderColumn[] = [
  {
    id: 'projectCode',
    align: 'left',
    label: 'Project Code',
    sortBy: 'projectCode',
    orderBy: 'desc',
    checked: false,
  },
  {
    id: 'requestName',
    align: 'left',
    label: 'Request Name',
    checked: false,
  },
  {
    id: 'projectName',
    align: 'left',
    label: 'Project Name',
    sortBy: 'projectName',
    orderBy: 'desc',
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
    id: 'requestStartDate',
    align: 'left',
    label: 'Request Start Date',
    sortBy: 'requestStartDate',
    orderBy: 'desc',
    checked: false,
  },
  {
    id: 'requestEndDate',
    align: 'left',
    label: 'Request End Date',
    sortBy: 'requestEndDate',
    orderBy: 'desc',
    checked: false,
  },
  {
    id: 'estimatedOTHours',
    align: 'left',
    label: 'Est. OT hours',
    sortBy: 'estimatedOTHours',
    orderBy: 'desc',
    checked: false,
  },
  {
    id: 'createPerson',
    align: 'left',
    label: 'Create Person',
    checked: false,
  },
  {
    id: 'lastUpdatedDate',
    align: 'left',
    label: 'Last Updated Date',
    checked: false,
  },
  {
    id: 'requestStatus',
    align: 'left',
    label: 'Request Status',
    checked: false,
    isHighlight: true,
  },
  {
    id: 'effectStatus',
    align: 'left',
    label: 'Effect Status',
    checked: false,
    isHighlight: true,
  },
  {
    id: 'delete',
    align: 'center',
    label: 'Action',
    checked: false,
  },
]

const createData = (item: any) => {
  return {
    id: item.id,
    projectCode: item.projectCode,
    requestName: item.requestName || '',
    projectName: item.projectName,
    branch: item.branch,
    division: item.division,
    requestStartDate: formatDate(item.requestStartDate),
    requestEndDate: formatDate(item.requestEndDate),
    estimatedOTHours: item.estimatedOTHours,
    createPerson: item.creator,
    lastUpdatedDate: formatDate(item.lastUpdatedDate),
    requestStatus: item.requestStatus.name,
    effectStatus: item.effectStatus.name,
    useApprove: item.canApprove,
    useReject: item.canReject,
    useUpdate: item.canUpdate,
    isRequestOT: item.canUpdate || item.canApprove || item.canReject,
    isActiveCheckbox: item.canApprove || item.canReject,
  }
}

const refactorQueryParameters = (queryParameters: IListRequestParams) => {
  const newQueryParameters = {
    ...structuredClone(queryParameters),
    requestStatus: queryParameters.requestStatus,
    effectStatus: queryParameters.effectStatus,
    projectId: queryParameters?.projectId?.id,
  }
  return newQueryParameters
}

const ProjectList = () => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)

  const { requestOTList, requestOTQueryParameters, listChecked }: ProjectState =
    useSelector(projectSelector)

  const rows = useMemo(() => {
    return requestOTList?.map((item: any) => createData(item)) || []
  }, [requestOTList])

  const getListRequestOTsApi = (params: IListRequestParams = {}) => {
    setTimeout(() => {
      dispatch(setIsListRequestOTFetching(true))
    })
    const newQueryParameters = refactorQueryParameters(params)
    dispatch(getListRequestOT(newQueryParameters))
  }

  useEffect(() => {
    getListRequestOTsApi(requestOTQueryParameters)
  }, [requestOTQueryParameters])

  return (
    <CommonScreenLayout title={i18Project('TXT_REQUEST_OT_MANAGEMENT')}>
      <Box className={classes.projectContainer}>
        <RequestOTListAction
          listChecked={listChecked}
          headCells={requestOTListHeadCells}
        />
        <TableRequestOTList
          rows={rows}
          headCells={requestOTListHeadCells}
          params={requestOTQueryParameters}
          refactorQueryParameters={refactorQueryParameters}
          onApprove={() => getListRequestOTsApi(requestOTQueryParameters)}
          onReject={() => getListRequestOTsApi(requestOTQueryParameters)}
          onUpdate={() => getListRequestOTsApi(requestOTQueryParameters)}
        />
      </Box>
    </CommonScreenLayout>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootProjectList: {},
  title: {
    fontSize: 16,
    fontWeight: 700,
    borderBottom: `1px solid ${theme.color.grey.secondary}`,
    width: 'max-content',
    paddingBottom: '28px',
  },
  projectContainer: {
    marginTop: theme.spacing(3),
  },
}))
export default ProjectList

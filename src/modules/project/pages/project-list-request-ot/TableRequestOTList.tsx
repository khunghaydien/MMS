import ModalConfirm from '@/components/modal/ModalConfirm'
import CustomTable from '@/components/table/CustomTable'
import { LangConstant, PathConstant } from '@/const'
import { AppDispatch } from '@/store'
import { SortChangePayload, TableHeaderColumn } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import ModalReasonReject from '../../components/ModalReasonReject'
import ModalRequestOT from '../../components/ModalRequestOT'
import {
  projectSelector,
  setIsCheckAllRequestOT,
  setListCheckedRequestOT,
  setRequestOTQueryParameters,
} from '../../reducer/project'
import { getListIds, updateOTRequestStatus } from '../../reducer/thunk'
import { IListProjectsParams, ProjectState } from '../../types'

interface ITableProjectList {
  params: IListProjectsParams
  headCells: TableHeaderColumn[]
  onApprove: () => void
  rows: any
  refactorQueryParameters: (
    queryParameters: IListProjectsParams
  ) => IListProjectsParams
  onReject: () => void
  onUpdate: () => void
}

const TableRequestOTList = ({
  params,
  headCells,
  rows,
  refactorQueryParameters,
  onApprove,
  onReject,
  onUpdate,
}: ITableProjectList) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const {
    requestOTTotalElements,
    requestOTQueryParameters,
    listCheckedRequestOT,
    isCheckAllRequestOT,
    isListRequestOTFetching,
  }: ProjectState = useSelector(projectSelector)
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)
  const [headCellsProject, setHeadCellsProject] = useState(headCells)
  const [isModalRequestOT, setIsModalRequestOT] = useState(false)
  const [requestOTDetail, setRequestOTDetail] = useState<any>(null)
  const [isShowModalConfirmApprove, setIsShowModalConfirmApprove] =
    useState(false)
  const [isShowModalConfirmReject, setIsShowModalConfirmReject] =
    useState(false)
  const [requestOTId, setRequestOTId] = useState<string>('')
  const [requestName, setRequestName] = useState<string>('')

  const handlePageChange = (newPage: number) => {
    const newQueryParameters = {
      ...requestOTQueryParameters,
      pageNum: newPage,
    }
    dispatch(setRequestOTQueryParameters(newQueryParameters))
  }
  const handleRowClick = (row: any) => {
    setIsModalRequestOT(true)
    setRequestOTDetail(row)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    const newQueryParameters = {
      ...requestOTQueryParameters,
      pageNum: 1,
      pageSize: newPageSize,
    }
    dispatch(setRequestOTQueryParameters(newQueryParameters))
  }

  const handleCheckAll = () => {
    const newIsCheckAll = !isCheckAllRequestOT
    if (newIsCheckAll) {
      const newQueryParameters = refactorQueryParameters(params)
      dispatch(getListIds(newQueryParameters))
    } else {
      dispatch(setListCheckedRequestOT([]))
    }
    dispatch(setIsCheckAllRequestOT(newIsCheckAll))
  }

  const handleCheckItem = ({
    newListChecked,
  }: {
    newListChecked: string[]
  }) => {
    dispatch(setListCheckedRequestOT(newListChecked))
  }

  const handleSortChange = ({
    nextOrderBy,
    sortBy,
    newColumns,
  }: SortChangePayload) => {
    setHeadCellsProject(newColumns)
    const newQueryParameters = {
      ...requestOTQueryParameters,
      orderBy: nextOrderBy,
      sortBy,
    }
    dispatch(setRequestOTQueryParameters(newQueryParameters))
  }

  const onApproveRequestOT = async (request: any) => {
    setIsShowModalConfirmApprove(true)
    setRequestOTId(request.id)
    setRequestName(request.requestName)
  }

  const handleApprove = async () => {
    await dispatch(
      updateOTRequestStatus({
        id: parseInt(requestOTId),
        status: 2,
      })
    )
    onApprove()
  }

  const onRejectRequestOT = (request: any) => {
    setIsShowModalConfirmReject(true)
    setRequestOTId(request.id)
  }

  const onUpdateRequestOT = (requestOT: any) => {
    setIsModalRequestOT(true)
    setRequestOTDetail(requestOT)
  }

  return (
    <Box className={classes.rootTableProjectList}>
      <CustomTable
        useCheckbox
        linkFormat={PathConstant.PROJECT_DETAIL_FORMAT}
        checkAll={listCheckedRequestOT.length === requestOTTotalElements}
        listChecked={listCheckedRequestOT}
        loading={isListRequestOTFetching}
        columns={headCellsProject}
        rows={rows}
        onCheckItem={handleCheckItem}
        onCheckAll={handleCheckAll}
        onSortChange={handleSortChange}
        onRowClick={handleRowClick}
        onApproveRequestOT={onApproveRequestOT}
        onRejectRequestOT={onRejectRequestOT}
        onUpdateRequestOT={onUpdateRequestOT}
        isRequestTable
        pagination={{
          totalElements: requestOTTotalElements,
          pageSize: params.pageSize as number,
          pageNum: params.pageNum as number,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
        }}
      />
      {isModalRequestOT && (
        <ModalRequestOT
          open
          onCloseModal={() => setIsModalRequestOT(false)}
          disabled={false}
          requestOTId={requestOTDetail.id}
          onSubmitModal={onUpdate}
        />
      )}
      {isShowModalConfirmApprove && (
        <ModalConfirm
          open
          titleSubmit={String(i18Project('LB_APPROVE_OT'))}
          title={String(i18Project('LB_CONFIRM_APPROVE'))}
          description={i18Project('MSG_CONFIRM_APPROVE', {
            requestName: requestName,
          })}
          onClose={() => setIsShowModalConfirmApprove(false)}
          onSubmit={handleApprove}
        />
      )}
      {isShowModalConfirmReject && (
        <ModalReasonReject
          onClose={() => setIsShowModalConfirmReject(false)}
          requestOTId={requestOTId}
          onSubmit={onReject}
        />
      )}
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootTableProjectList: {
    marginTop: theme.spacing(4),
  },
}))
export default TableRequestOTList

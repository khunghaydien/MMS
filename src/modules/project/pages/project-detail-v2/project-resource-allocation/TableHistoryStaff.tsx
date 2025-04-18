import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import CommonTable from '@/components/table/CommonTable'
import { LangConstant } from '@/const'
import { LIMIT_DEFAULT } from '@/const/table.const'
import { projectSelector } from '@/modules/project/reducer/project'
import { ProjectService } from '@/modules/project/services'
import { isMoreThan2023 } from '@/modules/project/utils'
import { alertSuccess, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { Pagination, TableHeaderColumn } from '@/types'
import { formatDate, formatNumberToCurrency } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import StringFormat from 'string-format'
import ModalStaffAssignDetails from './ModalStaffAssignDetails'

interface TableHistoryStaffProps {
  reGetListAssignHeadcount: Function
}

const TableHistoryStaff = ({
  reGetListAssignHeadcount,
}: TableHistoryStaffProps) => {
  const classes = useStyles()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)
  const { t: i18Contract } = useTranslation(LangConstant.NS_CONTRACT)

  const { permissionResourceAllocation } = useSelector(projectSelector)

  const columns: TableHeaderColumn[] = [
    {
      id: 'code',
      label: i18('LB_STAFF_CODE'),
    },
    {
      id: 'staffName',
      label: i18('LB_STAFF_NAME'),
    },
    {
      id: 'staffEmail',
      label: i18('LB_EMAIL'),
    },
    {
      id: 'branch',
      label: i18('LB_BRANCH'),
    },
    {
      id: 'division',
      label: i18('LB_DIVISION'),
    },
    {
      id: 'startDate',
      label: i18('LB_START_DATE'),
    },
    {
      id: 'endDate',
      label: i18('LB_END_DATE'),
    },
    {
      id: 'assignEffort',
      align: 'left',
      label: i18Project('TXT_ASSIGN_EFFORT'),
    },
    {
      id: 'role',
      align: 'left',
      label: i18Project('LB_ROLE'),
    },
    {
      id: 'delete',
      label: i18('LB_ACTION'),
      align: 'left',
    },
  ]

  const [totalElements, setTotalElements] = useState(0)
  const [pageSize, setPageSize] = useState(LIMIT_DEFAULT)
  const [pageNum, setPageNum] = useState(1)
  const [historyStaffAssignmentList, setHistoryStaffAssignmentList] =
    useState<any>([])
  const [loading, setLoading] = useState(false)
  const [openModalDelete, setOpenModalDelete] = useState(false)
  const [staffAssignment, setStaffAssignment] = useState<any>({})
  const [openModalDetailAssignStaff, setOpenModalDetailAssignStaff] =
    useState(false)
  const [staffSelected, setStaffSelected] = useState<any>({})

  const refactorRowsRendered = (item: any) => {
    return {
      projectStaffId: item.projectStaffId,
      projectStaffHeadcountId: item.projectStaffHeadcountId,
      id: item.projectStaffId,
      code: item.staffCode,
      staffName: item.staffName,
      staffEmail: item.staffEmail,
      branch: item.branchName,
      division: item.divisionName,
      startDate: formatDate(item.assignStartDate),
      endDate: formatDate(item.assignEndDate),
      assignEffort: `${
        !!item?.assignEffort ? formatNumberToCurrency(item?.assignEffort) : 0
      }%`,
      role: item.role || '',
      useDeleteIcon:
        !!permissionResourceAllocation.updateStaffAssignment &&
        isMoreThan2023(new Date(item.assignStartDate)) &&
        isMoreThan2023(new Date(item.assignEndDate)),
    }
  }

  const rowsRendered = useMemo(() => {
    return historyStaffAssignmentList.map(refactorRowsRendered)
  }, [historyStaffAssignmentList])

  const handlePageChange = (newPage: number) => {
    setPageNum(newPage)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setPageNum(1)
  }

  const closeModalDeleteStaffAssignment = () => {
    setOpenModalDelete(false)
    setStaffAssignment({})
  }

  const onClickStaffAssignment = (staffAssignment: any, columnId: string) => {
    setStaffSelected(staffAssignment)
    if (columnId !== 'action') {
      setOpenModalDetailAssignStaff(true)
    }
  }

  const deleteStaffAssignment = () => {
    const payload = {
      projectId: params.projectId as string,
      projectStaffId: staffAssignment.projectStaffId,
      projectStaffHeadcountId: staffAssignment.projectStaffHeadcountId,
    }
    dispatch(updateLoading(true))
    ProjectService.deleteAssignmentHeadcount(payload)
      .then(() => {
        reGetListAssignHeadcount()
        getHistoryStaffAssignment({ pageSize, pageNum })
        dispatch(
          alertSuccess({
            message: i18('MSG_DELETE_SUCCESS', {
              labelName: i18Project('LB_ASSIGNMENT'),
            }),
          })
        )
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  const getHistoryStaffAssignment = (queryParameters: Pagination) => {
    setLoading(true)
    ProjectService.getHistoryStaffAssignment({
      projectId: params.projectId as string,
      queryParameters,
    })
      .then((res: AxiosResponse) => {
        setHistoryStaffAssignmentList(res.data.content)
        setTotalElements(res.data.totalElements)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getHistoryStaffAssignment({
      pageSize,
      pageNum,
    })
  }, [pageSize, pageNum])

  return (
    <Box className={classes.RootTableHistoryStaff}>
      {openModalDetailAssignStaff && (
        <ModalStaffAssignDetails
          staff={staffSelected}
          reGetListAssignHeadcount={() => {
            getHistoryStaffAssignment({ pageSize, pageNum })
            reGetListAssignHeadcount()
          }}
          onClose={() => setOpenModalDetailAssignStaff(false)}
        />
      )}
      {openModalDelete && (
        <ModalDeleteRecords
          open
          titleMessage={i18Contract('TXT_DELETE_STAFF')}
          subMessage={StringFormat(
            i18Contract('MSG_CONFIRM_STAFF_DELETE'),
            staffAssignment.staffName
          )}
          onClose={closeModalDeleteStaffAssignment}
          onSubmit={deleteStaffAssignment}
        />
      )}
      <CommonTable
        loading={loading}
        columns={columns}
        rows={rowsRendered}
        onRowClick={(row: any, columnId: string) =>
          onClickStaffAssignment(row, columnId)
        }
        onDeleteClick={(row: any) => {
          setOpenModalDelete(true)
          setStaffAssignment(row)
        }}
        pagination={{
          totalElements,
          pageSize,
          pageNum,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
        }}
      />
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootTableHistoryStaff: {
    width: '100%',
  },
  actions: {
    display: 'flex',
    gap: theme.spacing(1),
    '& svg': {
      color: theme.color.black.secondary,
      cursor: 'pointer',
    },
  },
}))

export default TableHistoryStaff

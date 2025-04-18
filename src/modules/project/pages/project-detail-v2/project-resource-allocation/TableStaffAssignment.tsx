import ButtonAddPlus from '@/components/buttons/ButtonAddPlus'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import CommonTable from '@/components/table/CommonTable'
import { LangConstant, PathConstant } from '@/const'
import {
  projectSelector,
  setQueryStaffAssignment,
} from '@/modules/project/reducer/project'
import { ProjectService } from '@/modules/project/services'
import { isMoreThan2023 } from '@/modules/project/utils'
import { alertSuccess, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { TableHeaderColumn } from '@/types'
import { formatDate, formatNumberToCurrency } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Dispatch, Fragment, SetStateAction, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import StringFormat from 'string-format'
import ModalStaffAssignDetails from './ModalStaffAssignDetails'

interface TableStaffAssignmentProps {
  loading: boolean
  setOpenModalAddAssignStaff: Dispatch<SetStateAction<boolean>>
  reGetListAssignHeadcount: Function
}

const TableStaffAssignment = ({
  loading,
  setOpenModalAddAssignStaff,
  reGetListAssignHeadcount,
}: TableStaffAssignmentProps) => {
  const classes = useStyles()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)
  const { t: i18Contract } = useTranslation(LangConstant.NS_CONTRACT)

  const {
    assignStaffs,
    totalStaffAssignment,
    queryStaffAssignment,
    permissionResourceAllocation,
  } = useSelector(projectSelector)

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

  const [openModalDelete, setOpenModalDelete] = useState(false)
  const [staffAssignment, setStaffAssignment] = useState<any>({})
  const [openModalDetailAssignStaff, setOpenModalDetailAssignStaff] =
    useState(false)
  const [staffSelected, setStaffSelected] = useState<any>({})

  const refactorRowsRendered = (item: any) => {
    return {
      staffId: item.staffId,
      projectStaffId: item.projectStaffId,
      projectStaffHeadcountId: item.projectStaffHeadcountId,
      id: item.projectStaffId,
      code: item.staffCode,
      staffName: item.staffName || '',
      staffEmail: item.staffEmail || '',
      branch: item.branchName || '',
      division: item.divisionName || '',
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
    return assignStaffs.map(refactorRowsRendered)
  }, [assignStaffs])

  const handlePageChange = (newPage: number) => {
    dispatch(
      setQueryStaffAssignment({
        ...queryStaffAssignment,
        pageNum: newPage,
      })
    )
  }

  const handlePageSizeChange = (newPageSize: number) => {
    dispatch(
      setQueryStaffAssignment({
        ...queryStaffAssignment,
        pageSize: newPageSize,
        pageNum: 1,
      })
    )
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

  const onCodeClick = (row: any) => {
    const url = StringFormat(PathConstant.STAFF_DETAIL_FORMAT, row.staffId)
    window.open(url)
  }

  return (
    <Box className={classes.RootTableStaffAssignment}>
      {openModalDetailAssignStaff && (
        <ModalStaffAssignDetails
          staff={staffSelected}
          onClose={() => setOpenModalDetailAssignStaff(false)}
          reGetListAssignHeadcount={() => reGetListAssignHeadcount()}
        />
      )}
      {openModalDelete && (
        <ModalDeleteRecords
          open
          titleMessage={i18Contract('TXT_DELETE_STAFF')}
          subMessage={StringFormat(
            i18Contract('MSG_CONFIRM_STAFF_ASSIGNMENT_DELETE'),
            staffAssignment.staffName
          )}
          onClose={closeModalDeleteStaffAssignment}
          onSubmit={deleteStaffAssignment}
        />
      )}
      <CommonTable
        useClickCode
        onCodeClick={onCodeClick}
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
          totalElements: totalStaffAssignment,
          pageSize: queryStaffAssignment.pageSize,
          pageNum: queryStaffAssignment.pageNum,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
        }}
        FooterActions={
          !!permissionResourceAllocation.updateStaffAssignment ? (
            <ButtonAddPlus
              label={i18Project('LB_ASSIGN_NEW_STAFF')}
              onClick={() => setOpenModalAddAssignStaff(true)}
            />
          ) : (
            <Fragment></Fragment>
          )
        }
      />
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootTableStaffAssignment: {
    width: '100%',
    '& table tbody tr td:nth-child(2) div': {
      width: '160px',
    },
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

export default TableStaffAssignment

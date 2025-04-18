import CardFormSeeMore from '@/components/Form/CardFormSeeMore'
import ButtonAddPlus from '@/components/buttons/ButtonAddPlus'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import CommonTable from '@/components/table/CommonTable'
import { NS_CONTRACT, NS_PROJECT } from '@/const/lang.const'
import { LIMIT_DEFAULT, PAGE_CURRENT_DEFAULT } from '@/const/table.const'
import { TableHeaderColumn } from '@/types'
import { formatDate } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Fragment, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import StringFormat from 'string-format'
import ModalAssignNewStaff, {
  AssignStaffItem,
} from '../project-detail-v2/project-resource-allocation/ModalAssignNewStaff'
import ModalUpdateAssignStaff from './ModalUpdateAssignStaff'

interface CreateAssignStaffsProps {
  dataAssignStaffs: AssignStaffItem[]
  onAssignStaffsChange: (assignStaffs: AssignStaffItem[]) => void
}

const CreateAssignStaffs = ({
  dataAssignStaffs,
  onAssignStaffsChange,
}: CreateAssignStaffsProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)
  const { t: i18Contract } = useTranslation(NS_CONTRACT)

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
      id: 'assignStartDate',
      label: i18('LB_START_DATE'),
    },
    {
      id: 'assignEndDate',
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

  const [pageNum, setPageNum] = useState(PAGE_CURRENT_DEFAULT)
  const [pageSize, setPageSize] = useState(LIMIT_DEFAULT)
  const [openModalAddAssignStaff, setOpenModalAddAssignStaff] = useState(false)
  const [openModalDelete, setOpenModalDelete] = useState(false)
  const [staffAssignment, setStaffAssignment] = useState<any>({})
  const [openModalDetailAssignStaff, setOpenModalDetailAssignStaff] =
    useState(false)

  const rows = useMemo(() => {
    return dataAssignStaffs
      .slice((pageNum - 1) * pageSize, pageNum * pageSize)
      .map(item => ({
        itemRow: {
          ...item,
        },
        id: item.id,
        code: item.staff?.code,
        staffName: item.staff?.name,
        staffEmail: item.staff?.email,
        branch: item.staff?.branch?.name || item.staff?.branch?.name || '',
        division:
          item?.staff?.division?.name || item?.staff?.division?.name || '',
        assignStartDate: item.assignStartDate
          ? formatDate(item.assignStartDate)
          : '',
        assignEndDate: item.assignEndDate ? formatDate(item.assignEndDate) : '',
        assignEffort: `${item.assignEffort}%`,
        role: item.role,
        useDeleteIcon: true,
      }))
  }, [dataAssignStaffs, pageNum, pageSize])

  const onPageChange = (newPage: number) => {
    setPageNum(newPage)
  }

  const onPageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setPageNum(1)
  }

  const onProjectCreateAssignStaffs = (assignStaffs: AssignStaffItem[]) => {
    const newAssignStaffs = [...assignStaffs, ...dataAssignStaffs]
    onAssignStaffsChange(newAssignStaffs)
    setOpenModalAddAssignStaff(false)
  }

  const closeModalDeleteStaffAssignment = () => {
    setOpenModalDelete(false)
    setStaffAssignment({})
  }

  const deleteStaffAssignment = (id: string) => {
    const indexById = dataAssignStaffs.findIndex(item => item.id === id)
    const newAssignStaffs = [...dataAssignStaffs]
    newAssignStaffs.splice(indexById, 1)
    onAssignStaffsChange(newAssignStaffs)
    setOpenModalDetailAssignStaff(false)
  }

  const onClickStaffAssignment = (row: any, columnId: string) => {
    setStaffAssignment(row.itemRow)
    if (columnId !== 'action') {
      setOpenModalDetailAssignStaff(true)
    }
  }

  const onUpdateAssignStaff = (assignStaffItem: AssignStaffItem) => {
    const indexById = dataAssignStaffs.findIndex(
      item => item.id === staffAssignment.id
    )
    const newAssignStaffs = [...dataAssignStaffs]
    newAssignStaffs[indexById] = assignStaffItem
    onAssignStaffsChange(newAssignStaffs)
  }

  return (
    <Fragment>
      {openModalAddAssignStaff && (
        <ModalAssignNewStaff
          onClose={() => setOpenModalAddAssignStaff(false)}
          onProjectCreateAssignStaffs={onProjectCreateAssignStaffs}
        />
      )}
      {openModalDetailAssignStaff && (
        <ModalUpdateAssignStaff
          staff={staffAssignment}
          onClose={() => setOpenModalDetailAssignStaff(false)}
          onSubmit={onUpdateAssignStaff}
          onDelete={deleteStaffAssignment}
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
          onSubmit={() => deleteStaffAssignment(staffAssignment.id)}
        />
      )}
      <CardFormSeeMore
        title={i18Project('TXT_RESOURCE_ALLOCATION')}
        hideSeeMore
      >
        <Box className={classes.body}>
          <CommonTable
            useClickCode
            columns={columns}
            rows={rows}
            onRowClick={(row: any, columnId: string) =>
              onClickStaffAssignment(row, columnId)
            }
            onDeleteClick={(row: any) => {
              setOpenModalDelete(true)
              setStaffAssignment(row)
            }}
            pagination={{
              totalElements: dataAssignStaffs.length,
              pageSize: pageSize,
              pageNum: pageNum,
              onPageChange,
              onPageSizeChange,
            }}
            FooterActions={
              <ButtonAddPlus
                label={i18Project('LB_ASSIGN_NEW_STAFF')}
                onClick={() => setOpenModalAddAssignStaff(true)}
              />
            }
          />
        </Box>
      </CardFormSeeMore>
    </Fragment>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootCreateAssignStaffs: {},
  body: {},
}))

export default CreateAssignStaffs

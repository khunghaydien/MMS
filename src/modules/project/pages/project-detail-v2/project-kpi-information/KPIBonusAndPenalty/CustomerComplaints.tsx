import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import CommonTable from '@/components/table/CommonTable'
import { NS_PROJECT } from '@/const/lang.const'
import {
  COMPLAINT_LEVELS_LABELS,
  OVERALL_EVALUATION_TYPE,
} from '@/modules/project/const'
import {
  projectSelector,
  setCustomerComplaintState,
} from '@/modules/project/reducer/project'
import { ProjectService } from '@/modules/project/services'
import { alertSuccess, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { TableHeaderColumn } from '@/types'
import { formatDate } from '@/utils'
import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { ColTooltip } from '../../project-dashboard-detail/ProjectKPIInformationTable'
import { EvaluationMonthItem } from './KPIBonusAndPenalty'
import ModalDetailComplaintItem from './ModalDetailComplaintItem'

interface CustomerComplaintsProps {
  evaluateId: number
  updateSuccess: () => void
  evaluationMonthData: EvaluationMonthItem[]
  setEvaluationMonth: Dispatch<
    SetStateAction<{
      id: number
      month: string
    }>
  >
}

const CustomerComplaints = ({
  evaluateId,
  updateSuccess,
  setEvaluationMonth,
  evaluationMonthData,
}: CustomerComplaintsProps) => {
  const classes = useStyles()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()

  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const { customerComplaintState, permissionProjectKPI } =
    useSelector(projectSelector)

  const columns: TableHeaderColumn[] = [
    {
      id: 'no',
      label: i18('LB_NO'),
    },
    {
      id: 'complaintName',
      label: i18Project('TXT_COMPLAINT_NAME'),
    },
    {
      id: 'complaintDate',
      label: i18Project('TXT_COMPLAINT_DATE'),
    },
    {
      id: 'complaintLevel',
      label: i18('TXT_LEVEL'),
    },
    {
      id: 'personInCharge',
      label: i18Project('TXT_PERSON_IN_CHARGE'),
    },
    {
      id: 'resolveDeadline',
      label: i18Project('TXT_RESOLVE_DEADLINE'),
    },
    {
      id: 'resolveDate',
      label: i18Project('TXT_RESOLVE_DATE'),
    },
    {
      id: 'delete',
      label: i18('LB_ACTION'),
    },
  ]

  const [openModalDelete, setOpenModalDelete] = useState(false)
  const [complaintSelected, setComplaintSelected] = useState<any>({})
  const [openModalDetailComplaint, setOpenModalDetailComplaint] =
    useState(false)

  const rows = useMemo(() => {
    return customerComplaintState.data.map((item, index) => ({
      id: item.id,
      no:
        (customerComplaintState.queryParameters.pageNum - 1) *
          customerComplaintState.queryParameters.pageSize +
        index +
        1,
      complaintName: item.complaintName,
      complaintDate: formatDate(item.complaintDate),
      complaintLevel: (
        <ColTooltip
          resetBackground
          colName={COMPLAINT_LEVELS_LABELS[item.complaintLevel]}
          section={COMPLAINT_LEVELS_LABELS[item.complaintLevel]}
        />
      ),
      resolveDeadline: formatDate(item.resolveDeadline),
      resolveDate: formatDate(item.resolveDate),
      personInCharge: item.personInCharge,
      useDeleteIcon: !!permissionProjectKPI.customerComplaintDelete,
    }))
  }, [customerComplaintState])

  const onPageChange = (newPage: number) => {
    dispatch(
      setCustomerComplaintState({
        ...customerComplaintState,
        queryParameters: {
          ...customerComplaintState.queryParameters,
          pageNum: newPage,
        },
      })
    )
  }

  const onPageSizeChange = (newPageSize: number) => {
    dispatch(
      setCustomerComplaintState({
        ...customerComplaintState,
        queryParameters: {
          pageSize: newPageSize,
          pageNum: 1,
        },
      })
    )
  }

  const closeModalDeleteComplaint = () => {
    setOpenModalDelete(false)
    setComplaintSelected({})
  }

  const openModalDeleteComplaint = (complaint: any) => {
    setComplaintSelected(complaint)
    setOpenModalDelete(true)
  }

  const openModalUpdateComplaint = (complaint: any) => {
    setComplaintSelected(complaint)
    setOpenModalDetailComplaint(true)
  }

  const deleteComplaint = () => {
    const payload = {
      projectId: params.projectId as string,
      complaintId: complaintSelected.id,
      evaluateId,
    }
    dispatch(updateLoading(true))
    ProjectService.deleteCustomerComplaint(payload)
      .then(() => {
        if (
          customerComplaintState.data.length === 1 &&
          customerComplaintState.queryParameters.pageNum === 1 &&
          !evaluationMonthData.find(
            item => +item.type === OVERALL_EVALUATION_TYPE.BONUS
          )
        ) {
          setEvaluationMonth({
            id: 0,
            month: '',
          })
        }
        dispatch(
          alertSuccess({
            message: `${i18Project('TXT_CUSTOMER_COMPLAINT')} ${i18(
              'MSG_DELETE_SUCCESS',
              {
                labelName: complaintSelected.complaintName,
              }
            )}`,
          })
        )
        setTimeout(() => {
          updateSuccess()
        })
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  return (
    <Box className={classes.RootCustomerComplaints}>
      {openModalDetailComplaint && (
        <ModalDetailComplaintItem
          evaluateId={evaluateId}
          complaintId={complaintSelected.id}
          onClose={() => setOpenModalDetailComplaint(false)}
          openModalDeleteComplaint={openModalDeleteComplaint}
          onSubmitSuccess={updateSuccess}
        />
      )}
      {openModalDelete && (
        <ModalDeleteRecords
          open
          titleMessage={i18Project('TXT_DELETE_CUSTOMER_COMPLAINT')}
          subMessage={i18Project('MSG_CONFIRM_CUSTOMER_COMPLAINT_DELETE', {
            labelName: complaintSelected.complaintName,
          })}
          onClose={closeModalDeleteComplaint}
          onSubmit={deleteComplaint}
        />
      )}
      <CommonTable
        loading={customerComplaintState.loading}
        columns={columns}
        rows={rows}
        onDeleteClick={openModalDeleteComplaint}
        onRowClick={row =>
          !!permissionProjectKPI.customerComplaintDetail
            ? openModalUpdateComplaint(row)
            : null
        }
        pagination={{
          pageNum: customerComplaintState.queryParameters.pageNum,
          pageSize: customerComplaintState.queryParameters.pageSize,
          totalElements: rows.length,
          onPageChange,
          onPageSizeChange,
        }}
      />
    </Box>
  )
}

const useStyles = makeStyles(() => ({
  RootCustomerComplaints: {},
}))

export default CustomerComplaints

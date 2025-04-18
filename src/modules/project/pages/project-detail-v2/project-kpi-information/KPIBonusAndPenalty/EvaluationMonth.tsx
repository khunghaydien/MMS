import CardForm from '@/components/Form/CardForm'
import SwitchToggle from '@/components/common/SwitchToggle'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import CommonTable from '@/components/table/CommonTable'
import { NS_PROJECT } from '@/const/lang.const'
import { OVERALL_EVALUATION_TYPE } from '@/modules/project/const'
import { projectSelector } from '@/modules/project/reducer/project'
import { ProjectService } from '@/modules/project/services'
import { alertSuccess, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { TableHeaderColumn } from '@/types'
import { themeColors } from '@/ui/mui/v5'
import { Box, TableCell, TableRow, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import CustomerComplaints from './CustomerComplaints'
import { EvaluationMonthItem, getColorPoint } from './KPIBonusAndPenalty'

interface EvaluationMonthProps {
  evaluationMonth: {
    id: number
    month: string
  }
  loadingEvaluationMonth: boolean
  evaluationMonthData: EvaluationMonthItem[]
  updateSuccess: () => void
  deleteSuccess: () => void
  onOpenEditMode: () => void
  setEvaluationMonth: Dispatch<
    SetStateAction<{
      id: number
      month: string
    }>
  >
}

const EvaluationMonth = ({
  evaluationMonth,
  loadingEvaluationMonth,
  evaluationMonthData,
  updateSuccess,
  deleteSuccess,
  onOpenEditMode,
  setEvaluationMonth,
}: EvaluationMonthProps) => {
  const classes = useStyles()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const { permissionProjectKPI } = useSelector(projectSelector)

  const [useActivityLog, setUseActivityLog] = useState(false)
  const [openModalDelete, setOpenModalDelete] = useState(false)

  const columnsBonusAndPenalty: TableHeaderColumn[] = [
    { id: 'no', label: i18('LB_NO') },
    {
      id: 'type',
      label: `${i18Project('TXT_BONUS')}/${i18Project('TXT_PENALTY')}`,
    },
    { id: 'name', label: i18Project('TXT_TYPE'), ellipsisNumber: 100 },
    {
      id: 'point',
      label: i18Project('TXT_POINT'),
    },
    {
      id: 'note',
      label: i18('LB_NOTE'),
    },
  ]

  const rowsBonusAndPenalty = useMemo(() => {
    return evaluationMonthData.map((item, index) => ({
      id: index,
      no: index + 1,
      name: item.name,
      note: item.note || '',
      type: (
        <Box
          sx={{
            fontWeight: 700,
            color:
              +item.type === OVERALL_EVALUATION_TYPE.BONUS
                ? themeColors.color.green.primary
                : themeColors.color.error.primary,
          }}
        >
          {+item.type === OVERALL_EVALUATION_TYPE.BONUS
            ? i18Project('TXT_BONUS')
            : i18Project('TXT_PENALTY')}
        </Box>
      ),
      point: (
        <Box
          sx={{
            color: getColorPoint(item.point),
          }}
        >
          {item.point.toFixed(2)}
        </Box>
      ),
    }))
  }, [evaluationMonthData])

  const title = useMemo(() => {
    if (evaluationMonth.month) {
      return `<div>
        <span style="color: ${themeColors.color.blue.primary}">${i18Project(
        'TXT_EVALUATION_MONTH'
      )}: </span>
        <span>${evaluationMonth.month}</span>
      </div>`
    }
    return i18Project('TXT_EVALUATION_MONTH')
  }, [i18Project, evaluationMonth])

  const totalPoint = useMemo(() => {
    let total = 0
    evaluationMonthData.forEach(item => {
      total += +item.point
    })
    return total
  }, [evaluationMonthData])

  const deleteEvaluateProject = () => {
    dispatch(updateLoading(true))
    ProjectService.deleteEvaluateProject({
      projectId: params.projectId as string,
      evaluateId: evaluationMonth.id,
    })
      .then(() => {
        deleteSuccess()
        dispatch(
          alertSuccess({
            message: `${i18Project('TXT_EVALUATION_MONTH')} ${i18(
              'MSG_DELETE_SUCCESS',
              {
                labelName: evaluationMonth.month,
              }
            )}`,
          })
        )
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  return (
    <CardForm
      title={title}
      className={classes.RootEvaluationMonth}
      useDeleteIcon={
        !!evaluationMonth.id &&
        !!permissionProjectKPI.plusAndMinusEditEvaluation
      }
      useDetailViewMode={
        !!evaluationMonth.id &&
        !!permissionProjectKPI.plusAndMinusEditEvaluation
      }
      onOpenEditMode={onOpenEditMode}
      onDeleteIconClick={() => setOpenModalDelete(true)}
    >
      {openModalDelete && (
        <ModalDeleteRecords
          open
          titleMessage={i18Project('TXT_DELETE_EVALUATION_MONTH')}
          subMessage={i18Project('MSG_CONFIRM_EVALUATION_MONTH_DELETE', {
            labelName: evaluationMonth.month,
          })}
          onClose={() => setOpenModalDelete(false)}
          onSubmit={deleteEvaluateProject}
        />
      )}
      <Box className={classes.body}>
        <CommonTable
          rootClassName={classes.tableEvaluationMonth}
          loading={loadingEvaluationMonth}
          columns={columnsBonusAndPenalty}
          rows={rowsBonusAndPenalty}
          LastRow={
            <TableRow>
              <TableCell colSpan={2}></TableCell>
              <TableCell colSpan={1}>
                <Box component="b">{i18Project('TXT_TOTAL_POINTS')}</Box>
              </TableCell>
              <TableCell colSpan={2}>
                <Box
                  sx={{
                    fontWeight: 700,
                    color: getColorPoint(totalPoint),
                  }}
                >
                  {totalPoint.toFixed(2)}
                </Box>
              </TableCell>
            </TableRow>
          }
        />
        <Box className={classes.containerToggleCustomerComplaint}>
          <SwitchToggle
            label={i18Project('TXT_VIEW_CUSTOMER_COMPLAINTS') as string}
            checked={useActivityLog}
            onChange={(value: boolean) => setUseActivityLog(value)}
          />
        </Box>
        {useActivityLog && !!permissionProjectKPI.customerComplaintSummary && (
          <CustomerComplaints
            evaluationMonthData={evaluationMonthData}
            evaluateId={evaluationMonth.id}
            updateSuccess={updateSuccess}
            setEvaluationMonth={setEvaluationMonth}
          />
        )}
      </Box>
    </CardForm>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootEvaluationMonth: {
    marginTop: 'unset !important',
    flex: 1,
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  containerToggleCustomerComplaint: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  tableEvaluationMonth: {
    '& table thead tr th:nth-child(3)': {
      width: '700px',
    },
  },
}))

export default EvaluationMonth

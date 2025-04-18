import CardForm from '@/components/Form/CardForm'
import { LangConstant } from '@/const'
import CriteriaTableCycle from '@/modules/mbo/components/CriteriaTableCycle'
import {
  ATTITUDE,
  EMPLOYEE_WORK_TASKS,
  MANAGERIAL_WORK_TASKS,
} from '@/modules/mbo/const'
import { IWorkType } from '@/modules/mbo/models'
import { CycleState, cycleSelector } from '@/modules/mbo/reducer/cycle'
import { getWorkTypeMbo } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { TableHeaderColumn } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import i18next from 'i18next'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

interface IProps {
  loadingStep: boolean
}

const headCellsEmployeeWorkType: TableHeaderColumn[] = [
  {
    id: 'evaluationCriteria',
    align: 'left',
    label: i18next.t('mbo:LB_EVALUATION_CRITERIA'),
  },
  {
    id: 'weight',
    align: 'left',
    label: i18next.t('mbo:LB_WEIGHT'),
  },
]

const headCellsTaskDifficultyWorkType: TableHeaderColumn[] = [
  {
    id: 'scale',
    align: 'left',
    label: 'Scale',
  },
  {
    id: 'employeeWorkTask',
    align: 'left',
    label: i18next.t('mbo:LB_EMPLOYEE_WORK_TASK'),
  },
  {
    id: 'managementWorkTask',
    align: 'left',
    label: i18next.t('mbo:LB_MANAGEMENT_WORK_TASK'),
  },
]

const CycleCriteriaInformation = ({ loadingStep }: IProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)
  const classes = useStyles()
  const { criteriaGroupsCycle, evaluationCycle }: CycleState =
    useSelector(cycleSelector)

  const [workTask, setWorkTask] = useState<IWorkType[]>([])
  const [isLoadingWorkType, setIsLoadingWorkType] = useState(false)

  useEffect(() => {
    setIsLoadingWorkType(true)
    dispatch(getWorkTypeMbo({ isMasterData: true }))
      .unwrap()
      .then((res: any) => {
        setWorkTask(res.data)
      })
      .finally(() => {
        setIsLoadingWorkType(false)
      })
  }, [])

  const rowEmployeeWorkTask = useMemo(
    () =>
      criteriaGroupsCycle
        .find(item => item.type.id == EMPLOYEE_WORK_TASKS)
        ?.criteria?.map(item => ({
          id: item.id,
          evaluationCriteria: item.name,
          weight: `${item.weight}%`,
        })),
    [criteriaGroupsCycle]
  )

  const rowManagementWorkTask = useMemo(
    () =>
      criteriaGroupsCycle
        .find(item => item.type.id == MANAGERIAL_WORK_TASKS)
        ?.criteria?.map((item: any) => ({
          id: item.id,
          evaluationCriteria: item.name,
          weight: `${item.weight}%`,
        })),
    [criteriaGroupsCycle]
  )

  const rowAttitude = useMemo(
    () =>
      criteriaGroupsCycle
        .find(item => item.type.id == ATTITUDE)
        ?.criteria?.map((item: any) => ({
          id: item.id,
          evaluationCriteria: item.name,
          weight: `${item.weight}%`,
        })),
    [criteriaGroupsCycle]
  )

  const rowTaskDifficultyWorkType = useMemo(() => {
    const _employeeWorkTasks =
      workTask.find((item: IWorkType) => item.id == EMPLOYEE_WORK_TASKS)
        ?.difficultyWorkType || []
    const _managementWorkTasks =
      workTask.find((item: IWorkType) => item.id == MANAGERIAL_WORK_TASKS)
        ?.difficultyWorkType || []
    return (
      _employeeWorkTasks?.map(itemEmployee => {
        const indexEqualScore = _managementWorkTasks.findIndex(
          itemManagement => itemManagement.score == itemEmployee.score
        )
        if (indexEqualScore > -1) {
          return {
            id: itemEmployee.id,
            scale: itemEmployee.score,
            employeeWorkTask: <Box>{itemEmployee.content}</Box>,
            managementWorkTask: (
              <Box>{_managementWorkTasks[indexEqualScore].content}</Box>
            ),
          }
        }
      }) || []
    )
  }, [workTask])

  return (
    <Box>
      <CardForm
        title={`${i18Mbo('LB_JOB_COMPETENCY')}: ${
          evaluationCycle.jobCompetencyWeight || 0
        }%`}
      >
        <Box className={classes.flex}>
          <Box className={classes.jobCompetencyItem}>
            <Box className={classes.titleCriteria}>
              {i18Mbo('LB_TASK_TYPE')}: {i18Mbo('LB_EMPLOYEE_WORK_TASK')}
            </Box>
            <CriteriaTableCycle
              loadingStep={loadingStep}
              headCell={headCellsEmployeeWorkType}
              rows={rowEmployeeWorkTask || []}
            />
          </Box>
          <Box className={classes.jobCompetencyItem}>
            <Box className={classes.titleCriteria}>
              {i18Mbo('LB_TASK_TYPE')}: {i18Mbo('LB_MANAGEMENT_WORK_TASK')}
            </Box>
            <CriteriaTableCycle
              loadingStep={loadingStep}
              headCell={headCellsEmployeeWorkType}
              rows={rowManagementWorkTask || []}
            />
          </Box>
        </Box>
      </CardForm>
      <CardForm
        title={`${i18Mbo('LB_ATTITUDE')}: ${
          evaluationCycle.attitudeWeight || 0
        }%`}
      >
        <Box>
          <CriteriaTableCycle
            loadingStep={loadingStep}
            headCell={headCellsEmployeeWorkType}
            rows={rowAttitude || []}
          />
        </Box>
      </CardForm>
      <CardForm title={i18Mbo('LB_TASK_DIFFICULTY')}>
        <CriteriaTableCycle
          loadingStep={isLoadingWorkType}
          headCell={headCellsTaskDifficultyWorkType}
          rows={rowTaskDifficultyWorkType}
        />
      </CardForm>
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  flex: {
    display: 'flex',
    gap: theme.spacing(3),
  },
  titleCriteria: {
    marginBottom: theme.spacing(2),
    fontWeight: 700,
  },
  totalWeight: {
    border: `1px solid ${theme.color.blue.primary}`,
    borderRadius: '5px',
    width: 'max-content',
    padding: theme.spacing(1, 4),
  },
  jobCompetencyItem: {
    flex: 1,
  },
}))

export default CycleCriteriaInformation

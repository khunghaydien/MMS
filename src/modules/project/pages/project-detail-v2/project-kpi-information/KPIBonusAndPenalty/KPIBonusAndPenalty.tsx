import CardFormToggleBody from '@/components/Form/CardFormToggleBody'
import CommonButton from '@/components/buttons/CommonButton'
import { NS_MBO, NS_PROJECT } from '@/const/lang.const'
import { LIMIT_DEFAULT, PAGE_CURRENT_DEFAULT } from '@/const/table.const'
import { SEPARATE } from '@/modules/project/const'
import {
  projectSelector,
  setCustomerComplaintState,
} from '@/modules/project/reducer/project'
import {
  getNameCustomerComplaintProject,
  getViewCustomerComplaints,
} from '@/modules/project/reducer/thunk'
import { ProjectService } from '@/modules/project/services'
import { AppDispatch } from '@/store'
import { RangeDate } from '@/types'
import { themeColors } from '@/ui/mui/v5'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import KPIMetricsTooltip from '../../project-dashboard-detail/KPIMetricsTooltip'
import EvaluationMonth from './EvaluationMonth'
import ModalBonusAndPenaltyEvaluation from './ModalBonusAndPenaltyEvaluation'
import OverallEvaluation from './OverallEvaluation'

export const getColorPoint = (point: number | string) => {
  const _point = +point
  if (_point === 0) return themeColors.color.blue.primary
  return _point < 0
    ? themeColors.color.error.primary
    : themeColors.color.green.primary
}

export interface OverallEvaluationBonusAndPenaltyItem {
  id: number
  month: string
  point: number
}

export interface EvaluationMonthItem {
  id: number
  name: string
  note: string
  point: number
  type: string
}

const KPIBonusAndPenalty = () => {
  const classes = useStyles()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Project } = useTranslation(NS_PROJECT)
  const { t: i18Mbo } = useTranslation(NS_MBO)

  const {
    generalInfo,
    customerComplaintState,
    permissionProjectKPI,
    kpiRangeDateFilter,
  } = useSelector(projectSelector)

  const [openBody, setOpenBody] = useState(true)
  const [openModalBonusAndPenalty, setOpenModalBonusAndPenalty] =
    useState(false)
  const [rangeMonth, setRangeMonth] = useState<RangeDate>({
    startDate: kpiRangeDateFilter.startDate || generalInfo.startDate,
    endDate: kpiRangeDateFilter.endDate || generalInfo.endDate,
  })
  const [valueType, setValueType] = useState(SEPARATE)
  const [loadingOverallEvaluation, setLoadingOverallEvaluation] =
    useState(false)
  const [
    overallEvaluationBonusAndPenalty,
    setOverallEvaluationBonusAndPenalty,
  ] = useState<OverallEvaluationBonusAndPenaltyItem[]>([])
  const [evaluationMonthSelected, setEvaluationMonthSelected] = useState({
    id: 0,
    month: '',
  })
  const [loadingEvaluationMonth, setLoadingEvaluationMonth] = useState(false)
  const [evaluationMonthData, setEvaluationMonthData] = useState<
    EvaluationMonthItem[]
  >([])
  const [modeModalBonusPenalty, setModeModalBonusPenalty] = useState<
    'evaluate' | 'edit'
  >('evaluate')

  const getOverallEvaluation = () => {
    setLoadingOverallEvaluation(true)
    const startDate = rangeMonth.startDate as Date
    const endDate = rangeMonth.endDate as Date
    const payload = {
      projectId: params.projectId as string,
      queryParameters: {
        valueType,
        startMonth: startDate?.getMonth() + 1,
        endMonth: endDate?.getMonth() + 1,
        startYear: startDate?.getFullYear(),
        endYear: endDate?.getFullYear(),
      },
    }
    ProjectService.getOverallEvaluationBonusAndPenalty(payload)
      .then((res: AxiosResponse) => {
        setOverallEvaluationBonusAndPenalty(res.data)
      })
      .finally(() => {
        setLoadingOverallEvaluation(false)
      })
  }

  const getEvaluationMonthBonusAndPenaltyProject = () => {
    setLoadingEvaluationMonth(true)
    const payload = {
      projectId: params.projectId as string,
      evaluateId: evaluationMonthSelected.id,
    }
    ProjectService.getEvaluationMonthBonusAndPenaltyProject(payload)
      .then((res: AxiosResponse) => {
        setEvaluationMonthData(res.data || [])
      })
      .finally(() => {
        setLoadingEvaluationMonth(false)
      })
  }

  const getViewCustomerComplaintsApi = () => {
    const payload = {
      projectId: params.projectId as string,
      evaluateId: evaluationMonthSelected.id,
      queryParameters: customerComplaintState.queryParameters,
    }
    dispatch(getViewCustomerComplaints(payload))
  }

  const deleteSuccess = () => {
    getOverallEvaluation()
    setEvaluationMonthSelected({
      id: 0,
      month: '',
    })
    setEvaluationMonthData([])
    dispatch(
      setCustomerComplaintState({
        data: [],
        totalElements: 0,
        loading: false,
        queryParameters: {
          pageSize: LIMIT_DEFAULT,
          pageNum: PAGE_CURRENT_DEFAULT,
        },
      })
    )
  }

  useEffect(() => {
    if (generalInfo.startDate) {
      getOverallEvaluation()
    }
  }, [rangeMonth, valueType, generalInfo.startDate])

  useEffect(() => {
    getEvaluationMonthBonusAndPenaltyProject()
  }, [evaluationMonthSelected.id])

  useEffect(() => {
    if (evaluationMonthSelected.id) {
      getViewCustomerComplaintsApi()
    }
  }, [
    evaluationMonthSelected.id,
    customerComplaintState.queryParameters.pageNum,
    customerComplaintState.queryParameters.pageSize,
  ])

  useEffect(() => {
    setEvaluationMonthSelected({
      id: 0,
      month: '',
    })
    setEvaluationMonthData([])
    setOverallEvaluationBonusAndPenalty([])
  }, [valueType])

  useEffect(() => {
    dispatch(getNameCustomerComplaintProject(params.projectId as string))
  }, [params.projectId])

  return (
    <Box className={classes.RootKPIBonusAndPenalty}>
      {openModalBonusAndPenalty && (
        <ModalBonusAndPenaltyEvaluation
          mode={modeModalBonusPenalty}
          evaluateMonthMMYYYY={evaluationMonthSelected.month}
          onClose={() => setOpenModalBonusAndPenalty(false)}
          updateSuccess={() => {
            getOverallEvaluation()
            getEvaluationMonthBonusAndPenaltyProject()
            getViewCustomerComplaintsApi()
          }}
          evaluateSuccess={() => {
            getOverallEvaluation()
            getEvaluationMonthBonusAndPenaltyProject()
          }}
          setMode={setModeModalBonusPenalty}
        />
      )}
      <CardFormToggleBody
        open={openBody}
        setOpen={val => setOpenBody(val)}
        title={i18Project('TXT_BONUS_AND_PENALTY_POINT')}
        TooltipContent={<KPIMetricsTooltip section="bonusAndPenalty" />}
        HeaderRight={
          !!permissionProjectKPI.plusAndMinusEditEvaluation && (
            <CommonButton
              onClick={() => {
                setModeModalBonusPenalty('evaluate')
                setOpenModalBonusAndPenalty(true)
              }}
            >
              {i18Mbo('LB_EVALUATE')}
            </CommonButton>
          )
        }
      >
        <Box className={classes.body}>
          {!!permissionProjectKPI.plusAndMinusViewOverallEvaluation && (
            <Box width={470}>
              <OverallEvaluation
                dataRowsApi={overallEvaluationBonusAndPenalty}
                loading={loadingOverallEvaluation}
                valueType={valueType}
                rangeMonth={rangeMonth}
                setValueType={setValueType}
                setRangeMonth={setRangeMonth}
                setEvaluationMonth={setEvaluationMonthSelected}
                setEvaluationMonthData={setEvaluationMonthData}
              />
            </Box>
          )}
          <Box className={classes.right}>
            <EvaluationMonth
              loadingEvaluationMonth={loadingEvaluationMonth}
              evaluationMonth={evaluationMonthSelected}
              evaluationMonthData={evaluationMonthData}
              updateSuccess={() => {
                getEvaluationMonthBonusAndPenaltyProject()
                getViewCustomerComplaintsApi()
                getOverallEvaluation()
              }}
              setEvaluationMonth={setEvaluationMonthSelected}
              deleteSuccess={deleteSuccess}
              onOpenEditMode={() => {
                setOpenModalBonusAndPenalty(true)
                setModeModalBonusPenalty('edit')
              }}
            />
          </Box>
        </Box>
      </CardFormToggleBody>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootKPIBonusAndPenalty: {},
  body: {
    display: 'flex',
    gap: theme.spacing(2),
  },
  right: {
    width: 'calc(100% - 400px - 16px)',
  },
}))

export default KPIBonusAndPenalty

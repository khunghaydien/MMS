import CardForm from '@/components/Form/CardForm'
import { FieldListOptions } from '@/components/Form/CardForm/CardFormModeView'
import CommonButton from '@/components/buttons/CommonButton'
import StatusItem from '@/components/common/StatusItem'
import ModalConfirm from '@/components/modal/ModalConfirm'
import { NS_MBO } from '@/const/lang.const'
import { useQuery } from '@/hooks/useQuery'
import { AuthState, selectAuth } from '@/reducer/auth'
import { AppDispatch } from '@/store'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
  EvaluationProcessState,
  evaluationProcessSelector,
  submitForStaff,
} from '../../reducer/evaluation-process'
import CardProcessEvaluation from '../CardProcessEvaluation'

interface EvaluationCycleProcessProps {
  loading: boolean
  getEvaluationSummaryInfo: Function
  isApproved: boolean
  handleSubmit: (value: any) => void
}

const EvaluationCycleProcess = ({
  loading,
  getEvaluationSummaryInfo,
  isApproved,
  handleSubmit,
}: EvaluationCycleProcessProps) => {
  const classes = useStyles()
  const params = useParams()
  const queryParams = useQuery()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(NS_MBO)

  const { cycleInformation, summary }: EvaluationProcessState = useSelector(
    evaluationProcessSelector
  )
  const { staff }: AuthState = useSelector(selectAuth)
  const isReviewer = staff?.id == cycleInformation.reviewer?.id
  const isAppraiseeCreatedEvaluation = summary?.evaluationPeriods?.length > 0
  const resultScore = [
    {
      id: 1,
      label: i18Mbo('LB_JOB_RESULT'),
      value: summary.jobResult,
      width: 160,
    },
    {
      id: 2,
      label: i18Mbo('LB_ATTITUDE'),
      value: summary.attitude,
      width: 160,
    },
    {
      id: 3,
      label: i18Mbo('LB_ACHIEVEMENT'),
      value: summary.achievement,
      width: 160,
    },
    {
      id: 4,
      label: i18Mbo('LB_FINAL_EVALUATION_SCORE'),
      value: summary.finalEvaluationScore,
      width: 160,
    },
  ]

  const [showModalFinalSubmit, setShowModalFinalSubmit] = useState(false)

  const handleSubmitFinal = () => {
    dispatch(
      submitForStaff({
        evaluationCycleId: params.evaluationCycleId ?? '',
        evaluationCycleStaffId: queryParams.get('evaluationCycleStaffId') || '',
        staffName: cycleInformation.staff.name,
      })
    )
      .unwrap()
      .then((res: any) => {
        handleSubmit(res)
        getEvaluationSummaryInfo()
        setShowModalFinalSubmit(false)
      })
  }

  return (
    <Fragment>
      <CardForm
        isLoading={loading}
        title={i18Mbo('LB_EVALUATION_CYCLE_PROCESS')}
        childrenEndHead={
          <StatusItem
            typeStatus={{
              color: isApproved ? 'green' : 'orange',
              label: i18Mbo(isApproved ? 'LB_APPROVED' : 'LB_NOT_APPROVED'),
            }}
          />
        }
      >
        <CardProcessEvaluation />
        <FieldListOptions
          className={classes.resultScore}
          dataRendering={resultScore}
        />
        {isReviewer && isAppraiseeCreatedEvaluation && !isApproved && (
          <CommonButton
            className={classes.btnFinalSubmit}
            disabled={!summary.isAbleToSubmit}
            onClick={() => {
              setShowModalFinalSubmit(true)
            }}
          >
            {i18Mbo('LB_FINAL_SUBMIT')}
          </CommonButton>
        )}
      </CardForm>
      {showModalFinalSubmit && (
        <ModalConfirm
          open
          title={i18Mbo('LB_EVALUATE_STAFF')}
          description={i18Mbo('MSG_EVALUATE_STAFF')}
          titleSubmit={i18('LB_SUBMIT') || ''}
          onClose={() => {
            setShowModalFinalSubmit(false)
          }}
          onSubmit={handleSubmitFinal}
        />
      )}
    </Fragment>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  resultScore: {
    marginTop: theme.spacing(5),
  },
  btnFinalSubmit: {
    marginTop: `${theme.spacing(3)} !important`,
  },
}))

export default EvaluationCycleProcess

import { useQuery } from '@/hooks/useQuery'
import { AppDispatch } from '@/store'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
  EvaluationProcessState,
  evaluationProcessSelector,
  getEvaluationSummary,
} from '../../reducer/evaluation-process'
import EvaluationCycleProcess from './EvaluationCycleProcess'
import TableSummaryAchievements from './TableSummaryAchievements'
import TableSummaryEvaluationPeriod from './TableSummaryEvaluationPeriod'
type Props = {
  handleSubmit: (value: any) => void
  isApproved: boolean
}
const ECProcessSummary = ({ handleSubmit, isApproved }: Props) => {
  const classes = useStyles()
  const params = useParams()
  const queryParams = useQuery()
  const dispatch = useDispatch<AppDispatch>()

  const { isCycleInformationLoading }: EvaluationProcessState = useSelector(
    evaluationProcessSelector
  )

  const [loading, setLoading] = useState(true)

  const getEvaluationSummaryInfo = () => {
    dispatch(
      getEvaluationSummary({
        evaluationCycleId: params.evaluationCycleId || '',
        evaluationCycleStaffId: queryParams.get('evaluationCycleStaffId') || '',
      })
    )
      .unwrap()
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getEvaluationSummaryInfo()
  }, [])

  return (
    <Box className={classes.RootECProcessSummary}>
      <EvaluationCycleProcess
        loading={loading || isCycleInformationLoading}
        getEvaluationSummaryInfo={getEvaluationSummaryInfo}
        isApproved={isApproved}
        handleSubmit={value => handleSubmit(value)}
      />
      <TableSummaryEvaluationPeriod loading={loading} />
      <TableSummaryAchievements loading={loading} />
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootECProcessSummary: {},
}))

export default ECProcessSummary

import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import { LangConstant } from '@/const'
import { AppDispatch } from '@/store'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { CycleQueryString } from '../../models'
import {
  cycleSelector,
  deleteEvaluationCycle,
  getCycleList,
} from '../../reducer/cycle'
import CycleFilters from './CycleFilters'
import TableCycles from './TableCycles'

const CycleList = () => {
  const classes = useStyles()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)
  const dispatch = useDispatch<AppDispatch>()
  const { cycleQueryString } = useSelector(cycleSelector)

  const [loading, setLoading] = useState(false)

  const formatPayloadQuery = (cycleQueryString: CycleQueryString) => {
    return {
      pageNum: cycleQueryString?.pageNum,
      pageSize: cycleQueryString?.pageSize,
      positionId:
        cycleQueryString?.positions?.map(item => item.id)?.toString() || '',
      duration: cycleQueryString?.duration,
      status: cycleQueryString?.status?.map(item => item.id)?.toString() || '',
      name: cycleQueryString?.name,
    }
  }

  const dispatchCycleList = () => {
    setLoading(true)
    dispatch(getCycleList(formatPayloadQuery(cycleQueryString)))
      .unwrap()
      .finally(() => {
        setLoading(false)
      })
  }

  const handleDeleteCycle = (id: string) => {
    dispatch(deleteEvaluationCycle(id || '')).then(() => {
      dispatchCycleList()
    })
  }

  useEffect(() => {
    dispatchCycleList()
  }, [cycleQueryString])

  return (
    <CommonScreenLayout title={i18Mbo('LB_CYCLE_LIST')}>
      <Box className={classes.cycleContainer}>
        <CycleFilters />
        <TableCycles loading={loading} onDeleteCycle={handleDeleteCycle} />
      </Box>
    </CommonScreenLayout>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootCycleList: {},
  title: {
    fontSize: 16,
    fontWeight: 700,
    borderBottom: `1px solid ${theme.color.grey.secondary}`,
    width: 'max-content',
    paddingBottom: '28px',
  },
  cycleContainer: {
    marginTop: theme.spacing(3),
  },
}))
export default CycleList

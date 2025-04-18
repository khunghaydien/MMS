import CardForm from '@/components/Form/CardForm'
import FormItem from '@/components/Form/FormItem/FormItem'
import FormLayout from '@/components/Form/FormLayout'
import { LangConstant } from '@/const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { AppDispatch } from '@/store'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { CycleState, cycleSelector, setPayloadCycle } from '../../reducer/cycle'

const CycleSelectAppraiseAndReviewer = () => {
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)
  const { t: i18 } = useTranslation()
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { payloadCycle }: CycleState = useSelector(cycleSelector)
  const { staff, role }: AuthState = useSelector(selectAuth)

  const reviewer = useMemo(() => {
    const rolesSelfReview = [
      'Branch Director',
      'Division Director',
      'COO',
      'HRM',
    ]
    return role.some((roleItem: any) =>
      rolesSelfReview.includes(roleItem?.name)
    ) || !staff?.directManager
      ? staff?.name
      : staff?.directManager?.name
  }, [staff])

  useEffect(() => {
    dispatch(
      setPayloadCycle({
        ...payloadCycle,
        appraiser: staff?.id || '',
        reviewer: staff?.directManager?.id || staff?.id,
      })
    )
  }, [staff])

  return (
    <CardForm title={i18Mbo('LB_APPRAISER_AND_REVIEWER')}>
      <FormLayout top={24} gap={24}>
        <FormItem label={i18Mbo('LB_APPRAISER')} className={classes.item}>
          <Box>{staff?.name}</Box>
        </FormItem>
        <FormItem label={i18Mbo('LB_REVIEWER')} className={classes.item}>
          <Box>{reviewer}</Box>
        </FormItem>
      </FormLayout>
    </CardForm>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  item: {
    width: '250px',
  },
}))
export default CycleSelectAppraiseAndReviewer

import CardForm from '@/components/Form/CardForm'
import FormItem from '@/components/Form/FormItem/FormItem'
import FormLayout from '@/components/Form/FormLayout'
import { LangConstant } from '@/const'
import { CycleState, cycleSelector } from '@/modules/mbo/reducer/cycle'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

interface IProps {
  appraisees: any
  loadingStep: boolean
}
const CycleAppraiserReviewersList = ({ appraisees, loadingStep }: IProps) => {
  const classes = useStyles()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)
  const { evaluationCycle }: CycleState = useSelector(cycleSelector)

  return (
    <CardForm
      title={i18Mbo('LB_APPRAISERS_AND_REVIEWERS')}
      isLoading={loadingStep}
    >
      <FormLayout gap={24}>
        <FormItem label={'Appraisers'} className={classes.formItem}>
          {
            <Box className={classes.textContent}>
              {evaluationCycle?.appraiser?.label ||
                i18Mbo('TXT_ROLE_AS_PROJECT_MANAGER')}
            </Box>
          }
        </FormItem>
        <FormItem label={'Reviewers'} className={classes.formItem}>
          {
            <Box className={classes.textContent}>
              {evaluationCycle?.reviewer?.label ||
                i18Mbo('TXT_ROLE_AS_DIVISION_MANAGER')}
            </Box>
          }
        </FormItem>
      </FormLayout>
    </CardForm>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootCycleAppraiserReviewersList: {},
  formItem: {
    width: '200px',
  },
  textContent: {
    padding: theme.spacing(0.5, 0),
    borderRadius: theme.spacing(0.5),
    minHeight: theme.spacing(5),
    lineHeight: 1.6,
    display: 'flex',
    alignItems: 'center',
  },
}))
export default CycleAppraiserReviewersList

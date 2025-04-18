import FormItem from '@/components/Form/FormItem/FormItem'
import AutoCompleteSearchCustom from '@/components/common/AutoCompleteSearchCustom'
import { LangConstant } from '@/const'
import { AppDispatch } from '@/store'
import { OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { FormikErrors, FormikTouched } from 'formik'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  CycleState,
  cycleSelector,
  getCycleListUpcomingTemplate,
  setPayloadCycle,
} from '../../reducer/cycle'
import CycleSelectAppraiseAndReviewer from './CycleSelectAppraiseAndReviewer'
import CycleSelectAppraisees from './CycleSelectAppraisees'

interface ICreateCycleProps {
  formikValues: any
  formikErrors: FormikErrors<any>
  formikTouched: FormikTouched<any>
  formikSetValues: (
    values: any,
    shouldValidate?: boolean | undefined
  ) => Promise<void> | Promise<FormikErrors<any>>
}

const CreateCycle = ({
  formikValues,
  formikErrors,
  formikTouched,
  formikSetValues,
}: ICreateCycleProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)
  const dispatch = useDispatch<AppDispatch>()

  const { payloadCycle, cycleListUpcomingTemplate }: CycleState =
    useSelector(cycleSelector)

  const [selectCycleTemplate, setSelectCycleTemplate] = useState<OptionItem>({})

  const [loading, setLoading] = useState(false)
  const [valueSearchCycle, setValueSearchCycle] = useState('')

  const cycleListUpcomingTemplateFiltered = useMemo(() => {
    return cycleListUpcomingTemplate.filter((cycle: OptionItem) =>
      cycle.label?.toLowerCase()?.includes(valueSearchCycle.toLowerCase())
    )
  }, [valueSearchCycle, cycleListUpcomingTemplate])

  const handleInputDropdownChange = (value: OptionItem) => {
    setSelectCycleTemplate(value)
    dispatch(
      setPayloadCycle({
        ...payloadCycle,
        evaluationCycleTemplateId: value?.id || '',
      })
    )
    formikSetValues({
      ...formikValues,
      evaluationCycleTemplateId: value?.id || '',
    })
  }

  const handleSearchCycle = (value: string) => {
    setValueSearchCycle(value)
  }

  useEffect(() => {
    setLoading(true)
    dispatch(getCycleListUpcomingTemplate())
      .unwrap()
      .finally(() => {
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    formikSetValues({ ...formikValues, appraisees: payloadCycle.appraisees })
  }, [payloadCycle.appraisees])

  useEffect(() => {
    formikSetValues({
      ...formikValues,
      appraiser: payloadCycle.appraiser,
      reviewer: payloadCycle.reviewer,
    })
  }, [payloadCycle.appraiser, payloadCycle.reviewer])

  const deletePayloadCycle = () => {
    dispatch(
      setPayloadCycle({
        ...payloadCycle,
        evaluationCycleTemplateId: '',
      })
    )
  }
  useEffect(() => {
    return () => {
      deletePayloadCycle()
    }
  }, [])

  return (
    <Box className={classes.createCycle}>
      <FormItem label={i18Mbo('LB_CYCLE_TEMPLATE')} required>
        <AutoCompleteSearchCustom
          placeholder={i18('PLH_SELECT', {
            labelName: i18Mbo('LB_CYCLE_TEMPLATE'),
          })}
          loading={loading}
          width={400}
          multiple={false}
          value={selectCycleTemplate}
          listOptions={cycleListUpcomingTemplateFiltered}
          onChange={handleInputDropdownChange}
          error={
            !!formikErrors.evaluationCycleTemplateId &&
            !!formikTouched.evaluationCycleTemplateId
          }
          errorMessage={formikErrors.evaluationCycleTemplateId}
          onInputChange={handleSearchCycle}
          numberEllipsis={50}
        />
      </FormItem>
      <CycleSelectAppraisees
        formikErrors={formikErrors}
        formikTouched={formikTouched}
      />
      <CycleSelectAppraiseAndReviewer />
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  detailCycle: {},
  createCycle: {},
  footerActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(3),
  },
}))

export default CreateCycle

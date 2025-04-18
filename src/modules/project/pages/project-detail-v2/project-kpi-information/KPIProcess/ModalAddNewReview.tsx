import InputWeekPicker from '@/components/Datepicker/InputWeekPicker'
import Modal from '@/components/common/Modal'
import InputCurrency from '@/components/inputs/InputCurrency'
import { NS_DAILY_REPORT, NS_PROJECT } from '@/const/lang.const'
import { projectSelector } from '@/modules/project/reducer/project'
import { createNewProcess } from '@/modules/project/reducer/thunk'
import { alertSuccess } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { WeekPayload } from '@/types'
import { scrollToFirstErrorMessage } from '@/utils'
import { getYearWeekObject } from '@/utils/date'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import useKPIValidation from '../useKPIValidation'

export interface ReviewValues {
  week: number
  year: number
  planning: string | number
  monitoring: string | number
  closing: string | number
}

interface ModalAddNewReviewProps {
  onClose: () => void
  onSubmit: () => void
}

const ModalAddNewReview = ({ onClose, onSubmit }: ModalAddNewReviewProps) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { projectId } = useParams()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)
  const { t: i18DailyReport } = useTranslation(NS_DAILY_REPORT)
  const { addNewReviewValidation } = useKPIValidation()

  const { generalInfo } = useSelector(projectSelector)

  const form = useFormik({
    initialValues: {
      week: 0,
      year: 0,
      planning: '',
      monitoring: '',
      closing: '',
    } as ReviewValues,
    validationSchema: addNewReviewValidation,
    onSubmit: values => {
      setTimeout(() => {
        scrollToFirstErrorMessage()
      })
      handleSubmit(values)
    },
  })
  const { values, errors, touched, setFieldValue } = form

  const submitDisabled = useMemo(() => {
    return !values.planning && !values.monitoring && !values.closing
  }, [values])

  const projectStartWeek = useMemo(() => {
    return {
      year: getYearWeekObject(generalInfo.startDate).year,
      week: getYearWeekObject(generalInfo.startDate).week,
    }
  }, [generalInfo])

  const projectEndWeek = useMemo(() => {
    return {
      year: getYearWeekObject(generalInfo.endDate).year,
      week: getYearWeekObject(generalInfo.endDate).week,
    }
  }, [generalInfo])

  const handleSubmit = async (values: any) => {
    const _payload = {
      projectId: projectId,
      data: {
        closing: values.closing,
        monitoring: values.monitoring,
        planning: values.planning,
        week: values.week,
        yearWeek: values.year,
      },
    }
    await dispatch(createNewProcess(_payload))
      .unwrap()
      .then(res => {
        dispatch(
          alertSuccess({
            message: res.message,
          })
        )
        onClose()
        onSubmit()
      })
  }

  const onWeekChange = ({ value }: { value: WeekPayload }) => {
    setFieldValue('year', value.year)
    setFieldValue('week', value.week)
  }

  return (
    <Modal
      open
      width={325}
      submitDisabled={submitDisabled}
      title={i18Project('TXT_ADD_NEW_REVIEW')}
      onClose={onClose}
      onSubmit={() => form.handleSubmit()}
    >
      <form onSubmit={form.handleSubmit}>
        <Box className={classes.body}>
          <InputWeekPicker
            required
            value={{
              year: values.year,
              week: values.week,
            }}
            minWeek={projectStartWeek}
            maxWeek={projectEndWeek}
            label={i18('TXT_WEEK') as string}
            error={!!errors.week && touched.week}
            errorMessage={errors.week}
            onChange={onWeekChange}
          />
          <InputCurrency
            maxLength={6}
            suffix=""
            className={classes.inputCurrency}
            label={i18Project('TXT_PLANNING')}
            placeholder={i18DailyReport('PLH_WORKING_HOURS')}
            error={!!errors.planning && touched.planning}
            errorMessage={errors.planning}
            value={values.planning}
            onChange={(value: string | undefined) =>
              setFieldValue(`planning`, value as string)
            }
          />
          <InputCurrency
            maxLength={6}
            suffix=""
            className={classes.inputCurrency}
            label={i18Project('TXT_MONITORING')}
            placeholder={i18DailyReport('PLH_WORKING_HOURS')}
            error={!!errors.monitoring && touched.monitoring}
            errorMessage={errors.monitoring}
            value={values.monitoring}
            onChange={(value: string | undefined) =>
              setFieldValue(`monitoring`, value as string)
            }
          />
          <InputCurrency
            maxLength={6}
            suffix=""
            className={classes.inputCurrency}
            label={i18Project('TXT_CLOSING')}
            placeholder={i18DailyReport('PLH_WORKING_HOURS')}
            error={!!errors.closing && touched.closing}
            errorMessage={errors.closing}
            value={values.closing}
            onChange={(value: string | undefined) =>
              setFieldValue(`closing`, value as string)
            }
          />
        </Box>
      </form>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  inputCurrency: {
    maxWidth: 'unset',
  },
}))

export default ModalAddNewReview

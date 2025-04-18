import InputWeekPicker from '@/components/Datepicker/InputWeekPicker'
import CardFormEdit from '@/components/Form/CardFormEdit'
import FormLayout from '@/components/Form/FormLayout'
import Modal from '@/components/common/Modal'
import StatusItem from '@/components/common/StatusItem'
import InputCurrency from '@/components/inputs/InputCurrency'
import { NS_DAILY_REPORT, NS_PROJECT } from '@/const/lang.const'
import { projectSelector } from '@/modules/project/reducer/project'
import { updateProcess } from '@/modules/project/reducer/thunk'
import { alertSuccess } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { WeekPayload } from '@/types'
import { scrollToFirstErrorMessage } from '@/utils'
import { getYearWeekObject } from '@/utils/date'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
import { Fragment, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import useKPIValidation from '../useKPIValidation'
import { getProcessStatus } from './KPIProcess'
import { getValueView } from './KPIProcessTable'
import { ReviewValues } from './ModalAddNewReview'

const ViewDetail = ({ review }: { review: any }) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)
  return (
    <Box className={classes.RootViewDetail}>
      <Box className={classes.listFields}>
        <StatusItem typeStatus={getProcessStatus(review.weekStatus)} />
        <Box className={classes.option}>
          <Box className={classes.label}>{i18('TXT_WEEK')}</Box>
          <Box className={classes.value}>{review.weekText}</Box>
        </Box>
        <FormLayout gap={24}>
          <Box className={classes.option}>
            <Box className={classes.label}>{i18Project('TXT_PC_RATE')}</Box>
            <Box className={classes.value}>{getValueView(review.pcRate)}</Box>
          </Box>
          <Box className={classes.option}>
            <Box className={classes.label}>{i18Project('TXT_PLANNING')}</Box>
            <Box className={classes.value}>{getValueView(review.planning)}</Box>
          </Box>
        </FormLayout>
        <FormLayout>
          <Box className={classes.option}>
            <Box className={classes.label}>{i18Project('TXT_MONITORING')}</Box>
            <Box className={classes.value}>
              {getValueView(review.monitoring)}
            </Box>
          </Box>
        </FormLayout>
        <Box className={classes.option}>
          <Box className={classes.label}>{i18Project('TXT_CLOSING')}</Box>
          <Box className={classes.value}>{getValueView(review.closing)}</Box>
        </Box>
      </Box>
    </Box>
  )
}

interface ModalDetailReviewProps {
  initReview: any
  onClose: () => void
  onSubmit: () => void
  onDelete: () => void
}

const ModalDetailReview = ({
  initReview,
  onClose,
  onSubmit,
  onDelete,
}: ModalDetailReviewProps) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { projectId } = useParams()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)
  const { t: i18DailyReport } = useTranslation(NS_DAILY_REPORT)
  const { addNewReviewValidation } = useKPIValidation()

  const { generalInfo, permissionProjectKPI } = useSelector(projectSelector)

  const [isViewMode, setIsViewMode] = useState(true)
  const [reviewTemp] = useState(initReview)

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
      processId: initReview.id,
      data: {
        closing: values.closing,
        monitoring: values.monitoring,
        planning: values.planning,
        week: values.week,
        yearWeek: values.year,
      },
    }
    await dispatch(updateProcess(_payload))
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
  const form = useFormik({
    initialValues: {
      year: initReview.yearWeek,
      week: initReview.week,
      planning: initReview.planning === null ? '' : initReview.planning,
      monitoring: initReview.monitoring === null ? '' : initReview.monitoring,
      closing: initReview.closing === null ? '' : initReview.closing,
    } as ReviewValues,
    validationSchema: addNewReviewValidation,
    onSubmit: values => {
      setTimeout(() => {
        scrollToFirstErrorMessage()
      })
      handleSubmit(values)
    },
  })
  const { values, errors, touched, setFieldValue, setValues } = form

  const buttonSubmitDisabled = useMemo(() => {
    const hasChanged =
      JSON.stringify({
        year: values.year,
        week: values.week,
        planning: values.planning?.toString(),
        monitoring: values.monitoring?.toString(),
        closing: values.closing?.toString(),
      }) !==
      JSON.stringify({
        year: initReview.yearWeek,
        week: initReview.week,
        planning: initReview.planning?.toString(),
        monitoring: initReview.monitoring?.toString(),
        closing: initReview.closing?.toString(),
      })
    return (
      !hasChanged ||
      (values.planning === '' &&
        values.monitoring === '' &&
        values.closing === '')
    )
  }, [values])

  const onCancel = () => {
    setValues({
      year: initReview.yearWeek,
      week: initReview.week,
      planning: initReview.planning,
      monitoring: initReview.monitoring,
      closing: initReview.closing,
    })
    setIsViewMode(true)
  }

  const onWeekChange = (payload: { value: WeekPayload }) => {
    setFieldValue('year', payload.value.year)
    setFieldValue('week', payload.value.week)
  }

  return (
    <Modal
      open
      hideFooter
      width={360}
      title={i18Project('TXT_REVIEW_DETAILS')}
      onClose={onClose}
    >
      <Box className={classes.body}>
        <Box className={classes.actions}>
          <CardFormEdit
            hideBorder
            buttonUseDetailEditDisabled={buttonSubmitDisabled}
            useDeleteMode={isViewMode && !!permissionProjectKPI.processDelete}
            useDetailEditMode={!isViewMode}
            useDetailViewMode={
              isViewMode && !!permissionProjectKPI.processUpdate
            }
            onOpenEditMode={() => setIsViewMode(false)}
            onCancelEditMode={onCancel}
            onOpenDeleteMode={() => {
              onClose()
              onDelete()
            }}
            onSaveAs={() => form.handleSubmit()}
          />
        </Box>
        {isViewMode && <ViewDetail review={reviewTemp} />}
        {!isViewMode && (
          <Fragment>
            <FormLayout top={24}>
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
            </FormLayout>
            <FormLayout top={24} gap={24}>
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
            </FormLayout>
            <FormLayout top={24}>
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
            </FormLayout>
            <FormLayout top={24}>
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
            </FormLayout>
          </Fragment>
        )}
      </Box>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  body: {
    border: `1px solid ${theme.color.grey.secondary}`,
    borderRadius: '8px',
    padding: theme.spacing(2),
    position: 'relative',
  },
  actions: {
    position: 'absolute',
    right: theme.spacing(2),
  },
  RootViewDetail: {},
  listFields: {
    display: 'flex',
    gap: theme.spacing(2),
    flexDirection: 'column',
  },
  option: {
    width: 'max-content',
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: theme.color.black.secondary,
  },
  value: {
    fontSize: 14,
    marginTop: theme.spacing(0.5),
    fontWeight: 700,
    whiteSpace: 'pre-line',
  },
  inputCurrency: {
    maxWidth: 'unset',
  },
}))

export default ModalDetailReview

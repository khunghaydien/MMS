import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import FormLayout from '@/components/Form/FormLayout'
import Modal from '@/components/common/Modal'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import { NS_STAFF } from '@/const/lang.const'
import { STAFF_STATUS_TYPE, status } from '@/modules/staff/const'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { EventInput } from '@/types'
import { formatAnyToDate, formatDate, scrollToFirstErrorMessage } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import formikConfig from '../pages/formik/Formik'
import { getDetailStaff, updateChangeStatus } from '../reducer/thunk'
interface ModalChangeStatusProps {
  initStatus: any
  onClose: () => void
  onSubmit: () => void
}
const ModalChangeStatus = ({
  initStatus,
  onClose,
  onSubmit,
}: ModalChangeStatusProps) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { changeStatusSchemaValidation } = formikConfig()
  const { t: i18Staff } = useTranslation(NS_STAFF)
  const { staffId } = useParams()
  const handleSubmit = async (values: any) => {
    const requestBody = {
      endDate: values.estimateTo
        ? formatAnyToDate(values.estimateTo)?.getTime()
        : null,
      note: values.leaveReason,
      startDate: values.endDate
        ? formatAnyToDate(values.endDate)?.getTime()
        : null,
      status: values.changeStatusTo,
    }
    dispatch(updateLoading(true))
    dispatch(
      updateChangeStatus({
        id: staffId || '',
        requestBody: requestBody,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(getDetailStaff(staffId || ''))
        onSubmit()
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }
  const form = useFormik({
    initialValues: {
      currentStatus: initStatus?.status?.status?.id,
      startDate: initStatus.status.startDate,
      endDate: initStatus.status.endDate,
      leaveReason: '',
      changeStatusTo: '',
      estimateTo: null,
    },
    validationSchema: changeStatusSchemaValidation,
    onSubmit: values => {
      setTimeout(() => {
        scrollToFirstErrorMessage()
      })
      handleSubmit(values)
    },
  })
  const { values, errors, touched, setFieldValue } = form
  const handleDateChange = useCallback(
    (dateSelected: Date, keyName: string) => {
      setFieldValue(keyName, dateSelected || null)
    },
    []
  )
  const handleTextChange = useCallback((e: EventInput, keyName: string) => {
    setFieldValue(keyName, e.target.value)
  }, [])

  const onChangeValue = useCallback((value: any, keyName: string) => {
    if (keyName === 'changeStatusTo') {
      setFieldValue('endDate', values.endDate)
    }
    setFieldValue(keyName, value)
  }, [])
  const statusList = useMemo(() => {
    const newStatus = [...status]
    return newStatus.filter(
      item => item.id !== values.currentStatus?.toString()
    )
  }, [values.currentStatus])

  return (
    <Modal
      open
      useButtonCancel
      cancelOutlined
      onDontSave={onClose}
      onSubmit={form.handleSubmit}
      width={600}
      title={i18Staff('LB_CHANGE_STATUS')}
      useButtonDontSave
      onClose={onClose}
    >
      <form onSubmit={form.handleSubmit}>
        <FormLayout gap={24}>
          <InputDropdown
            required
            isDisable={true}
            listOptions={status}
            keyName="currentStatus"
            error={Boolean(!!errors?.currentStatus && touched?.currentStatus)}
            errorMessage={errors?.currentStatus}
            label={i18Staff('LB_CURRENT_STATUS')}
            value={values.currentStatus}
            placeholder={i18Staff('LB_CURRENT_STATUS')}
            onChange={(value: any) => onChangeValue(value, 'currentStatus')}
          />
          <InputDatepicker
            disabled
            label={i18Staff('LB_FROM') || ''}
            keyName={'startDate'}
            required
            minDate={
              values.changeStatusTo?.toString() ===
              STAFF_STATUS_TYPE.ON_SITE.toString()
                ? values.estimateTo
                : values.endDate
            }
            value={values?.startDate}
            error={touched?.startDate && Boolean(errors?.startDate)}
            errorMessage={errors?.startDate}
            width={'100%'}
            onChange={handleDateChange}
          />
          <InputDatepicker
            label={i18Staff('LB_TO') || ''}
            keyName={'endDate'}
            required
            minDate={values.startDate}
            value={values?.endDate}
            error={touched?.endDate && Boolean(errors?.endDate)}
            errorMessage={errors?.endDate}
            width={'100%'}
            onChange={handleDateChange}
          />
        </FormLayout>
        <FormLayout top={24} gap={24}>
          <InputDropdown
            required
            listOptions={statusList}
            keyName="changeStatusTo"
            error={Boolean(!!errors?.changeStatusTo && touched?.changeStatusTo)}
            errorMessage={errors?.changeStatusTo}
            label={i18Staff('LB_CHANGE_STATUS_TO')}
            value={values.changeStatusTo}
            placeholder={i18Staff('LB_CHANGE_STATUS_TO')}
            onChange={(value: any) => onChangeValue(value, 'changeStatusTo')}
          />
          {(values.changeStatusTo.toString() ===
            STAFF_STATUS_TYPE.ON_SITE.toString() ||
            values.changeStatusTo.toString() ===
              STAFF_STATUS_TYPE.STATUS_TEMPORARY_LEAVE.toString()) && (
            <InputDatepicker
              label={i18Staff('LB_TO_ESTIMATE') || ''}
              keyName={'estimateTo'}
              required
              minDate={values.endDate}
              value={values?.estimateTo}
              error={touched?.estimateTo && Boolean(errors?.estimateTo)}
              errorMessage={errors?.estimateTo}
              width={'100%'}
              onChange={handleDateChange}
            />
          )}
        </FormLayout>
        <Box className={classes.hint}>
          New status will be effective from
          <span style={{ fontWeight: 'bold' }}>
            {` ${formatDate(values.endDate)}`}
          </span>
        </Box>
        {values.changeStatusTo.toString() ===
          STAFF_STATUS_TYPE.STATUS_TEMPORARY_LEAVE.toString() && (
          <FormLayout top={24} gap={24}>
            <InputTextLabel
              required
              keyName="leaveReason"
              label={i18Staff('LB_LEAVE_REASON')}
              placeholder={i18Staff('LB_LEAVE_REASON') as string}
              error={!!errors.leaveReason && !!touched.leaveReason}
              errorMessage={errors.leaveReason}
              value={values.leaveReason}
              onChange={handleTextChange}
            />
          </FormLayout>
        )}
      </form>
    </Modal>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  hint: {
    marginTop: '10px',
    fontSize: '10px',
  },
  RootFormProjectOTReportItem: {
    border: `1px solid ${theme.color.grey.secondary}`,
    borderRadius: '8px',
    padding: theme.spacing(2),
    position: 'relative',
  },
  title: {
    position: 'absolute',
    fontWeight: 700,
    color: theme.color.blue.primary,
    background: '#fff',
    top: '-10px',
  },
  actions: {
    position: 'absolute',
    right: theme.spacing(2),
  },
  projectOTDateList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}))
export default ModalChangeStatus

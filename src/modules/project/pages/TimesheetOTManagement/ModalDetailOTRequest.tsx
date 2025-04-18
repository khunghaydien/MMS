import CommonButton from '@/components/buttons/CommonButton'
import Modal from '@/components/common/Modal'
import StatusItem from '@/components/common/StatusItem'
import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import InputTimepicker from '@/components/Datepicker/InputTimepicker'
import CardFormEdit from '@/components/Form/CardFormEdit'
import FormLayout from '@/components/Form/FormLayout'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputTextArea from '@/components/inputs/InputTextArea'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import { LangConstant } from '@/const'
import { STATUS_OT_REPORT_VALUES } from '@/modules/daily-report/const'
import { updateLoading } from '@/reducer/screen'
import commonService from '@/services/common.service'
import { AppDispatch } from '@/store'
import { formatDate, scrollToFirstErrorMessage } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { updateOTReportStatus, updateReportOT } from '../../reducer/thunk'
import { caculateHours } from './FormOTDateItem'
import { getOTReportStatus } from './MyOTReport'
import useTimesheetOTManagementValidate from './useTimesheetOTManagementValidate'

interface ModalDetailOTRequestProps {
  onClose: Function
  isConfirmer?: boolean
  isUpdateModal?: boolean
  setIsUpdateModal?: Dispatch<SetStateAction<boolean>>
  reportOTDetail?: any
  listProject?: any[]
  onUpdate?: () => void
  isMyOT?: boolean
  handleReject?: (id: string) => void
  onOpenRequestOT?: (requestId: string) => void
  onDeleteRequestOT?: (reportOTDetail: any) => void
}
const ModalDetailOTRequest = ({
  onClose,
  isUpdateModal,
  setIsUpdateModal,
  reportOTDetail,
  listProject,
  onUpdate,
  isMyOT,
  handleReject,
  onOpenRequestOT,
  onDeleteRequestOT,
}: ModalDetailOTRequestProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)
  const { t: i18DailyReport } = useTranslation(LangConstant.NS_DAILY_REPORT)
  const { otReportValidation } = useTimesheetOTManagementValidate()
  const [loading, setLoading] = useState<boolean>(false)
  const [reportOT, setReportOT] = useState(reportOTDetail)
  const [isErrorOTDate, setIsErrorOTDate] = useState(false)
  const initialValues = useMemo(() => {
    return {
      from: reportOT?.otFrom,
      to: reportOT?.otTo,
      reason: reportOT?.reason,
      otDate: reportOT?.otDate,
      projectId: reportOT?.project?.id,
      hours: reportOT?.otHours?.toString(),
      otRequestId: reportOT?.otRequest?.id,
    }
  }, [])
  const form = useFormik({
    initialValues: initialValues,
    validationSchema: otReportValidation,
    onSubmit: values => {
      handleUpdate(values)
    },
  })
  const { errors, touched, values, setFieldValue } = form

  const isChange = useMemo(() => {
    return JSON.stringify(values) != JSON.stringify(initialValues)
  }, [values, initialValues])

  const onChange = (value: any, key: string) => {
    setFieldValue(key, value)
    if (key === 'projectId') {
      setFieldValue('otDate', null)
    }
  }

  useEffect(() => {
    let totalDifference = 0
    if (values.from && values.to) {
      totalDifference = caculateHours(values.from, values.to)
    } else totalDifference = 0
    setFieldValue('hours', totalDifference.toString())
  }, [values.from, values.to])

  const handleUpdate = async (values: any) => {
    try {
      dispatch(updateLoading(true))
      await dispatch(
        updateReportOT({
          id: reportOT?.id,
          data: {
            otDate: new Date(
              `${formatDate(values.otDate).split('/')[1]}-${
                formatDate(values.otDate).split('/')[0]
              }-${formatDate(values.otDate).split('/')[2]}`
            ).getTime(),
            hours: values.hours,
            otFrom: values.from,
            otTo: values.to,
            otRequestId: values.otRequestId,
            reason: values.reason,
            projectId: values.projectId,
          },
        })
      )
      onClose()
      !!onUpdate && onUpdate()
      dispatch(updateLoading(false))
    } catch {}
  }
  const onConfirm = async () => {
    try {
      await dispatch(
        updateOTReportStatus({
          ids: [reportOT?.id],
          status: STATUS_OT_REPORT_VALUES.CONFIRMED,
        })
      )
    } catch {}
  }
  const onApprove = async () => {
    try {
      await dispatch(
        updateOTReportStatus({
          ids: [reportOT?.id],
          status: STATUS_OT_REPORT_VALUES.APPROVED,
        })
      )
    } catch {}
  }
  const handleButtonReject = () => {
    onClose()
    !!handleReject && handleReject(reportOT?.id)
  }
  const handleConfirm = async () => {
    await onConfirm()
    onClose()
    !!onUpdate && onUpdate()
  }
  const handleApprove = async () => {
    await onApprove()
    onClose()
    !!onUpdate && onUpdate()
  }
  const onSubmit = () => {
    form.handleSubmit()
    setTimeout(() => {
      scrollToFirstErrorMessage()
    })
  }
  const handleChangeOTDate = async (value: Date | null) => {
    setFieldValue('otDate', value)
    if (value) {
      dispatch(updateLoading(true))
      try {
        const res = await commonService.validateProjectOTReport({
          otDate: value?.getTime(),
          projectId: values.projectId.toString(),
        })
        if (typeof res.data === 'number') {
          setFieldValue('otRequestId', res.data)
          setIsErrorOTDate(false)
        }
      } catch (error) {
        setFieldValue('otRequestId', null)
        setIsErrorOTDate(true)
      } finally {
        dispatch(updateLoading(false))
      }
    }
  }
  return (
    <Modal
      open
      width={800}
      hideFooter
      title={i18Project('TXT_OT_REPORT_DETAILS')}
      onClose={onClose}
      loading={loading}
    >
      <Box className={classes.body}>
        {reportOT.canUpdate && isMyOT && (
          <Box className={classes.actions}>
            <CardFormEdit
              buttonUseDetailEditDisabled={!isChange}
              hideBorder
              onSaveAs={onSubmit}
              useDeleteMode={!isUpdateModal}
              useDetailEditMode={isUpdateModal}
              useDetailViewMode={!isUpdateModal}
              onOpenEditMode={() => {
                !!setIsUpdateModal && setIsUpdateModal(true)
              }}
              onCancelEditMode={() => {
                !!setIsUpdateModal && setIsUpdateModal(false)
              }}
              onOpenDeleteMode={() => {
                onClose()
                onDeleteRequestOT && onDeleteRequestOT(reportOTDetail)
              }}
            />
          </Box>
        )}
        {!isUpdateModal && (
          <Box className={classes.listFields}>
            <FormLayout gap={24}>
              <Box className={classes.option} width={300}>
                <Box className={classes.label}>
                  {i18DailyReport('LB_REPORT_DATE')}
                </Box>
                <Box className={classes.value}>
                  {formatDate(reportOT?.reportDate)}
                </Box>
              </Box>
              <Box className={classes.option} width={100}>
                <Box className={classes.label}>{i18('LB_STATUS')}</Box>
                <Box className={classes.value}>
                  <StatusItem
                    typeStatus={getOTReportStatus(reportOT?.status)}
                  />
                </Box>
              </Box>
            </FormLayout>
            <FormLayout gap={24}>
              <Box className={classes.option} width={300}>
                <Box className={classes.label}>
                  {i18Project('LB_PROJECT_NAME')}
                </Box>
                <Box className={classes.value}>{reportOT?.project.name}</Box>
              </Box>
              <Box className={classes.option}>
                <Box className={classes.label}>
                  {i18Project('LB_PROJECT_CODE')}
                </Box>
                <Box className={classes.value}>{reportOT?.project.code}</Box>
              </Box>
            </FormLayout>
            <FormLayout gap={24}>
              <Box className={classes.option} width={300}>
                <Box className={classes.label}>
                  {i18Project('LB_CONFIRMER')}
                </Box>
                <Box className={classes.value}>{reportOT?.confirmer.name}</Box>
              </Box>
              <Box className={classes.option}>
                <Box className={classes.label}>{i18Project('LB_APPROVER')}</Box>
                <Box className={classes.value}>{reportOT?.approver?.name}</Box>
              </Box>
            </FormLayout>
            <FormLayout gap={24}>
              <Box className={classes.option} width={300}>
                <Box className={classes.label}>{i18Project('LB_OT_DATE')}</Box>
                <Box className={classes.value}>
                  {formatDate(reportOT?.otDate)}
                </Box>
              </Box>
              <Box className={classes.option} width={60}>
                <Box className={classes.label}>{i18('LB_FROM')}</Box>
                <Box className={classes.value}>{reportOT?.otFrom}</Box>
              </Box>
              <Box className={classes.option} width={60}>
                <Box className={classes.label}>{i18('LB_TO')}</Box>
                <Box className={classes.value}>{reportOT?.otTo}</Box>
              </Box>
              <Box className={classes.option} width={60}>
                <Box className={classes.label}>
                  {i18DailyReport('LB_OT_HOURS')}
                </Box>
                <Box className={classes.value}>{reportOT?.otHours}</Box>
              </Box>
            </FormLayout>
            <Box className={classes.option} width={600}>
              <Box className={classes.label}>
                {i18DailyReport('LB_REASON_FOR_OT')}
              </Box>
              <Box className={classes.value}>{reportOT?.reason}</Box>
            </Box>
            {reportOT.viewOTRequest && (
              <Box className={classes.option} width={600}>
                <Box
                  className={classes.linkOT}
                  onClick={() => {
                    onClose()
                    !!onOpenRequestOT && onOpenRequestOT(reportOT.otRequest.id)
                  }}
                >
                  {`Xin phép OT ngày ${formatDate(
                    reportOT?.reportDate
                  )} cho dự án ${reportOT.project.name}`}
                </Box>
              </Box>
            )}
          </Box>
        )}
        {isUpdateModal && (
          <Box className={classes.listFields}>
            <InputDropdown
              required
              width={500}
              label={i18Project('LB_PROJECT')}
              value={values.projectId}
              listOptions={listProject}
              error={Boolean(!!errors?.projectId && touched?.projectId)}
              errorMessage={errors?.projectId}
              onChange={(value: any) => onChange(value, 'projectId')}
              placeholder={i18Project('LB_SELECT_PROJECT')}
            />
            <FormLayout gap={24}>
              <InputDatepicker
                disabled={!values.projectId}
                required
                width={160}
                label={i18Project('LB_OT_DATE')}
                error={Boolean(
                  (!!errors?.otDate && touched?.otDate) || isErrorOTDate
                )}
                errorMessage={errors?.otDate || errors?.otRequestId}
                value={values.otDate}
                onChange={handleChangeOTDate}
              />
              <InputTimepicker
                isDisable={!values.projectId}
                required
                value={values.from}
                error={Boolean(!!errors?.from && touched?.from)}
                errorMessage={errors?.from}
                label={i18('LB_FROM')}
                onChange={(value: any) => onChange(value, 'from')}
                maxTime={values.to}
              />
              <InputTimepicker
                isDisable={!values.projectId}
                required
                value={values.to}
                error={Boolean(!!errors?.to && touched?.to)}
                errorMessage={errors?.to}
                label={i18DailyReport('LB_TO')}
                onChange={(value: any) => onChange(value, 'to')}
                minTime={values.from}
              />
              <Box width={100}>
                <InputTextLabel
                  required
                  disabled
                  value={values.hours}
                  label={i18DailyReport('LB_OT_HOURS')}
                  useCounter={false}
                />
              </Box>
            </FormLayout>
            <InputTextArea
              height={80}
              defaultValue={values.reason}
              onChange={(value: any) => onChange(value.target.value, 'reason')}
              label={i18DailyReport('LB_REASON_FOR_OT') as string}
              placeholder={i18DailyReport('PLH_REASON_FOR_OT')}
            />
          </Box>
        )}
      </Box>
      {(reportOT.canReject || reportOT.canApprove || reportOT.canConfirm) && (
        <Box className={classes.footer}>
          <CommonButton color="error" onClick={handleButtonReject}>
            {i18('LB_REJECT')}
          </CommonButton>
          {reportOT.canConfirm && (
            <CommonButton onClick={handleConfirm}>
              {i18('LB_CONFIRM')}
            </CommonButton>
          )}
          {reportOT.canApprove && (
            <CommonButton onClick={handleApprove}>
              {i18Project('LB_APPROVE')}
            </CommonButton>
          )}
        </Box>
      )}
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  body: {
    border: `1px solid ${theme.color.grey.secondary}`,
    borderRadius: '4px',
    padding: theme.spacing(2),
    position: 'relative',
  },
  actions: {
    position: 'absolute',
    right: theme.spacing(2),
  },
  listFields: {
    display: 'flex',
    gap: theme.spacing(2),
    flexDirection: 'column',
  },
  option: {
    width: 'max-content',
  },
  label: {
    fontSize: 14,
    color: theme.color.black.secondary,
  },
  value: {
    fontSize: 14,
    marginTop: theme.spacing(0.5),
    fontWeight: 700,
  },
  footer: {
    padding: theme.spacing(2, 3),
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(2),
    background: theme.color.grey.tertiary,
    margin: theme.spacing(2, -3, -2, -3),
  },
  linkOT: {
    color: theme.color.blue.primary,
    cursor: 'pointer',
  },
}))

export default ModalDetailOTRequest

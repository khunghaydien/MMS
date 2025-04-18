import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import CardFormEdit from '@/components/Form/CardFormEdit'
import FormLayout from '@/components/Form/FormLayout'
import InputErrorMessage from '@/components/common/InputErrorMessage'
import InputTitle from '@/components/common/InputTitle'
import Modal from '@/components/common/Modal'
import StatusItem from '@/components/common/StatusItem'
import InputCheckbox from '@/components/inputs/InputCheckbox'
import InputRadioList from '@/components/inputs/InputRadioList'
import InputTextArea from '@/components/inputs/InputTextArea'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import { NS_PROJECT } from '@/const/lang.const'
import { MILESTONE_STATUS } from '@/modules/project/const'
import { projectSelector } from '@/modules/project/reducer/project'
import { ProjectService } from '@/modules/project/services'
import { alertSuccess, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { ErrorResponse, EventInput } from '@/types'
import { formatDate } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
import moment from 'moment'
import { Fragment, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import useKPIValidation from '../useKPIValidation'
import { getMilestoneStatus } from './DeliveryMilestone'
import {
  MilestoneInitialValues,
  radioListOptions,
} from './ModalAddNewMilestone'

const ViewDetail = ({ milestone }: { milestone: any }) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)
  return (
    <Box className={classes.RootViewDetail}>
      <Box className={classes.listFields}>
        <StatusItem typeStatus={getMilestoneStatus(milestone.status)} />
        <FormLayout gap={24}>
          <Box className={classes.option}>
            <Box className={classes.label}>{i18Project('TXT_ADDED_DATE')}</Box>
            <Box className={classes.value}>
              {formatDate(milestone.addedDate)}
            </Box>
          </Box>
          <Box className={classes.option}>
            <Box className={classes.label}>{i18Project('TXT_MILESTONE')}</Box>
            <Box className={classes.value}>{milestone.name}</Box>
          </Box>
          <Box className={classes.option}>
            <Box className={classes.label}>
              {i18Project('TXT_COMMITMENT_DELIVERY_DATE')}
            </Box>
            <Box className={classes.value}>
              {formatDate(milestone.commitmentDeliveryDate)}
            </Box>
          </Box>
        </FormLayout>
        {!!milestone.description && (
          <Box className={classes.option}>
            <Box className={classes.label}>{i18('LB_DESCRIPTION')}</Box>
            <Box className={classes.value}>{milestone.description}</Box>
          </Box>
        )}
        {(milestone.status === MILESTONE_STATUS.PASS ||
          milestone.status === MILESTONE_STATUS.FAIL) && (
          <>
            <FormLayout gap={24}>
              <Box className={classes.option}>
                <Box className={classes.label}>
                  {i18Project('TXT_ACTUAL_DELIVERY_DATE')}
                </Box>
                <Box className={classes.value}>
                  {formatDate(milestone.actualDeliveryDate)}
                </Box>
              </Box>
              {!!milestone.limitation && (
                <Box className={classes.option}>
                  <Box className={classes.label}>
                    {i18Project('TXT_LIMITATION')}
                  </Box>
                  <Box className={classes.value}>{milestone.limitation}</Box>
                </Box>
              )}
            </FormLayout>
          </>
        )}
      </Box>
    </Box>
  )
}

interface ModalDetailMilestoneProps {
  initMilestone: any
  onClose: () => void
  onOpenModalDeleteMilestoneFromDetail: (milestone: any) => void
  onUpdatedSuccessfully: () => void
}

const ModalDetailMilestone = ({
  initMilestone,
  onClose,
  onOpenModalDeleteMilestoneFromDetail,
  onUpdatedSuccessfully,
}: ModalDetailMilestoneProps) => {
  const classes = useStyles()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const { generalInfo, permissionProjectKPI } = useSelector(projectSelector)
  const { addNewMilestoneValidation } = useKPIValidation()
  const [isViewMode, setIsViewMode] = useState(true)
  const [milestoneTemp] = useState(initMilestone)
  const [milestoneNameError, setMilestoneNameError] = useState(false)
  const form = useFormik({
    initialValues: {
      name: initMilestone.name,
      addedDate: initMilestone.addedDate,
      commitmentDeliveryDate: initMilestone.commitmentDeliveryDate,
      description: initMilestone.description,
      deliver: initMilestone.deliver,
      actualDeliveryDate: initMilestone.actualDeliveryDate
        ? new Date(initMilestone.actualDeliveryDate)
        : null,
      limitation: initMilestone.limitation,
      milestoneDecision:
        initMilestone.status === MILESTONE_STATUS.PASS ||
        initMilestone.status === MILESTONE_STATUS.FAIL
          ? initMilestone.status === MILESTONE_STATUS.PASS
            ? '1'
            : '2'
          : '',
    } as MilestoneInitialValues,
    validationSchema: addNewMilestoneValidation,
    onSubmit: () => {
      updateMilestone()
    },
  })
  const { values, errors, touched, setFieldValue, setValues } = form

  const buttonSubmitDisabled = useMemo(() => {
    return (
      JSON.stringify({
        name: values.name,
        description: values.description,
        addedDate: moment(values.addedDate).format('DD/MM/YYYY'),
        commitmentDeliveryDate: moment(values.commitmentDeliveryDate).format(
          'DD/MM/YYYY'
        ),
        deliver: values.deliver,
        actualDeliveryDate: moment(values.actualDeliveryDate).format(
          'DD/MM/YYYY'
        ),
        limitation: values.limitation,
        milestoneDecision: values.milestoneDecision,
      }) ===
      JSON.stringify({
        name: initMilestone.name,
        description: initMilestone.description,
        addedDate: moment(initMilestone.addedDate).format('DD/MM/YYYY'),
        commitmentDeliveryDate: moment(
          initMilestone.commitmentDeliveryDate
        ).format('DD/MM/YYYY'),
        deliver: initMilestone.deliver,
        actualDeliveryDate: moment(initMilestone.actualDeliveryDate).format(
          'DD/MM/YYYY'
        ),
        limitation: initMilestone.limitation,
        milestoneDecision:
          initMilestone.status === MILESTONE_STATUS.PASS ? '1' : '2',
      })
    )
  }, [values])

  const onCancel = () => {
    setValues({
      name: initMilestone.name,
      addedDate: initMilestone.addedDate,
      commitmentDeliveryDate: initMilestone.commitmentDeliveryDate,
      description: initMilestone.description,
      deliver: initMilestone.deliver,
      actualDeliveryDate: initMilestone.actualDeliveryDate,
      limitation: initMilestone.limitation,
      milestoneDecision:
        initMilestone.status === MILESTONE_STATUS.PASS ? '1' : '2',
    })
    setIsViewMode(true)
  }

  const updateMilestone = () => {
    dispatch(updateLoading(true))
    const todayMoreThanCommitmentDeliveryDate =
      new Date().getTime() -
        (values.commitmentDeliveryDate?.getTime() as number) >
      0
    const payload = {
      projectId: params.projectId as string,
      milestoneId: initMilestone.id,
      requestBody: {
        ...values,
        actualDeliveryDate:
          values.deliver === 2
            ? (values.actualDeliveryDate?.getTime() as number)
            : null,
        commitmentDeliveryDate:
          values.commitmentDeliveryDate?.getTime() as number,
        addedDate: values.addedDate?.getTime() as number,
        status: todayMoreThanCommitmentDeliveryDate
          ? MILESTONE_STATUS.NOT_DELIVER
          : MILESTONE_STATUS.UP_COMING,
        limitation: values.deliver === 2 ? values.limitation : null,
        milestoneDecision:
          values.deliver === 1
            ? null
            : values.milestoneDecision === '1'
            ? true
            : false,
        deliver: values.deliver,
      },
    }
    ProjectService.updateMilestone(payload)
      .then(() => {
        dispatch(
          alertSuccess({
            message: i18('MSG_UPDATE_SUCCESS', {
              labelName: `${i18Project('TXT_MILESTONE')} ${initMilestone.name}`,
            }),
          })
        )
        onUpdatedSuccessfully()
        onClose()
      })
      .catch((errors: ErrorResponse[]) => {
        if (errors?.find(error => error.field === 'milestoneName')) {
          setMilestoneNameError(true)
        }
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  return (
    <Modal
      open
      hideFooter
      width={708}
      title={i18Project('TXT_MILESTONE_DETAILS')}
      onClose={onClose}
    >
      <Box className={classes.body}>
        <Box className={classes.actions}>
          <CardFormEdit
            hideBorder
            buttonUseDetailEditDisabled={buttonSubmitDisabled}
            useDeleteMode={
              isViewMode && !!permissionProjectKPI.deliveryMilestoneDelete
            }
            useDetailEditMode={!isViewMode}
            useDetailViewMode={
              isViewMode && !!permissionProjectKPI.deliveryMilestoneUpdate
            }
            onOpenEditMode={() => setIsViewMode(false)}
            onCancelEditMode={onCancel}
            onOpenDeleteMode={() =>
              onOpenModalDeleteMilestoneFromDetail(initMilestone)
            }
            onSaveAs={() => form.handleSubmit()}
          />
        </Box>
        {isViewMode && <ViewDetail milestone={milestoneTemp} />}
        {!isViewMode && (
          <Fragment>
            <FormLayout top={48} gap={24}>
              <InputDatepicker
                required
                disabled
                width={160}
                label={i18Project('TXT_ADDED_DATE')}
                error={!!errors.addedDate && touched.addedDate}
                errorMessage={errors.addedDate}
                value={values.addedDate}
                onChange={(date: Date | null) =>
                  setFieldValue('addedDate', date)
                }
              />
              <InputTextLabel
                required
                label={i18Project('TXT_MILESTONE')}
                placeholder={i18Project('PLH_MILESTONE_INPUT_TEXT')}
                error={(!!errors.name && touched.name) || milestoneNameError}
                errorMessage={
                  milestoneNameError
                    ? i18('MSG_FIELD_DUPLICATE', {
                        labelName: i18Project('TXT_MILESTONE'),
                      })
                    : errors.name
                }
                value={values.name}
                onChange={(e: EventInput) =>
                  setFieldValue('name', e.target.value)
                }
              />
              <InputDatepicker
                required
                label={i18Project('TXT_COMMITMENT_DELIVERY_DATE')}
                minDate={generalInfo.startDate}
                maxDate={generalInfo.endDate}
                error={
                  !!errors.commitmentDeliveryDate &&
                  touched.commitmentDeliveryDate
                }
                errorMessage={errors.commitmentDeliveryDate}
                value={values.commitmentDeliveryDate}
                onChange={(date: Date | null) =>
                  setFieldValue('commitmentDeliveryDate', date)
                }
              />
            </FormLayout>
            <FormLayout top={24}>
              <InputTextArea
                maxLength={255}
                label={i18('LB_DESCRIPTION') as string}
                placeholder={i18Project('PLH_DESCRIPTION_MILESTONE')}
                defaultValue={values.description}
                onChange={(e: EventInput) =>
                  setFieldValue('description', e.target.value)
                }
              />
            </FormLayout>
            <FormLayout top={24}>
              <InputCheckbox
                label={i18Project('TXT_COMPLETE_DELIVERING_MILESTONE')}
                checked={values.deliver === 2}
                onClick={() =>
                  setFieldValue('deliver', values.deliver === 2 ? 1 : 2)
                }
              />
            </FormLayout>
            {values.deliver === 2 && (
              <>
                <FormLayout top={24} gap={24}>
                  <InputDatepicker
                    required
                    width={180}
                    label={i18Project('TXT_ACTUAL_DELIVERY_DATE')}
                    error={
                      !!errors.actualDeliveryDate && touched.actualDeliveryDate
                    }
                    minDate={generalInfo.startDate}
                    maxDate={new Date()}
                    errorMessage={errors.actualDeliveryDate}
                    value={values.actualDeliveryDate}
                    onChange={(date: Date | null) =>
                      setFieldValue('actualDeliveryDate', date)
                    }
                  />
                  <InputTextArea
                    maxLength={255}
                    label={i18Project('TXT_LIMITATION') as string}
                    placeholder={i18Project('TXT_LIMITATION')}
                    defaultValue={values.limitation}
                    onChange={(e: EventInput) =>
                      setFieldValue('limitation', e.target.value)
                    }
                  />
                </FormLayout>
                <FormLayout top={24}>
                  <Box>
                    <Box className={classes.deliveryDecision}>
                      <InputTitle
                        required
                        removeMargin
                        title={i18Project('TXT_DELIVERY_DECISION')}
                        className={classes.title}
                      />
                      <InputRadioList
                        value={values.milestoneDecision}
                        listOptions={radioListOptions}
                        onChange={milestoneDecision =>
                          setFieldValue('milestoneDecision', milestoneDecision)
                        }
                      />
                    </Box>
                    {!!errors.milestoneDecision &&
                      touched.milestoneDecision && (
                        <InputErrorMessage
                          content={errors.milestoneDecision as string}
                        />
                      )}
                  </Box>
                </FormLayout>
              </>
            )}
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
  title: {
    width: '180px',
    marginRight: '24px',
  },
  deliveryDecision: {
    display: 'flex',
  },
}))

export default ModalDetailMilestone

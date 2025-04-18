import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import FormLayout from '@/components/Form/FormLayout'
import InputErrorMessage from '@/components/common/InputErrorMessage'
import InputTitle from '@/components/common/InputTitle'
import Modal from '@/components/common/Modal'
import StatusItem from '@/components/common/StatusItem'
import InputRadioList from '@/components/inputs/InputRadioList'
import InputTextArea from '@/components/inputs/InputTextArea'
import { NS_PROJECT } from '@/const/lang.const'
import { projectSelector } from '@/modules/project/reducer/project'
import { ProjectService } from '@/modules/project/services'
import { alertSuccess, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { EventInput } from '@/types'
import { formatDate, scrollToFirstErrorMessage } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
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
            <Box className={classes.label}>{i18Project('TXT_MILESTONE')}</Box>
            <Box className={classes.value}>{milestone.name}</Box>
          </Box>
          <Box className={classes.option}>
            <Box className={classes.label}>{i18Project('TXT_ADDED_DATE')}</Box>
            <Box className={classes.value}>
              {formatDate(milestone.addedDate)}
            </Box>
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
      </Box>
    </Box>
  )
}

interface ModalDeliverMilestoneProps {
  initMilestone: any
  onClose: () => void
  reloadApi: () => void
}

const ModalDeliveryMilestone = ({
  initMilestone,
  onClose,
  reloadApi,
}: ModalDeliverMilestoneProps) => {
  const classes = useStyles()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const { generalInfo } = useSelector(projectSelector)
  const { deliverMilestoneValidation } = useKPIValidation()
  const form = useFormik({
    initialValues: {
      actualDeliveryDate: initMilestone.actualDeliveryDate
        ? new Date(initMilestone.actualDeliveryDate)
        : null,
      limitation: initMilestone.limitation,
      milestoneDecision: '',
    } as MilestoneInitialValues,
    validationSchema: deliverMilestoneValidation,
    onSubmit: () => {
      setTimeout(() => {
        scrollToFirstErrorMessage()
      })
      deliverMilestone()
    },
  })
  const { values, errors, touched, setFieldValue } = form

  const deliverMilestone = () => {
    dispatch(updateLoading(true))
    ProjectService.deliverMilestone({
      projectId: params.projectId as string,
      milestoneId: initMilestone.id,
      request: {
        ...initMilestone,
        deliver: 2,
        actualDeliveryDate: values.actualDeliveryDate?.getTime() as number,
        limitation: values.limitation,
        milestoneDecision: values.milestoneDecision === '1' ? true : false,
      },
    })
      .then(() => {
        reloadApi()
        dispatch(
          alertSuccess({
            message: i18Project('MSG_DELIVERED', {
              labelName: `${i18Project('TXT_MILESTONE')} ${initMilestone.name}`,
            }),
          })
        )
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  return (
    <Modal
      open
      width={708}
      title={i18Project('TXT_DELIVER_MILESTONE')}
      useButtonCancel
      cancelOutlined
      useButtonDontSave
      onDontSave={onClose}
      onClose={onClose}
      onSubmit={() => form.handleSubmit()}
    >
      <form onSubmit={form.handleSubmit}>
        <ViewDetail milestone={initMilestone} />
        <FormLayout top={24} gap={24}>
          <InputDatepicker
            required
            width={180}
            label={i18Project('TXT_ACTUAL_DELIVERY_DATE')}
            error={!!errors.actualDeliveryDate && touched.actualDeliveryDate}
            minDate={generalInfo.startDate}
            maxDate={new Date()}
            errorMessage={errors.actualDeliveryDate}
            value={values.actualDeliveryDate}
            onChange={(date: Date | null) =>
              setFieldValue('actualDeliveryDate', date)
            }
          />
          <InputTextArea
            label={i18Project('TXT_LIMITATION') as string}
            placeholder={i18Project('TXT_LIMITATION')}
            maxLength={255}
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
            {!!errors.milestoneDecision && touched.milestoneDecision && (
              <InputErrorMessage content={errors.milestoneDecision as string} />
            )}
          </Box>
        </FormLayout>
      </form>
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

export default ModalDeliveryMilestone

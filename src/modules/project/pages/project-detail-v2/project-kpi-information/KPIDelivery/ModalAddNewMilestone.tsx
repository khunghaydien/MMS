import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import FormLayout from '@/components/Form/FormLayout'
import InputErrorMessage from '@/components/common/InputErrorMessage'
import InputTitle from '@/components/common/InputTitle'
import Modal from '@/components/common/Modal'
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
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import useKPIValidation from '../useKPIValidation'

export interface MilestoneInitialValues {
  name: string
  addedDate: Date | null
  commitmentDeliveryDate: Date | null
  description: string
  deliver: 1 | 2
  actualDeliveryDate: Date | null
  milestoneDecision: string
  limitation: string
}

interface ModalAddNewMilestoneProps {
  onClose: () => void
  onAddedSuccessfully: () => void
}
export const PASS = '1'
export const FAIL = '2'
export const radioListOptions = [
  {
    id: PASS,
    value: PASS,
    label: 'Pass',
  },
  {
    id: FAIL,
    value: FAIL,
    label: 'Fail',
  },
]
const ModalAddNewMilestone = ({
  onClose,
  onAddedSuccessfully,
}: ModalAddNewMilestoneProps) => {
  const classes = useStyles()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const { generalInfo } = useSelector(projectSelector)
  const { addNewMilestoneValidation } = useKPIValidation()

  const form = useFormik({
    initialValues: {
      name: '',
      addedDate: new Date(),
      commitmentDeliveryDate: null,
      description: '',
      deliver: 1,
      actualDeliveryDate: null,
      limitation: '',
      milestoneDecision: '',
    } as MilestoneInitialValues,
    validationSchema: addNewMilestoneValidation,
    onSubmit: () => {
      createMilestone()
    },
  })

  const { values, errors, touched, setFieldValue } = form

  const [milestoneNameError, setMilestoneNameError] = useState(false)

  const createMilestone = () => {
    dispatch(updateLoading(true))
    const todayMoreThanCommitmentDeliveryDate =
      new Date().getTime() -
        (values.commitmentDeliveryDate?.getTime() as number) >
      0
    const payload = {
      projectId: params.projectId as string,
      requestBody: {
        description: values.description,
        name: values.name.trim(),
        addedDate: values.addedDate?.getTime() as number,
        commitmentDeliveryDate:
          values.commitmentDeliveryDate?.getTime() as number,
        actualDeliveryDate:
          values.deliver === 2
            ? (values.actualDeliveryDate?.getTime() as number)
            : null,
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
    ProjectService.createMilestone(payload)
      .then(() => {
        onClose()
        onAddedSuccessfully()
        dispatch(
          alertSuccess({
            message: i18('MSG_ADDED', {
              labelName: `${i18Project('TXT_MILESTONE')} ${values.name}`,
            }),
          })
        )
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
      width={708}
      title={i18Project('TXT_ADD_NEW_MILESTONE')}
      onClose={onClose}
      onSubmit={() => form.handleSubmit()}
    >
      <Box className={classes.body}>
        <FormLayout gap={24}>
          <InputDatepicker
            required
            disabled
            width={160}
            label={i18Project('TXT_ADDED_DATE')}
            error={!!errors.addedDate && touched.addedDate}
            errorMessage={errors.addedDate}
            value={values.addedDate}
            onChange={(date: Date | null) => setFieldValue('addedDate', date)}
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
            onChange={(e: EventInput) => {
              setFieldValue('name', e.target.value)
              setMilestoneNameError(false)
            }}
          />
          <InputDatepicker
            required
            label={i18Project('TXT_COMMITMENT_DELIVERY_DATE')}
            minDate={generalInfo.startDate}
            maxDate={generalInfo.endDate}
            error={
              !!errors.commitmentDeliveryDate && touched.commitmentDeliveryDate
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
              setFieldValue('deliver', values.deliver === 2 ? 0 : 2)
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
                {!!errors.milestoneDecision && touched.milestoneDecision && (
                  <InputErrorMessage
                    content={errors.milestoneDecision as string}
                  />
                )}
              </Box>
            </FormLayout>
          </>
        )}
      </Box>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  body: {},
  title: {
    width: '180px',
    marginRight: '24px',
  },
  errorMessage: {
    marginTop: theme.spacing(1),
  },
  deliveryDecision: {
    display: 'flex',
  },
}))

export default ModalAddNewMilestone

import CardFormEdit from '@/components/Form/CardFormEdit'
import FormLayout from '@/components/Form/FormLayout'
import Modal from '@/components/common/Modal'
import LoadingSkeleton from '@/components/loading/LoadingSkeleton'
import { NS_PROJECT } from '@/const/lang.const'
import { COMPLAINT_LEVELS_LABELS } from '@/modules/project/const'
import { projectSelector } from '@/modules/project/reducer/project'
import { ProjectService } from '@/modules/project/services'
import { alertError, alertSuccess, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { ErrorResponse } from '@/types'
import { formatDate } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import { useFormik } from 'formik'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { ColTooltip } from '../../project-dashboard-detail/ProjectKPIInformationTable'
import FormAddComplaintItem from '../KPIBonusAndPenalty/FormAddComplaintItem'
import useKPIValidation from '../useKPIValidation'
import { BonusAndPenaltyQuestionItem } from './ModalBonusAndPenaltyEvaluation'

const ViewDetail = ({
  complaint,
}: {
  complaint: any
  onResolveSuccess: Function
}) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  return (
    <Box className={classes.RootViewDetail}>
      <Box className={classes.listFields}>
        <FormLayout gap={24}>
          <Box className={classes.option}>
            <Box className={classes.label}>
              {i18Project('TXT_COMPLAINT_NAME')}
            </Box>
            <Box className={classes.value}>{complaint.complaintName}</Box>
          </Box>
          <Box className={classes.option}>
            <Box className={classes.label}>
              {i18Project('TXT_COMPLAINT_DATE')}
            </Box>
            <Box className={classes.value}>
              {formatDate(complaint.complaintDate)}
            </Box>
          </Box>
          <Box className={classes.option}>
            <Box className={classes.label}>
              {i18Project('TXT_COMPLAINT_LEVEL')}
            </Box>
            <Box className={classes.value}>
              <ColTooltip
                resetBackground
                colName={COMPLAINT_LEVELS_LABELS[complaint.complaintLevel]}
                section={COMPLAINT_LEVELS_LABELS[complaint.complaintLevel]}
              />
            </Box>
          </Box>
        </FormLayout>
        <FormLayout gap={24}>
          <Box className={classes.option}>
            <Box className={classes.label}>
              {i18Project('TXT_PERSON_IN_CHARGE')}
            </Box>
            <Box className={classes.value}>{complaint.personInCharge.name}</Box>
          </Box>
          <Box className={classes.option}>
            <Box className={classes.label}>{i18Project('LB_ROLE')}</Box>
            <Box className={classes.value}>{complaint.picRole}</Box>
          </Box>
          <Box className={classes.option}>
            <Box className={classes.label}>
              {i18Project('TXT_RESOLVE_DEADLINE')}
            </Box>
            <Box className={classes.value}>
              {formatDate(complaint.resolveDeadline)}
            </Box>
          </Box>
          <Box className={classes.option}>
            <Box className={classes.label}>
              {i18Project('TXT_RESOLVE_DATE')}
            </Box>
            <Box className={classes.value}>
              {complaint.resolveDate ? formatDate(complaint.resolveDate) : '--'}
            </Box>
          </Box>
        </FormLayout>
        <FormLayout>
          <Box className={classes.option}>
            <Box className={classes.label}>{i18Project('TXT_ROOT_CAUSE')}</Box>
            <Box className={classes.value}>{complaint.rootCause || '--'}</Box>
          </Box>
        </FormLayout>
        <FormLayout gap={24}>
          <Box className={classes.option}>
            <Box className={classes.label}>{i18('LB_DESCRIPTION')}</Box>
            <Box className={classes.value}>{complaint.description || '--'}</Box>
          </Box>
        </FormLayout>

        <FormLayout>
          <Box className={classes.option}>
            <Box className={classes.label}>
              {i18Project('TXT_CORRECTIVE_ACTION')}
            </Box>
            <Box className={classes.value}>
              {complaint.correctiveAction || '--'}{' '}
            </Box>
          </Box>
        </FormLayout>
        <FormLayout>
          <Box className={classes.option}>
            <Box className={classes.label}>
              {i18Project('TXT_PREVENTIVE_ACTION')}
            </Box>
            <Box className={classes.value}>
              {complaint.preventiveAction || '--'}{' '}
            </Box>
          </Box>
        </FormLayout>
      </Box>
    </Box>
  )
}

interface ModalDetailComplaintItemProps {
  complaintId: number
  onClose: () => void
  openModalDeleteComplaint: (complaint: any) => void
  onSubmitSuccess: () => void
  evaluateId: number
}

const initValues: BonusAndPenaltyQuestionItem = {
  id: 1,
  complaint: false,
  complaintDate: null,
  complaintLevel: '',
  complaintName: '',
  correctiveAction: '',
  description: '',
  evaluateQuestionId: 0,
  note: '',
  personInCharge: {},
  picRole: '',
  point: '',
  preventiveAction: '',
  questionId: '',
  resolveDate: null,
  resolveDeadline: null,
  rootCause: '',
  bonusPenalty: '',
}

const ModalDetailComplaintItem = ({
  onClose,
  complaintId,
  openModalDeleteComplaint,
  onSubmitSuccess,
  evaluateId,
}: ModalDetailComplaintItemProps) => {
  const classes = useStyles()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const { nameCustomerComplaintProject, permissionProjectKPI } =
    useSelector(projectSelector)

  const [useDetailViewMode, setUseDetailViewMode] = useState(true)
  const [complaintTemp, setComplaintTemp] = useState(initValues)
  const [loading, setLoading] = useState(false)

  const { addComplaintValidation } = useKPIValidation({
    nameCustomerComplaintProject,
  })

  const form = useFormik({
    initialValues: initValues,
    validationSchema: addComplaintValidation,
    onSubmit: () => {
      updateCustomerComplaint()
    },
  })
  const { values, errors, touched, setFieldValue, setValues } = form

  const buttonSubmitDisabled = useMemo(() => {
    return JSON.stringify(complaintTemp) === JSON.stringify(values)
  }, [values, complaintTemp])

  const onCancel = () => {
    setUseDetailViewMode(true)
  }

  const onDelete = () => {
    openModalDeleteComplaint(values)
  }

  const onChange = (payload: { value: any; keyName: string }) => {
    setFieldValue(payload.keyName, payload.value)
  }

  const updateCustomerComplaint = () => {
    dispatch(updateLoading(true))
    const payload = {
      projectId: params.projectId as string,
      complaintId: values.id as number,
      evaluateId,
      requestBody: {
        complaint: true,
        complaintDate: values.complaintDate?.getTime(),
        complaintLevel: values.complaintLevel,
        correctiveAction: values.correctiveAction,
        description: values.description,
        complaintName: values.complaintName,
        personInCharge: values.personInCharge.id,
        picRole: values.picRole,
        point: values.point,
        preventiveAction: values.preventiveAction,
        resolveDeadline: values.resolveDeadline?.getTime(),
        resolveDate: values.resolveDate?.getTime(),
        rootCause: values.rootCause,
      },
    }
    ProjectService.updateCustomerComplaint(payload)
      .then(() => {
        getCustomerComplaintDetail()
        onSubmitSuccess()
        dispatch(
          alertSuccess({
            message: i18('MSG_UPDATE_SUCCESS', {
              labelName: complaintTemp.complaintName,
            }),
          })
        )
        setUseDetailViewMode(true)
      })
      .catch((errors: ErrorResponse[]) => {
        dispatch(
          alertError({
            message: errors?.[0]?.message,
          })
        )
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  const fillDataFromApi = (data: any) => {
    const _values: BonusAndPenaltyQuestionItem = {
      id: data.id,
      complaint: true,
      complaintName: data.name,
      complaintDate: new Date(data.complaintDate),
      personInCharge: {
        ...data.personInCharge,
        id: +data.personInCharge.id,
        value: +data.personInCharge.id,
        label: `${data.personInCharge.code} - ${data.personInCharge.name}`,
      },
      picRole: data.picRole,
      resolveDeadline: new Date(data.resolveDeadline),
      resolveDate: data.resolveDate ? new Date(data.resolveDate) : null,
      complaintLevel: data.complaintLevel.id,
      point: data.points,
      rootCause: data.rootCause,
      description: data.description,
      correctiveAction: data.correctiveAction,
      preventiveAction: data.preventiveAction,
      questionId: data.questionId,
      evaluateQuestionId: data.evaluateQuestionId,
    }
    setValues(_values)
    setComplaintTemp(_values)
  }

  const getCustomerComplaintDetail = () => {
    setLoading(true)
    ProjectService.getCustomerComplaintDetail({
      projectId: params.projectId as string,
      complaintId,
      evaluateId,
    })
      .then((res: AxiosResponse) => {
        fillDataFromApi(res.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getCustomerComplaintDetail()
  }, [])

  return (
    <Modal
      open
      hideFooter
      width={840}
      title={i18Project('TXT_CUSTOMER_COMPLAINT_DETAILS')}
      onClose={onClose}
    >
      <Box className={classes.body}>
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <Box className={classes.RootForm}>
            <Box className={classes.title}>{i18Project('TXT_COMPLAINT')}</Box>
            <Box className={classes.actions}>
              <CardFormEdit
                hideBorder
                buttonUseDetailEditDisabled={buttonSubmitDisabled}
                useDeleteMode={
                  useDetailViewMode &&
                  !!permissionProjectKPI.customerComplaintDelete
                }
                useDetailEditMode={!useDetailViewMode}
                useDetailViewMode={
                  useDetailViewMode &&
                  !!permissionProjectKPI.customerComplaintUpdate
                }
                onOpenEditMode={() => setUseDetailViewMode(false)}
                onCancelEditMode={onCancel}
                onOpenDeleteMode={onDelete}
                onSaveAs={() => form.handleSubmit()}
              />
            </Box>
            {useDetailViewMode && (
              <ViewDetail
                complaint={complaintTemp}
                onResolveSuccess={() => {
                  getCustomerComplaintDetail()
                  onSubmitSuccess()
                }}
              />
            )}
            {!useDetailViewMode && (
              <Box className={classes.boxComplaint}>
                <FormAddComplaintItem
                  complaint={values}
                  errors={errors}
                  touched={touched}
                  onChange={onChange}
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  body: {},
  RootForm: {
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
  RootViewDetail: {},
  listFields: {
    display: 'flex',
    gap: theme.spacing(2),
    flexDirection: 'column',
  },
  option: {
    width: 'max-content',
    minWidth: '200px',
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
  boxComplaint: {
    paddingTop: theme.spacing(6),
  },
}))

export default ModalDetailComplaintItem

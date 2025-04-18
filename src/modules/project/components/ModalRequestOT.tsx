import InputDatePicker from '@/components/Datepicker/InputDatepicker'
import FormItem from '@/components/Form/FormItem/FormItem'
import FormLayout from '@/components/Form/FormLayout'
import Modal from '@/components/common/Modal'
import InputCurrency from '@/components/inputs/InputCurrency'
import InputTextArea from '@/components/inputs/InputTextArea'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import SelectDivisionDirector from '@/components/select/SelectDivisionDirector'
import SelectMember from '@/components/select/SelectMember'
import SelectProject from '@/components/select/SelectProject'
import { LangConstant } from '@/const'
import { LIMIT_DEFAULT_SELECT, PAGE_CURRENT_DEFAULT } from '@/const/table.const'
import { projectSelector } from '@/modules/project/reducer/project'
import { getDivisionDirector } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { EventInput, OptionItem } from '@/types'
import { formatDate, scrollToFirstErrorMessage } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useFormik } from 'formik'
import { isEmpty } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  createOTRequest,
  getProjectDivisionStaff,
  getProjectManaged,
  getRequestOT,
  updateOTRequest,
  updateOTRequestStatus,
} from '../reducer/thunk'
import { ProjectState } from '../types'
import { convertPayloadRequestOT } from '../utils'
import useProjectValidation from '../utils/useProjectValidation'
import ModalReasonReject from './ModalReasonReject'
interface IProps {
  open: boolean
  onCloseModal: () => void
  onSubmitModal?: () => void
  disabled: boolean
  projectId?: string
  startDate?: any
  endDate?: any
  requestOTId?: string
}

const initialValues = {
  projectId: '',
  requestName: '',
  startDate: null,
  divisionDirector: {},
  branch: '',
  divisions: '',
  endDate: null,
  reason: '',
  members: [],
  hours: undefined,
}
const ModalRequestOT = ({
  open,
  onCloseModal,
  disabled,
  projectId,
  startDate,
  endDate,
  requestOTId,
  onSubmitModal,
}: IProps) => {
  const { t: i18nProject } = useTranslation(LangConstant.NS_PROJECT)
  const { modalRequestOT } = useProjectValidation()
  const dispatch = useDispatch<AppDispatch>()
  const [startDateError, setStartDateError] = useState(false)
  const [endDateError, setEndDateError] = useState(false)
  const { projectManaged, divisionStaff }: ProjectState =
    useSelector(projectSelector)
  const [projectOptions, setProjectOptions] = useState<OptionItem[]>([])
  const [branchOptions, setBranchOptionsOptions] = useState<OptionItem[]>([])
  const [divisionOptions, setDivisionOptions] = useState<OptionItem[]>([])
  const [requestOTInfo, setRequestOTInfo] = useState<any>(undefined)
  const [loading, setLoading] = useState<boolean>(false)
  const [isViewDetail, setViewDetail] = useState(false)
  const [loadingDivisionDirector, setLoadingDivisionDirector] = useState(false)
  const [currentProjectStartDate, setCurrentProjectStartDate] = useState<
    Date | number | null
  >(null)
  const [currentProjectEndDate, setCurrentProjectEndDate] = useState<
    Date | number | null
  >(null)
  const [requestOTStatus, setRequestOTStatus] = useState<number | null>(null)
  const [requestOTSumittedDate, setRequestOTSumittedDate] = useState<string>('')
  const [requestOTResultDate, setRequestOTResultDate] = useState<string>('')
  const [isShowConfirmReject, setIsShowConfirmReject] = useState(false)
  const REQUEST_OT_STATUS = {
    IN_PROGRESS: 1,
    APPROVED: 2,
    REJECTED: 3,
  }
  const classes = useStyles()
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: modalRequestOT,
    onSubmit: (values: any, actions) => {
      scrollToFirstErrorMessage()
      !open &&
        actions.resetForm({
          values: initialValues,
        })
      onSubmit(values)
    },
  })
  const labelSubmit = useMemo(() => {
    if (!isViewDetail) return String(i18nProject('LB_REQUEST_OT'))
    else {
      if (requestOTInfo?.canUpdate) return String(i18nProject('LB_UPDATE'))
      if (requestOTInfo?.canApprove) return String(i18nProject('LB_APPROVE_OT'))
    }
  }, [isViewDetail, requestOTInfo?.canUpdate])

  const isHideFooter = useMemo(() => {
    if (
      isViewDetail &&
      !requestOTInfo?.canReject &&
      !requestOTInfo?.canReject &&
      !requestOTInfo?.canUpdate
    )
      return true
    else return false
  }, [requestOTStatus])

  useEffect(() => {
    if (requestOTId) {
      setLoading(true)
      dispatch(getRequestOT(requestOTId))
        .unwrap()
        .then((res: any) => {
          setRequestOTInfo(res.data)
        })
        .finally(() => setLoading(false))
    }
  }, [requestOTId])

  const formatOptionValue = (value: any) => {
    return {
      id: value?.id,
      description: value?.email,
      code: value?.code,
      label: value?.name,
      value: value?.id,
    }
  }

  const disabledForm = useMemo(() => {
    if ((requestOTInfo?.canUpdate && isViewDetail) || !isViewDetail)
      return false
    else return true
  }, [requestOTStatus])

  useEffect(() => {
    if (requestOTId) {
      setViewDetail(true)
      if (requestOTInfo?.project?.id) {
        const project = formatOptionValue(requestOTInfo.project)
        setProjectOptions([project])
        formik.setFieldValue('projectId', project.id)
      }
      if (requestOTInfo?.divisionDirector?.id) {
        formik.setFieldValue('divisionDirector', {
          id: requestOTInfo?.divisionDirector.id.toString(),
          value: requestOTInfo?.divisionDirector.id.toString(),
          label: requestOTInfo?.divisionDirector.name,
          description: requestOTInfo?.divisionDirector.email,
        })
        if (requestOTInfo?.divisionDirector?.branch?.id) {
          const branch = formatOptionValue(
            requestOTInfo.divisionDirector.branch
          )
          setBranchOptionsOptions([branch])
          formik.setFieldValue('branchId', branch.id)
        }
        if (requestOTInfo?.divisionProject?.id) {
          const division = {
            id: requestOTInfo?.divisionProject?.id,
            label: requestOTInfo?.divisionProject?.name,
            value: requestOTInfo?.divisionProject?.id,
          }
          setDivisionOptions([division])
          formik.setFieldValue('divisionId', division.id)
        }
      }
      if (requestOTInfo?.members?.length !== 0) {
        const members = requestOTInfo?.members.map((item: any) => {
          return {
            description: item?.email,
            id: item?.id,
            label: item?.name,
            value: item?.id,
          }
        })
        formik.setFieldValue('members', members)
      }
      setRequestOTStatus(requestOTInfo?.status?.id)
      formik.setFieldValue('startDate', new Date(requestOTInfo?.startDate))
      formik.setFieldValue('endDate', new Date(requestOTInfo?.endDate))
      formik.setFieldValue('reason', requestOTInfo?.reason)
      formik.setFieldValue('hours', requestOTInfo?.hours)
      formik.setFieldValue('requestName', requestOTInfo?.requestName || '')
      formik.setFieldValue('reasonReject', requestOTInfo?.reasonReject)
      setRequestOTResultDate(formatDate(requestOTInfo?.approveDate))
      setRequestOTSumittedDate(formatDate(requestOTInfo?.createDate))
    }
  }, [requestOTInfo, requestOTStatus])

  const onSubmit = async (values: any) => {
    if (isViewDetail && requestOTId) {
      if (requestOTInfo?.canUpdate && isEmpty(formik.errors)) {
        await dispatch(
          updateOTRequest({
            id: parseInt(requestOTId),
            data: convertPayloadRequestOT(values),
          })
        )
      } else {
        await dispatch(
          updateOTRequestStatus({
            id: parseInt(requestOTId),
            status: 2,
          })
        )
      }
      onCloseModal()
      !!onSubmitModal && onSubmitModal()
    }
    if (!isViewDetail && isEmpty(formik.errors)) {
      dispatch(createOTRequest(convertPayloadRequestOT(values)))
        .unwrap()
        .then(() => {
          onCloseModal()
          !!onSubmitModal && onSubmitModal()
        })
    }
  }
  const handleClose = () => {
    onCloseModal()
    formik.resetForm({
      values: initialValues,
    })
  }
  const handleStartDateChange = useCallback((value: any) => {
    formik.setFieldValue('startDate', value)
  }, [])

  const startDateErrorMessage = useMemo(() => {
    if (startDateError || endDateError) {
      if (
        formik.values.startDate &&
        formik.values.endDate &&
        formik.values.startDate > formik.values.endDate
      ) {
        return i18nProject('MSG_INVALID_START_DATE_RANGE_REQUEST_OT') as string
      } else {
        return i18nProject('MSG_REQUEST_OT_START_DATE_INVALID') as string
      }
    } else {
      return !!formik.touched.startDate ? formik.errors.startDate : ''
    }
  }, [
    startDateError,
    formik.touched.startDate,
    formik.errors.startDate,
    formik.values.startDate,
    formik.values.endDate,
  ])

  const compareStartDateWithEndDate = useMemo(() => {
    if (!formik.values.startDate || !formik.values.endDate) return false
    return formik.values.startDate > formik.values.endDate
  }, [formik.values.startDate, formik.values.endDate])

  const handleEndDateChange = useCallback((value: any) => {
    formik.setFieldValue('endDate', value)
  }, [])
  const handleRequestOTMemberChange = (value: any) => {
    formik.setFieldValue('members', value)
  }
  const handleProjectChange = (value: any) => {
    formik.setFieldValue('projectId', value)
    formik.setFieldValue('divisionId', '')
    formik.setFieldValue('branchId', '')
    formik.setFieldValue('divisionDirector', '')
  }
  const handleBranchChange = (value: any) => {
    formik.setFieldValue('branchId', value)
  }
  const handleDivisionChange = (value: any) => {
    formik.setFieldValue('divisionId', value)
  }
  const handleDivisionDirectorChange = (value: any) => {
    formik.setFieldValue('divisionDirector', value)
  }
  const handleRequestName = useCallback((e: EventInput, keyName?: string) => {
    const value = e.target.value
    formik.setFieldValue('requestName' || '', value)
  }, [])
  useEffect(() => {
    const project = projectManaged.find(
      (item: any) =>
        item.project?.id?.toString() === formik.values?.projectId?.toString()
    )
    let branchOptions: OptionItem[] = []
    let divisionOptions: OptionItem[] = []
    if (project) {
      const endDate = project.project.endDate
        ? new Date(project.project.endDate)
        : null
      const startDate = project.project.startDate
        ? new Date(project.project.startDate)
        : null
      setCurrentProjectEndDate(endDate)
      setCurrentProjectStartDate(startDate)
      pushItem(branchOptions, project, 'branch')
      pushItem(divisionOptions, project, 'division')
      setBranchOptionsOptions(branchOptions)
      setDivisionOptions(divisionOptions)
      formik.setFieldValue('branchId', project.branch.id)
      formik.setFieldValue('divisionId', project.division.id)
    }
  }, [formik.values.projectId, projectManaged, divisionStaff])

  useEffect(() => {
    dispatch(getProjectManaged())
    if (projectId) {
      handleProjectChange(projectId)
    }
  }, [])

  useEffect(() => {
    if (formik.values.divisionId)
      dispatch(getProjectDivisionStaff(formik.values.divisionId))
  }, [formik.values.divisionId])

  const pushItem = (optionsArray: any, item: any, type: any) => {
    optionsArray.push({
      id: item[type].id,
      description: item[type].email,
      code: item[type].code,
      label: item[type].name,
      value: item[type].id,
    })
  }

  useEffect(() => {
    let projectOptions: OptionItem[] = []
    projectManaged.forEach((item: any) => {
      pushItem(projectOptions, item, 'project')
    })
    setProjectOptions(projectOptions)
  }, [projectManaged])

  const handleReject = () => {
    if (requestOTId) {
      setIsShowConfirmReject(true)
    }
  }
  const btnSubmitColor = useMemo(() => {
    if (isViewDetail && requestOTStatus === REQUEST_OT_STATUS.APPROVED)
      return 'success'
  }, [isViewDetail])

  useEffect(() => {
    const _params = {
      pageNum: PAGE_CURRENT_DEFAULT,
      pageSize: LIMIT_DEFAULT_SELECT,
      sortBy: 'name',
      orderBy: 'asc',
      divisionId: formik.values.divisionId,
      branchId: formik.values.branchId,
    }
    if (formik.values.divisionId && formik.values.branchId && !disabledForm) {
      setLoadingDivisionDirector(true)
      dispatch(getDivisionDirector({ ..._params }))
        .unwrap()
        .then(res => {
          if (!requestOTId)
            formik.setFieldValue('divisionDirector', {
              id: res?.data?.content[0].id.toString(),
              value: res?.data?.content[0].id.toString(),
              label: res?.data?.content[0].name,
              description: res?.data?.content[0].email,
            })
        })
        .finally(() => setLoadingDivisionDirector(false))
    }
  }, [
    formik.values.divisionId,
    formik.values.branchId,
    formik.values.projectId,
  ])

  useEffect(() => {
    if (endDate) setCurrentProjectEndDate(endDate)
    if (startDate) setCurrentProjectStartDate(startDate)
  }, [startDate, endDate])

  const subTitle = (
    <Box>
      {i18nProject('LB_STATUS')}
      <span
        className={clsx(
          requestOTStatus === REQUEST_OT_STATUS.APPROVED
            ? classes.approved
            : requestOTStatus === REQUEST_OT_STATUS.REJECTED
            ? classes.rejected
            : classes.inProgress
        )}
      >
        {requestOTStatus === REQUEST_OT_STATUS.APPROVED
          ? i18nProject('LB_APPROVED_OT')
          : requestOTStatus === REQUEST_OT_STATUS.REJECTED
          ? i18nProject('LB_REJECTED_OT')
          : i18nProject('LB_WAIT_DICISION')}
      </span>
    </Box>
  )
  return (
    <>
      <Modal
        width={660}
        loading={loading}
        open={open}
        title={i18nProject('TXT_REQUEST_OT_FORM')}
        fontSizeTitle={22}
        subTitle={isViewDetail ? subTitle : null}
        labelSubmit={labelSubmit}
        onClose={handleClose}
        onSubmit={formik.handleSubmit}
        isButtonCustom={isViewDetail && requestOTInfo?.canReject}
        onSubmitCustom={handleReject}
        labelButtonCustom={String(i18nProject('LB_REJECT_OT'))}
        colorButtonCustom={'error'}
        colorButtonSubmit={btnSubmitColor}
        isBtnHorizontal={
          isViewDetail && requestOTInfo?.canApprove && requestOTInfo?.canReject
        }
        hideFooter={isHideFooter || loading}
        colorModal="inherit"
      >
        <form onSubmit={formik.handleSubmit}>
          <Box className={clsx(classes.listFields, 'scrollbar')}>
            {requestOTStatus && (
              <Box className={clsx(classes.flex, classes.flexSpaceBetween)}>
                <Box>
                  Created Date:{' '}
                  <span className={classes.fontWeight700}>
                    {requestOTSumittedDate}
                  </span>
                </Box>
                <Box>
                  {requestOTStatus === REQUEST_OT_STATUS.APPROVED
                    ? 'Approved Dated: '
                    : requestOTStatus === REQUEST_OT_STATUS.REJECTED
                    ? 'Rejected Date: '
                    : 'Approved/Rejected Date: '}{' '}
                  <span className={classes.fontWeight700}>
                    {requestOTResultDate
                      ? requestOTResultDate
                      : i18nProject('LB_WAIT_DICISION')}
                  </span>
                </Box>
              </Box>
            )}
            <FormLayout top={24} gap={24}>
              <SelectProject
                required
                disabled={disabled || disabledForm}
                label={i18nProject('LB_SELECT_PROJECT')}
                error={
                  formik.touched.projectId && Boolean(formik.errors.projectId)
                }
                errorMessage={
                  formik.touched.projectId && formik.errors.projectId
                }
                value={formik.values.projectId}
                onChange={handleProjectChange}
                projectManaged={projectOptions}
              />
            </FormLayout>
            <FormLayout top={24} gap={24}>
              <SelectProject
                required
                disabled={true}
                label={i18nProject('LB_RESPONSIBLE_BRANCH')}
                error={
                  formik.touched.branchId && Boolean(formik.errors.branchId)
                }
                errorMessage={formik.touched.branchId && formik.errors.branchId}
                value={formik.values.branchId}
                onChange={handleBranchChange}
                projectManaged={branchOptions}
              />
              <SelectProject
                required
                disabled={true}
                label={i18nProject('LB_PARTICIPATE_DIVISION')}
                error={
                  formik.touched.divisionId && Boolean(formik.errors.divisionId)
                }
                errorMessage={
                  formik.touched.divisionId && formik.errors.divisionId
                }
                value={formik.values.divisionId}
                onChange={handleDivisionChange}
                projectManaged={divisionOptions}
              />
            </FormLayout>
            <FormLayout top={24} gap={24}>
              <SelectDivisionDirector
                required
                disabled={disabled || disabledForm}
                label={i18nProject('LB_DIVISION_DIRECTOR')}
                error={
                  formik.touched.divisionDirector &&
                  Boolean(formik.errors.divisionDirector)
                }
                errorMessage={
                  String(formik.touched.divisionDirector) &&
                  String(formik.errors.divisionDirector)
                }
                value={formik.values.divisionDirector}
                onChange={handleDivisionDirectorChange}
                divisionId={formik.values.divisionId}
                loadingDivisionDirector={loadingDivisionDirector}
                branchId={formik.values.branchId}
                numberEllipsis={35}
              />
            </FormLayout>
            <FormLayout top={24} gap={24}>
              <InputTextLabel
                required
                name="requestName"
                disabled={disabled || disabledForm}
                label={i18nProject('LB_REQUEST_NAME')}
                placeholder={i18nProject('PLH_REQUEST_NAME')}
                error={
                  formik.touched.requestName &&
                  Boolean(formik.errors.requestName)
                }
                errorMessage={
                  formik.touched.requestName && formik.errors.requestName
                }
                value={formik.values.requestName}
                onChange={handleRequestName}
                maxLength={500}
              />
            </FormLayout>
            {requestOTInfo?.createdBy?.name && (
              <FormLayout top={24} gap={24}>
                <InputTextLabel
                  name="creatorName"
                  disabled
                  label={i18nProject('LB_CREATOR_NAME')}
                  value={requestOTInfo?.createdBy?.name}
                  onChange={handleRequestName}
                />
              </FormLayout>
            )}
            <FormLayout gap={24} top={24}>
              <InputDatePicker
                required
                isShowClearIcon={!disabled}
                disabled={disabled || disabledForm}
                label={i18nProject('LB_REQUEST_OT_START_DATE')}
                maxDate={formik.values.endDate || currentProjectEndDate}
                minDate={currentProjectStartDate}
                value={formik.values.startDate}
                width={'100%'}
                onChange={handleStartDateChange}
                error={
                  (formik.touched.startDate &&
                    Boolean(formik.errors.startDate)) ||
                  startDateError
                }
                errorMessage={startDateErrorMessage}
                onError={(error: string | null) => setStartDateError(!!error)}
              />

              <InputDatePicker
                required
                isShowClearIcon={!disabled}
                disabled={disabled || disabledForm}
                label={i18nProject('LB_REQUEST_OT_END_DATE')}
                width={'100%'}
                error={
                  (formik.touched.endDate && Boolean(formik.errors.endDate)) ||
                  endDateError
                }
                errorMessage={
                  endDateError
                    ? compareStartDateWithEndDate
                      ? ''
                      : (i18nProject('MSG_PROJECT_END_DATE_INVALID') as string)
                    : !!formik.touched.endDate
                    ? formik.errors.endDate
                    : ''
                }
                minDate={formik.values.startDate || currentProjectStartDate}
                maxDate={currentProjectEndDate}
                value={formik.values.endDate}
                onChange={handleEndDateChange}
                onError={(error: string | null) => setEndDateError(!!error)}
              />
            </FormLayout>
            <FormLayout top={24}>
              <FormItem
                label={i18nProject('LB_REQUEST_REASON')}
                error={formik.touched.reason && !!formik.errors.reason}
                errorMessage={formik.errors.reason}
              >
                <InputTextArea
                  disabled={disabled || disabledForm}
                  placeholder={
                    disabled || disabledForm
                      ? ''
                      : i18nProject('PLH_REQUEST_REASON')
                  }
                  name="reason"
                  defaultValue={formik.values.reason}
                  onChange={(e: any) => {
                    formik.setFieldValue('reason', e.target.value || '')
                  }}
                  error={formik.touched.reason && !!formik.errors.reason}
                />
              </FormItem>
            </FormLayout>
            <FormLayout gap={24} top={24}>
              <SelectMember
                disabled={disabledForm}
                required
                error={formik.touched.members && Boolean(formik.errors.members)}
                errorMessage={formik.errors.members as string}
                value={formik.values.members}
                projectId={formik.values.projectId}
                label={i18nProject('LB_SELECTED_OT_MEMBER')}
                onChange={handleRequestOTMemberChange}
              />
            </FormLayout>
            <FormLayout top={24} gap={24}>
              <InputCurrency
                maxLength={4}
                required
                disabled={disabledForm}
                label={i18nProject('LB_ESTIMATED_OT_HOURS')}
                value={formik.values.hours}
                error={formik.touched.hours && Boolean(formik.errors.hours)}
                errorMessage={formik.touched.hours && formik.errors.hours}
                onChange={(value: any) => {
                  formik.setFieldValue('hours', value)
                }}
              />
            </FormLayout>
            {requestOTInfo?.canUpdate && (
              <FormLayout top={24}>
                <FormItem
                  required={true}
                  label={i18nProject('LB_REJECT_REASON')}
                  errorMessage={'Reject Reason must has input'}
                >
                  <InputTextArea
                    name="reason"
                    disabled
                    defaultValue={formik.values.reasonReject}
                  />
                </FormItem>
              </FormLayout>
            )}
          </Box>
        </form>
      </Modal>
      {isShowConfirmReject && (
        <ModalReasonReject
          onClose={() => {
            setIsShowConfirmReject(false)
          }}
          onCloseModalRequestOT={() => onCloseModal()}
          requestOTId={requestOTId}
        />
      )}
    </>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  listFields: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    overflowX: 'hidden',
    gap: '4px',
    paddingRight: theme.spacing(1),
  },
  flexSpaceBetween: {
    justifyContent: 'space-between',
  },
  flex: {
    display: 'flex',
    gap: theme.spacing(3),
  },
  boxFormItem: {
    display: 'flex',
    paddingBottom: theme.spacing(2),
  },
  fullWidth: {
    padding: theme.spacing(1, 1),
    width: '100%',
  },
  halfWidth: {
    width: '50%',
  },
  formItem: {
    width: 'unset !important',
  },
  widthInput: {
    width: '260px',
  },
  modalFooter: {
    padding: theme.spacing(2, 3),
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(2),
    background: theme.color.grey.tertiary,
  },
  buttonCancel: {
    padding: theme.spacing(1, 2),
    cursor: 'pointer',
    color: `${theme.color.black.secondary} !important`,
  },
  btnSubmit: {
    width: 'max-content !important',
  },
  currencyInput: {
    '& .currency-input:disabled': {
      color: '#5d5f60',
    },
  },
  textContent: {
    padding: theme.spacing(0.5, 1.5),
    border: `1px solid ${theme.color.grey.secondary}`,
    borderRadius: theme.spacing(0.5),
    minHeight: theme.spacing(5),
    lineHeight: 1.6,
    display: 'flex',
    alignItems: 'center',
  },
  textArea: {
    height: theme.spacing(19.25),
    minHeight: theme.spacing(19.25),
    overflow: 'auto',
    wordBreak: 'break-word',
    alignItems: 'start !important',
  },
  uploadFilesBox: {
    marginTop: '0 !important',
  },
  inProgress: {
    color: '#17469F',
  },
  approved: {
    color: '#58B984',
  },
  rejected: {
    color: '#E41D1D',
  },
  fontWeight700: {
    fontWeight: '700',
  },
}))
export default ModalRequestOT

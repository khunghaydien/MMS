import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import CardFormEdit from '@/components/Form/CardFormEdit'
import InputCurrency from '@/components/inputs/InputCurrency'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputTextArea from '@/components/inputs/InputTextArea'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import LoadingSkeleton from '@/components/loading/LoadingSkeleton'
import DialogBox from '@/components/modal/DialogBox'
import ModalConfirm from '@/components/modal/ModalConfirm'
import SelectAllDivisions from '@/components/select/SelectAllDivisions'
import SelectBranch from '@/components/select/SelectBranch'
import SelectCustomer from '@/components/select/SelectCustomer'
import SelectDivisionSingle from '@/components/select/SelectDivisionSingle'
import SelectPartner from '@/components/select/SelectPartner'
import SelectProjectManager from '@/components/select/SelectProjectManager'
import SelectSaleMember from '@/components/select/SelectSaleMember'
import SelectService from '@/components/select/SelectService'
import { LangConstant } from '@/const'
import { MODULE_PROJECT_CONST } from '@/const/app.const'
import { useCallbackPrompt } from '@/hooks/useCallbackPrompt'
import {
  PRODUCT_TYPES_OPTIONS,
  PROJECT_RANK_OPTIONS,
  PROJECT_TYPES,
} from '@/modules/project/const'
import {
  projectSelector,
  setGeneralInfo,
} from '@/modules/project/reducer/project'
import {
  projectGeneralValidate,
  updateProjectGeneral,
} from '@/modules/project/reducer/thunk'
import { IGeneralProjectState, ProjectState } from '@/modules/project/types'
import { convertPayloadGeneralUpdate } from '@/modules/project/utils'
import useProjectValidation from '@/modules/project/utils/useProjectValidation'
import { AuthState, selectAuth } from '@/reducer/auth'
import { CommonState, commonSelector, getAllDivisions } from '@/reducer/common'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { EventInput, OptionItem } from '@/types'
import { formatDate, formatNumber, scrollToFirstErrorMessage } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { projectStatus } from '../../project-list/instance'

const getBasicInformation = (general: IGeneralProjectState) => {
  return {
    name: general.name,
    startDate: general.startDate,
    endDate: general.endDate,
    projectType: general.projectType,
    projectManager: general.projectManager,
    branchId: general.branchId,
    divisionId: general.divisionId,
    technologies: general.technologies,
    subProjectManagers: general.subProjectManagers,
    productType: general.productType,
    customer: general.customer,
    partners: general.partners,
    amSale: general.amSale,
    status: general.status,
    subCustomer: general.subCustomer,
    projectRank: general.projectRank,
    billableMM: general.billableMM,
    businessDomain: general.businessDomain,
    description: general.description,
  }
}

const ProjectBasicInformation = () => {
  const classes = useStyles()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)
  const { generalInfo, updateGeneralInfo }: ProjectState =
    useSelector(projectSelector)
  const { allDivisions, listBranches }: CommonState =
    useSelector(commonSelector)
  const { permissions, staff, role }: AuthState = useSelector(selectAuth)

  const [useEditMode, setUseEditMode] = useState(false)
  const [startDateError, setStartDateError] = useState(false)
  const [endDateError, setEndDateError] = useState(false)
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false)
  const [isNameExisted, setIsNameExisted] = useState(false)
  const [isDisableDivision, setIsDisableDivision] = useState(false)
  const [divisionsLoading, setDivisionsLoading] = useState(false)

  const informationList = [
    {
      id: 'projectName',
      label: i18Project('LB_PROJECT_NAME'),
      value: generalInfo.name,
    },
    {
      id: 'projectCode',
      label: i18Project('LB_PROJECT_CODE'),
      value: generalInfo.code,
    },
    {
      id: 'projectRank',
      label: i18Project('LB_PROJECT_RANK'),
      value: PROJECT_RANK_OPTIONS.find(
        (rank: OptionItem) => rank.value === generalInfo.projectRank
      )?.label,
    },
    {
      id: 'billableMM',
      label: i18Project('LB_BILLABLE_MM'),
      value: formatNumber(generalInfo.billableMM),
    },
    {
      id: 'startDate',
      label: i18Project('LB_PROJECT_START_DATE'),
      value: formatDate(generalInfo.startDate as Date),
    },
    {
      id: 'endDate',
      label: i18Project('LB_PROJECT_END_DATE'),
      value: formatDate(generalInfo.endDate as Date),
    },
    {
      id: 'projectType',
      label: i18Project('LB_PROJECT_TYPE'),
      value: PROJECT_TYPES.find(
        (type: any) => type.value == generalInfo.projectType
      )?.label,
    },
    {
      id: 'projectManager',
      label: i18('LB_PROJECT_MANAGER'),
      value: generalInfo.projectManager.label,
    },
    {
      id: 'branch',
      label: i18('LB_BRANCH'),
      value: listBranches.find(
        (branch: any) => branch.value === generalInfo.branchId
      )?.label,
    },
    {
      id: 'divisions',
      label: i18('LB_DIVISION'),
      value: allDivisions.find(
        division => division.value === generalInfo.divisionId
      )?.label,
    },
    {
      id: 'subCustomer',
      label: i18Project('LB_SUB_CUSTOMER'),
      value: allDivisions.find(
        division => division.value === generalInfo.subCustomer
      )?.label,
    },
    {
      id: 'technologies',
      label: i18('LB_TECHNOLOGY'),
      value: generalInfo.technologies
        .map(tech => tech.label || tech.name)
        .join(', '),
    },
    {
      id: 'subProjectManagers',
      label: i18Project('LB_PROJECT_SUB_MANAGER'),
      value: generalInfo.subProjectManagers.map(pjm => pjm.label).join(', '),
    },
    {
      id: 'productType',
      label: i18Project('LB_PRODUCT_TYPE'),
      value: PRODUCT_TYPES_OPTIONS.find(
        (productType: any) => productType.value === generalInfo.productType
      )?.label,
    },
    {
      id: 'customer',
      label: i18('LB_CUSTOMER'),
      value: generalInfo.customer.name,
    },
    {
      id: 'outsource',
      label: i18Project('LB_OUTSOURCE'),
      value: generalInfo.partners.map(pn => pn.name).join(', '),
    },
    {
      id: 'amSale',
      label: i18Project('LB_AM_SALE'),
      value: generalInfo.amSale?.label,
    },
    {
      id: 'status',
      label: i18Project('LB_PROJECT_STATUS'),
      value: projectStatus.find(
        (status: any) => status.value === generalInfo.status
      )?.label,
    },
    {
      id: 'businessDomain',
      label: i18Project('LB_BUSINESS_DOMAIN'),
      value: generalInfo.businessDomain,
    },
    {
      id: 'description',
      label: i18('LB_DESCRIPTION'),
      value: generalInfo.description,
    },
  ]

  const { updateProjectBasicValidation } = useProjectValidation()
  const form = useFormik({
    initialValues: generalInfo,
    validationSchema: updateProjectBasicValidation,
    onSubmit: () => {
      if (endDateError || isNameExisted) return
      setShowUpdateConfirm(true)
    },
  })
  const { values, setFieldValue, errors, touched, setValues } = form

  const nameError = (touched.name && !!errors.name) || isNameExisted

  const nameErrorMessage = isNameExisted
    ? (i18Project('MSG_FIELD_EXISTED', {
        name: i18Project('LB_PROJECT_NAME'),
      }) as string)
    : touched.name
    ? errors.name
    : ''

  const checkIsSubProjectManager = useMemo(() => {
    const subPm = values.subProjectManagers
    const staffId = staff?.id
    const isCheckSubPm = subPm.some(
      (subManager: any) => subManager.id === staffId?.toString()
    )
    return isCheckSubPm
  }, [values.projectManager?.id])

  const formDisabled = useMemo(() => {
    if (!params.projectId || checkIsSubProjectManager) return false
    return !permissions.useProjectUpdateGeneralInfo || !updateGeneralInfo
  }, [
    permissions.useProjectUpdateGeneralInfo,
    updateGeneralInfo,
    checkIsSubProjectManager,
  ])

  const startDateErrorMessage = useMemo(() => {
    if (startDateError || endDateError) {
      if (
        values.startDate &&
        values.endDate &&
        values.startDate > values.endDate
      ) {
        return i18Project('MSG_INVALID_START_DATE_RANGE') as string
      } else {
        return i18Project('MSG_PROJECT_START_DATE_INVALID') as string
      }
    } else {
      return !!touched.startDate ? errors.startDate : ''
    }
  }, [
    startDateError,
    touched.startDate,
    errors.startDate,
    values.startDate,
    values.endDate,
  ])

  const compareStartDateWithEndDate = useMemo(() => {
    if (!values.startDate || !values.endDate) return false
    return values.startDate > values.endDate
  }, [values.startDate, values.endDate])

  const dataHasChanged = useMemo(() => {
    return (
      JSON.stringify(getBasicInformation(values)) !==
      JSON.stringify(getBasicInformation(generalInfo))
    )
  }, [values, generalInfo])

  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(dataHasChanged)

  const onProjectNameChange = (e: EventInput) => {
    setFieldValue('name', e.target.value)
    setIsNameExisted(false)
  }

  const onProjectDateChange = (value: Date | null, field: string) => {
    setFieldValue(field, value)
  }
  const onSingleDropdownChange = (
    value: string,
    _?: OptionItem,
    field?: string
  ) => {
    setFieldValue(field as string, value)
    if (field === 'branchId') {
      setFieldValue('divisionId', '')
    }
  }

  const onDivisionChange = (option: OptionItem) => {
    setFieldValue('divisionId', option?.id)
  }

  const validateProjectName = () => {
    dispatch(
      projectGeneralValidate({
        requestBody: [
          {
            fieldName: 'name',
            value: values.name,
          },
        ],
      })
    )
      .unwrap()
      .then(() => {
        form.handleSubmit()
      })
      .catch(() => {
        setIsNameExisted(true)
      })
  }

  const onCancel = () => {
    setUseEditMode(false)
    setIsNameExisted(false)
    form.resetForm({
      values: generalInfo,
    })
  }

  const onUpdateGeneralInformation = () => {
    dispatch(updateLoading(true))
    const data = convertPayloadGeneralUpdate(values)
    dispatch(updateProjectGeneral({ projectId: params.projectId || '', data }))
      .unwrap()
      .then(() => {
        setIsNameExisted(false)
        setUseEditMode(false)
        dispatch(setGeneralInfo(values))
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  const clickSubmit = () => {
    if (values.name !== generalInfo.name) {
      validateProjectName()
    } else {
      form.handleSubmit()
    }
    setTimeout(() => {
      scrollToFirstErrorMessage()
    })
  }

  useEffect(() => {
    const roleAutoCreateDivision = ['HRM', 'Division Director']
    role.some((roleItem: any) => {
      if (roleAutoCreateDivision.includes(roleItem?.name)) {
        setIsDisableDivision(true)
      }
    })
    if (staff) {
      const currentSubProjectManager = values.subProjectManagers.find(
        (item: any) => item.id === staff?.id.toString()
      )
      if (
        currentSubProjectManager ||
        values.projectManager?.id === staff?.id?.toString()
      ) {
        setIsDisableDivision(true)
      }
    }
  }, [staff, values.subProjectManagers, values.projectManager])

  useEffect(() => {
    setValues(generalInfo)
  }, [generalInfo])

  useEffect(() => {
    if (!allDivisions.length) {
      setDivisionsLoading(true)
      dispatch(getAllDivisions())
        .unwrap()
        .finally(() => {
          setDivisionsLoading(false)
        })
    }
  }, [allDivisions])

  return (
    <Fragment>
      <CardFormEdit
        title={i18Project('TXT_BASIC_INFORMATION') as string}
        buttonUseDetailEditDisabled={!dataHasChanged}
        useDetailEditMode={useEditMode}
        useDetailViewMode={!useEditMode && !formDisabled}
        onOpenEditMode={() => setUseEditMode(true)}
        onCancelEditMode={onCancel}
        onSaveAs={clickSubmit}
      >
        {useEditMode && (
          <Box className={classes.listFieldsViewEdit}>
            <Box className={classes.fieldRow}>
              <InputTextLabel
                required
                value={values.name}
                className={classes.projectNameField}
                label={i18Project('LB_PROJECT_NAME')}
                placeholder={i18Project('PLH_PROJECT_NAME')}
                onChange={onProjectNameChange}
                error={nameError}
                errorMessage={nameErrorMessage}
              />
            </Box>
            <Box className={classes.fieldRow}>
              <InputDropdown
                required
                width={200}
                keyName="projectRank"
                label={i18Project('LB_PROJECT_RANK')}
                placeholder={i18Project('PLH_PROJECT_RANK')}
                value={values.projectRank}
                listOptions={PROJECT_RANK_OPTIONS}
                onChange={onSingleDropdownChange}
                error={touched.projectRank && !!errors.projectRank}
                errorMessage={touched.projectRank && errors.projectRank}
              />
              <InputCurrency
                required
                label={i18Project('LB_BILLABLE_MM')}
                placeholder={i18Project('PLH_SHARE_EFFORT')}
                maxLength={values?.billableMM?.toString().includes('.') ? 7 : 4}
                error={touched?.billableMM && !!errors?.billableMM}
                errorMessage={errors?.billableMM}
                value={values?.billableMM}
                onChange={(value?: string) => {
                  setFieldValue('billableMM', value || '')
                }}
              />
              <InputDatepicker
                required
                width={160}
                keyName="startDate"
                value={values.startDate}
                maxDate={values.endDate}
                label={i18Project('LB_PROJECT_START_DATE')}
                onChange={onProjectDateChange}
                error={
                  (touched.startDate && !!errors.startDate) || startDateError
                }
                errorMessage={startDateErrorMessage}
                onError={(error: string | null) => setStartDateError(!!error)}
              />
              <InputDatepicker
                required
                width={160}
                keyName="endDate"
                minDate={values.startDate}
                value={values.endDate}
                label={i18Project('LB_PROJECT_END_DATE')}
                onChange={onProjectDateChange}
                error={(touched.endDate && !!errors.endDate) || endDateError}
                errorMessage={
                  endDateError
                    ? compareStartDateWithEndDate
                      ? ''
                      : (i18Project('MSG_PROJECT_END_DATE_INVALID') as string)
                    : !!touched.endDate
                    ? errors.endDate
                    : ''
                }
                onError={(error: string | null) => setEndDateError(!!error)}
              />
            </Box>
            <Box className={classes.fieldRow}>
              <InputDropdown
                required
                keyName="projectType"
                label={i18Project('LB_PROJECT_TYPE')}
                placeholder={i18Project('PLH_SELECT_PROJECT_TYPE')}
                listOptions={PROJECT_TYPES}
                value={values.projectType}
                onChange={onSingleDropdownChange}
                error={touched.projectType && !!errors.projectType}
                errorMessage={errors.projectType}
              />
              <SelectProjectManager
                required
                disabled
                multiple={false}
                label={i18('LB_PROJECT_MANAGER')}
                branchId={values.branchId}
                value={values.projectManager}
                onChange={(value: OptionItem[]) =>
                  setFieldValue('projectManager', value)
                }
                error={touched.projectManager && !!errors.projectManager}
                errorMessage={errors.projectManager as string}
              />
              <SelectBranch
                required
                disabled
                keyName="branchId"
                moduleConstant={MODULE_PROJECT_CONST}
                label={i18Project('LB_RESPONSIBLE_BRANCH')}
                error={touched.branchId && !!errors.branchId}
                errorMessage={touched.branchId && errors.branchId}
                value={values.branchId}
                onChange={onSingleDropdownChange}
              />
            </Box>
            <Box className={classes.fieldRow}>
              <SelectDivisionSingle
                required
                isShowClearIcon
                isDisable={isDisableDivision || !values.branchId}
                moduleConstant={MODULE_PROJECT_CONST}
                label={i18Project('LB_PARTICIPATE_DIVISION') || ''}
                placeholder={i18Project('PLH_SELECT_DIVISION') || ''}
                branchId={values.branchId}
                value={values.divisionId}
                onChange={onDivisionChange}
                error={touched.divisionId && Boolean(errors.divisionId)}
                errorMessage={
                  !!touched.divisionId ? (errors.divisionId as string) : ''
                }
              />
              <SelectAllDivisions
                label={i18Project('LB_SUB_CUSTOMER') as string}
                placeholder={i18Project('PLH_SUB_CUSTOMER') as string}
                value={values.subCustomer}
                onChange={(value: string) =>
                  setFieldValue('subCustomer', value)
                }
              />
            </Box>
            <Box className={classes.fieldRow}>
              <SelectService
                label={i18('LB_TECHNOLOGY')}
                width={'100%'}
                placeholder={i18Project('PLH_SELECT_TECHNOLOGY')}
                value={values.technologies}
                onChange={(listTech: OptionItem[]) =>
                  setFieldValue('technologies', listTech)
                }
              />
            </Box>
            <Box className={classes.fieldRow}>
              <SelectProjectManager
                isSubProjectManager
                disabled={!values.branchId}
                label={i18Project('LB_PROJECT_SUB_MANAGER')}
                numberEllipsis={55}
                error={
                  touched.subProjectManagers && !!errors.subProjectManagers
                }
                errorMessage={errors.subProjectManagers as string}
                value={values.subProjectManagers}
                branchId={values.branchId}
                onChange={(value: OptionItem[]) =>
                  setFieldValue('subProjectManagers', value)
                }
              />
            </Box>
            <Box className={classes.fieldRow}>
              <InputDropdown
                required
                keyName="productType"
                label={i18Project('LB_PRODUCT_TYPE')}
                placeholder={i18Project('PLH_PRODUCT_TYPE')}
                error={touched.productType && !!errors.productType}
                errorMessage={errors.productType || errors.productType}
                listOptions={PRODUCT_TYPES_OPTIONS}
                onChange={onSingleDropdownChange}
                value={values.productType}
              />
              <SelectCustomer
                isProject
                required
                numberEllipsis={55}
                value={values.customer}
                onChange={(value: OptionItem | null) =>
                  setFieldValue('customer', value)
                }
                error={touched.customer && !!errors.customer}
                errorMessage={
                  !!touched.customer ? (errors.customer as string) : ''
                }
              />
            </Box>
            <Box className={classes.fieldRow}>
              <SelectPartner
                isProject
                numberEllipsis={50}
                label={i18Project('LB_OUTSOURCE')}
                placeholder={i18Project('PLH_SELECT_OUTSOURCE') as string}
                value={values.partners}
                onChange={(value: OptionItem[] | OptionItem) =>
                  setFieldValue('partners', value)
                }
                error={touched.partners && !!errors.partners}
                errorMessage={
                  Boolean(touched.partners) ? (errors.partners as string) : ''
                }
              />
              <SelectSaleMember
                multiple={false}
                disabled={!values.branchId}
                label={i18Project('LB_AM_SALE')}
                error={touched.amSale && !!errors.amSale}
                placeholder={i18Project('PLH_AM_SALE') as string}
                errorMessage={errors.amSale as string}
                value={values.amSale}
                branchId={values.branchId}
                onChange={(value: OptionItem[]) =>
                  setFieldValue('amSale', value)
                }
              />
              <InputDropdown
                required
                keyName="status"
                label={i18Project('LB_PROJECT_STATUS')}
                placeholder={i18Project('PLH_SELECT_PROJECT_STATUS')}
                listOptions={projectStatus}
                value={values.status}
                onChange={onSingleDropdownChange}
                error={touched.status && !!errors.status}
                errorMessage={touched.status && errors.status}
              />
            </Box>
            <Box className={classes.fieldRow}>
              <InputTextLabel
                required
                label={i18Project('LB_BUSINESS_DOMAIN')}
                placeholder={i18Project('PLH_BUSINESS_DOMAIN')}
                error={touched.businessDomain && !!errors.businessDomain}
                errorMessage={touched.businessDomain && errors.businessDomain}
                value={values.businessDomain}
                onChange={(e: EventInput) => {
                  setFieldValue('businessDomain', e.target.value)
                }}
              />
            </Box>
            <Box className={classes.fieldRow}>
              <InputTextArea
                label={i18('LB_DESCRIPTION') as string}
                placeholder={i18('PLH_DESCRIPTION')}
                defaultValue={values.description}
                onChange={(e: EventInput) => {
                  setFieldValue('description', e.target.value)
                }}
              />
            </Box>
          </Box>
        )}

        {!useEditMode && (
          <Box className={classes.listFields}>
            {divisionsLoading ? (
              <LoadingSkeleton />
            ) : (
              informationList.map(option => (
                <Box className={classes.option} key={option.id}>
                  <Box className={classes.label}>{option.label}</Box>
                  <Box className={classes.value} title={option.value}>
                    {option.value || ''}
                  </Box>
                </Box>
              ))
            )}
          </Box>
        )}
      </CardFormEdit>
      <DialogBox
        // @ts-ignore
        showDialog={showPrompt}
        confirmNavigation={confirmNavigation}
        cancelNavigation={cancelNavigation}
      />
      {showUpdateConfirm && (
        <ModalConfirm
          open
          title={i18('TXT_UPDATE_INFORMATION')}
          description={`Do you wish to update Project ${generalInfo.code} - General Information?`}
          onClose={() => setShowUpdateConfirm(false)}
          onSubmit={onUpdateGeneralInformation}
        />
      )}
    </Fragment>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  listFields: {
    display: 'flex',
    gap: theme.spacing(2.5, 1),
    flexWrap: 'wrap',
  },
  listFieldsViewEdit: {
    display: 'flex',
    gap: theme.spacing(2.5, 1),
    flexWrap: 'wrap',
    flexDirection: 'column',
    maxWidth: '860px',
  },
  option: {
    width: '200px',
  },
  label: {
    fontSize: 14,
    color: theme.color.black.secondary,
  },
  value: {
    fontSize: 14,
    marginTop: theme.spacing(0.5),
    fontWeight: 700,
    wordBreak: 'break-word',
  },
  fieldRow: {
    display: 'flex',
    gap: theme.spacing(3),
  },
  projectNameField: {
    width: 'unset',
    flex: 1,
  },
}))

export default ProjectBasicInformation

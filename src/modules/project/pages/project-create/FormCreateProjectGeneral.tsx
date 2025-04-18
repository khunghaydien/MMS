import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import CardFormSeeMore from '@/components/Form/CardFormSeeMore'
import FormItem from '@/components/Form/FormItem/FormItem'
import FormLayout from '@/components/Form/FormLayout'
import CommonButton from '@/components/buttons/CommonButton'
import InputCheckbox from '@/components/inputs/InputCheckbox'
import InputCurrency from '@/components/inputs/InputCurrency'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputTextArea from '@/components/inputs/InputTextArea'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import SelectAllDivisions from '@/components/select/SelectAllDivisions'
import SelectBranch from '@/components/select/SelectBranch'
import SelectCustomer from '@/components/select/SelectCustomer'
import SelectDivisionSingle from '@/components/select/SelectDivisionSingle'
import SelectPartner from '@/components/select/SelectPartner'
import SelectProjectManager from '@/components/select/SelectProjectManager'
import SelectSaleMember from '@/components/select/SelectSaleMember'
import SelectService from '@/components/select/SelectService'
import { MODULE_PROJECT_CONST } from '@/const/app.const'
import { NS_PROJECT } from '@/const/lang.const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { commonSelector, getProjectCode } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { ErrorResponse, EventInput, OptionItem } from '@/types'
import { removeVietnameseTonesOnly, scrollToFirstErrorMessage } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  PRODUCT_TYPES_OPTIONS,
  PROJECT_RANK_OPTIONS,
  PROJECT_TYPES,
} from '../../const'
import { projectGeneralValidate } from '../../reducer/thunk'
import { projectStatus } from '../project-list/instance'

interface FormCreateProjectGeneralProps {
  generalFormik: any
}

const FormCreateProjectGeneral = ({
  generalFormik,
}: FormCreateProjectGeneralProps) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const { staff, role }: AuthState = useSelector(selectAuth)
  const { projectCode } = useSelector(commonSelector)

  const [duplicateList, setDuplicateList] = useState<string[]>([])
  const [branchDisabled, setBranchDisabled] = useState(false)
  const [divisionDisabled, setDivisionDisabed] = useState(false)
  const [isChangeGroupMail, setIsChangeGroupMail] = useState<boolean>(false)
  const [isChangeJira, setIsChangeJira] = useState<boolean>(false)
  const [isChangeBitBucket, setIsChangeBitBucket] = useState<boolean>(false)

  const { values, errors, touched, setFieldValue, handleSubmit } = generalFormik

  const nameErrorMessage = useMemo(() => {
    if (duplicateList.includes('name')) {
      return i18Project('MSG_FIELD_EXISTED', {
        name: i18Project('LB_PROJECT_NAME'),
      }) as string
    }
    return touched.name ? errors.name : ''
  }, [duplicateList, errors, i18Project, touched])

  const getProjectName = useMemo(() => {
    return removeVietnameseTonesOnly(
      `${
        projectCode && values.customer?.id
          ? `${projectCode + '_' + values.name}`
          : values.name
      }`
    )
      .split(' ')
      .join('_')
  }, [projectCode, values.name, values.customer?.id])

  const onBlurValidate = (field: string) => {
    // @ts-ignore
    const value = values[field] || ''
    if (!value) return
    dispatch(
      projectGeneralValidate({
        requestBody: [
          {
            fieldName: field === 'generateGroupMailName' ? 'groupMail' : field,
            value,
          },
        ],
      })
    )
      .unwrap()
      .catch((errs: ErrorResponse[]) => {
        const newDuplicateList = [...duplicateList]
        if (!newDuplicateList.includes(errs[0]?.field)) {
          newDuplicateList.push(errs[0]?.field)
        }
        setDuplicateList(newDuplicateList)
      })
  }

  const onTextChange = (e: EventInput, field: string) => {
    setFieldValue(field, e.target.value)
    if (duplicateList.includes(field)) {
      const newDuplicateList = duplicateList.filter(item => item !== field)
      setDuplicateList(newDuplicateList)
    }
  }

  const onSingleDropdownChange = (
    value: string,
    _?: OptionItem,
    field?: string
  ) => {
    if (field === 'branchId') {
      setFieldValue('divisions', [])
    }
    setFieldValue(field || '', value)
  }

  const onGroupMailNameChange = (event: EventInput) => {
    setFieldValue('generateGroupMail.name', event.target.value)
    if (duplicateList.includes('groupMail')) {
      const newDuplicateList = duplicateList.filter(
        item => item !== 'groupMail'
      )
      setDuplicateList(newDuplicateList)
    }
    setIsChangeGroupMail(true)
  }

  const onJiraNameChange = (event: EventInput) => {
    setFieldValue('generateJira.name', event.target.value)
    setIsChangeJira(true)
  }

  const onBitbucketNameChange = (event: EventInput) => {
    setFieldValue('generateBitbucketName', event.target.value)
    setIsChangeBitBucket(true)
  }

  const nextSubmit = () => {
    handleSubmit()
    setTimeout(() => {
      scrollToFirstErrorMessage()
    })
  }

  useEffect(() => {
    const roleAutoCreateBranch = [
      'Branch Director',
      'COO',
      'HRM',
      'Division Director',
    ]
    const roleAutoCreateDivision = ['HRM', 'Division Director']
    role.some((roleItem: any) => {
      if (roleAutoCreateBranch.includes(roleItem?.name)) {
        setFieldValue('branchId', staff?.branch?.id)
        setBranchDisabled(true)
      }
      if (roleAutoCreateDivision.includes(roleItem?.name)) {
        setFieldValue('divisions', [
          {
            id: staff?.division.id,
            label: staff?.division.name,
            code: staff?.division.id,
          },
        ])
        setDivisionDisabed(true)
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
        setDivisionDisabed(true)
      }
    }
  }, [staff?.id, values.subProjectManagers, values.projectManager])

  useEffect(() => {
    if (!values.generateJira.autoGenerate) {
      setFieldValue('generateJira.name', '')
    }
    if (!values.generateBitbucket.autoGenerate) {
      setFieldValue('generateBitbucket.name', '')
    }
    if (!values.generateGroupMail.autoGenerate) {
      setFieldValue('generateGroupMail.name', '')
      if (duplicateList.includes('groupMail')) {
        const newDuplicateList = duplicateList.filter(
          item => item !== 'groupMail'
        )
        setDuplicateList(newDuplicateList)
      }
      setIsChangeGroupMail(false)
    }
    if (
      values.generateJira.autoGenerate &&
      (!isChangeJira || !values.generateJira.name)
    )
      setFieldValue('generateJira.name', getProjectName)
    if (
      values.generateBitbucket.autoGenerate &&
      (!isChangeBitBucket || !values.generateBitbucket.name)
    )
      setFieldValue('generateBitbucket.name', getProjectName)
    if (
      values.generateGroupMail.autoGenerate &&
      (!isChangeGroupMail || !values.generateGroupMail.name)
    ) {
      setFieldValue(
        'generateGroupMail.name',
        'Mor.' +
          removeVietnameseTonesOnly(values.name).split(' ').join('_') +
          '@morsoftware.com'
      )
    }
  }, [
    values.name,
    projectCode,
    values.generateJira.autoGenerate,
    values.generateBitbucket.autoGenerate,
    values.generateGroupMail.autoGenerate,
  ])

  useEffect(() => {
    if (values.customer?.id)
      dispatch(getProjectCode(values.customer.id.toString()))
  }, [values.customer?.id])

  return (
    <Box>
      <CardFormSeeMore title={i18('TXT_GENERAL_INFORMATION')} hideSeeMore>
        <Box className={classes.cardFormBody}>
          <Box className={classes.formRow}>
            <InputTextLabel
              required
              keyName="name"
              className={classes.projectNameField}
              label={i18Project('LB_PROJECT_NAME')}
              placeholder={i18Project('PLH_PROJECT_NAME')}
              value={values.name}
              onChange={onTextChange}
              error={
                (touched.name && !!errors.name) ||
                duplicateList.includes('name')
              }
              errorMessage={nameErrorMessage}
              onBlur={() => onBlurValidate('name')}
            />
            <SelectBranch
              required
              width={200}
              keyName="branchId"
              disabled={branchDisabled}
              moduleConstant={MODULE_PROJECT_CONST}
              label={i18Project('LB_RESPONSIBLE_BRANCH')}
              value={values.branchId}
              error={touched.branchId && !!errors.branchId}
              errorMessage={touched.branchId && errors.branchId}
              onChange={onSingleDropdownChange}
            />
            <SelectDivisionSingle
              isShowClearIcon
              required
              width={200}
              isDisable={divisionDisabled || !values.branchId}
              moduleConstant={MODULE_PROJECT_CONST}
              label={i18Project('LB_PARTICIPATE_DIVISION') || ''}
              placeholder={i18Project('PLH_SELECT_DIVISION') || ''}
              branchId={values.branchId}
              value={values.divisions[0]?.id}
              onChange={(value: OptionItem) => {
                setFieldValue('divisions', value?.id ? [value] : [])
              }}
              error={
                touched.divisions && !!errors.divisions && !!values.branchId
              }
              errorMessage={errors.divisions as string}
            />
            <InputDatepicker
              required
              width={160}
              label={i18Project('LB_PROJECT_START_DATE')}
              maxDate={values.endDate}
              value={values.startDate}
              onChange={(value: Date | null) =>
                setFieldValue('startDate', value)
              }
              error={touched.startDate && !!errors.startDate}
              errorMessage={errors.startDate}
            />
            <InputDatepicker
              required
              width={160}
              label={i18Project('LB_PROJECT_END_DATE')}
              error={touched.endDate && !!errors.endDate}
              errorMessage={errors.endDate}
              minDate={values.startDate}
              value={values.endDate}
              onChange={(value: Date | null) => setFieldValue('endDate', value)}
            />
          </Box>
          <Box className={classes.formRow}>
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
              maxLength={values.billableMM?.toString().includes('.') ? 7 : 4}
              error={touched?.billableMM && !!errors?.billableMM}
              errorMessage={errors?.billableMM}
              value={values?.billableMM}
              onChange={(value?: string) => {
                setFieldValue('billableMM', value || '')
              }}
            />
            <Box sx={{ flex: 1 }}>
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
            </Box>
            <Box sx={{ flex: 1 }}>
              <InputDropdown
                required
                keyName="productType"
                label={i18Project('LB_PRODUCT_TYPE')}
                placeholder={i18Project('PLH_PRODUCT_TYPE')}
                listOptions={PRODUCT_TYPES_OPTIONS}
                value={values.productType}
                onChange={onSingleDropdownChange}
                error={touched.productType && !!errors.productType}
                errorMessage={errors.productType}
              />
            </Box>
          </Box>
          <Box className={classes.formRow}>
            <SelectPartner
              isProject
              label={i18Project('LB_OUTSOURCE')}
              placeholder={i18Project('PLH_SELECT_OUTSOURCE') as string}
              numberEllipsis={50}
              value={values.partners}
              onChange={value => setFieldValue('partners', value)}
              error={touched.partners && !!errors.partners}
              errorMessage={errors.partners as string}
            />
            <SelectCustomer
              isProject
              required
              value={values.customer}
              onChange={value => setFieldValue('customer', value)}
              error={touched.customer && !!errors.customer}
              errorMessage={errors.customer as string}
              numberEllipsis={55}
            />
            <SelectAllDivisions
              label={i18Project('LB_SUB_CUSTOMER') as string}
              placeholder={i18Project('PLH_SUB_CUSTOMER') as string}
              value={values.subCustomer}
              onChange={(value: string) => setFieldValue('subCustomer', value)}
            />
          </Box>
          <Box className={classes.formRow}>
            <SelectProjectManager
              required
              multiple={false}
              disabled={!values.branchId}
              error={
                touched.projectManager &&
                !!errors.projectManager &&
                !values.projectManager?.id
              }
              errorMessage={errors.projectManager as string}
              value={values.projectManager}
              branchId={values.branchId}
              label={i18('LB_PROJECT_MANAGER')}
              onChange={value => setFieldValue('projectManager', value)}
            />
            <SelectProjectManager
              isSubProjectManager
              disabled={!values.branchId}
              label={i18Project('LB_PROJECT_SUB_MANAGER')}
              error={touched.subProjectManagers && !!errors.subProjectManagers}
              errorMessage={errors.subProjectManagers as string}
              value={values.subProjectManagers}
              branchId={values.branchId}
              onChange={value => setFieldValue('subProjectManagers', value)}
              numberEllipsis={55}
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
              errorMessage={errors.status}
            />
            <SelectSaleMember
              multiple={false}
              branchId={values.branchId}
              disabled={!values.branchId}
              label={i18Project('LB_AM_SALE')}
              placeholder={i18Project('PLH_AM_SALE') as string}
              error={touched.amSale && !!errors.amSale}
              errorMessage={errors.amSale as string}
              onChange={value => setFieldValue('amSale', value)}
              value={values.amSale}
            />
          </Box>
          <Box className={classes.formRow}>
            <SelectService
              label={i18('LB_TECHNOLOGY')}
              width={'100%'}
              placeholder={i18Project('PLH_SELECT_TECHNOLOGY')}
              value={values.technologies}
              onChange={value => setFieldValue('technologies', value)}
            />
            <InputTextLabel
              required
              label={i18Project('LB_BUSINESS_DOMAIN')}
              placeholder={i18Project('PLH_BUSINESS_DOMAIN')}
              keyName="businessDomain"
              error={touched.businessDomain && !!errors.businessDomain}
              errorMessage={errors.businessDomain as string}
              value={values.businessDomain}
              onChange={onTextChange}
            />
          </Box>
          <Box className={classes.formRow}>
            <InputTextArea
              label={i18('LB_DESCRIPTION') as string}
              placeholder={i18('PLH_DESCRIPTION')}
              defaultValue={values.description}
              onChange={onTextChange}
            />
          </Box>
          <Box className={classes.formRow}>
            <InputTextLabel
              keyName="driveLink"
              label={i18Project('LB_SHARED_DRIVE_LINK')}
              placeholder={i18Project('PLH_SHARED_DRIVE_LINK')}
              value={values.driveLink}
              onChange={onTextChange}
            />
            <InputTextLabel
              keyName="slackLink"
              label={i18Project('LB_PROJECT_SLACK_LINK')}
              placeholder={i18Project('PLH_INPUT_SLACK_LINK')}
              value={values.slackLink}
              onChange={onTextChange}
            />
            <InputTextLabel
              keyName="referenceLink"
              label={i18Project('LB_REFERENCE_LINK')}
              placeholder={i18Project('PLH_REFERENCE_LINK')}
              value={values.referenceLink}
              onChange={onTextChange}
            />
          </Box>
          <Box className={classes.formRow}>
            <Box width="100%">
              <FormLayout>
                <FormItem label={i18Project('LB_SELECT_TO_GENERATE')}>
                  <InputCheckbox
                    className="checkbox"
                    label={i18Project('LB_GENERATE_GROUP_MAIL')}
                    isEmphasize
                    checked={values.generateGroupMail.autoGenerate}
                    onClick={() =>
                      setFieldValue(
                        'generateGroupMail.autoGenerate',
                        !values.generateGroupMail.autoGenerate
                      )
                    }
                  />
                  {!!values.generateGroupMail.autoGenerate && (
                    <InputTextLabel
                      isHorizontal
                      label={i18Project('LB_EMAIL_ADDRESS')}
                      placeholder={i18Project('LB_EMAIL_ADDRESS')}
                      keyName="generateGroupMail.name"
                      value={values.generateGroupMail.name}
                      onChange={onGroupMailNameChange}
                      onBlur={() => onBlurValidate('generateGroupMailName')}
                      error={
                        (touched.generateGroupMail?.name &&
                          !!errors.generateGroupMail?.name) ||
                        duplicateList.includes('groupMail')
                      }
                      errorMessage={
                        duplicateList.includes('groupMail')
                          ? i18Project('MSG_FIELD_EXISTED', {
                              name: i18Project('LB_GROUP_MAIL_ADDRESS'),
                            })
                          : touched.generateGroupMail?.name
                          ? errors.generateGroupMail?.name
                          : ''
                      }
                    />
                  )}
                </FormItem>
              </FormLayout>
              <FormLayout top={24}>
                <FormItem>
                  <InputCheckbox
                    isEmphasize
                    className="checkbox"
                    label={i18Project('LB_GENERATE_GROUP_JIRA')}
                    checked={values.generateJira.autoGenerate}
                    onClick={() =>
                      setFieldValue(
                        'generateJira.autoGenerate',
                        !values.generateJira.autoGenerate
                      )
                    }
                  />
                  {values.generateJira.autoGenerate && (
                    <InputTextLabel
                      isHorizontal
                      label={i18Project('LB_PROJECT_NAME')}
                      placeholder={i18Project('LB_PROJECT_NAME')}
                      keyName="generateJira.name"
                      value={values.generateJira.name}
                      onChange={onJiraNameChange}
                      onBlur={() => onBlurValidate('generateJiraName')}
                      error={
                        (touched.generateJira?.name &&
                          !!errors.generateJira?.name) ||
                        duplicateList.includes('generateJiraName')
                      }
                      errorMessage={
                        duplicateList.includes('generateJiraName')
                          ? i18Project('MSG_FIELD_EXISTED', {
                              name: 'Project on Jira',
                            })
                          : touched.generateJira?.name
                          ? errors.generateJira?.name
                          : ''
                      }
                    />
                  )}
                </FormItem>
              </FormLayout>
              <FormLayout top={24}>
                <FormItem>
                  <InputCheckbox
                    isEmphasize
                    className="checkbox"
                    label={i18Project('LB_GENERATE_GROUP_GIT')}
                    checked={values.generateBitbucket.autoGenerate}
                    onClick={() =>
                      setFieldValue(
                        'generateBitbucket.autoGenerate',
                        !values.generateBitbucket.autoGenerate
                      )
                    }
                  />
                  {values.generateBitbucket.autoGenerate && (
                    <InputTextLabel
                      isHorizontal
                      label={i18Project('LB_PROJECT_NAME')}
                      placeholder={i18Project('LB_PROJECT_NAME')}
                      keyName="generateBitbucket.name"
                      value={values.generateBitbucket.name}
                      onChange={onBitbucketNameChange}
                      onBlur={() => onBlurValidate('generateBitbucketName')}
                      error={
                        (touched.generateBitbucket?.name &&
                          !!errors.generateBitbucket?.name) ||
                        duplicateList.includes('generateBitbucketName')
                      }
                      errorMessage={
                        duplicateList.includes('generateBitbucketName')
                          ? i18Project('MSG_FIELD_EXISTED', {
                              name: 'Project on Git',
                            })
                          : touched.generateBitbucket?.name
                          ? errors.generateBitbucket?.name
                          : ''
                      }
                    />
                  )}
                </FormItem>
              </FormLayout>
            </Box>
          </Box>
        </Box>
      </CardFormSeeMore>
      <Box className={classes.footerActions}>
        <CommonButton onClick={nextSubmit}>{i18('LB_NEXT')}</CommonButton>
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootFormCreateProjectGeneral: {},
  cardFormBody: {
    display: 'flex',
    gap: theme.spacing(3),
    flexDirection: 'column',
  },
  projectNameField: {
    width: 'unset',
    flex: 1,
  },
  formRow: {
    display: 'flex',
    gap: theme.spacing(3),
    width: '100%',
  },
  footerActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(3),
    gap: theme.spacing(2),
  },
}))

export default FormCreateProjectGeneral

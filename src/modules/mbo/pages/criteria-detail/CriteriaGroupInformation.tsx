import CardForm from '@/components/Form/CardForm'
import FormItem from '@/components/Form/FormItem/FormItem'
import FormLayout from '@/components/Form/FormLayout'
import AutoCompleteSearchCustom from '@/components/common/AutoCompleteSearchCustom'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputTextArea from '@/components/inputs/InputTextArea'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import ModalConfirm from '@/components/modal/ModalConfirm'
import { LangConstant, PathConstant } from '@/const'
import CommonService from '@/services/common.service'
import { AppDispatch } from '@/store'
import { EventInput, OptionItem } from '@/types'
import { checkValidateFormik, scrollToFirstErrorMessage } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { ICriteriaGroupInformation } from '../../models'
import {
  deleteCriteriaGroup,
  updateCriteriaGroup,
} from '../../reducer/criteria'

import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import { CRITERIA_TEXT_MAX_LENGTH } from '../../const'
import { initialCriteriaGroupInformation } from '../../formik/criteriaFormik'
import useWorkType from '../../hooks/useWorkType'

interface CriteriaGroupInformationProps {
  isDetailPage: boolean
  isLoading: boolean
  criteriaGroupDraft: typeof initialCriteriaGroupInformation
  criteriaGroup: any
  confirmNavigation: Function | any
  onSetCriteriaGroupDraft: (payload: {
    name: string
    type: string
    positionApplied: any
    description: string
  }) => void
}

const CriteriaGroupInformation = ({
  isDetailPage,
  isLoading,
  criteriaGroupDraft,
  criteriaGroup,
  onSetCriteriaGroupDraft,
  confirmNavigation,
}: CriteriaGroupInformationProps) => {
  const classes = useStyles()
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)

  const {
    values: criteriaGroupValues,
    errors,
    touched,
    setFieldValue,
  } = criteriaGroup

  const [listPositions, setListPositions] = useState<OptionItem[]>([])
  const [useEditMode, setUseEditMode] = useState(false)
  const [showDialogLeave, setShowDialogLeave] = useState(false)
  const [isOpenUpdateConfirmation, setIsOpenUpdateConfirmation] =
    useState(false)
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    useState(false)
  const [listWorkTypes] = useWorkType()

  const getCriteriaGroupInformation = (
    criteriaGroup: ICriteriaGroupInformation
  ) => {
    return {
      isAllPosition: criteriaGroup.isAllPosition,
      name: criteriaGroup.name,
      type: criteriaGroup.type,
      positionApplied: criteriaGroup.positionApplied,
      description: criteriaGroup.description,
    }
  }

  const values = useMemo(() => {
    return getCriteriaGroupInformation(criteriaGroupValues)
  }, [
    criteriaGroupValues.name,
    criteriaGroupValues.type,
    criteriaGroupValues.positionApplied,
    criteriaGroupValues.description,
  ])

  const criteriaGroupInformationRef = useMemo(() => {
    return getCriteriaGroupInformation(criteriaGroupDraft)
  }, [
    criteriaGroupDraft.name,
    criteriaGroupDraft.type,
    criteriaGroupDraft.positionApplied,
    criteriaGroupDraft.description,
  ])

  const buttonUseDetailEditDisabled = useMemo(() => {
    return (
      JSON.stringify(criteriaGroupInformationRef) === JSON.stringify(values)
    )
  }, [criteriaGroupInformationRef, values])

  const handleTextChange = useCallback((e: EventInput, keyName: string) => {
    setFieldValue(keyName, e.target.value)
  }, [])

  const handleInputDropdownChange = useCallback(
    (value: string, _?: OptionItem, keyName?: string) => {
      setFieldValue(keyName || '', value)
    },
    []
  )

  const handlePositionsChange = (value: OptionItem[]) => {
    const allPositionOption = {
      id: '*',
      value: '*',
      label: i18('LB_ALL_POSITION'),
    }
    if (value[value.length - 1]?.id === '*') {
      setFieldValue('positionApplied', [allPositionOption])
    } else {
      const isChooseAllPosition =
        value.filter(item => item.id !== '*').length ===
        listPositions.filter(item => item.id !== '*').length
      if (isChooseAllPosition) {
        setFieldValue('positionApplied', [allPositionOption])
      } else {
        setFieldValue(
          'positionApplied',
          value.filter(item => item.id !== '*')
        )
      }
    }
  }

  const getPositionBranch = async () => {
    const res = await CommonService.getPositionBranch()
    setListPositions([
      {
        id: '*',
        value: '*',
        label: 'All Position',
      },
      ...res.data.map((ps: OptionItem) => ({
        id: ps.id,
        value: ps.id,
        label: ps.name,
      })),
    ])
  }

  const detailValues = useMemo(() => {
    return [
      {
        id: 'name',
        label: i18Mbo('LB_CRITERIA_GROUP'),
        value: criteriaGroupInformationRef.name,
      },
      {
        id: 'type',
        label: i18Mbo('LB_CRITERIA_TYPE'),
        value: listWorkTypes.find(
          (item: OptionItem) =>
            item.id?.toString() == criteriaGroupInformationRef.type
        )?.label,
      },
      {
        id: 'positionApplied',
        label: i18Mbo('LB_POSITION_APPLIED'),
        value: criteriaGroupInformationRef.isAllPosition
          ? i18('LB_ALL_POSITION')
          : criteriaGroupInformationRef.positionApplied
              .map((ps: OptionItem) => ps.label)
              .join(', '),
      },
      {
        id: 'description',
        label: i18('LB_DESCRIPTION'),
        value: criteriaGroupInformationRef.description,
      },
    ]
  }, [criteriaGroupInformationRef, i18, i18Mbo])

  const handleCancelEditMode = () => {
    if (buttonUseDetailEditDisabled) {
      setUseEditMode(false)
    } else {
      setShowDialogLeave(true)
    }
  }

  const handleLeaveEditMode = () => {
    setUseEditMode(false)
    handleCloseModalLeave()
    setFieldValue('name', criteriaGroupDraft.name)
    setFieldValue('type', criteriaGroupDraft.type)
    setFieldValue('positionApplied', criteriaGroupDraft.positionApplied)
    setFieldValue('description', criteriaGroupDraft.description)
  }

  const reFillCriteriaGroupDetail = () => {
    onSetCriteriaGroupDraft({
      name: criteriaGroupValues.name,
      type: criteriaGroupValues.type,
      description: criteriaGroupValues.description,
      positionApplied: criteriaGroupValues.positionApplied,
    })
  }

  const handleUpdateCriteriaGroup = () => {
    const isAllPosition = values.positionApplied[0].id === '*'
    const positionApplied = isAllPosition
      ? []
      : values.positionApplied.map((ps: any) => ps.id)
    const payload = {
      criteriaGroupId: params.criteriaGroupId,
      requestBody: {
        ...values,
        positionApplied,
        isAllPosition,
      },
    }
    dispatch(updateCriteriaGroup(payload))
      .unwrap()
      .then(() => {
        reFillCriteriaGroupDetail()
        setUseEditMode(false)
      })
  }

  const handleSaveAsClick = async () => {
    setTimeout(() => {
      scrollToFirstErrorMessage()
    })
    const isError = await checkValidateFormik(criteriaGroup)
    if (!isError) {
      criteriaGroup.handleSubmit()
      setIsOpenUpdateConfirmation(true)
    }
  }

  const handleDeleteCriteriaGroup = () => {
    dispatch(
      deleteCriteriaGroup({
        criteriaGroupId: params.criteriaGroupId,
        alertName: values.name,
      })
    )
      .unwrap()
      .then(() => {
        navigate(PathConstant.MBO_CRITERIA_LIST)
        confirmNavigation()
      })
  }

  const handleCloseModalLeave = () => setShowDialogLeave(false)
  const handleOpenEditMode = () => setUseEditMode(true)
  const handleCloseConfirmationModal = () => setIsOpenUpdateConfirmation(false)
  const handleDeleteIconClick = () => setIsOpenDeleteConfirmation(true)
  const handleCloseDeleteConfirmation = () => setIsOpenDeleteConfirmation(false)

  useEffect(() => {
    getPositionBranch()
  }, [])

  return (
    <Fragment>
      {isOpenDeleteConfirmation && (
        <ModalDeleteRecords
          open
          titleMessage={i18Mbo('TXT_DELETE_CRITERIA_GROUP')}
          subMessage={i18('MSG_CONFIRM_DELETE_DESCRIPTION', {
            labelName: `${i18Mbo('LB_CRITERIA_GROUP')}: ${values.name}`,
          })}
          onClose={handleCloseDeleteConfirmation}
          onSubmit={handleDeleteCriteriaGroup}
        />
      )}
      {showDialogLeave && (
        <ModalConfirm
          open
          title={i18('TXT_LEAVE_SITE')}
          description={i18('MSG_DESCRIPTION_CONFIRM_LEAVE')}
          titleSubmit={i18('LB_LEAVE') as string}
          onClose={handleCloseModalLeave}
          onSubmit={handleLeaveEditMode}
        />
      )}
      {isOpenUpdateConfirmation && (
        <ModalConfirm
          open
          title={i18('TXT_UPDATE_INFORMATION')}
          description={i18('MSG_UPDATE_DESCRIPTION', {
            labelName: `${i18Mbo('LB_CRITERIA_GROUP')}: ${
              criteriaGroupValues.name
            }`,
          })}
          onClose={handleCloseConfirmationModal}
          onSubmit={handleUpdateCriteriaGroup}
        />
      )}
      <CardForm
        useDeleteIcon={isDetailPage && !useEditMode}
        isLoading={isLoading}
        title={i18Mbo('TXT_CRITERIA_GROUP_INFORMATION')}
        buttonUseDetailEditDisabled={buttonUseDetailEditDisabled}
        useDetailViewMode={isDetailPage && !useEditMode}
        useDetailEditMode={isDetailPage && useEditMode}
        onCancelEditMode={handleCancelEditMode}
        onOpenEditMode={handleOpenEditMode}
        onSaveAs={handleSaveAsClick}
        onDeleteIconClick={handleDeleteIconClick}
      >
        {!useEditMode && (
          <Box className={classes.criteriaGroupDetail}>
            {detailValues.map(
              (option: OptionItem) =>
                !!option.value && (
                  <Box className={classes.option} key={option.id}>
                    <Box className={classes.label}>{option.label}:</Box>
                    <Box className={classes.value}>{option.value}</Box>
                  </Box>
                )
            )}
          </Box>
        )}
        {(useEditMode || !isDetailPage) && (
          <Box className={classes.listFields}>
            <InputTextLabel
              required
              maxLength={CRITERIA_TEXT_MAX_LENGTH}
              error={!!errors.name && !!touched.name}
              errorMessage={errors.name as string}
              keyName="name"
              label={i18Mbo('LB_CRITERIA_GROUP')}
              placeholder={i18Mbo('PLH_CRITERIA_GROUP')}
              value={values.name}
              onChange={handleTextChange}
            />
            <FormLayout gap={24}>
              <InputDropdown
                required
                error={!!errors.type && !!touched.type}
                errorMessage={errors.type}
                keyName="type"
                label={i18Mbo('LB_CRITERIA_TYPE')}
                placeholder={i18('PLH_SELECT', {
                  labelName: i18Mbo('LB_CRITERIA_TYPE'),
                })}
                value={values.type}
                listOptions={listWorkTypes}
                onChange={handleInputDropdownChange}
              />
            </FormLayout>
            <FormItem required label={i18Mbo('LB_POSITION_APPLIED')}>
              <AutoCompleteSearchCustom
                multiple
                error={!!errors.positionApplied && !!touched.positionApplied}
                errorMessage={errors.positionApplied}
                placeholder={i18('PLH_SELECT', {
                  labelName: i18Mbo('LB_POSITION_APPLIED'),
                })}
                value={values.positionApplied}
                listOptions={listPositions}
                onChange={handlePositionsChange}
              />
            </FormItem>
            <InputTextArea
              defaultValue={values.description}
              keyName="description"
              label={i18('LB_DESCRIPTION') || ''}
              placeholder={i18('PLH_DESCRIPTION')}
              onChange={handleTextChange}
            />
          </Box>
        )}
      </CardForm>
    </Fragment>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  criteriaGroupInformation: {},
  listFields: {
    width: 600,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  criteriaGroupDetail: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
  },
  label: {
    width: theme.spacing(15),
    fontSize: 14,
    fontWeight: 700,
  },
  value: {
    flex: 1,
  },
}))

export default memo(CriteriaGroupInformation)

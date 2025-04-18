import CardFormActions from '@/components/Form/CardForm/CardFormActions'
import FormItem from '@/components/Form/FormItem/FormItem'
import ButtonAddPlus from '@/components/buttons/ButtonAddPlus'
import ToggleSectionIcon from '@/components/icons/ToggleSectionIcon'
import InputTextArea from '@/components/inputs/InputTextArea'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import ModalConfirm from '@/components/modal/ModalConfirm'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import { LangConstant } from '@/const'
import { alertSuccess } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { EventInput } from '@/types'
import { scrollToFirstErrorMessage } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
  CRITERIA_TEXT_MAX_LENGTH,
  MAX_EVALUATION_SCALE,
  SCORE_LIST_OPTIONS,
} from '../const'
import {
  criteriaRequestItemValidation,
  initCriteriaRequests,
} from '../formik/criteriaFormik'
import { CriteriaRequest, ICriteriaDetailRequest } from '../models'
import { createHashCriteria, updateHashCriteria } from '../reducer/criteria'
import CriteriaDetailRequestItem from './CriteriaDetailRequestItem'
import CriteriaRequestItemViewDetail from './CriteriaRequestItemViewDetail'

const refactorCriteriaDetail = (criteriaDetail: ICriteriaDetailRequest) => {
  return {
    id: 1,
    score: criteriaDetail.score.toString(),
    content: criteriaDetail.content,
  }
}

interface CriteriaRequestItemProps {
  index: number
  criteriaRequest: CriteriaRequest
  criteriaRequestDraft: CriteriaRequest | any
  onCriteriaRequestChange: (
    newCriteriaRequest: CriteriaRequest,
    index: number
  ) => void
  onFlagChange: () => void
  criteriaRequestItemCounter: number
  onDeleteIconClick?: (
    criteriaRequestItem: CriteriaRequest,
    index: number
  ) => void
  criteriaListDraft: { criteria: typeof initCriteriaRequests }
  countSubmit: number
  openData: boolean
  onSetCriteriaListDraft: (criteriaListDraft: CriteriaRequest[]) => void
  onReGetCriteriaGroup: (blockLoading?: boolean | undefined) => void
  indexListOpenData: number[]
  setIndexListOpenData: Dispatch<SetStateAction<number[]>>
}

const CriteriaRequestItem = ({
  criteriaRequest,
  index,
  onCriteriaRequestChange,
  onFlagChange,
  criteriaRequestItemCounter,
  onDeleteIconClick,
  criteriaRequestDraft,
  onSetCriteriaListDraft,
  onReGetCriteriaGroup,
  criteriaListDraft,
  countSubmit,
  openData,
  indexListOpenData,
  setIndexListOpenData,
}: CriteriaRequestItemProps) => {
  const classes = useStyles()
  const params = useParams()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)
  const dispatch = useDispatch<AppDispatch>()

  const criteriaRequestItemFormik = useFormik({
    initialValues: criteriaRequest,
    validationSchema: criteriaRequestItemValidation,
    onSubmit: () => {
      if (saveMode === 'save') {
        setIsOpenUpdateConfirmation(true)
      } else if (saveMode === 'add') {
        dispatch(
          createHashCriteria({
            criteriaGroupId: params.criteriaGroupId,
            requestBody: criteriaRequestItem,
            alertName: `${i18Mbo('LB_CRITERIA')} #${index + 1}: ${
              criteriaRequestItem.name
            }`,
          })
        )
          .unwrap()
          .then(() => {
            onReGetCriteriaGroup(true)
            setUseEditMode(false)
            setShowDialogLeave(false)
            const newIndexListOpenData = [...indexListOpenData]
            newIndexListOpenData.push(index)
            setIndexListOpenData(newIndexListOpenData)
          })
      }
    },
  })

  const { setValues, errors, touched } = criteriaRequestItemFormik

  const isDetailPage = useMemo(() => {
    return !!params.criteriaGroupId
  }, [])

  const [clear, setClear] = useState(false)
  const [saveMode, setSaveMode] = useState<'save' | 'add' | ''>('save')
  const [isOpenModalDeleteEvaluation, setIsOpenModalDeleteEvaluation] =
    useState(false)
  const [contentNameSelected, setContentNameSelected] = useState('')
  const [evaluationIndexSelected, setEvaluationIndexSelected] = useState(0)
  const [useEditMode, setUseEditMode] = useState(
    isDetailPage && !criteriaRequest.name ? true : false
  )
  const [showDialogLeave, setShowDialogLeave] = useState(false)
  const [isOpenUpdateConfirmation, setIsOpenUpdateConfirmation] =
    useState(false)
  const [scoreSelected, setScoreSelected] = useState<string | number>('')

  const criteriaRequestItem = useMemo(() => {
    return criteriaRequestItemFormik.values
  }, [criteriaRequestItemFormik.values])

  const listScoresExist = useMemo(() => {
    const result: string[] = []
    criteriaRequestItem.criteriaDetail.forEach(
      (criteriaDetailRequest: ICriteriaDetailRequest) => {
        if (!!criteriaDetailRequest.score) {
          result.push(criteriaDetailRequest.score)
        }
      }
    )
    return result
  }, [criteriaRequestItem])

  const useDeleteIcon = useMemo(() => {
    if (!isDetailPage) return criteriaRequestItemCounter > 1
    return (
      ((isDetailPage
        ? criteriaRequestItemCounter > 1 &&
          !!criteriaListDraft.criteria?.[1]?.id
        : criteriaRequestItemCounter > 1) ||
        !criteriaRequestDraft) &&
      !useEditMode
    )
  }, [
    criteriaRequestItemCounter,
    useEditMode,
    criteriaRequestDraft,
    criteriaListDraft.criteria?.[1],
  ])

  const buttonUseDetailEditDisabled = useMemo(() => {
    if (clear) return clear
    const newCriteriaRequestItem: CriteriaRequest = { ...criteriaRequestItem }
    newCriteriaRequestItem.criteriaDetail =
      newCriteriaRequestItem.criteriaDetail.map(refactorCriteriaDetail)
    const newCriteriaRequestDraft: CriteriaRequest = { ...criteriaRequestDraft }
    if (newCriteriaRequestDraft && newCriteriaRequestDraft.criteriaDetail) {
      newCriteriaRequestDraft.criteriaDetail =
        newCriteriaRequestDraft.criteriaDetail.map(refactorCriteriaDetail)
    }
    return (
      JSON.stringify(newCriteriaRequestDraft) ===
      JSON.stringify(newCriteriaRequestItem)
    )
  }, [criteriaRequestDraft, criteriaRequest, criteriaRequestItem, clear])

  const handleTextChange = (e: EventInput, keyName: string) => {
    const newCriteriaRequestItem: CriteriaRequest = {
      ...criteriaRequestItem,
      id: criteriaRequest.id,
      [keyName]: e.target.value,
    }
    setValues(newCriteriaRequestItem)
  }

  const handleCriteriaDetailRequestChange = (
    newCriteriaDetailRequest: ICriteriaDetailRequest,
    indexScoreContent: number
  ) => {
    const newCriteriaDetailRequests = [...criteriaRequestItem.criteriaDetail]
    newCriteriaDetailRequests[indexScoreContent] = newCriteriaDetailRequest
    const newCriteriaRequestItem: CriteriaRequest = {
      ...criteriaRequestItem,
      criteriaDetail: newCriteriaDetailRequests,
    }
    setValues(newCriteriaRequestItem)
  }

  const handleAddNewEvaluationScale = () => {
    const otherScores = SCORE_LIST_OPTIONS.filter(
      option => !listScoresExist.map(n => +n).includes(+option.value)
    )
    const evaluationScaleIds = criteriaRequestItem.criteriaDetail.map(
      criteriaDetailRequest => criteriaDetailRequest.id
    )

    const id = Math.max(...evaluationScaleIds) + 1
    const newCriteriaRequestItem = {
      ...criteriaRequestItem,
      criteriaDetail: [
        ...criteriaRequestItem.criteriaDetail,
        {
          id,
          score: otherScores[0].value,
          content: '',
        },
      ],
    }
    setValues(newCriteriaRequestItem)
  }

  const handleDeleteIconCriteriaClick = () => {
    !!onDeleteIconClick && onDeleteIconClick(criteriaRequestItem, index)
  }

  const deleteEvaluationByIndex = (
    indexEvaluation: number,
    score: string | number
  ) => {
    const newCriteriaDetailRequests = [...criteriaRequestItem.criteriaDetail]
    newCriteriaDetailRequests.splice(indexEvaluation, 1)
    const newCriteriaRequestItem = {
      ...criteriaRequestItem,
      criteriaDetail: newCriteriaDetailRequests,
    }
    setValues(newCriteriaRequestItem)
    dispatch(
      alertSuccess({
        message: i18('MSG_DELETE_SUCCESS', {
          labelName: `${i18('LB_SCORE')} ${score}`,
        }),
      })
    )
  }

  const handleDeleteIconEvaluationClick = (
    criteriaDetailRequest: ICriteriaDetailRequest,
    indexEvaluation: number
  ) => {
    const useModal = !!criteriaDetailRequest.content
    if (useModal) {
      setIsOpenModalDeleteEvaluation(true)
      setContentNameSelected(criteriaDetailRequest.content)
      setScoreSelected(criteriaDetailRequest.score)
      setEvaluationIndexSelected(indexEvaluation)
    } else {
      deleteEvaluationByIndex(indexEvaluation, criteriaDetailRequest.score)
    }
  }

  const handleDeleteEvaluation = () => {
    deleteEvaluationByIndex(evaluationIndexSelected, scoreSelected)
  }

  const handleLeaveEditMode = () => {
    setUseEditMode(false)
    handleCloseModalLeave()
    setValues(criteriaRequestDraft)
    onCriteriaRequestChange(criteriaRequestDraft, index)
  }

  const handleCancelEditMode = () => {
    if (buttonUseDetailEditDisabled) {
      setUseEditMode(false)
    } else {
      setShowDialogLeave(true)
    }
  }

  const reFillHashCriteria = (id: number) => {
    onCriteriaRequestChange({ ...criteriaRequestItem, id }, index)
    const newCriteriaListDraft = [...criteriaListDraft.criteria]
    newCriteriaListDraft[index] = criteriaRequestItem
    onSetCriteriaListDraft(newCriteriaListDraft)
  }

  const handleUpdateHashCriteria = () => {
    const payload = {
      criteriaGroupId: params.criteriaGroupId,
      hashCriteriaId: criteriaRequestItem.id,
      requestBody: criteriaRequestItem,
      alertLabelName: `${i18Mbo('LB_CRITERIA')} #${index + 1}: ${
        criteriaRequestItem.name
      }`,
    }
    dispatch(updateHashCriteria(payload))
      .unwrap()
      .then(res => {
        reFillHashCriteria(res.data.id as number)
        setUseEditMode(false)
        setShowDialogLeave(false)
        setClear(true)
      })
  }

  const handleSaveAsClick = () => {
    setSaveMode('save')
    criteriaRequestItemFormik.handleSubmit()
    setTimeout(() => {
      scrollToFirstErrorMessage()
    })
  }

  const handleAddNewACriteria = () => {
    setSaveMode('add')
    criteriaRequestItemFormik.handleSubmit()
    setTimeout(() => {
      scrollToFirstErrorMessage()
    })
  }

  const handleOpenEditMode = () => setUseEditMode(true)
  const handleToggleOpenData = (open: boolean) => {
    const newIndexListOpenData = [...indexListOpenData]
    if (open) {
      newIndexListOpenData.push(index)
    } else {
      const findIndex = indexListOpenData.findIndex(_index => _index === index)
      if (findIndex !== -1) {
        newIndexListOpenData.splice(findIndex, 1)
      }
    }
    setIndexListOpenData(newIndexListOpenData)
  }
  const handleCloseModalLeave = () => setShowDialogLeave(false)
  const handleCloseConfirmationModal = () => setIsOpenUpdateConfirmation(false)

  useEffect(() => {
    if (countSubmit) {
      setSaveMode('')
      setTimeout(() => {
        criteriaRequestItemFormik.handleSubmit()
      })
    }
  }, [countSubmit])

  useEffect(() => {
    onFlagChange()
  }, [criteriaRequestItem])

  useEffect(() => {
    const hasChanged =
      JSON.stringify(criteriaRequest) !== JSON.stringify(criteriaRequestItem)
    if (hasChanged) {
      setClear(false)
      onCriteriaRequestChange(criteriaRequestItem, index)
    }
  }, [criteriaRequestItem])

  return (
    <Fragment>
      {isOpenUpdateConfirmation && (
        <ModalConfirm
          open
          title={i18('TXT_UPDATE_INFORMATION')}
          description={i18('MSG_UPDATE_DESCRIPTION', {
            labelName: `${i18Mbo('LB_CRITERIA')} #${index + 1}: ${
              criteriaRequestItem.name
            }`,
          })}
          onClose={handleCloseConfirmationModal}
          onSubmit={handleUpdateHashCriteria}
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
      {isOpenModalDeleteEvaluation && (
        <ModalDeleteRecords
          open
          titleMessage={i18Mbo('TXT_DELETE_AN_EVALUATION')}
          subMessage={i18('MSG_CONFIRM_DELETE_DESCRIPTION', {
            labelName: `${i18Mbo(
              'LB_CRITERIA_CONTENT'
            )}: ${contentNameSelected}`,
          })}
          onClose={() => setIsOpenModalDeleteEvaluation(false)}
          onSubmit={handleDeleteEvaluation}
        />
      )}
      <Box className={classes.criteriaRequestItem}>
        <Box className={classes.criteriaRequestItemHeader}>
          <Box className={classes.title}>
            {!useEditMode && isDetailPage && (
              <ToggleSectionIcon
                open={openData}
                onToggle={handleToggleOpenData}
              />
            )}
            <Box>
              <Box component="span" className={classes.criteriaLabel}>
                {i18Mbo('LB_CRITERIA')} #{index + 1}
                {isDetailPage && !!criteriaRequestDraft && ':'}
              </Box>
              {isDetailPage && !!criteriaRequestDraft && (
                <Box className={classes.criteriaNameViewMode} component="span">
                  {criteriaRequestDraft.name}
                </Box>
              )}
            </Box>
          </Box>
          <Box className={classes.headerActions}>
            <CardFormActions
              useDeleteIcon={useDeleteIcon}
              useDetailCreateMode={
                !criteriaRequestDraft && !!useEditMode && isDetailPage
              }
              useDetailViewMode={!useEditMode && isDetailPage}
              useDetailEditMode={
                useEditMode && !!criteriaRequestDraft && isDetailPage
              }
              onOpenEditMode={handleOpenEditMode}
              onCancelEditMode={handleCancelEditMode}
              buttonUseDetailEditDisabled={buttonUseDetailEditDisabled}
              onSaveAs={handleSaveAsClick}
              onDeleteIconClick={handleDeleteIconCriteriaClick}
              onCreateClick={handleAddNewACriteria}
            />
          </Box>
        </Box>
        {!useEditMode && openData && (
          <CriteriaRequestItemViewDetail criteriaSelection={criteriaRequest} />
        )}
        {(useEditMode || !isDetailPage) && (
          <Box className={classes.listFields}>
            <Box className={classes.width600}>
              <InputTextLabel
                required
                maxLength={CRITERIA_TEXT_MAX_LENGTH}
                error={!!errors.name && !!touched.name}
                errorMessage={errors?.name as string}
                keyName="name"
                value={criteriaRequestItem.name}
                label={i18Mbo('LB_CRITERIA_NAME')}
                placeholder={i18Mbo('PLH_CRITERIA_NAME')}
                onChange={handleTextChange}
              />
            </Box>
            <Box className={classes.width600}>
              <InputTextArea
                keyName="description"
                defaultValue={criteriaRequestItem.description}
                label={i18('LB_DESCRIPTION') || ''}
                placeholder={i18('PLH_DESCRIPTION')}
                onChange={handleTextChange}
              />
            </Box>
            <FormItem required label={i18Mbo('LB_EVALUATION_SCALE')}>
              <Box className={classes.evaluationScale}>
                {criteriaRequestItem.criteriaDetail.map(
                  (
                    criteriaDetailRequest: ICriteriaDetailRequest,
                    index: number
                  ) => (
                    <CriteriaDetailRequestItem
                      listScoresExist={listScoresExist}
                      errors={errors.criteriaDetail?.[index] || {}}
                      touched={touched.criteriaDetail?.[index] || {}}
                      key={criteriaDetailRequest.id}
                      index={index}
                      criteriaDetailRequestsCounter={
                        criteriaRequestItem.criteriaDetail.length
                      }
                      criteriaDetailRequest={criteriaDetailRequest}
                      onChange={handleCriteriaDetailRequestChange}
                      onDeleteIconClick={handleDeleteIconEvaluationClick}
                    />
                  )
                )}
              </Box>
            </FormItem>
            {criteriaRequestItem.criteriaDetail.length <
              MAX_EVALUATION_SCALE && (
              <Box>
                <ButtonAddPlus
                  label={i18('LB_ADD_A_NEW_ROW')}
                  onClick={handleAddNewEvaluationScale}
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Fragment>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  criteriaRequestItem: {
    border: `1px solid ${theme.color.grey.primary}`,
    borderRadius: '4px',
    padding: theme.spacing(2),
  },
  criteriaRequestItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontWeight: 700,
    color: theme.color.blue.primary,
    borderRadius: '3px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(0.5),
  },
  listFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    marginTop: theme.spacing(3),
  },
  evaluationScale: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  deleteIcon: {
    color: theme.color.black.secondary,
    cursor: 'pointer',
    '&:hover': {
      color: theme.color.error.primary,
    },
  },
  headerActions: {
    display: 'flex',
    gap: theme.spacing(0.6),
  },
  buttonIcon: {
    cursor: 'pointer',
    color: theme.color.black.secondary,
    '&:hover': {
      color: theme.color.blue.primary,
    },
    '&.disable': {
      pointerEvents: 'none',
    },
    '&.active': {
      color: theme.color.blue.primary,
    },
    '&.cancel:hover': {
      color: `${theme.color.error.primary}`,
    },
    '&.cancel': {
      marginLeft: theme.spacing(0.5),
    },
  },
  criteriaNameViewMode: {
    display: 'inline-block',
    color: theme.color.black.primary,
    fontSize: 18,
  },
  criteriaLabel: {
    marginRight: theme.spacing(0.5),
  },
  width600: {
    width: 600,
  },
}))

export default CriteriaRequestItem

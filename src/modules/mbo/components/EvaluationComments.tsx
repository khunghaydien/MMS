import CardAvatar from '@/components/common/CardAvatar'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import CommonTabs from '@/components/tabs'
import { AuthState, selectAuth } from '@/reducer/auth'
import { AppDispatch } from '@/store'
import { OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { IAppraiser } from '../models'
import {
  EvaluationProcessState,
  addCommentForReviewer,
  deleteComment,
  evaluationProcessSelector,
} from '../reducer/evaluation-process'

import ConditionalRender from '@/components/ConditionalRender'
import CardFormActions from '@/components/Form/CardForm/CardFormActions'
import InputFormText from '@/components/inputs/InputFormText'
import DialogBox from '@/components/modal/DialogBox'
import ModalConfirm from '@/components/modal/ModalConfirm'
import { useCallbackPrompt } from '@/hooks/useCallbackPrompt'
import { alertSuccess } from '@/reducer/screen'
import EvaluationCommentsItem from './EvaluationCommentsItem'

interface EvaluationCommentsProps {
  listAppraisers: IAppraiser[]
  evaluationCycleId: string
  taskId: string
  commentReviewer: any
  evaluationPeriodId: string
  onSubmitComment: (payload: {
    taskId: number | string
    comment: string
  }) => void
  isApproved: boolean
}

const EvaluationComments = ({
  listAppraisers,
  evaluationCycleId,
  taskId,
  commentReviewer,
  evaluationPeriodId,
  onSubmitComment,
  isApproved,
}: EvaluationCommentsProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const { staff }: AuthState = useSelector(selectAuth)
  const { cycleInformation }: EvaluationProcessState = useSelector(
    evaluationProcessSelector
  )

  const [activeTab, setActiveTab] = useState(1)
  const [comment, setComment] = useState('')
  const [commentTemp, setCommentTemp] = useState('')
  const [toggleDeleteModal, setToggleDeleteModal] = useState(false)
  const [toggleEditMode, setToggleEdit] = useState(false)
  const [toggleModelConfirm, setToggleModelConfirm] = useState(false)
  const [showDialog, setShowDialog] = useState<boolean>(true)
  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(showDialog)

  const isTabReviewer =
    listAppraisers[activeTab - 1]?.code == commentReviewer?.appraiser?.code

  const isCommentChanged = comment === commentTemp
  const tabs = useMemo(
    () =>
      listAppraisers?.map((item: IAppraiser, index: number) => ({
        step: index + 1,
        label: item.name,
      })) || [],
    [listAppraisers]
  )

  const multiComment = useMemo(() => {
    let _multiComment: OptionItem[] = []
    listAppraisers[activeTab - 1]?.taskEvaluationDetails?.forEach(
      (item: any) => {
        if (!!item.comment) {
          _multiComment.push({
            id: item.criteria.id,
            comment: item.comment,
            name: item.criteria.name,
          })
        }
      }
    )
    return _multiComment
  }, [activeTab])

  const handleActiveTab = (value: number) => {
    setActiveTab(value)
  }

  const handleSendComment = () => {
    dispatch(
      addCommentForReviewer({
        evaluationCycleId,
        taskId,
        comment,
        evaluationCycleStaffId: cycleInformation.evaluationCycleStaffId || '',
        evaluationPeriodId,
      })
    )
      .unwrap()
      .then(() => {
        setComment(comment.trim())
        setCommentTemp(comment.trim())
        setToggleEdit(false)
        onSubmitComment({ taskId, comment: comment.trim() })
      })
  }

  const handleChangeInput = useCallback((value: string) => {
    setComment(value)
  }, [])

  const handleDeleteComment = () => {
    dispatch(
      deleteComment({
        evaluationCycleId,
        taskId,
        evaluationCycleStaffId: cycleInformation.evaluationCycleStaffId || '',
        evaluationPeriodId,
      })
    )
      .unwrap()
      .then(() => {
        onSubmitComment({ taskId, comment: '' })
        dispatch(
          alertSuccess({
            message: i18('MSG_DELETE_SUCCESS', {
              labelName: i18('LB_COMMENT'),
            }),
          })
        )
        setCommentTemp('')
      })
  }

  const handleToggleDeleteModal = () => {
    setToggleDeleteModal(current => !current)
  }

  const handleToggleConfirmModal = () => {
    if (commentTemp === comment) {
      setToggleEdit(current => !current)
    } else {
      setToggleModelConfirm(current => !current)
    }
  }

  const handleClickEditMode = () => {
    setToggleEdit(current => !current)
  }

  useEffect(() => {
    setCommentTemp(commentReviewer.comment?.trim() || '')
    setComment(commentReviewer.comment?.trim() || '')
  }, [commentReviewer?.comment])

  useEffect(() => {
    setShowDialog(!isCommentChanged)
  }, [comment, commentTemp])

  useEffect(() => {
    let indexAppraiserCurrent = 0
    listAppraisers.forEach((item: IAppraiser, index: number) => {
      if (item.code == staff?.code) {
        indexAppraiserCurrent = index
      }
    })
    if (!!indexAppraiserCurrent) {
      setActiveTab(indexAppraiserCurrent + 1)
    }
  }, [listAppraisers, staff])
  return (
    <Box className={classes.rootEvaluationComments}>
      <Box className={classes.title}>{i18('LB_COMMENT')}</Box>
      <CommonTabs
        disabled={false}
        configTabs={tabs}
        activeTab={activeTab}
        onClickTab={handleActiveTab}
      />
      <Box className={classes.commentContent}>
        <Box className={classes.headerComment}>
          <Box className={classes.author}>
            <CardAvatar info={{ name: listAppraisers[activeTab - 1]?.name }} />
          </Box>
          <ConditionalRender
            conditional={
              activeTab == listAppraisers.length &&
              staff?.code === commentReviewer?.appraiser?.code &&
              !!commentTemp
            }
          >
            <Box className={classes.commentHeaderRight}>
              <CardFormActions
                isApproved={isApproved}
                useDeleteIcon={!toggleEditMode}
                useDetailViewMode={!toggleEditMode}
                useDetailEditMode={toggleEditMode}
                onOpenEditMode={handleClickEditMode}
                onCancelEditMode={handleToggleConfirmModal}
                buttonUseDetailEditDisabled={isCommentChanged}
                onSaveAs={handleSendComment}
                onDeleteIconClick={handleToggleDeleteModal}
              />
              <Box className={classes.buttonDelete}>
                {toggleDeleteModal && (
                  <ModalDeleteRecords
                    open={true}
                    onClose={handleToggleDeleteModal}
                    labelSubmit={i18('LB_DELETE')}
                    onSubmit={handleDeleteComment}
                    titleMessage={i18('LB_DELETE_COMMENT')}
                    subMessage={i18('MSG_CONFIRM_DELETE_COMMENT')}
                  />
                )}
                {toggleModelConfirm && (
                  <ModalConfirm
                    open={true}
                    title={i18('LB_CANCEL')}
                    description={i18('MSG_DESCRIPTION_CONFIRM_LEAVE')}
                    onClose={handleToggleConfirmModal}
                    titleSubmit={i18('LB_CANCEL') || ''}
                    onSubmit={handleClickEditMode}
                  />
                )}
                <DialogBox
                  // @ts-ignore
                  showDialog={showPrompt}
                  confirmNavigation={confirmNavigation}
                  cancelNavigation={cancelNavigation}
                />
              </Box>
            </Box>
          </ConditionalRender>
        </Box>
        <Box className={classes.commentItem}>
          {isTabReviewer ? (
            <Box>
              <ConditionalRender conditional={!!commentTemp}>
                {!toggleEditMode ? (
                  <Box className={classes.commentReviewer}>
                    <Box>{commentTemp}</Box>
                  </Box>
                ) : (
                  <Box className={classes.commentContainer}>
                    <InputFormText
                      disabled={isApproved}
                      placeholder={i18('PLH_COMMENT')}
                      defaultValue={commentTemp}
                      useSubmit={false}
                      onChange={handleChangeInput}
                    />
                  </Box>
                )}
              </ConditionalRender>
              <ConditionalRender conditional={!commentTemp}>
                <ConditionalRender
                  conditional={
                    activeTab == listAppraisers.length &&
                    staff?.code === commentReviewer?.appraiser?.code
                  }
                >
                  <Box className={classes.commentContainer}>
                    <InputFormText
                      disabled={isApproved}
                      placeholder={i18('PLH_COMMENT')}
                      defaultValue={commentTemp}
                      onChange={handleChangeInput}
                      onSubmit={handleSendComment}
                    />
                  </Box>
                </ConditionalRender>
                <ConditionalRender
                  conditional={
                    !(
                      activeTab == listAppraisers.length &&
                      staff?.code === commentReviewer?.appraiser?.code
                    )
                  }
                >
                  <Box className={classes.noComment}>
                    {i18('LB_NO_COMMENT')}
                  </Box>
                </ConditionalRender>
              </ConditionalRender>
            </Box>
          ) : (
            <EvaluationCommentsItem
              comment={listAppraisers[activeTab - 1]?.comment}
              multiComment={multiComment}
            />
          )}
        </Box>
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootEvaluationComments: {},
  headerComment: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  commentHeaderRight: {
    display: 'flex',
    flexDirection: 'row',
  },
  title: {
    fontWeight: 700,
    fontSize: 14,
  },
  commentContent: {
    borderRadius: '4px',
    border: `1px solid ${theme.color.grey.secondary}`,
    padding: theme.spacing(2),
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
  },
  noComment: {
    color: theme.color.grey.primary,
  },
  author: {
    flex: 1,
    fontWeight: 700,
    fontSize: 14,
    marginBottom: theme.spacing(2),
  },
  commentItem: {},
  option: {
    display: 'flex',
    alignItems: 'stretch',
    gap: theme.spacing(1),
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  optionCriteriaDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  label: {
    fontWeight: 700,
    fontSize: 14,
    width: '220px',
    minWidth: '220px',
    maxWidth: '220px',
  },
  commentReviewer: {
    display: 'flex',
    gap: theme.spacing(1),
    fontSize: 14,
    lineHeight: '20px',
  },
  buttonDelete: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    '& svg': {
      color: theme.color.black.secondary,
      cursor: 'pointer',
    },
    '& svg:hover': {
      color: theme.color.error.primary,
    },
  },
  commentContainer: {
    marginTop: theme.spacing(1),
  },
  buttonWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    border: `1px solid ${theme.color.grey.primary}`,
    borderRadius: '5px',
    cursor: 'pointer',
    backgroundColor: theme.color.blue.primary,
    borderColor: theme.color.blue.primary,
    color: '#FFFFFF !important',
    transition: 'all .1s',
    '&.disabled': {
      pointerEvents: 'none',
      color: 'rgba(0, 0, 0, 0.26) !important',
      boxShadow: 'none',
      borderColor: 'rgba(0, 0, 0, 0.12)',
      backgroundColor: 'rgba(0, 0, 0, 0.12)',
    },
    '& svg': {
      fontSize: 20,
    },
    '&:hover': {
      backgroundColor: theme.color.orange.primary,
      borderColor: theme.color.orange.primary,
      color: '#FFFFFF !important',
      '& *': {
        color: '#FFFFFF !important',
      },
    },
  },
}))

export default EvaluationComments

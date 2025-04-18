import ConditionalRender from '@/components/ConditionalRender'
import { FieldListOptions } from '@/components/Form/CardForm/CardFormModeView'
import ButtonHeaderActions from '@/components/common/ButtonHeaderActions'
import StatusItem, { IStatusType } from '@/components/common/StatusItem'
import ToggleSectionIcon from '@/components/icons/ToggleSectionIcon'
import ModalConfirm from '@/components/modal/ModalConfirm'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import CommonTabs from '@/components/tabs'
import { LangConstant } from '@/const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { formatDate } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import {
  APPRAISEES_EVALUATED,
  APPRAISER_1_EVALUATED,
  APPRAISER_2_EVALUATED,
  APPROVED,
  DRAFT,
  EVALUATION_PERIOD_STEP,
  NOT_APPROVED,
  REJECTED,
  REVIEWER_EVALUATED,
} from '../const'
import {
  EvaluationProcessState,
  evaluationProcessSelector,
} from '../reducer/evaluation-process'
import AttitudeItem from './EvaluationItem/AttitudeItem'
import TaskItem from './EvaluationItem/TaskItem'

const KEY_MODAL_CONFIRM_DELETE = 'delete'
const KEY_MODAL_CONFIRM_APPROVE = 'approve'
const KEY_MODAL_CONFIRM_REVERT = 'revert'
const KEY_MODAL_CONFIRM_REJECT = 'reject'
const KEY_MODAL_CONFIRM_CLEAR = 'clear'
const KEY_MODAL_CONFIRM_REVIEW = 'review'

interface EvaluationPeriodProps {
  index: number
  onApprove: (name: string) => void
  onDelete: () => void
  onEdit: (keyName: string) => void
  onEvaluate: () => void
  onRevert: (name: string) => void
  onReject: (name: string) => void
  onClear: (name: string) => void
  onSaveDraftEvaluate: (name: string) => void
  onSubmitAnyway: () => void
  evaluationPeriodItem: any
  isApproved: boolean
  isReviewEvaluate?: boolean
}

const EvaluationPeriodItem = ({
  index,
  onEdit,
  onApprove,
  onDelete,
  onEvaluate,
  onRevert,
  onReject,
  onClear,
  onSubmitAnyway,
  onSaveDraftEvaluate,
  evaluationPeriodItem,
  isApproved,
  isReviewEvaluate,
}: EvaluationPeriodProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation(LangConstant.NS_COMMON)
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)
  const { cycleInformation }: EvaluationProcessState = useSelector(
    evaluationProcessSelector
  )
  const { staff }: AuthState = useSelector(selectAuth)

  const tabs = [
    {
      step: EVALUATION_PERIOD_STEP.JOB_RESULT,
      label: i18Mbo('LB_JOB_RESULT'),
      disabled: evaluationPeriodItem.jobResults.length === 0,
    },
    {
      step: EVALUATION_PERIOD_STEP.ATTITUDE,
      label: i18Mbo('LB_ATTITUDE'),
      disabled: evaluationPeriodItem.attitudes.length === 0,
    },
  ]

  const [evaluationPeriodItemLocal, setEvaluationPeriodItemLocal] =
    useState(evaluationPeriodItem)
  const [isShowMore, setIsShowMore] = useState(false)
  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [modalConfirmData, setModalConfirmData] = useState({
    title: '',
    description: '',
    titleSubmit: '',
    keyName: '',
  })

  const isAppraisees =
    evaluationPeriodItem.currentLoginRole.appraisees.length > 0

  const isAppraiser_1 =
    evaluationPeriodItem.currentLoginRole.appraiser_1.length > 0

  const isAppraiser_2 =
    evaluationPeriodItem.currentLoginRole.appraiser_2.length > 0

  const isReviewer = evaluationPeriodItem.currentLoginRole.reviewer.length > 0
  const isAppraiser12ReviewerEvaluated =
    isReviewer &&
    !!evaluationPeriodItem.attitudes[0]?.taskEvaluations?.appraiser_2?.id &&
    !evaluationPeriodItem.attitudes[0]?.taskEvaluations?.reviewer?.id &&
    evaluationPeriodItem.jobResults.every(
      (task: any) => !!task.taskEvaluations.appraiser_2.id
    )

  const taskProcessStatusList = useMemo(() => {
    const _taskProcessStatusList: any = { attitudes: [], jobResults: [] }
    for (const key in evaluationPeriodItem.currentLoginRole) {
      const roleTaskList = evaluationPeriodItem.currentLoginRole[key]
      if (roleTaskList.length > 0) {
        evaluationPeriodItem.attitudes.forEach((item: any) => {
          if (roleTaskList.includes(item.id)) {
            _taskProcessStatusList.attitudes.push({
              id: item.id,
              processingStatus: item.processingStatus,
            })
          }
        })
        evaluationPeriodItem.jobResults.forEach((item: any) => {
          if (roleTaskList.includes(item.id)) {
            _taskProcessStatusList.jobResults.push({
              id: item.id,
              processingStatus: item.processingStatus,
            })
          }
        })
        break
      }
    }
    return _taskProcessStatusList
  }, [evaluationPeriodItem])

  const processingStatusCheck = (evaluateStatus: number) => {
    for (const key in taskProcessStatusList) {
      if (
        taskProcessStatusList[key].some(
          (item: any) => item.processingStatus === evaluateStatus
        )
      ) {
        return true
      }
    }
    return false
  }
  const isReviewerAppraiser =
    evaluationPeriodItem.attitudes[0]?.taskEvaluations?.appraiser_2?.appraiser
      .id ===
    evaluationPeriodItem.attitudes[0]?.taskEvaluations?.reviewer?.appraiser.id
  const useButtonClear = useMemo(() => {
    let state = false
    if (isApproved) {
      return false
    }
    if (isAppraiser12ReviewerEvaluated) {
      return evaluationPeriodItem.status?.id === REJECTED && isReviewerAppraiser
        ? true
        : state
    }
    if (isAppraiser_1) {
      state = processingStatusCheck(APPRAISER_1_EVALUATED)
    }
    if (isAppraiser_2) {
      state = processingStatusCheck(APPRAISER_2_EVALUATED)
    }
    return state
  }, [
    isAppraiser_1,
    isAppraiser_2,
    isAppraiser12ReviewerEvaluated,
    isReviewerAppraiser,
    isApproved,
  ])

  const useButtonEdit = useMemo(() => {
    let state = false
    if (isApproved) {
      return false
    }
    if (isAppraiser12ReviewerEvaluated) {
      return evaluationPeriodItem.status?.id === REJECTED && isReviewerAppraiser
        ? true
        : state
    }
    if (isAppraisees) {
      state = taskProcessStatusList.jobResults.some(
        (per: any) => per.processingStatus <= APPRAISER_1_EVALUATED
      )
      // && new Date() < new Date(cycleInformation.endDate - 6 * 86400000)
    }
    if (isAppraiser_1) {
      state = processingStatusCheck(APPRAISER_1_EVALUATED)
    }
    if (isAppraiser_2) {
      state = processingStatusCheck(APPRAISER_2_EVALUATED)
    }
    if (isReviewer && evaluationPeriodItem.status?.id === APPROVED) {
      state = true
    }
    return state
  }, [
    isAppraisees,
    isAppraiser_1,
    isAppraiser_2,
    isReviewer,
    evaluationPeriodItem,
    isAppraiser12ReviewerEvaluated,
    isReviewerAppraiser,
    isApproved,
  ])

  const useButtonEvaluate = useMemo(() => {
    if (isApproved) {
      return false
    }
    if (isAppraiser_1) {
      return processingStatusCheck(APPRAISEES_EVALUATED)
    }
    if (isAppraiser_2) {
      for (const key in taskProcessStatusList) {
        if (
          taskProcessStatusList[key].some(
            (item: any) =>
              item.processingStatus === APPRAISER_1_EVALUATED ||
              item.processingStatus === APPRAISEES_EVALUATED
          )
        ) {
          return true
        }
      }
      return false
    }
    return false
  }, [isAppraiser_1, isAppraiser_2, isApproved])

  const isCommonAppraiserEvaluated =
    taskProcessStatusList.attitudes[0]?.processingStatus >=
      APPRAISER_1_EVALUATED ||
    taskProcessStatusList.jobResults.some(
      (per: any) => per.processingStatus >= APPRAISER_1_EVALUATED
    )

  const useButtonDelete = useMemo(() => {
    if (isApproved) {
      return false
    }
    if (isAppraisees) {
      return !isCommonAppraiserEvaluated
      //  &&
      // new Date() < new Date(cycleInformation.endDate - 6 * 86400000)
    }
    return false
  }, [isCommonAppraiserEvaluated, isAppraisees, isApproved])

  const isAppraiser2Evaluated =
    taskProcessStatusList.attitudes.every(
      (per: any) => per.processingStatus === APPRAISER_2_EVALUATED
    ) &&
    taskProcessStatusList.jobResults.every(
      (per: any) => per.processingStatus === APPRAISER_2_EVALUATED
    )

  const useButtonApprove = useMemo(() => {
    if (isApproved) {
      return false
    }
    if (isReviewer) {
      return (
        isAppraiser2Evaluated && evaluationPeriodItem.status?.id !== REJECTED
      )
    }
    return false
  }, [isReviewer, isAppraiser2Evaluated, evaluationPeriodItem, isApproved])

  const useButtonReject = useMemo(() => {
    if (isApproved) {
      return false
    }
    if (isReviewer) {
      return (
        isAppraiser2Evaluated &&
        evaluationPeriodItem.status?.id === NOT_APPROVED
      )
    }
    return false
  }, [
    isReviewer,
    isAppraiser2Evaluated,
    evaluationPeriodItem.status?.id,
    isApproved,
  ])

  const useButtonRevert = useMemo(() => {
    if (isApproved) {
      return false
    }
    if (isReviewer) {
      return processingStatusCheck(REVIEWER_EVALUATED)
    }
    return false
  }, [isReviewer, isApproved])

  const listEvaluationInformation = useMemo(
    () => [
      {
        id: 'evaluationName',
        label: i18Mbo('LB_EVALUATION_NAME'),
        value: evaluationPeriodItem.name,
      },
      {
        id: 'startDate',
        label: i18('LB_START_DATE'),
        value: formatDate(evaluationPeriodItem.startDate),
      },
      {
        id: 'endDate',
        label: i18('LB_END_DATE'),
        value: formatDate(evaluationPeriodItem.endDate),
      },
      {
        id: 'days',
        label: i18('LB_DAYS'),
        value: evaluationPeriodItem.duration,
      },
      {
        id: 'evaluationDate',
        label: i18Mbo('LB_EVALUATION_DATE'),
        value: formatDate(evaluationPeriodItem.evaluateDate),
      },
    ],
    [evaluationPeriodItem]
  )

  const status: IStatusType = useMemo(() => {
    switch (evaluationPeriodItem.status?.id) {
      case NOT_APPROVED:
        return {
          color: 'orange',
          label: i18Mbo('LB_NOT_APPROVED'),
        }
      case APPROVED:
        return {
          color: 'green',
          label: i18Mbo('LB_APPROVED'),
        }
      case DRAFT:
        return {
          color: 'grey',
          label: i18('LB_DRAFT'),
        }
      default:
        return {
          color: 'red',
          label: i18('LB_REJECTED'),
        }
    }
  }, [evaluationPeriodItem.status?.id])

  const handleActiveTab = (value: number) => {
    setActiveTab(value)
  }

  const handleClickEdit = () => {
    if (isAppraisees) {
      onEdit('appraisees')
    }
    if (isAppraiser_1) {
      onEdit('appraiser_1')
    }
    if (isAppraiser_2) {
      onEdit('appraiser_2')
    }
    if (isReviewer) {
      onEdit('reviewer')
    }
  }

  const handleOnShowModal = (keyName: string) => {
    setIsShowModalConfirm(true)
    switch (keyName) {
      case KEY_MODAL_CONFIRM_REVERT: {
        setModalConfirmData({
          title: i18Mbo('LB_REVERT_EVALUATION'),
          description: i18Mbo('MSG_REVERT_EVALUATION'),
          titleSubmit: i18('LB_REVERT'),
          keyName: KEY_MODAL_CONFIRM_REVERT,
        })
        break
      }
      case KEY_MODAL_CONFIRM_REJECT: {
        setModalConfirmData({
          title: i18Mbo('LB_REJECT_EVALUATION'),
          description: i18Mbo('MSG_REJECT_TASK'),
          titleSubmit: i18('LB_REJECT'),
          keyName: KEY_MODAL_CONFIRM_REJECT,
        })
        break
      }
      case KEY_MODAL_CONFIRM_CLEAR: {
        setModalConfirmData({
          title: i18Mbo('LB_ClEAR_EVALUATION'),
          description: i18Mbo('MSG_CLEAR_EVALUATION'),
          titleSubmit: i18('LB_CLEAR_ALL'),
          keyName: KEY_MODAL_CONFIRM_CLEAR,
        })
        break
      }
      case KEY_MODAL_CONFIRM_DELETE: {
        setModalConfirmData({
          title: i18Mbo('TXT_DELETE_EVALUATION'),
          description: i18Mbo('MSG_CONFIRM_DELETE_EVALUATION'),
          titleSubmit: '',
          keyName: KEY_MODAL_CONFIRM_DELETE,
        })
        break
      }
      case KEY_MODAL_CONFIRM_REVIEW: {
        let role = ''
        let name = ''
        if (isAppraiser_1) {
          role = i18Mbo('LB_APPRAISEE')
          name = cycleInformation.staff.name
        }

        if (isAppraiser_2) {
          role = i18Mbo('LB_APPRAISER_1')
          name = ''
        }

        if (isAppraiser_1 && isAppraiser_2) {
          role = i18Mbo('LB_APPRAISEE')
          name = ''
        }

        setModalConfirmData({
          title: i18Mbo('LB_EVALUATION_PERIOD'),
          description: i18Mbo('TXT_CONFIRM_EVALUATE', {
            role,
            name,
          }),
          titleSubmit: i18('LB_REVIEW'),
          keyName: KEY_MODAL_CONFIRM_REVIEW,
        })

        break
      }
    }
  }

  const handleConfirmModal = (keyName: string) => {
    switch (keyName) {
      case KEY_MODAL_CONFIRM_REVERT: {
        onRevert(evaluationPeriodItem.name)
        break
      }
      case KEY_MODAL_CONFIRM_REJECT: {
        onReject(evaluationPeriodItem.name)
        break
      }
      case KEY_MODAL_CONFIRM_CLEAR: {
        onClear(evaluationPeriodItem.name)
        break
      }
      case KEY_MODAL_CONFIRM_DELETE: {
        onDelete()
        break
      }
      case KEY_MODAL_CONFIRM_REVIEW: {
        onEvaluate()
        break
      }
    }
    setIsShowModalConfirm(false)
  }

  const handleIsButtonCustom = (keyName: string) => {
    switch (keyName) {
      case KEY_MODAL_CONFIRM_CLEAR: {
        return i18('LB_SAVE_DRAFT')
      }
      case KEY_MODAL_CONFIRM_REVIEW: {
        return i18Mbo('LB_SUBMIT_ANYWAY')
      }
      default: {
        return ''
      }
    }
  }

  const handleConfirmModalCustomButton = (keyName: string) => {
    switch (keyName) {
      case KEY_MODAL_CONFIRM_REVIEW: {
        onSubmitAnyway()
        break
      }
      case KEY_MODAL_CONFIRM_CLEAR: {
        onSaveDraftEvaluate(evaluationPeriodItem.name)
        break
      }
    }
  }

  const handleSubmitCommentSuccess = (payload: any) => {
    const isReviewerAppraiser2 =
      staff?.id == payload.task?.taskEvaluations?.appraiser_2?.appraiser?.id
    const newEvaluationperiodItem = { ...evaluationPeriodItemLocal }
    isReviewerAppraiser2
      ? (newEvaluationperiodItem[payload.field][payload.index].taskEvaluations[
          'appraiser_2'
        ].comment = payload.comment)
      : (newEvaluationperiodItem[payload.field][payload.index].comment =
          payload.comment)
    setEvaluationPeriodItemLocal(newEvaluationperiodItem)
  }

  useLayoutEffect(() => {
    const listActiveTabs: any = tabs.filter(tab => !tab.disabled)
    if (listActiveTabs[0] && listActiveTabs[0].step !== activeTab) {
      setActiveTab(listActiveTabs[0].step)
    }
  }, [])

  useEffect(() => {
    setEvaluationPeriodItemLocal(evaluationPeriodItem)
  }, [evaluationPeriodItem])

  useEffect(() => {
    if (isReviewEvaluate) {
      setIsShowMore(true)
    }
  }, [isReviewEvaluate])

  return (
    <Box className={classes.rootEvaluationPeriodItem}>
      <Box className={classes.header}>
        <Box className={classes.titleWrapper}>
          <Box className={classes.nameWrapper}>
            <ToggleSectionIcon
              open={isShowMore}
              onToggle={() => setIsShowMore(!isShowMore)}
            />
            <Box className={classes.name}>
              <Box component="span">
                {`${i18Mbo('LB_EVALUATION_PERIOD')} #${index + 1}: `}
              </Box>
              <Box component="span">{evaluationPeriodItem.name}</Box>
            </Box>
            <StatusItem typeStatus={status} />
          </Box>
          <ButtonHeaderActions
            configs={{
              useButtonEvaluate: useButtonEvaluate,
              useButtonDelete: useButtonDelete,
              useButtonEdit: useButtonEdit,
              useButtonApprove: useButtonApprove,
              useButtonReject: useButtonReject,
              useButtonRevert: useButtonRevert,
              useButtonClear: useButtonClear,
            }}
            callback={{
              onClickDelete: () => handleOnShowModal(KEY_MODAL_CONFIRM_DELETE),
              onClickEdit: handleClickEdit,
              onClickEvaluate: onEvaluate,
              onClickRevert: () => handleOnShowModal(KEY_MODAL_CONFIRM_REVERT),
              onClickApprove: () => onApprove(evaluationPeriodItem.name),
              onClickReject: () => handleOnShowModal(KEY_MODAL_CONFIRM_REJECT),
              onClickClear: () => handleOnShowModal(KEY_MODAL_CONFIRM_CLEAR),
            }}
          />
        </Box>
      </Box>

      <ConditionalRender conditional={isShowMore}>
        <Box className={classes.body}>
          <FieldListOptions
            dataRendering={listEvaluationInformation}
            isVertical={false}
          />
          <CommonTabs
            disabled={false}
            configTabs={tabs}
            activeTab={activeTab}
            onClickTab={handleActiveTab}
          />

          <ConditionalRender
            conditional={activeTab === EVALUATION_PERIOD_STEP.JOB_RESULT}
          >
            <Box className={classes.taskList}>
              {evaluationPeriodItemLocal.jobResults.map(
                (item: any, index: number) => (
                  <TaskItem
                    evaluationPeriodId={evaluationPeriodItem.id}
                    key={index}
                    taskItem={item}
                    index={index}
                    onSubmitComment={payload =>
                      handleSubmitCommentSuccess({
                        task: item,
                        index,
                        ...payload,
                        field: 'jobResults',
                      })
                    }
                    isApproved={isApproved}
                  />
                )
              )}
            </Box>
          </ConditionalRender>

          <ConditionalRender
            conditional={activeTab === EVALUATION_PERIOD_STEP.ATTITUDE}
          >
            <Box className={classes.taskList}>
              <AttitudeItem
                taskItem={evaluationPeriodItemLocal.attitudes[0]}
                evaluationPeriodId={evaluationPeriodItem.id}
                onSubmitComment={payload =>
                  handleSubmitCommentSuccess({
                    task: evaluationPeriodItemLocal.attitudes[0],
                    index: 0,
                    ...payload,
                    field: 'attitudes',
                  })
                }
                isApproved={isApproved}
              />
            </Box>
          </ConditionalRender>
        </Box>
      </ConditionalRender>

      <ConditionalRender conditional={modalConfirmData.keyName !== 'delete'}>
        <ModalConfirm
          colorButtonCustom={
            modalConfirmData.keyName === KEY_MODAL_CONFIRM_CLEAR
              ? 'inherit'
              : 'primary'
          }
          open={isShowModalConfirm}
          title={modalConfirmData.title}
          description={modalConfirmData.description}
          titleSubmit={modalConfirmData.titleSubmit || ''}
          onClose={() => setIsShowModalConfirm(false)}
          onSubmit={() => handleConfirmModal(modalConfirmData.keyName)}
          isButtonCustom={!!handleIsButtonCustom(modalConfirmData.keyName)}
          labelButtonCustom={handleIsButtonCustom(modalConfirmData.keyName)}
          onSubmitCustom={() =>
            handleConfirmModalCustomButton(modalConfirmData.keyName)
          }
        />
      </ConditionalRender>

      <ConditionalRender conditional={modalConfirmData.keyName === 'delete'}>
        <ModalDeleteRecords
          open={isShowModalConfirm}
          titleMessage={i18Mbo('TXT_DELETE_EVALUATION')}
          subMessage={i18Mbo('MSG_CONFIRM_DELETE_EVALUATION', {
            evaluationName: evaluationPeriodItem.name,
          })}
          onClose={() => setIsShowModalConfirm(false)}
          onSubmit={() => handleConfirmModal(modalConfirmData.keyName)}
        />
      </ConditionalRender>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootEvaluationPeriodItem: {
    borderRadius: '4px',
    border: `1px solid ${theme.color.grey.secondary}`,
    padding: theme.spacing(2),
  },

  title: {
    flex: 1,
    fontWeight: 700,
    color: theme.color.blue.primary,
    borderRadius: '3px',
    display: 'grid',
    gridTemplateColumns: '0.1fr 10fr 1fr',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },
  wrapTaskTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  taskAndEvaluationLabel: {
    marginRight: theme.spacing(0.5),
  },
  taskAndEvaluationValue: {
    display: 'inline-block',
    color: theme.color.black.primary,
    fontSize: 18,
  },
  body: {
    marginTop: theme.spacing(3),
  },
  label: {
    fontWeight: 700,
    fontSize: 14,
    maxWidth: theme.spacing(15),
  },
  taskScore: {
    border: '1px solid',
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  toolTipScore: {
    padding: theme.spacing(0.5),
    '& .toolTipName': {
      fontWeight: 700,
      fontSize: 12,
    },
    '& .toolTipDescription': {
      display: 'flex',
      alignItems: 'center',
    },
  },
  buttonWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    border: `1px solid ${theme.color.grey.primary}`,
    borderRadius: '50px',
    cursor: 'pointer',
    backgroundColor: theme.color.blue.primary,
    borderColor: theme.color.blue.primary,
    color: '#FFFFFF !important',
    transition: 'all .1s',
    '&.disabled': {
      pointerEvents: 'none',
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
    '&.delete:hover': {
      backgroundColor: theme.color.error.primary,
      borderColor: theme.color.error.primary,
    },
  },
  status: {
    fontSize: 14,
    fontWeight: 700,
    '&.approved': {
      color: theme.color.green.primary,
    },
    '&.not-approved': {
      color: theme.color.error.primary,
    },
  },
  wrapButtonDeleteAndEdit: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  taskList: {
    display: 'flex',
    gap: theme.spacing(1),
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    width: '100%',
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
    justifyContent: 'space-between',
    width: '100%',
  },
  nameWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  name: {
    maxWidth: 700,
    '& span:first-child': {
      color: theme.color.blue.primary,
      fontWeight: 700,
    },
    '& span:last-child': {
      wordBreak: 'break-all',
    },
  },
}))
export default EvaluationPeriodItem

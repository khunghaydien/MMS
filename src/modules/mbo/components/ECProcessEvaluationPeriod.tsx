import ConditionalRender from '@/components/ConditionalRender/index.js'
import ButtonAddWithIcon from '@/components/buttons/ButtonAddWithIcon.js'
import NoData from '@/components/common/NoData.js'
import LoadingSkeleton from '@/components/loading/LoadingSkeleton.js'
import { useQuery } from '@/hooks/useQuery.js'
import { AuthState, selectAuth } from '@/reducer/auth.js'
import { AppDispatch } from '@/store.js'
import { removeTime } from '@/utils/index.js'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { LangConstant } from '../../../const/index.js'
import {
  APPRAISEES_EVALUATED,
  APPRAISER_1_EVALUATED,
  APPRAISER_2_EVALUATED,
  DRAFT,
  MY_EVALUATION,
  NOT_APPROVED,
  REVIEWER_EVALUATED,
} from '../const.js'
import {
  EvaluationProcessState,
  approveEvaluationPeriod,
  clearEvaluationPeriod,
  createEvaluationPeriod,
  deleteEvaluationPeriod,
  evaluateEvaluationPeriod,
  evaluationProcessSelector,
  getEvaluationPeriod,
  revertEvaluationPeriod,
  updateEvaluationPeriod,
} from '../reducer/evaluation-process.js'
import EvaluationPeriodItem from './EvaluationPeriodItem.js'
import { EVERY, GENERAL } from './FormEvaluationComments.js'
import ModalEvaluateEvaluationPeriod from './ModalEvaluateEvaluationPeriod.js'
import ModalEvaluationPeriod from './ModalEvaluationPeriod.js'
interface ECProcessEvaluationPeriodProps {
  tabEvaluation: number
  evaluationCycleId: string
  dispatchGetECStaffGeneralInfo: Function
  isApproved: boolean
}

const ECProcessEvaluationPeriod = ({
  tabEvaluation,
  evaluationCycleId,
  dispatchGetECStaffGeneralInfo,
  isApproved,
}: ECProcessEvaluationPeriodProps) => {
  const classes = useStyles()
  const queryParams = useQuery()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()

  const { cycleInformation }: EvaluationProcessState = useSelector(
    evaluationProcessSelector
  )
  const { staff }: AuthState = useSelector(selectAuth)

  const [loading, setLoading] = useState(false)
  const [evaluationPeriodList, setEvaluationPeriodList] = useState([])
  const [evaluationPeriodItem, setEvaluationPeriodItem] = useState<any>({})
  const [isShowModalAdd, setIsShowModalAdd] = useState(false)
  const [isShowModalEdit, setIsShowModalEdit] = useState(false)
  const [isShowModalEvaluate, setIsShowModalEvaluate] = useState(false)
  const [isShowModalEditEvaluate, setIsShowModalEditEvaluate] = useState(false)
  const [isNotEvaluated, setIsNotValuated] = useState(false)

  const isShowButtonAddTask = useMemo(
    () =>
      (cycleInformation.startDate < removeTime(new Date()).getTime() ||
        cycleInformation.startDate - removeTime(new Date()).getTime() <=
          86400000) &&
      // new Date() < new Date(cycleInformation.endDate - 6 * 86400000) &&
      cycleInformation.evaluationCycleStaffStatus.id == NOT_APPROVED &&
      staff?.id == cycleInformation.staff?.id,
    [cycleInformation, staff]
  )

  const isAppraisees =
    evaluationPeriodItem?.currentLoginRole?.appraisees.length > 0

  const isAppraiser_1 =
    evaluationPeriodItem?.currentLoginRole?.appraiser_1.length > 0

  const isAppraiser_2 =
    evaluationPeriodItem?.currentLoginRole?.appraiser_2.length > 0

  const isShowSaveDraftButton = useMemo(() => {
    if (isAppraisees) {
      return evaluationPeriodItem.status.id === DRAFT
    }
    if (isAppraiser_1) {
      return evaluationPeriodItem.processingStatus < APPRAISER_1_EVALUATED
    }
    if (isAppraiser_2) {
      return evaluationPeriodItem.processingStatus < APPRAISER_2_EVALUATED
    }
    return false
  }, [evaluationPeriodItem])

  const checkRole = (
    role: string,
    taskId: number,
    _evaluationPeriodItem: any
  ) => {
    return _evaluationPeriodItem?.currentLoginRole[role]?.includes(taskId)
  }

  const filterEvaluateAbleTask = (_evaluationPeriodItem: any) => {
    let jobResults: any[] = []
    let attitudes: any[] = []
    _evaluationPeriodItem.jobResults.forEach((item: any) => {
      if (checkRole('appraisees', item.id, _evaluationPeriodItem)) {
        if (item.processingStatus === APPRAISEES_EVALUATED) {
          jobResults.push(item)
        }
      }
      if (checkRole('appraiser_1', item.id, _evaluationPeriodItem)) {
        if (
          item.processingStatus === APPRAISEES_EVALUATED ||
          item.processingStatus === APPRAISER_1_EVALUATED
        ) {
          jobResults.push(item)
        }
      }
      if (checkRole('appraiser_2', item.id, _evaluationPeriodItem)) {
        if (
          item.processingStatus === APPRAISEES_EVALUATED ||
          item.processingStatus === APPRAISER_1_EVALUATED ||
          item.processingStatus === APPRAISER_2_EVALUATED
        ) {
          const isExitsJobResults = jobResults.some(
            jobResult => jobResult.id === item.id
          )
          if (
            !isExitsJobResults &&
            (item.processingStatus !== APPRAISEES_EVALUATED ||
              (item.processingStatus === APPRAISEES_EVALUATED &&
                item?.taskEvaluations?.appraiser_1?.appraiser?.id ===
                  item?.taskEvaluations?.appraiser_2?.appraiser?.id))
          ) {
            jobResults.push(item)
          }
          if (
            item.processingStatus === APPRAISEES_EVALUATED &&
            item?.taskEvaluations?.appraiser_1?.appraiser?.id !==
              item?.taskEvaluations?.appraiser_2?.appraiser?.id
          ) {
            setIsNotValuated(true)
          } else {
            setIsNotValuated(false)
          }
        }
      }
      if (checkRole('reviewer', item.id, _evaluationPeriodItem)) {
        if (item.processingStatus === REVIEWER_EVALUATED) {
          jobResults.push(item)
        }
      }
    })

    _evaluationPeriodItem.attitudes.forEach((item: any) => {
      if (checkRole('appraisees', item.id, _evaluationPeriodItem)) {
        if (item.processingStatus === APPRAISEES_EVALUATED) {
          attitudes.push(item)
        }
      }
      if (checkRole('appraiser_1', item.id, _evaluationPeriodItem)) {
        if (
          item.processingStatus === APPRAISEES_EVALUATED ||
          item.processingStatus === APPRAISER_1_EVALUATED
        ) {
          attitudes.push(item)
        }
      }
      if (checkRole('appraiser_2', item.id, _evaluationPeriodItem)) {
        if (
          item.processingStatus === APPRAISEES_EVALUATED ||
          item.processingStatus === APPRAISER_1_EVALUATED ||
          item.processingStatus === APPRAISER_2_EVALUATED
        ) {
          const isExitsattitudes = attitudes.some(
            attitude => attitude.id === item.id
          )
          if (!isExitsattitudes) {
            attitudes.push(item)
          }
        }
      }
      if (checkRole('reviewer', item.id, _evaluationPeriodItem)) {
        if (item.processingStatus === REVIEWER_EVALUATED) {
          attitudes.push(item)
        }
      }
    })

    return { ..._evaluationPeriodItem, jobResults, attitudes }
  }

  const handleToggleModal = ({
    id,
    type,
    role,
    evaluationName,
  }: {
    id: string
    type: string
    role?: string
    evaluationName?: string
  }) => {
    const _evaluationPeriodItem = evaluationPeriodList.find(
      (item: any) => item.id == id
    )
    setEvaluationPeriodItem(filterEvaluateAbleTask(_evaluationPeriodItem) || {})
    if (type === 'edit') {
      if (role === 'appraisees') {
        setEvaluationPeriodItem(_evaluationPeriodItem)
        setIsShowModalEdit(true)
      } else if (
        role === 'appraiser_1' ||
        role === 'appraiser_2' ||
        role === 'reviewer'
      ) {
        setEvaluationPeriodItem(
          filterEvaluateAbleTask(_evaluationPeriodItem) || {}
        )
        setIsShowModalEditEvaluate(true)
      }
    } else if (type === 'evaluate') {
      setEvaluationPeriodItem(
        filterEvaluateAbleTask(_evaluationPeriodItem) || {}
      )
      setIsShowModalEvaluate(true)
    } else if (type === 'submitAnyway') {
      setEvaluationPeriodItem(
        filterEvaluateAbleTask(_evaluationPeriodItem) || {}
      )
      setTimeout(() => {
        handleSubmitAnyway()
      }, 500)
    }
  }

  const convertData = (value: any, keyName?: string) => {
    let _attitude: any = {}
    let _requestData: any = {}
    if (keyName === 'evaluate') {
      const isAttitudeEmpty = Object.keys(value.attitudes).length === 0
      _requestData = {
        taskEvaluationRequests: value.taskRequests.map((taskRequest: any) => ({
          taskId: typeof taskRequest.id === 'number' ? taskRequest.id : null,
          comment:
            taskRequest.commentType === GENERAL
              ? taskRequest.comment || ''
              : null,
          difficultyId: Number(taskRequest.difficultyId) || null,
          reasonDifficulty: taskRequest.reasonDifficulty,
          isJobResult: true,
          taskEvaluationDetails: taskRequest.taskEvaluationDetails?.map(
            (item: any) => ({
              criteriaDetailId:
                Number(item.criteriaDetailId) === 0
                  ? null
                  : Number(item.criteriaDetailId),
              comment:
                taskRequest.commentType === EVERY ? item.comment || '' : null,
            })
          ),
        })),
      }

      if (!isAttitudeEmpty) {
        _attitude = {
          taskId:
            typeof value.attitudes[0].id === 'number'
              ? value.attitudes[0].id
              : null,
          comment:
            value.attitudes[0]?.commentType === GENERAL
              ? value.attitudes[0]?.comment || ''
              : '',
          difficultyId: null,
          isJobResult: false,
          taskEvaluationDetails: value.attitudes[0].taskEvaluationDetails?.map(
            (item: any) => ({
              criteriaDetailId:
                Number(item.criteriaDetailId) === 0
                  ? null
                  : Number(item.criteriaDetailId),
              comment:
                value.attitudes[0]?.commentType === EVERY
                  ? item.comment || ''
                  : '',
            })
          ),
        }
        _requestData.taskEvaluationRequests.push(_attitude)
      }
    } else if (keyName === 'update') {
      _attitude = {
        appraiserId: Number(value.attitudes.appraiserId) || null,
        comment:
          value.attitudes.commentType === GENERAL
            ? value.attitudes.comment || ''
            : '',
        criteriaGroupId: value.attitudes.criteriaGroupId,
        difficultyId: null,
        effort: null,
        name: '',
        projectId: null,
        isJobResult: false,
        taskId:
          typeof value.attitudes.id === 'number' ? value.attitudes.id : null,
        taskEvaluationDetails: value.attitudes.taskEvaluationDetails?.map(
          (item: any) => ({
            criteriaDetailId:
              Number(item.criteriaDetailId) === 0
                ? null
                : Number(item.criteriaDetailId),
            comment:
              value.attitudes.commentType === EVERY ? item.comment || '' : '',
          })
        ),
      }
      _requestData = {
        endDate: value.endDate,
        name: value.name,
        startDate: value.startDate,
        taskRequests: [
          ...value.taskRequests.map((taskRequest: any) => ({
            appraiserId: Number(taskRequest.appraiserId) || null,
            comment:
              taskRequest.commentType === GENERAL
                ? taskRequest.comment || ''
                : '',
            criteriaGroupId: taskRequest.criteriaGroupId,
            difficultyId: Number(taskRequest.difficultyId) || null,
            effort: Number(taskRequest.effort) || null,
            name: taskRequest.name,
            isJobResult: true,
            projectId:
              taskRequest.projectId === 'none' ? null : taskRequest.projectId,
            taskId: typeof taskRequest.id === 'number' ? taskRequest.id : null,
            taskEvaluationDetails: taskRequest.taskEvaluationDetails?.map(
              (item: any) => ({
                criteriaDetailId:
                  Number(item.criteriaDetailId) === 0
                    ? null
                    : Number(item.criteriaDetailId),
                comment:
                  taskRequest.commentType === EVERY ? item.comment || '' : '',
              })
            ),
          })),
          _attitude,
        ],
      }
    } else if (keyName === 'add') {
      _attitude = {
        appraiserId:
          Number(value.attitudes.appraiserId) === 0
            ? null
            : Number(value.attitudes.appraiserId),
        comment:
          value.attitudes.commentType === GENERAL
            ? value.attitudes.comment || ''
            : '',
        criteriaGroupId: value.attitudes.criteriaGroupId,
        difficultyId: null,
        effort: null,
        name: '',
        projectId: null,
        isJobResult: false,
        taskEvaluationDetails: value.attitudes.taskEvaluationDetails?.map(
          (item: any) => ({
            criteriaDetailId:
              Number(item.criteriaDetailId) === 0
                ? null
                : Number(item.criteriaDetailId),
            comment:
              value.attitudes.commentType === EVERY ? item.comment || '' : '',
          })
        ),
      }
      _requestData = {
        endDate: value.endDate,
        name: value.name,
        startDate: value.startDate,
        taskRequests: [
          ...value.taskRequests.map((taskRequest: any) => ({
            appraiserId: Number(taskRequest.appraiserId) || null,
            comment:
              taskRequest.commentType === GENERAL
                ? taskRequest.comment || ''
                : '',
            criteriaGroupId: taskRequest.criteriaGroupId,
            difficultyId: Number(taskRequest.difficultyId) || null,
            effort: Number(taskRequest.effort) || null,
            name: taskRequest.name,
            isJobResult: true,
            projectId:
              taskRequest.projectId === 'none' ? null : taskRequest.projectId,
            taskEvaluationDetails: taskRequest.taskEvaluationDetails?.map(
              (item: any) => ({
                criteriaDetailId:
                  Number(item.criteriaDetailId) === 0
                    ? null
                    : Number(item.criteriaDetailId),
                comment:
                  taskRequest.commentType === EVERY ? item.comment || '' : '',
              })
            ),
          })),
          _attitude,
        ],
      }
    }
    return _requestData
  }

  const dispatchEvaluationPeriod = () => {
    setLoading(true)
    if (evaluationCycleId) {
      dispatch(
        getEvaluationPeriod({
          evaluationCycleId,
          evaluationCycleStaffId:
            queryParams.get('evaluationCycleStaffId') || '',
        })
      )
        .unwrap()
        .then(res => {
          setEvaluationPeriodList(res.data)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  const handleCloseModal = () => {
    setIsShowModalAdd(current => !current)
  }

  const handleAddEvaluationPeriod = (value: any, isDraft: boolean) => {
    const requestData = convertData(value, 'add')
    dispatch(
      createEvaluationPeriod({
        evaluationCycleId: params.evaluationCycleId || '',
        evaluationCycleStaffId: queryParams.get('evaluationCycleStaffId') || '',
        requestBody: { ...requestData, isDraft },
      })
    )
      .unwrap()
      .then(() => {
        dispatchEvaluationPeriod()
        dispatchGetECStaffGeneralInfo()
        setIsShowModalAdd(false)
      })
  }

  const handleDeleteEvaluationPeriod = (evaluationPeriodId: string) => {
    dispatch(
      deleteEvaluationPeriod({
        evaluationCycleId: params.evaluationCycleId || '',
        evaluationPeriodId,
        evaluationCycleStaffId: queryParams.get('evaluationCycleStaffId') || '',
      })
    ).then(() => {
      dispatchEvaluationPeriod()
    })
  }

  const handleRevertEvaluationPeriod = (
    evaluationPeriodId: string,
    name: string
  ) => {
    dispatch(
      revertEvaluationPeriod({
        evaluationCycleId: params.evaluationCycleId || '',
        evaluationPeriodId,
        evaluationCycleStaffId: queryParams.get('evaluationCycleStaffId') || '',
        saveDraft: false,
        name,
      })
    ).then(() => {
      dispatchEvaluationPeriod()
    })
  }

  const handleEditEvaluationPeriod = (value: any, isDraft: boolean) => {
    const requestData = convertData(value, 'update')
    dispatch(
      updateEvaluationPeriod({
        evaluationPeriodId: evaluationPeriodItem.id,
        evaluationCycleId: params.evaluationCycleId || '',
        evaluationCycleStaffId: queryParams.get('evaluationCycleStaffId') || '',
        request: { ...requestData, isDraft },
      })
    )
      .unwrap()
      .then(() => {
        dispatchEvaluationPeriod()
        dispatchGetECStaffGeneralInfo()
        setIsShowModalEdit(false)
      })
  }

  const handleEvaluateEvaluationPeriod = ({
    value,
    isDraft,
    isEvaluate,
  }: {
    value: any
    isDraft?: boolean
    isEvaluate?: boolean
  }) => {
    const requestData = convertData(value, 'evaluate')
    dispatch(
      evaluateEvaluationPeriod({
        evaluationPeriodId: evaluationPeriodItem.id,
        evaluationCycleId: params.evaluationCycleId || '',
        evaluationCycleStaffId: queryParams.get('evaluationCycleStaffId') || '',
        isEvaluate: !!isEvaluate,
        staffName: cycleInformation.staff?.name || '',
        evaluationName: evaluationPeriodItem.name || '',
        request: { ...requestData, isDraft: !!isDraft },
      })
    )
      .unwrap()
      .then(() => {
        dispatchEvaluationPeriod()
        setIsShowModalEditEvaluate(false)
        setIsShowModalEvaluate(false)
      })
  }

  const handleClearEvaluationPeriod = (
    evaluationPeriodId: string,
    name: string,
    saveDraft: boolean
  ) => {
    dispatch(
      clearEvaluationPeriod({
        evaluationCycleId: params.evaluationCycleId || '',
        evaluationPeriodId,
        evaluationCycleStaffId: queryParams.get('evaluationCycleStaffId') || '',
        saveDraft,
        name,
      })
    ).then(() => {
      dispatchEvaluationPeriod()
    })
  }

  const handleApproveEvaluationPeriod = (
    evaluationPeriodId: string,
    name: string
  ) => {
    dispatch(
      approveEvaluationPeriod({
        evaluationCycleId: params.evaluationCycleId || '',
        evaluationPeriodId,
        evaluationCycleStaffId: queryParams.get('evaluationCycleStaffId') || '',
        isRejected: false,
        name,
      })
    ).then(() => {
      dispatchEvaluationPeriod()
    })
  }

  const handleSubmitAnyway = () => {
    const formatData = (task: any, role: string) => {
      const taskEvaluation = task.taskEvaluations[role]
      return {
        taskId: typeof task.id === 'number' ? task.id : null,
        comment: taskEvaluation.comment,
        difficultyId: Number(taskEvaluation.difficulty?.id) || null,
        taskEvaluationDetails: taskEvaluation.taskEvaluationDetails?.map(
          (item: any) => ({
            criteriaDetailId:
              Number(item.criteriaDetail.id) === 0
                ? null
                : Number(item.criteriaDetail.id),
            comment: item.comment,
          })
        ),
      }
    }

    const requestData: any = {
      taskEvaluationRequests: [
        ...(evaluationPeriodItem?.jobResults || [])?.map((item: any) => {
          if (checkRole('appraiser_1', item.id, evaluationPeriodItem)) {
            return formatData(item, 'appraisees')
          } else if (checkRole('appraiser_2', item.id, evaluationPeriodItem)) {
            return formatData(item, 'appraiser_1')
          }
        }),
        ...(evaluationPeriodItem?.attitudes || [])?.map((item: any) => {
          if (checkRole('appraiser_1', item.id, evaluationPeriodItem)) {
            return formatData(item, 'appraisees')
          } else if (checkRole('appraiser_2', item.id, evaluationPeriodItem)) {
            return formatData(item, 'appraiser_1')
          }
        }),
      ],
    }

    dispatch(
      evaluateEvaluationPeriod({
        evaluationPeriodId: evaluationPeriodItem.id,
        evaluationCycleId: params.evaluationCycleId || '',
        evaluationCycleStaffId: queryParams.get('evaluationCycleStaffId') || '',
        request: { ...requestData, isDraft: false },
      })
    )
      .unwrap()
      .then(() => {
        dispatchEvaluationPeriod()
      })
  }

  const handleRejectEvaluationPeriod = (
    evaluationPeriodId: string,
    name: string
  ) => {
    dispatch(
      approveEvaluationPeriod({
        evaluationCycleId: params.evaluationCycleId || '',
        evaluationPeriodId,
        evaluationCycleStaffId: queryParams.get('evaluationCycleStaffId') || '',
        isRejected: true,
        name,
      })
    ).then(() => {
      dispatchEvaluationPeriod()
    })
  }

  useEffect(() => {
    dispatchEvaluationPeriod()
  }, [evaluationCycleId])

  const [reviewEvaluateId, setReviewEvaluateId] = useState<string | null>(null)
  return (
    <Box className={classes.rootECProcessEvaluationPeriod}>
      <ConditionalRender
        conditional={
          tabEvaluation == MY_EVALUATION &&
          isShowButtonAddTask &&
          !loading &&
          !evaluationPeriodList.length
        }
      >
        <Box className={classes.headerActions}>
          <ButtonAddWithIcon onClick={() => setIsShowModalAdd(true)}>
            {i18Mbo('LB_ADD_NEW_EVALUATION')}
          </ButtonAddWithIcon>
        </Box>
      </ConditionalRender>

      <ConditionalRender conditional={!loading}>
        <ConditionalRender conditional={!evaluationPeriodList.length}>
          <Box className={classes.wrapNoData}>
            <NoData />
          </Box>
        </ConditionalRender>

        <Box className={classes.taskList}>
          {evaluationPeriodList.map((item: any, index: number) => (
            <EvaluationPeriodItem
              key={item.id}
              index={index}
              onEdit={role =>
                handleToggleModal({
                  id: item.id,
                  type: 'edit',
                  role,
                })
              }
              onReject={() => handleRejectEvaluationPeriod(item.id, item.name)}
              onApprove={(name: string) =>
                handleApproveEvaluationPeriod(item.id, name)
              }
              onDelete={() => handleDeleteEvaluationPeriod(item.id)}
              onRevert={(name: string) =>
                handleRevertEvaluationPeriod(item.id, name)
              }
              onEvaluate={() =>
                handleToggleModal({
                  id: item.id,
                  type: 'evaluate',
                  evaluationName: item.name,
                })
              }
              onSubmitAnyway={() =>
                handleToggleModal({
                  id: item.id,
                  type: 'submitAnyway',
                })
              }
              onClear={(name: string) =>
                handleClearEvaluationPeriod(item.id, name, false)
              }
              onSaveDraftEvaluate={(name: string) =>
                handleClearEvaluationPeriod(item.id, name, true)
              }
              evaluationPeriodItem={item}
              isApproved={isApproved}
              isReviewEvaluate={reviewEvaluateId === item.id}
            />
          ))}
        </Box>
      </ConditionalRender>

      <ConditionalRender conditional={loading}>
        <LoadingSkeleton />
      </ConditionalRender>

      <ConditionalRender conditional={isShowModalAdd}>
        <ModalEvaluationPeriod
          title={i18Mbo('LB_ADD_NEW_EVALUATION')}
          finalStepButtonLabel={i18('LB_ADD')}
          onClose={handleCloseModal}
          submit={value => handleAddEvaluationPeriod(value, false)}
          onSaveDraft={value => handleAddEvaluationPeriod(value, true)}
          useSaveDraftButton={true}
          isAddEvaluation={true}
        />
      </ConditionalRender>

      <ConditionalRender conditional={isShowModalEdit}>
        <ModalEvaluationPeriod
          isDetail
          title={i18Mbo('LB_EDIT_EVALUATION_PERIOD')}
          finalStepButtonLabel={i18('LB_SUBMIT')}
          evaluationPeriodItem={evaluationPeriodItem}
          submit={value => handleEditEvaluationPeriod(value, false)}
          onSaveDraft={value => handleEditEvaluationPeriod(value, true)}
          onClose={() => setIsShowModalEdit(false)}
          useSaveDraftButton={isShowSaveDraftButton}
          isAddEvaluation={false}
        />
      </ConditionalRender>

      <ConditionalRender conditional={isShowModalEvaluate}>
        <ModalEvaluateEvaluationPeriod
          isNotEvaluated={isNotEvaluated}
          title={i18Mbo('LB_EVALUATE_TASK')}
          labelSubmit={
            isNotEvaluated ? i18('LB_SAVE_DRAFT') : i18Mbo('LB_EVALUATE')
          }
          evaluationPeriodItem={evaluationPeriodItem}
          submit={value =>
            handleEvaluateEvaluationPeriod({
              value,
              isEvaluate: true,
            })
          }
          onSaveDraft={value =>
            handleEvaluateEvaluationPeriod({
              value,
              isDraft: true,
              isEvaluate: true,
            })
          }
          onClose={() => setIsShowModalEvaluate(false)}
          useSaveDraftButton={true}
          setIsShowModalEvaluate={setIsShowModalEvaluate}
          setReviewEvaluateId={setReviewEvaluateId}
        />
      </ConditionalRender>

      <ConditionalRender conditional={isShowModalEditEvaluate}>
        <ModalEvaluateEvaluationPeriod
          title={i18Mbo('LB_EVALUATE_EDIT_TASK')}
          labelSubmit={i18('LB_EDIT')}
          evaluationPeriodItem={evaluationPeriodItem}
          submit={value => handleEvaluateEvaluationPeriod({ value })}
          onSaveDraft={value =>
            handleEvaluateEvaluationPeriod({ value, isDraft: true })
          }
          onClose={() => setIsShowModalEditEvaluate(false)}
          useSaveDraftButton={isShowSaveDraftButton}
        />
      </ConditionalRender>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootECProcessEvaluationPeriod: {},
  headerActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(3),
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    position: 'relative',
  },
  wrapNoData: {
    border: `1px solid ${theme.color.grey.secondary}`,
    borderRadius: '4px',
  },
}))
export default ECProcessEvaluationPeriod

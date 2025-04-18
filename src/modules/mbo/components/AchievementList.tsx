import NoData from '@/components/common/NoData'
import LoadingSkeleton from '@/components/loading/LoadingSkeleton'
import ModalConfirm from '@/components/modal/ModalConfirm'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import { NS_MBO } from '@/const/lang.const'
import { useQuery } from '@/hooks/useQuery'
import { AppDispatch } from '@/store'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { ACHIEVEMENT_STATUS, MAX_LENGTH_OPEN_DATA } from '../const'
import { AchievementListItemView, UpdateAchievementPayload } from '../models'
import {
  deleteAchievement,
  reviewerActionsOnAchievement,
  updateAchievement,
} from '../reducer/evaluation-process'
import AchievementListItem from './AchievementListItem'
import ModalEditAchievement from './ModalEditAchievement'

interface AchievementListProps {
  achievements: AchievementListItemView[]
  loading: boolean
  onRequestAchievements: () => void
  isApproved: boolean
}

const AchievementList = ({
  achievements,
  loading,
  isApproved,
  onRequestAchievements,
}: AchievementListProps) => {
  const classes = useStyles()
  const queryParams = useQuery()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(NS_MBO)

  const [achievementSelected, setAchievementSelected] =
    useState<AchievementListItemView>({})
  const [useModalDelete, setUseModalDelete] = useState(false)
  const [useModalEdit, setUseModalEdit] = useState(false)
  const [useModalReject, setUseModalReject] = useState(false)

  const handleDeleteAchievement = () => {
    dispatch(
      deleteAchievement({
        evaluationCycleId: params.evaluationCycleId || '',
        evaluationCycleStaffId: queryParams.get('evaluationCycleStaffId') || '',
        achievementId: achievementSelected.id || '',
        achievementName: achievementSelected.name || '',
      })
    )
      .unwrap()
      .then(() => {
        onRequestAchievements()
        setAchievementSelected({})
      })
  }

  const handleUpdateAchievement = (payload: UpdateAchievementPayload) => {
    dispatch(updateAchievement(payload))
      .unwrap()
      .then(() => {
        onRequestAchievements()
        setUseModalEdit(false)
        setAchievementSelected({})
      })
  }

  const dispatchReviewerActionsOnAchievement = ({
    comment,
    status,
    achievement,
  }: {
    comment: string
    status: number
    achievement: AchievementListItemView
  }) => {
    dispatch(
      reviewerActionsOnAchievement({
        achievementId: achievement.id || '',
        evaluationCycleId: params.evaluationCycleId || '',
        evaluationCycleStaffId: queryParams.get('evaluationCycleStaffId') || '',
        achievementName: achievement.name || '',
        requestBody: {
          comment,
          status,
        },
      })
    )
      .unwrap()
      .then(() => {
        onRequestAchievements()
      })
  }

  const handleApproveAchievement = (achievement: AchievementListItemView) => {
    dispatchReviewerActionsOnAchievement({
      status: ACHIEVEMENT_STATUS.APPROVED,
      comment: '',
      achievement,
    })
  }

  const handleRevertAchievement = (achievement: AchievementListItemView) => {
    dispatchReviewerActionsOnAchievement({
      status: ACHIEVEMENT_STATUS.NOT_APPROVED,
      comment: '',
      achievement,
    })
  }

  const handleReject = () => {
    dispatchReviewerActionsOnAchievement({
      status: ACHIEVEMENT_STATUS.REJECT,
      comment: '',
      achievement: achievementSelected,
    })
  }

  return loading ? (
    <LoadingSkeleton />
  ) : !!achievements.length ? (
    <Fragment>
      <Box className={classes.RootAchievementList}>
        {achievements.map((achievementItem, index) => (
          <AchievementListItem
            isApproved={isApproved}
            key={achievementItem.id}
            initShow={achievements.length < MAX_LENGTH_OPEN_DATA}
            order={index + 1}
            achievement={achievementItem}
            onClickDelete={() => {
              setAchievementSelected(achievementItem)
              setUseModalDelete(true)
            }}
            onClickEdit={() => {
              setAchievementSelected(achievementItem)
              setUseModalEdit(true)
            }}
            onClickApprove={() => handleApproveAchievement(achievementItem)}
            onClickRevert={() => handleRevertAchievement(achievementItem)}
            onClickReject={() => {
              setUseModalReject(true)
              setAchievementSelected(achievementItem)
            }}
          />
        ))}
      </Box>
      {useModalReject && (
        <ModalConfirm
          open
          title={`${i18Mbo('LB_ACHIEVEMENT')}: ${achievementSelected.name}`}
          description={i18('MSG_CONFIRM_REJECT', {
            labelName: i18Mbo('LB_ACHIEVEMENT'),
          })}
          onClose={() => {
            setUseModalReject(false)
            setAchievementSelected({})
          }}
          onSubmit={handleReject}
        />
      )}
      {useModalEdit && (
        <ModalEditAchievement
          achievement={achievementSelected}
          onClose={() => {
            setAchievementSelected({})
            setUseModalEdit(false)
          }}
          onSubmit={handleUpdateAchievement}
          onFilesUpdated={onRequestAchievements}
        />
      )}
      {useModalDelete && (
        <ModalDeleteRecords
          open
          titleMessage={i18Mbo('TXT_DELETE_ACHIEVEMENT')}
          subMessage={i18Mbo('MSG_CONFIRM_DELETE_ACHIEVEMENT', {
            name: achievementSelected.name || '',
          })}
          onClose={() => {
            setUseModalDelete(false)
            setAchievementSelected({})
          }}
          onSubmit={handleDeleteAchievement}
        />
      )}
    </Fragment>
  ) : (
    <Box className={classes.rootNoData}>
      <NoData />
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootAchievementList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  rootNoData: {
    borderRadius: '4px',
    border: `1px solid ${theme.color.grey.secondary}`,
  },
}))

export default AchievementList

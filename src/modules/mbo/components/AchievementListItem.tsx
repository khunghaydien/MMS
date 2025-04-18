import ConditionalRender from '@/components/ConditionalRender'
import { FieldListOptions } from '@/components/Form/CardForm/CardFormModeView'
import FormItem from '@/components/Form/FormItem/FormItem'
import ButtonHeaderActions from '@/components/common/ButtonHeaderActions'
import StatusItem, { IStatusType } from '@/components/common/StatusItem'
import UploadFile from '@/components/common/UploadFile'
import ToggleSectionIcon from '@/components/icons/ToggleSectionIcon'
import { NS_MBO } from '@/const/lang.const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { FileItem } from '@/types'
import { formatDate } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { ACHIEVEMENT_STATUS } from '../const'
import { AchievementListItemView } from '../models'
import {
  EvaluationProcessState,
  evaluationProcessSelector,
} from '../reducer/evaluation-process'

interface AchievementListItemProps {
  achievement: AchievementListItemView
  order: number
  initShow?: boolean
  onClickDelete: () => void
  onClickEdit: () => void
  onClickApprove: () => void
  onClickRevert: () => void
  onClickReject: () => void
  isApproved: boolean
}

const AchievementListItem = ({
  achievement,
  order,
  initShow = true,
  onClickDelete,
  onClickEdit,
  onClickApprove,
  onClickRevert,
  onClickReject,
  isApproved,
}: AchievementListItemProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(NS_MBO)

  const { permissions }: AuthState = useSelector(selectAuth)
  const { staff }: AuthState = useSelector(selectAuth)
  const { cycleInformation }: EvaluationProcessState = useSelector(
    evaluationProcessSelector
  )

  const [show, setShow] = useState(initShow)

  const isAchievementOwner =
    staff?.id?.toString() === achievement.createdBy?.id?.toString()
  const isAppraiserReviewer =
    staff?.id == cycleInformation.appraiser?.id &&
    staff?.id == cycleInformation.reviewer?.id

  const useButtonEdit = useMemo(() => {
    if (isApproved) return false
    if (!isAchievementOwner) return false
    if (achievement.status?.id === ACHIEVEMENT_STATUS.DRAFT) {
      return true
    }
    if (isAppraiserReviewer) {
      return (
        achievement.status?.id == ACHIEVEMENT_STATUS.APPROVED ||
        achievement.status?.id === ACHIEVEMENT_STATUS.REJECT
      )
    } else {
      return achievement.status?.id !== ACHIEVEMENT_STATUS.APPROVED
    }
  }, [isAppraiserReviewer, isAchievementOwner, achievement])

  const useButtonDelete = useMemo(() => {
    if (isApproved) return false
    if (!isAchievementOwner) return false
    if (achievement.status?.id === ACHIEVEMENT_STATUS.DRAFT) {
      return true
    }
    if (isAppraiserReviewer) {
      return achievement.status?.id === ACHIEVEMENT_STATUS.REJECT
    } else {
      return (
        achievement.status?.id === ACHIEVEMENT_STATUS.NOT_APPROVED ||
        achievement.status?.id === ACHIEVEMENT_STATUS.REJECT
      )
    }
  }, [isAchievementOwner, isAppraiserReviewer])

  const useButtonApproveAndReject =
    achievement.status?.id === ACHIEVEMENT_STATUS.NOT_APPROVED &&
    staff?.id == cycleInformation.reviewer?.id &&
    !isApproved

  const useButtonRevert =
    achievement.status?.id === ACHIEVEMENT_STATUS.APPROVED &&
    staff?.id == cycleInformation.reviewer?.id &&
    !isApproved

  const dataRendering = [
    {
      id: 1,
      label: i18Mbo('LB_ACHIEVEMENT_NAME'),
      value: achievement.name || 'None',
    },
    {
      id: 2,
      label: i18Mbo('LB_ACHIEVEMENT_START_DATE'),
      value: achievement.startDate
        ? formatDate(achievement.startDate as number)
        : 'None',
    },
    {
      id: 3,
      label: i18Mbo('LB_ACHIEVEMENT_END_DATE'),
      value: achievement.endDate
        ? formatDate(achievement.endDate as number)
        : 'None',
    },
    {
      id: 4,
      label: i18('LB_DURATION'),
      value: `${cycleInformation.duration} ${i18('LB_MONTHS')}`,
    },
    {
      id: 5,
      label: i18Mbo('LB_DAY_ADDED'),
      value: formatDate(achievement.dayAdded),
    },
    {
      id: 6,
      label: i18Mbo('LB_RATE_OVER_TOTAL_SCORE'),
      value: achievement.rateOverTotalScore
        ? `${achievement.rateOverTotalScore}%`
        : '0%',
    },
    {
      id: 7,
      label: i18('LB_DESCRIPTION'),
      value: achievement.description || 'None',
    },
  ]

  const status: IStatusType = useMemo(() => {
    switch (achievement.status?.id) {
      case ACHIEVEMENT_STATUS.NOT_APPROVED:
        return {
          color: 'orange',
          label: i18Mbo('LB_NOT_APPROVED'),
        }
      case ACHIEVEMENT_STATUS.APPROVED:
        return {
          color: 'green',
          label: i18Mbo('LB_APPROVED'),
        }
      case ACHIEVEMENT_STATUS.DRAFT:
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
  }, [achievement.status])

  return (
    <Box className={classes.RootAchievementListItem}>
      <Box className={classes.header}>
        <Box className={classes.titleWrapper}>
          <Box className={classes.nameWrapper}>
            <ToggleSectionIcon open={show} onToggle={() => setShow(!show)} />
            <Box className={classes.name}>
              <Box component="span">
                {`${i18Mbo('LB_ACHIEVEMENT')} #${order}: `}
              </Box>
              <Box component="span">{achievement.name}</Box>
            </Box>
          </Box>
          <StatusItem typeStatus={status} />
        </Box>
        <ConditionalRender
          conditional={
            permissions.useMBOAchievement &&
            staff?.id != cycleInformation.staff?.id
          }
        >
          <ButtonHeaderActions
            configs={{
              useButtonEdit: useButtonEdit,
              useButtonDelete: useButtonDelete,
              useButtonApprove: useButtonApproveAndReject,
              useButtonReject: useButtonApproveAndReject,
              useButtonRevert,
            }}
            callback={{
              onClickDelete,
              onClickEdit,
              onClickApprove,
              onClickRevert,
              onClickReject,
            }}
          />
        </ConditionalRender>
      </Box>
      {show && (
        <Box className={classes.body}>
          <FieldListOptions dataRendering={dataRendering} isVertical={false} />
          <FormItem label={i18Mbo('LB_EVIDENCE')} className={classes.evidence}>
            <UploadFile
              usePreview
              readonly
              useDelete={false}
              useLastModified={false}
              listFiles={achievement.evidences as FileItem[]}
            />
          </FormItem>
        </Box>
      )}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootAchievementListItem: {
    border: `1px solid ${theme.color.grey.secondary}`,
    borderRadius: '4px',
    padding: theme.spacing(2),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
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
  body: {
    padding: theme.spacing(2, 2, 2, 0.5),
  },
  evidence: {
    marginTop: theme.spacing(3),
  },
}))

export default AchievementListItem

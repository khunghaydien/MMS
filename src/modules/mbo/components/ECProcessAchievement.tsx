import ButtonAddWithIcon from '@/components/buttons/ButtonAddWithIcon'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import { NS_MBO } from '@/const/lang.const'
import { useQuery } from '@/hooks/useQuery'
import { AuthState, selectAuth } from '@/reducer/auth'
import { alertError, alertSuccess } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { FileItem, IFileUpload } from '@/types'
import { scrollToFirstErrorMessage } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { FormikErrors, useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { ACHIEVEMENT_STATUS } from '../const'
import { achievementValidation } from '../formik/evaluationProcessFormik'
import { AchievementListItemView } from '../models'
import {
  EvaluationProcessState,
  createAchievements,
  evaluationProcessSelector,
} from '../reducer/evaluation-process'
import evaluationProcessService from '../services/evaluation-process.service'
import AchievementList from './AchievementList'
import ModalAchievements from './ModalAchievements'

export const achievementEmptyItem: AchievementListItemView = {
  id: 1,
  name: '',
  startDate: null,
  endDate: null,
  rateOverTotalScore: '',
  description: '',
  evidences: [],
}
type Props = {
  isApproved: boolean
}

const ECProcessAchievement = ({ isApproved }: Props) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const params = useParams()
  const queryParams = useQuery()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(NS_MBO)

  const { permissions, staff }: AuthState = useSelector(selectAuth)
  const { cycleInformation }: EvaluationProcessState = useSelector(
    evaluationProcessSelector
  )

  const achievementModalFormik = useFormik({
    initialValues: {
      achievements: [achievementEmptyItem] as AchievementListItemView[],
    },
    validationSchema: achievementValidation,
    onSubmit: values => {
      let rateOverTotalScore = 0
      values.achievements.forEach(achievementItem => {
        rateOverTotalScore += +(achievementItem.rateOverTotalScore as number)
      })
      if (rateOverTotalScore > 10) {
        dispatch(
          alertError({
            message: i18Mbo('MSG_RATE_OVER_TOTAL_SCORE'),
          })
        )
      } else {
        dispatchCreateAchievements(values.achievements)
      }
    },
  })

  const [useModalAchievements, setUseModalAchievements] = useState(false)
  const [achievements, setAchievements] = useState<AchievementListItemView[]>(
    []
  )
  const [useModalRemoveAnAchievement, setUseModalRemoveAnAchievement] =
    useState(false)
  const [achievementNameSelected, setAchievementNameSelected] = useState('')
  const [achievementIndexSelected, setAchievementIndexSelected] = useState(0)
  const [loading, setLoading] = useState(true)

  const useButtonAddNewAchievements =
    permissions.useMBOAchievement && staff?.id == cycleInformation.appraiser?.id

  const handleChange = (newAchievements: AchievementListItemView[]) => {
    achievementModalFormik.setFieldValue('achievements', newAchievements)
  }

  const handleCloseModalAddAchievements = () => {
    setUseModalAchievements(false)
    achievementModalFormik.resetForm()
  }

  const removeAchievementByIndex = (index: number, name: string) => {
    const newAchievements = [...achievementModalFormik.values.achievements]
    newAchievements.splice(index, 1)
    achievementModalFormik.setFieldValue('achievements', newAchievements)
    if (name) {
      dispatch(
        alertSuccess({
          message: i18('MSG_DELETE_SUCCESS', {
            labelName: `${i18Mbo('LB_ACHIEVEMENT_NAME')}: ${name}`,
          }),
        })
      )
    }
  }

  const handleDeleteAchievement = (index: number) => {
    const achievement = achievementModalFormik.values.achievements[index]
    const isEmptyValue =
      !achievement.name &&
      !achievement.startDate &&
      !achievement.endDate &&
      !achievement.rateOverTotalScore &&
      !achievement.evidences?.length
    if (isEmptyValue) {
      removeAchievementByIndex(index, achievement.name as string)
    } else {
      setUseModalRemoveAnAchievement(true)
      setAchievementNameSelected(achievement.name as string)
      setAchievementIndexSelected(index)
    }
  }

  const dispatchCreateAchievements = (
    achievements: AchievementListItemView[]
  ) => {
    dispatch(
      createAchievements({
        achievements,
        evaluationCycleId: params.evaluationCycleId || '',
        evaluationCycleStaffId: queryParams.get('evaluationCycleStaffId') || '',
        status: ACHIEVEMENT_STATUS.NOT_APPROVED,
      })
    )
      .unwrap()
      .then(() => {
        setUseModalAchievements(false)
        getAchievements()
        achievementModalFormik.resetForm()
      })
  }

  const handleSubmit = () => {
    achievementModalFormik.handleSubmit()
    setTimeout(() => {
      scrollToFirstErrorMessage()
    })
  }

  const getAchievements = async () => {
    setLoading(true)
    try {
      const res = await evaluationProcessService.getAchievements({
        evaluationCycleId: params.evaluationCycleId || '',
        evaluationCycleStaffId: queryParams.get('evaluationCycleStaffId') || '',
      })
      const result: AchievementListItemView[] = res.data.map(
        (achievement: any) => ({
          ...achievement,
          description: achievement.description || '',
          evidences: achievement.evidences?.map((evidence: IFileUpload) => {
            return {
              id: evidence.id,
              url: evidence.url,
              FileObject: new File([''], evidence.filename, {
                type: evidence.type,
                lastModified: evidence.uploadDate,
              }),
            }
          }) as FileItem[],
        })
      )
      setAchievements(result)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitDraft = () => {
    dispatch(
      createAchievements({
        achievements: achievementModalFormik.values.achievements,
        evaluationCycleId: params.evaluationCycleId || '',
        evaluationCycleStaffId: queryParams.get('evaluationCycleStaffId') || '',
        status: ACHIEVEMENT_STATUS.DRAFT,
      })
    )
      .unwrap()
      .then(() => {
        setUseModalAchievements(false)
        getAchievements()
        achievementModalFormik.resetForm()
      })
  }

  useEffect(() => {
    getAchievements()
  }, [])

  return (
    <Box className={classes.RootECProcessAchievement}>
      {useButtonAddNewAchievements && (
        <Box className={classes.achievementHeaderActions}>
          <ButtonAddWithIcon onClick={() => setUseModalAchievements(true)}>
            {i18Mbo('LB_NEW_ACHIEVEMENT')}
          </ButtonAddWithIcon>
        </Box>
      )}
      <AchievementList
        isApproved={isApproved}
        loading={loading}
        achievements={achievements}
        onRequestAchievements={getAchievements}
      />
      {useModalAchievements && (
        <ModalAchievements
          currentNumberAchievement={achievements.length}
          useDeleteIcons={achievementModalFormik.values.achievements.length > 1}
          achievements={achievementModalFormik.values.achievements}
          achievementErrors={
            achievementModalFormik.errors.achievements as
              | FormikErrors<AchievementListItemView>[]
              | undefined
          }
          achievementTouches={achievementModalFormik.touched.achievements}
          onClose={handleCloseModalAddAchievements}
          onSubmit={handleSubmit}
          onChange={handleChange}
          onDeleteAchievement={handleDeleteAchievement}
          onSaveDraft={handleSubmitDraft}
        />
      )}
      {useModalRemoveAnAchievement && (
        <ModalDeleteRecords
          open
          titleMessage={i18Mbo('TXT_DELETE_AN_EVALUATION')}
          subMessage={i18('MSG_CONFIRM_DELETE_DESCRIPTION', {
            labelName: `${i18Mbo(
              'LB_ACHIEVEMENT_NAME'
            )}: ${achievementNameSelected}`,
          })}
          onClose={() => setUseModalRemoveAnAchievement(false)}
          onSubmit={() =>
            removeAchievementByIndex(
              achievementIndexSelected,
              achievementNameSelected
            )
          }
        />
      )}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootECProcessAchievement: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  achievementHeaderActions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}))

export default ECProcessAchievement

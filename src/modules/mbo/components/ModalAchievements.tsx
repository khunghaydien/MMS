import InputDateFns from '@/components/Datepicker/InputDateFns'
import FormItem from '@/components/Form/FormItem/FormItem'
import FormLayout from '@/components/Form/FormLayout'
import ButtonAddPlus from '@/components/buttons/ButtonAddPlus'
import Modal from '@/components/common/Modal'
import UploadFile from '@/components/common/UploadFile'
import DeleteIcon from '@/components/icons/DeleteIcon'
import InputCurrency from '@/components/inputs/InputCurrency'
import InputTextArea from '@/components/inputs/InputTextArea'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import { ACCEPT_DEFAULT_UPLOAD, DEFAULT_FILE_MAX_SIZE } from '@/const/app.const'
import { NS_MBO } from '@/const/lang.const'
import { alertSuccess } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { EventInput, FileItem } from '@/types'
import { formatDate } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { FormikErrors, FormikTouched } from 'formik'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { AchievementListItemView } from '../models'
import {
  EvaluationProcessState,
  evaluationProcessSelector,
} from '../reducer/evaluation-process'
import { achievementEmptyItem } from './ECProcessAchievement'

interface AchievementFormProps {
  index?: number
  achievement: AchievementListItemView
  useDeleteIcons?: boolean
  errors: FormikErrors<AchievementListItemView> | undefined
  touched: FormikTouched<AchievementListItemView> | undefined
  onChange: (payload: {
    achievement: AchievementListItemView
    index: number
    isUploadFile?: boolean
    file?: FileItem
  }) => void
  onDelete?: (index: number) => void
  useTitle?: boolean
  usePreview?: boolean
  currentNumberAchievement?: number
}

export const AchievementForm = ({
  index = 0,
  achievement,
  errors,
  touched,
  onChange,
  useDeleteIcons,
  onDelete,
  useTitle = true,
  usePreview,
  currentNumberAchievement = 0,
}: AchievementFormProps) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(NS_MBO)

  const { cycleInformation }: EvaluationProcessState = useSelector(
    evaluationProcessSelector
  )

  const [showAlertSuccess, setShowAlertSuccess] = useState(false)

  const handleChange = (value: any, field?: string) => {
    const newAchievement = {
      ...achievement,
      [field as string]: value,
    }
    onChange({
      achievement: newAchievement,
      index,
    })
  }

  const handleUploadFiles = (acceptedFiles: FileItem[]) => {
    const nextFiles = [...(achievement.evidences || []), ...acceptedFiles]
    const newAchievement = {
      ...achievement,
      evidences: nextFiles,
    }
    onChange({
      achievement: newAchievement,
      index,
      isUploadFile: true,
    })
    setShowAlertSuccess(true)
  }

  const handleDeleteFile = (fileItem: FileItem | null) => {
    const fileIndexSelected =
      achievement?.evidences?.findIndex(
        (fileItemLocal: FileItem) => fileItemLocal.id === fileItem?.id
      ) || 0
    if (fileIndexSelected === -1) return
    const newEvidences = [...(achievement.evidences || [])]
    newEvidences.splice(fileIndexSelected, 1)
    const newAchievement = {
      ...achievement,
      evidences: newEvidences,
    }
    onChange({
      achievement: newAchievement,
      index,
      isUploadFile: true,
      file: fileItem as FileItem,
    })
    dispatch(
      alertSuccess({
        message: i18('MSG_DELETE_FILE_SUCCESS', {
          fileName: fileItem?.FileObject.name || '',
        }),
      })
    )
  }

  const handleDeleteAchievement = () => {
    !!onDelete && onDelete(index)
  }

  return (
    <Box className={classes.RootAchievementForm}>
      {useTitle && (
        <Box className={classes.achievementFormTitle}>
          <Box className={classes.achievementTitleBox}>
            <Box className="text">{i18Mbo('LB_ACHIEVEMENT')}:</Box>
            <Box className={classes.order}>{`#${
              currentNumberAchievement + 1
            }`}</Box>
          </Box>
          {!!useDeleteIcons && <DeleteIcon onClick={handleDeleteAchievement} />}
        </Box>
      )}
      <Box className={classes.achievementForm}>
        <FormLayout gap={24}>
          <InputTextLabel
            required
            className={classes.achievementName}
            keyName="name"
            value={achievement.name}
            error={!!errors?.name && !!touched?.name}
            errorMessage={errors?.name}
            label={i18Mbo('LB_ACHIEVEMENT_NAME')}
            placeholder={i18Mbo('PLH_ACHIEVEMENT_NAME')}
            onChange={(e: EventInput, field: string) =>
              handleChange(e.target.value, field)
            }
          />
          <InputDateFns
            required
            minDate={cycleInformation.startDate}
            maxDate={cycleInformation.endDate}
            defaultCalendarMonth={new Date(cycleInformation.startDate)}
            keyName="startDate"
            width={160}
            value={achievement.startDate}
            error={!!errors?.startDate && !!touched?.startDate}
            errorMessage={errors?.startDate}
            onChange={(date: Date | null, field: string) =>
              handleChange(date?.getTime() || null, field)
            }
            label={i18Mbo('LB_ACHIEVEMENT_START_DATE')}
          />
          <InputDateFns
            defaultCalendarMonth={
              achievement.startDate
                ? new Date(achievement.startDate)
                : new Date(cycleInformation.endDate)
            }
            minDate={achievement.startDate}
            keyName="endDate"
            width={160}
            value={achievement.endDate}
            onChange={(date: Date | null, field: string) =>
              handleChange(date?.getTime() || null, field)
            }
            label={i18Mbo('LB_ACHIEVEMENT_END_DATE')}
          />
          <FormLayout width={160}>
            <FormItem label={i18Mbo('LB_DAY_ADDED')}>
              <Box className={classes.dayAdded}>
                {achievement.dayAdded
                  ? formatDate(achievement.dayAdded)
                  : formatDate(new Date())}
              </Box>
            </FormItem>
          </FormLayout>
        </FormLayout>
        <InputCurrency
          required
          description={i18Mbo('MSG_NOT_OVER_10_PERCENT') as string}
          suffix="%"
          keyName="rateOverTotalScore"
          value={achievement.rateOverTotalScore}
          error={!!errors?.rateOverTotalScore && !!touched?.rateOverTotalScore}
          errorMessage={errors?.rateOverTotalScore}
          label={i18Mbo('LB_RATE_OVER_TOTAL_SCORE')}
          placeholder="E.g: 2%"
          onChange={(value?: string, field?: string) =>
            handleChange(value, field)
          }
        />
        <InputTextArea
          keyName="description"
          defaultValue={achievement.description}
          label={i18('LB_DESCRIPTION') || ''}
          placeholder={i18('PLH_DESCRIPTION')}
          onChange={(e: EventInput, field: string) =>
            handleChange(e.target.value, field)
          }
        />
        <FormItem
          required
          label={i18Mbo('LB_EVIDENCE')}
          error={!!errors?.evidences && !!touched?.evidences}
          errorMessage={errors?.evidences || ''}
        >
          <UploadFile
            readonly={achievement.evidences?.length === 1}
            maxFiles={1}
            maxSize={DEFAULT_FILE_MAX_SIZE * 2}
            uploadAcceptFileTypes={ACCEPT_DEFAULT_UPLOAD}
            namespace="evidence"
            usePreview={!!usePreview}
            showAlertSuccess={showAlertSuccess}
            setShowAlertSuccess={setShowAlertSuccess}
            total={achievement.evidences?.length || 0}
            listFiles={achievement.evidences}
            onChange={handleUploadFiles}
            onDeleteFile={handleDeleteFile}
          />
        </FormItem>
      </Box>
    </Box>
  )
}

interface ModalAchievementsProps {
  onClose: () => void
  onSubmit: () => void
  onChange: (newAchievements: AchievementListItemView[]) => void
  useDeleteIcons: boolean
  achievements: AchievementListItemView[]
  achievementErrors: FormikErrors<AchievementListItemView>[] | undefined
  achievementTouches: FormikTouched<AchievementListItemView>[] | undefined
  currentNumberAchievement: number
  onDeleteAchievement: (index: number) => void
  onSaveDraft: () => void
}

const MAX_ACHIEVEMENT_ITEMS = 10

const ModalAchievements = ({
  onClose,
  currentNumberAchievement,
  achievements,
  achievementErrors,
  achievementTouches,
  onSubmit,
  onChange,
  useDeleteIcons,
  onDeleteAchievement,
  onSaveDraft,
}: ModalAchievementsProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(NS_MBO)

  const handleChange = ({
    achievement,
    index,
  }: {
    achievement: AchievementListItemView
    index: number
  }) => {
    const newAchievements: AchievementListItemView[] = [...achievements]
    newAchievements[index] = achievement
    onChange(newAchievements)
  }

  const handleAddNewAnAchievement = () => {
    const newAchievements: AchievementListItemView[] = [
      ...achievements,
      { ...achievementEmptyItem, id: new Date().getTime() },
    ]
    onChange(newAchievements)
  }

  return (
    <Modal
      open
      isButtonCustom
      labelButtonCustom={i18('LB_SAVE_DRAFT') || ''}
      colorButtonCustom="inherit"
      width={960}
      title={i18Mbo('TXT_ADD_NEW_ACHIEVEMENT')}
      onClose={onClose}
      onSubmit={onSubmit}
      onSubmitCustom={onSaveDraft}
    >
      <Box className={classes.modalBody}>
        {achievements.map((achievementItem, index) => (
          <AchievementForm
            currentNumberAchievement={currentNumberAchievement}
            useDeleteIcons={useDeleteIcons}
            achievement={achievementItem}
            key={achievementItem.id}
            index={index}
            errors={achievementErrors?.[index]}
            touched={achievementTouches?.[index]}
            onChange={handleChange}
            onDelete={onDeleteAchievement}
          />
        ))}
        <ButtonAddPlus
          disabled={achievements.length === MAX_ACHIEVEMENT_ITEMS}
          label={i18Mbo('TXT_ADD_NEW_ACHIEVEMENT')}
          onClick={handleAddNewAnAchievement}
        />
      </Box>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  dayAdded: {
    background: theme.color.grey.secondary,
    height: theme.spacing(5),
    width: 'max-content',
    borderRadius: '4px',
    lineHeight: theme.spacing(5),
    padding: theme.spacing(0, 1),
    fontWeight: 700,
  },
  modalBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    alignItems: 'flex-start',
  },
  RootAchievementForm: {
    borderRadius: '4px',
    padding: theme.spacing(2, 3, 3, 3),
    border: `1px solid ${theme.color.grey.secondary}`,
    width: '100%',
  },
  achievementForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  // msgNotOver10Percent: {
  //   marginTop: theme.spacing(1),
  //   fontSize: 12,
  // },
  achievementFormTitle: {
    fontSize: 18,
    marginBottom: theme.spacing(3),
    display: 'flex',
    justifyContent: 'space-between',
  },
  achievementTitleBox: {
    display: 'flex',
    gap: theme.spacing(1),
    fontWeight: 500,
    borderRadius: '4px',
  },
  order: {
    color: theme.color.blue.primary,
  },
  achievementName: {
    flex: 1,
  },
}))

export default ModalAchievements

import Modal from '@/components/common/Modal'
import { NS_MBO } from '@/const/lang.const'
import { useQuery } from '@/hooks/useQuery'
import { deleteFile } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { FileItem } from '@/types'
import { scrollToFirstErrorMessage } from '@/utils'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'
import { ACHIEVEMENT_STATUS } from '../const'
import { achievementFormYup } from '../formik/evaluationProcessFormik'
import { AchievementListItemView, UpdateAchievementPayload } from '../models'
import { AchievementForm } from './ModalAchievements'

interface ModalEditAchievementProps {
  achievement: AchievementListItemView
  onClose: () => void
  onSubmit: (payload: UpdateAchievementPayload) => void
  onFilesUpdated: () => void
}

const ModalEditAchievement = ({
  achievement,
  onClose,
  onSubmit,
}: ModalEditAchievementProps) => {
  const params = useParams()
  const queryParams = useQuery()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(NS_MBO)
  const [isUploadFile, setIsUploadFile] = useState(false)
  const [fileWillDeleted, setFileWillDeleted] = useState<FileItem>()

  const achievementFormik = useFormik({
    initialValues: structuredClone({
      ...achievement,
      rateOverTotalScore: achievement.rateOverTotalScore,
    }) as AchievementListItemView,
    validationSchema: Yup.object(achievementFormYup),
    onSubmit: values => {
      submitModal(
        values.status?.id === ACHIEVEMENT_STATUS.REJECT
          ? ACHIEVEMENT_STATUS.NOT_APPROVED
          : values.status?.id === ACHIEVEMENT_STATUS.DRAFT
          ? ACHIEVEMENT_STATUS.NOT_APPROVED
          : values.status?.id || ACHIEVEMENT_STATUS.NOT_APPROVED,
        values
      )
    },
  })

  const buttonSubmitDisabled = useMemo(() => {
    if (achievement.status?.id === ACHIEVEMENT_STATUS.DRAFT) {
      return false
    }
    const convert = (achievement: AchievementListItemView) => ({
      name: achievement.name,
      startDate: achievement.startDate,
      endDate: achievement.endDate,
      rateOverTotalScore: achievement.rateOverTotalScore?.toString(),
      description: achievement.description,
    })
    const init = convert(achievement)
    const binding = convert(achievementFormik.values)
    return JSON.stringify(init) === JSON.stringify(binding) && !isUploadFile
  }, [achievement, achievementFormik.values, isUploadFile])

  const handleSubmit = () => {
    achievementFormik.handleSubmit()
    setTimeout(() => {
      scrollToFirstErrorMessage()
    })
  }

  const handleChange = ({
    achievement,
    isUploadFile,
    file,
  }: {
    achievement: AchievementListItemView
    isUploadFile?: boolean
    file?: FileItem
  }) => {
    achievementFormik.setValues(achievement)
    if (isUploadFile) {
      setIsUploadFile(true)
    }
    if (file && !fileWillDeleted) {
      setFileWillDeleted(file)
    }
  }

  const handleSaveDraft = () => {
    submitModal(ACHIEVEMENT_STATUS.DRAFT, achievementFormik.values)
  }

  const submitModal = (status: number, values: AchievementListItemView) => {
    if (fileWillDeleted?.id) {
      dispatch(
        deleteFile({
          id: fileWillDeleted?.id,
        })
      )
    }
    const payload = {
      achievementId: values.id || '',
      preAchievementName: values.name || '',
      evaluationCycleId: params.evaluationCycleId || '',
      evaluationCycleStaffId: queryParams.get('evaluationCycleStaffId') || '',
      requestBody: {
        name: values.name,
        startDate: values.startDate,
        endDate: values.endDate,
        rateOverTotalScore: values.rateOverTotalScore,
        status: status,
        description: values.description || '',
      },
      evidences: isUploadFile ? values.evidences : [],
    }
    onSubmit(payload as UpdateAchievementPayload)
  }

  return (
    <Modal
      open
      width={960}
      submitDisabled={buttonSubmitDisabled}
      title={
        achievement.name
          ? `${i18Mbo('LB_ACHIEVEMENT')}: ${achievement.name}`
          : i18Mbo('LB_ACHIEVEMENT')
      }
      onClose={onClose}
      labelSubmit={i18('LB_UPDATE') as string}
      onSubmit={handleSubmit}
      isButtonCustom={
        achievementFormik.values.status?.id == ACHIEVEMENT_STATUS.DRAFT
      }
      colorButtonCustom="inherit"
      labelButtonCustom={i18('LB_SAVE_DRAFT') as string}
      onSubmitCustom={handleSaveDraft}
    >
      <AchievementForm
        usePreview={!isUploadFile}
        useTitle={false}
        achievement={achievementFormik.values}
        errors={achievementFormik.errors}
        touched={achievementFormik.touched}
        useDeleteIcons={false}
        onChange={handleChange}
      />
    </Modal>
  )
}

const useStyles = makeStyles(() => ({}))

export default ModalEditAchievement

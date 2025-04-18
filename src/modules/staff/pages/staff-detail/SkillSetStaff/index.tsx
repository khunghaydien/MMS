import CommonButton from '@/components/buttons/CommonButton'
import ModalConfirm from '@/components/modal/ModalConfirm'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import {
  SkillItem,
  SkillSetListItem,
} from '@/modules/staff/components/ModalExportSkillSets/ModalExportSkillSets'
import SkillSetList from '@/modules/staff/components/ModalExportSkillSets/SkillSetList'
import StaffStepAction from '@/modules/staff/components/StaffStepAction'
import { CONFIG_STAFF_STEP } from '@/modules/staff/const'
import {
  refactorSkillSetList,
  setActiveStep,
  setSkillSetList,
  staffSelector,
} from '@/modules/staff/reducer/staff'
import {
  getSkillSets,
  updateSkillSetStaffDetail,
} from '@/modules/staff/reducer/thunk'
import { StaffState, UpdateSkillSetStaffDetail } from '@/modules/staff/types'
import { AuthState, selectAuth } from '@/reducer/auth'
import { alertSuccess, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { uuid } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

interface SkillSetStaffProps {
  tempStep?: number
  flagUpdate?: boolean
  onChangeForm: (isChange: boolean) => void
  onUpdateFlag: (isChange: boolean) => void
}

const SkillSetStaff = ({
  tempStep = 0,
  flagUpdate,
  onChangeForm,
  onUpdateFlag,
}: SkillSetStaffProps) => {
  //const
  const classes = useStyles()
  const params = useParams()
  const { t: i18 } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const { activeStep, skillSetList, isUpdateStaff }: StaffState =
    useSelector(staffSelector)
  const { permissions }: AuthState = useSelector(selectAuth)

  const [flagSubmit, setFlagSubmit] = useState(false)
  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false)
  const [skillSetListTemp, setSkillSetListTemp] = useState<SkillSetListItem[]>(
    []
  )
  const [showModalDeleteSkillGroup, setShowModalDeleteSkillGroup] = useState({
    status: false,
    skillGroupIndex: 0,
  })
  const [showModalDeleteSkillName, setShowModalDeleteSkillName] = useState({
    status: false,
    skillGroupIndex: 0,
    skillSetLevelIndex: 0,
  })

  const staffId: string | number = useMemo(() => {
    return params.staffId || ''
  }, [params.staffId])

  const isViewDetail = useMemo(() => {
    return !!staffId
  }, [staffId])

  const isButtonSubmitDisabled = useMemo(() => {
    return JSON.stringify(skillSetList) === JSON.stringify(skillSetListTemp)
  }, [skillSetList, skillSetListTemp])

  const descriptionDeleteSkillGroup = useMemo(() => {
    if (!skillSetList.length) return ''
    return `Do you wish to delete Skill Group ${
      skillSetList[showModalDeleteSkillGroup.skillGroupIndex].skillGroupName
    }?`
  }, [skillSetList, showModalDeleteSkillGroup])

  const descriptionDeleteSkillName = useMemo(() => {
    if (!skillSetList.length) return ''
    return `Do you wish to delete Skill Name ${
      skillSetList[showModalDeleteSkillName.skillGroupIndex].skillSetLevels[
        showModalDeleteSkillName.skillSetLevelIndex
      ]?.skillName || ''
    }?`
  }, [skillSetList, showModalDeleteSkillName])

  const getErrors = () => {
    let error: boolean = false
    if (skillSetList.length) {
      error = skillSetList.some(
        (skillSetListItem: SkillSetListItem) =>
          !skillSetListItem.id || !skillSetListItem.skillSetLevels.length
      )
      let allSkillSetLevels: SkillItem[] = []
      const allSkillSetLevelsNotFlat: SkillItem[][] = []
      skillSetList.forEach((skillSetListItem: SkillSetListItem) => {
        allSkillSetLevels = [
          ...allSkillSetLevels,
          ...skillSetListItem.skillSetLevels,
        ]
        if (skillSetListItem.skillSetLevels.length) {
          allSkillSetLevelsNotFlat.push(skillSetListItem.skillSetLevels)
        }
      })
      if (
        allSkillSetLevels.length &&
        allSkillSetLevelsNotFlat.length === skillSetList.length
      ) {
        error = allSkillSetLevels.some(
          (skillItem: SkillItem) =>
            !skillItem.id ||
            !skillItem.yearOfExperience ||
            !skillItem.level ||
            skillItem.yearOfExperience.length > 2
        )
      }
    }
    return error
  }

  const handleNext = () => {
    setFlagSubmit(true)
    const error: boolean = getErrors()
    !error && dispatch(setActiveStep(activeStep + 1))
  }
  const getApiListSkillSet = () => {
    dispatch(updateLoading(true))
    dispatch(
      getSkillSets({
        staffId: staffId,
        params: { pageNum: 1 },
      })
    )
      .unwrap()
      .then(res => {
        const tempSkillSetList = refactorSkillSetList(res.data.content || [])
        setSkillSetListTemp(tempSkillSetList)
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  const handleAddNewSkillSet = () => {
    setFlagSubmit(false)
    const newSkillSetList = structuredClone(skillSetList)
    newSkillSetList.push({
      id: '',
      skillGroupName: '',
      skillSetLevels: [],
      code: uuid(),
    })
    dispatch(setSkillSetList(newSkillSetList))
  }

  const handleDeleteSkillGroup = (
    skillGroupIndex: number = showModalDeleteSkillGroup.skillGroupIndex
  ) => {
    dispatch(
      alertSuccess({
        message: `Skill Group ${skillSetList[skillGroupIndex].skillGroupName} has been successfully deleted`,
      })
    )
    setFlagSubmit(false)
    const newSkillSetList = structuredClone(skillSetList)
    newSkillSetList.splice(skillGroupIndex, 1)
    dispatch(setSkillSetList(newSkillSetList))
  }

  const handleSkillGroupChange = ({
    value,
    skillGroupIndex,
    skillGroupName,
  }: {
    value: string
    skillGroupIndex: number
    skillGroupName: string
  }) => {
    const newSkillSetList = structuredClone(skillSetList)
    setFlagSubmit(false)
    newSkillSetList[skillGroupIndex].id = value
    newSkillSetList[skillGroupIndex].skillGroupName = skillGroupName
    newSkillSetList[skillGroupIndex].skillSetLevels = []
    dispatch(setSkillSetList(newSkillSetList))
  }

  const handleAddNewSkillName = (skillGroupIndex: number) => {
    setFlagSubmit(false)
    const newSkillSetList = structuredClone(skillSetList)
    const newSkillItem: SkillItem = {
      id: '',
      level: '',
      skillName: '',
      yearOfExperience: '',
      note: '',
    }
    newSkillSetList[skillGroupIndex].skillSetLevels.push(newSkillItem)
    dispatch(setSkillSetList(newSkillSetList))
  }

  const handleDeleteSkillName = (
    skillGroupIndex: number = showModalDeleteSkillName.skillGroupIndex,
    skillSetLevelIndex: number = showModalDeleteSkillName.skillSetLevelIndex
  ) => {
    dispatch(
      alertSuccess({
        message: `Skill Name ${skillSetList[skillGroupIndex].skillSetLevels[skillSetLevelIndex].skillName} has been successfully deleted`,
      })
    )
    const newSkillSetList = structuredClone(skillSetList)
    newSkillSetList[skillGroupIndex].skillSetLevels.splice(
      skillSetLevelIndex,
      1
    )
    dispatch(setSkillSetList(newSkillSetList))
  }

  const handleSkillSetListChange = (payload: {
    value: string
    skillGroupIndex: number
    skillSetLevelIndex: number
    key: string
    skillName?: string
  }) => {
    const { value, skillGroupIndex, skillSetLevelIndex, key, skillName } =
      payload
    const newSkillSetList = structuredClone(skillSetList)
    const newSkillItem = {
      ...newSkillSetList[skillGroupIndex].skillSetLevels[skillSetLevelIndex],
      [key]: value,
    }
    newSkillSetList[skillGroupIndex].skillSetLevels[skillSetLevelIndex] =
      newSkillItem
    if (skillName) {
      newSkillSetList[skillGroupIndex].skillSetLevels[skillSetLevelIndex] = {
        ...newSkillItem,
        skillName,
      }
    }
    if (key === 'id' && !skillName) {
      newSkillSetList[skillGroupIndex].skillSetLevels[skillSetLevelIndex] = {
        ...newSkillItem,
        skillName: '',
      }
    }
    dispatch(setSkillSetList(newSkillSetList))
  }

  const handleSubmitStaffSkillSet = (isChangeStep: boolean = false) => {
    const requestBody: UpdateSkillSetStaffDetail[] = []
    skillSetList.forEach((item: SkillSetListItem) => {
      requestBody.push({
        skillGroupId: +item.id,
        skillSetLevels: item.skillSetLevels.map((skillItem: SkillItem) => ({
          level: skillItem.level,
          note: skillItem.note || '',
          skillId: +skillItem.id,
          yearsOfExperience: skillItem.yearOfExperience,
        })),
      })
    })

    dispatch(updateLoading(true))
    dispatch(
      updateSkillSetStaffDetail({
        staffId,
        requestBody,
      })
    )
      .unwrap()
      .then(() => {
        getApiListSkillSet()
        isChangeStep && dispatch(setActiveStep(tempStep))
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  const handleShowModalDeleteSkillGroup = (skillGroupIndex: number) => {
    if (skillSetList[skillGroupIndex].id) {
      setShowModalDeleteSkillGroup({
        status: true,
        skillGroupIndex,
      })
    } else {
      handleDeleteSkillGroup(skillGroupIndex)
    }
  }

  const handleShowModalDeleteSkillName = (payload: {
    skillGroupIndex: number
    skillSetLevelIndex: number
  }) => {
    const { skillGroupIndex, skillSetLevelIndex } = payload
    if (skillSetList[skillGroupIndex].skillSetLevels[skillSetLevelIndex].id) {
      setShowModalDeleteSkillName({
        status: true,
        skillGroupIndex,
        skillSetLevelIndex,
      })
    } else {
      handleDeleteSkillName(skillGroupIndex, skillSetLevelIndex)
    }
  }

  const handleShowModalConfirmUpdate = () => {
    const error = getErrors()
    if (error) {
      setFlagSubmit(true)
    } else {
      setIsShowModalConfirm(true)
    }
  }

  useEffect(() => {
    if (isViewDetail) {
      getApiListSkillSet()
    }
  }, [isViewDetail])

  useEffect(() => {
    onChangeForm(!isButtonSubmitDisabled)
  }, [isButtonSubmitDisabled])

  useEffect(() => {
    if (flagUpdate) {
      const error = getErrors()
      if (error) {
        setFlagSubmit(true)
        onUpdateFlag(false)
      } else {
        handleSubmitStaffSkillSet(true)
      }
    }
  }, [flagUpdate])

  return (
    <Box>
      <ModalConfirm
        title="Update Skillset Information"
        description="Do you wish to update Skillset Information?"
        open={isShowModalConfirm}
        onClose={() => setIsShowModalConfirm(false)}
        onSubmit={handleSubmitStaffSkillSet}
      />
      {showModalDeleteSkillGroup.status && (
        <ModalDeleteRecords
          open
          titleMessage="Delete Skill Group"
          subMessage={descriptionDeleteSkillGroup}
          onClose={() =>
            setShowModalDeleteSkillGroup({ status: false, skillGroupIndex: 0 })
          }
          onSubmit={handleDeleteSkillGroup}
        />
      )}
      {showModalDeleteSkillName.status && (
        <ModalDeleteRecords
          open
          titleMessage="Delete Skill Name"
          subMessage={descriptionDeleteSkillName}
          onClose={() =>
            setShowModalDeleteSkillName({
              status: false,
              skillGroupIndex: 0,
              skillSetLevelIndex: 0,
            })
          }
          onSubmit={handleDeleteSkillName}
        />
      )}
      <SkillSetList
        useNote
        readonly={
          isViewDetail && (!permissions.useStaffUpdate || !isUpdateStaff)
        }
        flagSubmit={flagSubmit}
        skillSetList={skillSetList}
        onAddNewSkillSet={handleAddNewSkillSet}
        onDeleteSkillGroup={handleShowModalDeleteSkillGroup}
        onAddNewSkill={handleAddNewSkillName}
        onDeleteSkill={handleShowModalDeleteSkillName}
        onSkillGroupChange={handleSkillGroupChange}
        onChange={handleSkillSetListChange}
      />
      {!isViewDetail ? (
        <StaffStepAction
          configSteps={CONFIG_STAFF_STEP}
          activeStep={activeStep}
          onNext={handleNext}
        />
      ) : isViewDetail && !permissions.useStaffUpdate ? (
        <Box />
      ) : (
        <Box className={classes.footer}>
          <CommonButton
            disabled={isButtonSubmitDisabled}
            onClick={handleShowModalConfirmUpdate}
            height={40}
            width={96}
          >
            {i18(isViewDetail ? 'LB_UPDATE' : 'LB_SUBMIT')}
          </CommonButton>
        </Box>
      )}
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootSkillSetList: {
    width: '100%',
  },
  headerFilter: {
    display: 'flex',
    gap: theme.spacing(2),
    justifyContent: 'end',
    '& .btn-add': {
      height: theme.spacing(5),
    },
    '& .header-filter': {
      width: theme.spacing(30),
      display: 'flex',
      gap: theme.spacing(2),
    },
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(2),
  },
}))
export default SkillSetStaff

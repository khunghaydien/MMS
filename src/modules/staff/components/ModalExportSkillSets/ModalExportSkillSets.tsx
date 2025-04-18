import Modal from '@/components/common/Modal'
import { AppDispatch } from '@/store'
import { DateRange, OptionItem } from '@/types'
import { formatDate, uuid } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { cloneDeep, uniqBy } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { PersonalInformation as IPersonalInformation } from '../../pages/staff-detail'
import { staffSelector } from '../../reducer/staff'
import { getSkillSets, getStaffProject } from '../../reducer/thunk'
import { StaffState } from '../../types'
import LevelDescriptionCriteria from './LevelDescriptionCriteria'
import MainProjects from './MainProjects'
import PersonalInformation from './PersonalInformation'
import SkillSetList from './SkillSetList'

export interface SkillItem {
  id: string
  level: string
  skillName: string
  yearOfExperience: string
  code?: string
  note?: string
}

export interface SkillSetListItem {
  id: string
  skillGroupName: string
  skillSetLevels: SkillItem[]
  code?: string
  note?: string
}

export interface ProjectInformation {
  name: string
  startDate: Date | null
  endDate: Date | null
  role: string
  teamSize: string
  technology: OptionItem[]
  description: string
  code?: string
}

interface ModalExportSkillSetsProps {
  title: string
  personalInformation: IPersonalInformation
  onClose: () => void
  onSubmit: (payload: any) => void
}

const ModalExportSkillSets = ({
  title,
  personalInformation,
  onClose,
  onSubmit,
}: ModalExportSkillSetsProps) => {
  const classes = useStyles()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()

  const { skillSetStaffs, staffProject }: StaffState =
    useSelector(staffSelector)

  const [flagSubmit, setFlagSubmit] = useState(false)
  const [skillSetList, setSkillSetList] = useState<SkillSetListItem[]>([])
  const [mainProjects, setMainProjects] = useState<ProjectInformation[]>([])

  const personalInformationList = useMemo(() => {
    return [
      {
        id: 1,
        label: 'Date Of Birth',
        value: personalInformation.dateOfBirth,
      },
      {
        id: 2,
        label: 'Gender',
        value: personalInformation.gender,
      },
      {
        id: 3,
        label: 'Email',
        value: personalInformation.email,
      },
    ]
  }, [personalInformation])

  const handleSkillSetListChange = (payload: {
    value: string
    skillGroupIndex: number
    skillSetLevelIndex: number
    key: string
  }) => {
    const { value, skillGroupIndex, skillSetLevelIndex, key } = payload
    const newSkillSetList = [...skillSetList]
    const newSkillItem = {
      ...newSkillSetList[skillGroupIndex].skillSetLevels[skillSetLevelIndex],
      [key]: value,
    }
    newSkillSetList[skillGroupIndex].skillSetLevels[skillSetLevelIndex] =
      newSkillItem
    setSkillSetList(newSkillSetList)
  }

  const handleProjectListChange = (payload: {
    value: any
    projectIndex: number
    key: keyof ProjectInformation
  }) => {
    const { value, projectIndex, key } = payload
    const newMainProjects = [...mainProjects]
    newMainProjects[projectIndex][key] = value
    setMainProjects(newMainProjects)
  }

  const handleAddNewSkill = (skillGroupIndex: number) => {
    setFlagSubmit(false)
    const newSkillSetList = [...skillSetList]
    const newSkillItem: SkillItem = {
      id: '',
      level: '',
      skillName: '',
      yearOfExperience: '',
      code: uuid(),
    }
    newSkillSetList[skillGroupIndex].skillSetLevels.push(newSkillItem)
    setSkillSetList(newSkillSetList)
  }

  const handleDeleteSkill = (payload: {
    skillGroupIndex: number
    skillSetLevelIndex: number
  }) => {
    const { skillGroupIndex, skillSetLevelIndex } = payload
    const newSkillSetList = [...skillSetList]
    newSkillSetList[skillGroupIndex].skillSetLevels.splice(
      skillSetLevelIndex,
      1
    )
    setSkillSetList(newSkillSetList)
  }

  const handleDeleteProject = (projectIndex: number) => {
    const newMainProjects = [...mainProjects]
    newMainProjects.splice(projectIndex, 1)
    setMainProjects(newMainProjects)
  }

  const handleAddNewProject = () => {
    setFlagSubmit(false)
    const newProject: ProjectInformation = {
      name: '',
      startDate: null,
      endDate: null,
      role: '',
      teamSize: '',
      technology: [],
      description: '',
      code: uuid(),
    }
    const newMainProjects = cloneDeep(mainProjects)
    newMainProjects.push(newProject)
    setMainProjects(newMainProjects)
  }

  const fillSkillSetList = () => {
    if (skillSetStaffs.length) {
      const result: SkillSetListItem[] = []
      const skillGroups = uniqBy(
        skillSetStaffs.map(item => item.skillGroup),
        'id'
      )
      skillGroups.forEach(skillGroup => {
        const skillSetLevels = skillSetStaffs.filter(
          item => item.skillGroup.id === skillGroup.id
        )
        const newSkillGroup: SkillSetListItem = {
          id: skillGroup.id?.toString() as string,
          skillGroupName: skillGroup.label as string,
          skillSetLevels: skillSetLevels.map(item => ({
            id: item.skillName.id?.toString() as string,
            level: item.level.value,
            skillName: item.skillName.label,
            yearOfExperience: item.yearsOfExperience?.toString(),
          })) as SkillItem[],
        }
        result.push(newSkillGroup)
        setSkillSetList(result)
      })
    }
  }

  const fillMainProjects = () => {
    if (staffProject.data?.length) {
      const newMainProjects: ProjectInformation[] = staffProject.data.map(
        item => {
          const _teamSize = item.teamSize
            ? item.teamSize.toString().includes('.')
              ? item.teamSize.toFixed(2).toString()
              : item.teamSize.toString()
            : ''
          return {
            id: item.id?.toString(),
            name: item.name,
            startDate: new Date(item.startDate),
            endDate: new Date(item.endDate),
            role: item.role || '',
            teamSize: _teamSize,
            technology: item.technologies.map(tech => ({
              id: tech.skillSetId,
              label: tech.name,
              value: tech.skillSetId,
            })),
            description: item.description || '',
          }
        }
      )
      setMainProjects(newMainProjects)
    }
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
    const newSkillSetList = [...skillSetList]
    newSkillSetList[skillGroupIndex].id = value
    newSkillSetList[skillGroupIndex].skillGroupName = skillGroupName
    newSkillSetList[skillGroupIndex].skillSetLevels = []
    setSkillSetList(newSkillSetList)
  }

  const getErrors = () => {
    if (!skillSetList.length || !mainProjects.length) {
      return true
    }
    let skillSetError: boolean = false
    let projectError: boolean = false

    // skillSet error
    skillSetError = skillSetList.some(
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
      skillSetError = allSkillSetLevels.some(
        (skillItem: SkillItem) =>
          !skillItem.id || !skillItem.yearOfExperience || !skillItem.level
      )
    }

    // project error
    projectError = mainProjects.some(
      (project: ProjectInformation) =>
        !project.description ||
        !project.endDate ||
        !project.startDate ||
        !project.name ||
        !project.role ||
        !project.teamSize ||
        !project.technology.length
    )
    return skillSetError || projectError
  }

  const handleSubmit = () => {
    setFlagSubmit(true)
    const isError = getErrors()
    if (!isError) {
      const payload = {
        personalInformation,
        skillSetList: skillSetList.map(
          (skillSetListItem: SkillSetListItem) => ({
            skillGroupName: skillSetListItem.skillGroupName,
            skillSetLevels: skillSetListItem.skillSetLevels.map(
              (skillItem: SkillItem) => ({
                level: skillItem.level,
                skillName: skillItem.skillName,
                yearOfExperience: skillItem.yearOfExperience,
              })
            ),
          })
        ),
        mainProjects: mainProjects.map((project: ProjectInformation) => ({
          description: project.description || '',
          endDate: formatDate(project.endDate || new Date()),
          name: project.name || '',
          role: project.role || '',
          startDate: formatDate(project.startDate || new Date()),
          teamSize: project.teamSize,
          technology: project.technology
            .map((item: OptionItem) => item.label)
            .join(', '),
        })),
      }
      onSubmit(payload)
    } else {
      setTimeout(() => {
        scrollToFirstErrorMessage()
      })
    }
  }

  const scrollToFirstErrorMessage = () => {
    const listFields = Array.from(document.querySelectorAll('.input-field'))
    const fieldError = listFields.find(field =>
      field.querySelector('.error-message-scroll')
    ) as HTMLElement
    const modalContent = document.querySelector('.modal-content')
    if (fieldError && modalContent) {
      fieldError.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }

  const handleAddNewSkillSet = () => {
    setFlagSubmit(false)
    const newSkillSetList = [...skillSetList]
    newSkillSetList.push({
      id: '',
      skillGroupName: '',
      skillSetLevels: [],
      code: uuid(),
    })
    setSkillSetList(newSkillSetList)
  }

  const handleDeleteSkillGroup = (skillGroupIndex: number) => {
    setFlagSubmit(false)
    const newSkillSetList = [...skillSetList]
    newSkillSetList.splice(skillGroupIndex, 1)
    setSkillSetList(newSkillSetList)
  }

  const handleProjectNameChange = ({
    value,
    projectIndex,
  }: {
    value: string
    projectIndex: number
  }) => {
    const newMainProjects = [...mainProjects]
    newMainProjects[projectIndex].name = value
    setMainProjects(newMainProjects)
  }

  const handleProjectDateChange = ({
    value,
    projectIndex,
  }: {
    value: DateRange
    projectIndex: number
  }) => {
    const newMainProjects = [...mainProjects]
    newMainProjects[projectIndex].startDate = value.startDate || null
    newMainProjects[projectIndex].endDate = value.endDate || null
    setMainProjects(newMainProjects)
  }

  useEffect(() => {
    dispatch(
      getSkillSets({
        staffId: params.staffId,
        params: { pageNum: 1, pageSize: 100 },
      })
    )
      .unwrap()
      .finally(() => {
        fillSkillSetList()
      })
    dispatch(
      getStaffProject({
        staffId: params.staffId as string,
        pageNum: 1,
        pageSize: 100,
      })
    ).finally(() => {
      fillMainProjects()
    })
  }, [])

  useEffect(() => {
    fillSkillSetList()
  }, [skillSetStaffs])

  useEffect(() => {
    fillMainProjects()
  }, [staffProject])

  return (
    <Modal
      open
      width={'100%'}
      labelSubmit="Export"
      useButtonCancel={false}
      useEditMode
      className={classes.modal}
      title={title}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Box className={clsx(classes.rootModalExportSkillSets, 'scrollbar')}>
        <PersonalInformation personalInformation={personalInformationList} />
        <LevelDescriptionCriteria />
        <SkillSetList
          flagSubmit={flagSubmit}
          skillSetList={skillSetList}
          onChange={handleSkillSetListChange}
          onAddNewSkill={handleAddNewSkill}
          onDeleteSkill={handleDeleteSkill}
          onSkillGroupChange={handleSkillGroupChange}
          onAddNewSkillSet={handleAddNewSkillSet}
          onDeleteSkillGroup={handleDeleteSkillGroup}
        />
        <MainProjects
          flagSubmit={flagSubmit}
          mainProjects={mainProjects}
          onChange={handleProjectListChange}
          onDeleteProject={handleDeleteProject}
          onAddNewProject={handleAddNewProject}
          onProjectNameChange={handleProjectNameChange}
          onDateChange={handleProjectDateChange}
        />
      </Box>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootModalExportSkillSets: {
    paddingRight: theme.spacing(2),
  },
  modal: {
    '& [data-title="button"]': {
      cursor: 'pointer',
      width: 'max-content',
      color: theme.color.black.secondary,
    },
    '& .MuiPaper-root': {
      width: '100vw',
      height: '100vh',
    },
  },
}))
export default ModalExportSkillSets

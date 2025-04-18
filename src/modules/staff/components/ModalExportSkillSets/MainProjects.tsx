import ButtonAddPlus from '@/components/buttons/ButtonAddPlus'
import InputErrorMessage from '@/components/common/InputErrorMessage'
import CardForm from '@/components/Form/CardForm'
import FormItem from '@/components/Form/FormItem/FormItem'
import FormLayout from '@/components/Form/FormLayout'
import DeleteIcon from '@/components/icons/DeleteIcon'
import InputRangeDatePicker from '@/components/inputs/InputRangeDatePicker'
import InputTextArea from '@/components/inputs/InputTextArea'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import SelectService from '@/components/select/SelectService'
import { LangConstant } from '@/const'
import { DateRange, EventInput, OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ProjectInformation } from './ModalExportSkillSets'

interface MainProjectsProps {
  flagSubmit: boolean
  mainProjects: ProjectInformation[]
  onChange: (payload: {
    value: any
    projectIndex: number
    key: keyof ProjectInformation
  }) => void
  onDeleteProject: (projectIndex: number) => void
  onAddNewProject: () => void
  onProjectNameChange: (payload: {
    value: string
    projectIndex: number
  }) => void
  onDateChange: (payload: { value: DateRange; projectIndex: number }) => void
}

const MainProjects = ({
  flagSubmit,
  mainProjects,
  onChange,
  onDeleteProject,
  onAddNewProject,
  onProjectNameChange,
  onDateChange,
}: MainProjectsProps) => {
  const classes = useStyles()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)

  const [projectIndex, setProjectIndex] = useState(0)

  const handleProjectChange = (
    value: any,
    projectIndex: number,
    key: keyof ProjectInformation
  ) => {
    onChange({
      value,
      projectIndex,
      key,
    })
  }

  const handleProjectNameChange = useCallback(
    (e: EventInput) => {
      onProjectNameChange({
        value: e.target.value,
        projectIndex,
      })
    },
    [onProjectNameChange, projectIndex]
  )

  const handleDateChange = (dateRange: DateRange, projectIndex: number) => {
    const value = {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    }
    onDateChange({
      value,
      projectIndex,
    })
  }

  const handleDescriptionChange = useCallback(
    (e: any) => {
      handleProjectChange(e.target.value, projectIndex, 'description')
    },
    [projectIndex, handleProjectChange]
  )

  const handleTeamSizeChange = useCallback(
    (e: EventInput) => {
      handleProjectChange(e.target.value, projectIndex, 'teamSize')
    },
    [projectIndex, handleProjectChange]
  )

  const handleTechnologyChange = useCallback(
    (value: OptionItem[]) => {
      handleProjectChange(value, projectIndex, 'technology')
    },
    [projectIndex, handleProjectChange]
  )

  const handleRoleChange = useCallback(
    (e: EventInput) => {
      handleProjectChange(e.target.value, projectIndex, 'role')
    },
    [projectIndex, handleProjectChange]
  )

  return (
    <CardForm title="Main Projects">
      <Box className={classes.rootMainProjects}>
        {flagSubmit && !mainProjects.length && (
          <InputErrorMessage content={'Main Projects must be selected'} />
        )}
        {mainProjects.map(
          (project: ProjectInformation, projectIndex: number) => (
            <Box
              className={classes.projectItem}
              key={`${projectIndex} ${project.code}`}
              onClick={() => setProjectIndex(projectIndex)}
            >
              <Box className={classes.projectName}>
                <InputTextLabel
                  required
                  error={flagSubmit && !project.name}
                  errorMessage="Project Name required to have input"
                  label="Project Name"
                  placeholder={i18Project('PLH_PROJECT_NAME')}
                  value={project.name}
                  onChange={handleProjectNameChange}
                />
                <FormLayout top={16}>
                  <FormItem
                    className="input-field"
                    label="Project Date"
                    required
                  >
                    <InputRangeDatePicker
                      error={
                        flagSubmit && (!project.startDate || !project.endDate)
                      }
                      errorMessage="Project Date must have a specific date"
                      values={{
                        startDate: project.startDate || null,
                        endDate: project.endDate || null,
                      }}
                      onChange={(dateRange: DateRange) =>
                        handleDateChange(dateRange, projectIndex)
                      }
                    />
                  </FormItem>
                </FormLayout>
              </Box>
              <Box className={classes.projectInformation}>
                <Box className={clsx(classes.projectInfoItem, 'input-field')}>
                  <InputTextArea
                    required
                    error={flagSubmit && !project.description}
                    errorMessage="Project Description required to have input"
                    label="Description"
                    placeholder="E.g: This is some description"
                    defaultValue={project.description}
                    onChange={handleDescriptionChange}
                  />
                </Box>
                <Box className={classes.projectInfoItem}>
                  <FormLayout width={160}>
                    <Box className="input-field">
                      <InputTextLabel
                        required
                        error={flagSubmit && !project.teamSize}
                        errorMessage="Project Team Size required to have input"
                        label="Team Size"
                        placeholder="E.g: 10"
                        value={project.teamSize}
                        onChange={handleTeamSizeChange}
                      />
                    </Box>
                  </FormLayout>
                  <Box className="input-field">
                    <SelectService
                      required
                      error={flagSubmit && !project.technology.length}
                      errorMessage="Project Technology must be selected"
                      maxLength={10}
                      label="Technology"
                      placeholder="Select Technology"
                      value={project.technology}
                      onChange={handleTechnologyChange}
                    />
                  </Box>
                </Box>
                <Box className={clsx(classes.projectInfoItem, 'input-field')}>
                  <FormLayout width={260}>
                    <InputTextLabel
                      required
                      error={flagSubmit && !project.role}
                      errorMessage="Role required to have input"
                      label="Role"
                      placeholder="E.g: Front-end Engineer"
                      value={project.role}
                      onChange={handleRoleChange}
                    />
                  </FormLayout>
                </Box>
              </Box>
              {mainProjects.length > 1 && (
                <Box sx={{ padding: '8px' }}>
                  <DeleteIcon
                    data-title="button"
                    onClick={() => onDeleteProject(projectIndex)}
                  />
                </Box>
              )}
            </Box>
          )
        )}
      </Box>
      <ButtonAddPlus label="Add New Project" onClick={onAddNewProject} />
    </CardForm>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootMainProjects: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },
  projectItem: {
    width: '100%',
    border: `1px solid ${theme.color.grey.secondary}`,
    display: 'flex',
    backgroundColor: '#F8F8FF',
  },
  projectName: {
    width: 390,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(2),
    alignItems: 'flex-start',
    borderRight: `1px solid ${theme.color.grey.secondary}`,
  },
  projectDate: {
    fontSize: 14,
    marginTop: theme.spacing(1),
  },
  projectInformation: {
    width: 'calc(100% - 200px)',
  },
  projectInfoItem: {
    padding: theme.spacing(2),
    width: '100%',
    display: 'flex',
    gap: theme.spacing(3),
    '& .MuiBox-root': {
      width: '100%',
      maxWidth: '100%',
    },
    '& .counter, & .endAdornment': {
      width: 'unset',
      maxWidth: 'unset',
    },
  },
}))

export default memo(MainProjects)

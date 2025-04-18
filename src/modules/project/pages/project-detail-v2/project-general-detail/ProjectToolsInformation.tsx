import CardFormEdit from '@/components/Form/CardFormEdit'
import { LangConstant } from '@/const'
import { projectSelector } from '@/modules/project/reducer/project'
import { ProjectState } from '@/modules/project/types'
import useProjectValidation from '@/modules/project/utils/useProjectValidation'
import { AuthState, selectAuth } from '@/reducer/auth'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import ModalEditToolsInformation from './ModalEditToolsInformation'

const ProjectToolsInformation = () => {
  const classes = useStyles()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)

  const { generalInfo, updateGeneralInfo }: ProjectState =
    useSelector(projectSelector)
  const { permissions, staff }: AuthState = useSelector(selectAuth)

  const [openModalEdit, setOpenModalEdit] = useState(false)

  const informationList = [
    {
      id: 'sharedDriveLink',
      label: i18Project('LB_SHARED_DRIVE_LINK'),
      value: generalInfo.driveLink,
    },
    {
      id: 'slackLink',
      label: i18Project('LB_PROJECT_SLACK_LINK'),
      value: generalInfo.slackLink,
    },
    {
      id: 'referenceLink',
      label: i18Project('LB_REFERENCE_LINK'),
      value: generalInfo.referenceLink,
    },
    {
      id: 'groupMail',
      label: i18Project('LB_GROUP_MAIL_ADDRESS'),
      value: generalInfo.groupMail,
    },
    {
      id: 'jiraLink',
      label: i18Project('LB_JIRA_LINK'),
      value: generalInfo.jiraLink,
    },
    {
      id: 'gitLink',
      label: i18Project('LB_GIT_LINK'),
      value: generalInfo.gitLink,
    },
  ]

  const { projectToolsInformationValidation } = useProjectValidation()

  const form = useFormik({
    initialValues: generalInfo,
    validationSchema: projectToolsInformationValidation,
    onSubmit: () => {},
  })
  const { setValues, values } = form

  const checkIsSubProjectManager = useMemo(() => {
    const subPm = values.subProjectManagers
    const staffId = staff?.id
    const isCheckSubPm = subPm.some(
      (subManager: any) => subManager.id === staffId?.toString()
    )
    return isCheckSubPm
  }, [values.projectManager?.id])

  const formDisabled = useMemo(() => {
    if (checkIsSubProjectManager) return false
    return !permissions.useProjectUpdateGeneralInfo || !updateGeneralInfo
  }, [
    permissions.useProjectUpdateGeneralInfo,
    updateGeneralInfo,
    checkIsSubProjectManager,
  ])

  useEffect(() => {
    setValues(generalInfo)
  }, [generalInfo])

  return (
    <Fragment>
      <CardFormEdit
        useDetailViewMode={!formDisabled}
        title={i18Project('TXT_TOOLS_INFORMATION') as string}
        onOpenEditMode={() => setOpenModalEdit(true)}
      >
        <Box className={classes.listFields}>
          {informationList.map(option => (
            <Box className={classes.option} key={option.id}>
              <Box className={classes.label}>{option.label}</Box>
              <Box className={classes.value}>{option.value || ''}</Box>
            </Box>
          ))}
        </Box>
      </CardFormEdit>
      {openModalEdit && (
        <ModalEditToolsInformation onClose={() => setOpenModalEdit(false)} />
      )}
    </Fragment>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  listFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2.5, 1),
  },
  option: {},
  label: {
    fontSize: 14,
    color: theme.color.black.secondary,
  },
  value: {
    fontSize: 14,
    marginTop: theme.spacing(0.5),
    fontWeight: 700,
    '& a': {
      color: theme.color.blue.primary,
      textDecoration: 'none',
    },
  },
  listFieldsViewEdit: {
    display: 'flex',
    gap: theme.spacing(2.5, 1),
    flexWrap: 'wrap',
    flexDirection: 'column',
  },
}))

export default ProjectToolsInformation

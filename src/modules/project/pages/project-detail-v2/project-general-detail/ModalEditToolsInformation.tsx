import CommonButton from '@/components/buttons/CommonButton'
import InputErrorMessage from '@/components/common/InputErrorMessage'
import Modal from '@/components/common/Modal'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import { NS_PROJECT } from '@/const/lang.const'
import {
  projectSelector,
  setGeneralInfo,
} from '@/modules/project/reducer/project'
import {
  projectGeneralValidate,
  updateProjectGeneral,
} from '@/modules/project/reducer/thunk'
import { IGeneralProjectState, ProjectState } from '@/modules/project/types'
import { convertPayloadGeneralUpdate } from '@/modules/project/utils'
import useProjectValidation from '@/modules/project/utils/useProjectValidation'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { EventInput } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import { useFormik } from 'formik'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

interface ModalEditToolsInformationProps {
  onClose: () => void
}

const initialExistingErros = {
  groupMail: false,
  jiraLink: false,
  gitLink: false,
}

const getToolsInformation = (general: IGeneralProjectState) => {
  return {
    slackLink: general.slackLink || '',
    groupMail: general.groupMail || '',
    jiraLink: general.jiraLink || '',
    gitLink: general.gitLink || '',
    driveLink: general.driveLink || '',
    referenceLink: general.referenceLink || '',
  }
}

const ModalEditToolsInformation = ({
  onClose,
}: ModalEditToolsInformationProps) => {
  const classes = useStyles()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const { projectToolsInformationValidation } = useProjectValidation()

  const { generalInfo }: ProjectState = useSelector(projectSelector)

  const form = useFormik({
    initialValues: generalInfo,
    validationSchema: projectToolsInformationValidation,
    onSubmit: () => {
      updateToolsInformation()
    },
  })
  const { values, setFieldValue, touched, errors } = form

  const [verified, setVerified] = useState({
    groupMail: false,
    jiraLink: false,
    gitLink: false,
  })
  const [existingErrors, setExistingErrors] = useState(initialExistingErros)

  const getVerifyBtnDisalbed = (field: keyof IGeneralProjectState) => {
    const dataThatDoesNotChange =
      (values[field] || '') === (generalInfo[field] || '')
    // @ts-ignore
    return dataThatDoesNotChange || verified[field]
  }

  const allPass = useMemo(() => {
    let groupMailPass =
      values.groupMail !== generalInfo.groupMail ? verified.groupMail : true
    let jiraLinkPass =
      values.jiraLink !== generalInfo.jiraLink ? verified.jiraLink : true
    let gitLinkPass =
      values.gitLink !== generalInfo.gitLink ? verified.gitLink : true
    return groupMailPass && jiraLinkPass && gitLinkPass
  }, [values, generalInfo, verified])

  const submitDisabled = useMemo(() => {
    const doesNotChange =
      JSON.stringify(getToolsInformation(values)) ===
      JSON.stringify(getToolsInformation(generalInfo))
    return doesNotChange || !allPass
  }, [values, generalInfo, allPass])

  const onChange = (e: EventInput, field: keyof IGeneralProjectState) => {
    setFieldValue(field, e.target.value)
    setVerified({
      ...verified,
      [field]: false,
    })
    setExistingErrors({
      ...existingErrors,
      [field]: false,
    })
  }

  const verify = (field: keyof IGeneralProjectState) => {
    dispatch(
      projectGeneralValidate({
        requestBody: [
          {
            fieldName: field,
            value: values[field],
          },
        ],
      })
    )
      .unwrap()
      .then((res: AxiosResponse) => {
        setVerified({
          ...verified,
          [field]: true,
        })
        setExistingErrors({
          ...existingErrors,
          [field]: false,
        })
      })
      .catch(err => {
        setVerified({
          ...verified,
          [field]: false,
        })
        setExistingErrors({
          ...existingErrors,
          [field]: true,
        })
      })
  }

  const updateToolsInformation = () => {
    dispatch(updateLoading(true))
    const data = convertPayloadGeneralUpdate(values)
    dispatch(updateProjectGeneral({ projectId: params.projectId || '', data }))
      .unwrap()
      .then(() => {
        dispatch(setGeneralInfo(values))
        onClose()
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  return (
    <Modal
      open
      title={i18Project('TXT_EDIT_TOOLS_INFORMATION')}
      onClose={onClose}
      submitDisabled={submitDisabled}
      onSubmit={() => form.handleSubmit()}
    >
      <Box className={classes.body}>
        <InputTextLabel
          keyName="driveLink"
          label={i18Project('LB_SHARED_DRIVE_LINK')}
          placeholder={i18Project('PLH_SHARED_DRIVE_LINK')}
          value={values.driveLink}
          onChange={onChange}
        />
        <InputTextLabel
          keyName="slackLink"
          label={i18Project('LB_PROJECT_SLACK_LINK')}
          placeholder={i18Project('PLH_INPUT_SLACK_LINK')}
          value={values.slackLink}
          onChange={onChange}
        />
        <InputTextLabel
          keyName="referenceLink"
          label={i18Project('LB_REFERENCE_LINK')}
          placeholder={i18Project('PLH_REFERENCE_LINK')}
          value={values.referenceLink}
          onChange={onChange}
        />
        <Box className={classes.formGroup}>
          <Box className={classes.field}>
            <InputTextLabel
              keyName="groupMail"
              label={i18Project('LB_GROUP_MAIL_ADDRESS')}
              placeholder={i18('PLH_INPUT_EMAIL')}
              value={values.groupMail}
              onChange={onChange}
              error={
                (!!errors.groupMail && touched.groupMail) ||
                existingErrors.groupMail
              }
              errorMessage=" "
            />
            <CommonButton
              className={classes.verifyBtn}
              disabled={getVerifyBtnDisalbed('groupMail')}
              onClick={() => verify('groupMail')}
            >
              {i18('LB_VERIFY')}
            </CommonButton>
          </Box>
          {verified.groupMail && (
            <InputErrorMessage
              className={classes.successMessage}
              color="green"
              content={i18('MSG_IS_VALID', {
                labelName: i18Project('LB_GROUP_MAIL_ADDRESS'),
              })}
            />
          )}
          {existingErrors.groupMail && (
            <InputErrorMessage
              content={i18('MSG_IS_INVALID', {
                labelName: i18Project('LB_GROUP_MAIL_ADDRESS'),
              })}
            />
          )}
        </Box>
        <Box className={classes.formGroup}>
          <Box className={classes.field}>
            <InputTextLabel
              keyName="jiraLink"
              label={i18Project('LB_JIRA_LINK')}
              placeholder={i18Project('PLH_JIRA_LINK')}
              value={values.jiraLink}
              onChange={onChange}
              error={
                (!!errors.jiraLink && touched.jiraLink) ||
                existingErrors.jiraLink
              }
              errorMessage=" "
            />
            <CommonButton
              className={classes.verifyBtn}
              disabled={getVerifyBtnDisalbed('jiraLink')}
              onClick={() => verify('jiraLink')}
            >
              {i18('LB_VERIFY')}
            </CommonButton>
          </Box>
          {verified.jiraLink && (
            <InputErrorMessage
              className={classes.successMessage}
              color="green"
              content={i18('MSG_IS_VALID', {
                labelName: i18Project('LB_JIRA_LINK'),
              })}
            />
          )}
          {existingErrors.jiraLink && (
            <InputErrorMessage
              content={i18('MSG_IS_INVALID', {
                labelName: i18Project('LB_JIRA_LINK'),
              })}
            />
          )}
        </Box>

        <Box className={classes.formGroup}>
          <Box className={classes.field}>
            <InputTextLabel
              keyName="gitLink"
              label={i18Project('LB_GIT_LINK')}
              placeholder={i18Project('PLH_GIT_LINK')}
              value={values.gitLink}
              onChange={onChange}
              error={
                (!!errors.gitLink && touched.gitLink) || existingErrors.gitLink
              }
              errorMessage=" "
            />
            <CommonButton
              className={classes.verifyBtn}
              disabled={getVerifyBtnDisalbed('gitLink')}
              onClick={() => verify('gitLink')}
            >
              {i18('LB_VERIFY')}
            </CommonButton>
          </Box>
          {verified.gitLink && (
            <InputErrorMessage
              className={classes.successMessage}
              color="green"
              content={i18('MSG_IS_VALID', {
                labelName: i18Project('LB_GIT_LINK'),
              })}
            />
          )}
          {existingErrors.gitLink && (
            <InputErrorMessage
              content={i18('MSG_IS_INVALID', {
                labelName: i18Project('LB_GIT_LINK'),
              })}
            />
          )}
        </Box>
      </Box>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  field: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'flex-end',
  },
  verifyBtn: {
    marginBottom: `${theme.spacing(1)} !important`,
  },
  formGroup: {},
  successMessage: {
    marginTop: theme.spacing(1),
  },
}))

export default ModalEditToolsInformation

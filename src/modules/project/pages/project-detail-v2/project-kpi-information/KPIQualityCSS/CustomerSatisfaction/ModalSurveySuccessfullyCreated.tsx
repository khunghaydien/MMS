import CommonButton from '@/components/buttons/CommonButton'
import Modal from '@/components/common/Modal'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import { NS_PROJECT } from '@/const/lang.const'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ModalSurveySuccessfullyCreatedProps {
  onClose: () => void
  surveyURL: string
}

const ModalSurveySuccessfullyCreated = ({
  onClose,
  surveyURL,
}: ModalSurveySuccessfullyCreatedProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const [copying, setCopying] = useState(false)

  const copyingTimeout = useRef<NodeJS.Timeout | null>(null)

  const toggleCopy = useCallback((status: boolean) => {
    if (status) {
      setCopying(status)
    } else {
      copyingTimeout.current = setTimeout(() => {
        setCopying(false)
      }, 500)
    }
  }, [])

  const onCopy = async () => {
    toggleCopy(true)
    if (copyingTimeout.current) {
      clearTimeout(copyingTimeout.current)
    }
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(surveyURL).finally(() => {
        toggleCopy(false)
      })
    } else {
      const textArea = document.createElement('textarea')
      textArea.value = surveyURL
      textArea.style.position = 'absolute'
      textArea.style.left = '-999999px'
      document.body.prepend(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
      } catch (error) {
        console.error(error)
      } finally {
        textArea.remove()
        toggleCopy(false)
      }
    }
  }

  return (
    <Modal
      open
      numberEllipsis={100}
      width={750}
      title={i18Project('TXT_MODAL_SURVEY_CREATED_SUCCESSFULLY_CREATED_TITLE')}
      onClose={onClose}
      labelSubmit={i18('LB_CLOSE') as string}
      onSubmit={onClose}
    >
      <Box className={classes.body}>
        <Box
          className={classes.description}
          dangerouslySetInnerHTML={{
            __html: i18Project(
              'TXT_MODAL_SURVEY_CREATED_SUCCESSFULLY_CREATED_DESCRIPTION'
            ),
          }}
        />
        <Box className={classes.formGroup}>
          <InputTextLabel
            readonly
            label={i18Project('TXT_SURVEY_URL')}
            value={surveyURL}
          />
          <CommonButton variant="outlined" onClick={onCopy}>
            {copying ? i18('LB_COPIED') : i18('LB_COPY')}
          </CommonButton>
        </Box>
      </Box>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  body: {},
  formGroup: {
    display: 'flex',
    gap: theme.spacing(3),
    alignItems: 'flex-end',
    marginTop: theme.spacing(3),
  },
  description: {
    fontWeight: 700,
    fontSize: 14,
    '& .successfully': {
      color: theme.color.green.primary,
    },
  },
}))

export default ModalSurveySuccessfullyCreated

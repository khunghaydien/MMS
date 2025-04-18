import StatusItem from '@/components/common/StatusItem'
import { NS_PROJECT } from '@/const/lang.const'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import { SurveyInformationPreview } from './project-base/ModalResultProjectBase'

interface SurveyInformationProps {
  surveyInfo: SurveyInformationPreview
}

const SurveyInformation = ({ surveyInfo }: SurveyInformationProps) => {
  const classes = useStyles()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  return (
    <Box className={classes.RootSurveyInformation}>
      <Box className={classes.listFields}>
        <Box>
          <Box className={classes.label}>{i18Project('TXT_SURVEY_NAME')}</Box>
          <Box className={classes.value} title={surveyInfo.surveyName}>
            {surveyInfo.surveyName}
          </Box>
        </Box>
        <Box>
          <Box className={classes.label}>
            {i18Project('TXT_MOR_REPRESENTATIVE')}
          </Box>
          <Box className={classes.value} title={surveyInfo.morRepresentative}>
            {surveyInfo.morRepresentative}
          </Box>
        </Box>
        <Box>
          <Box className={classes.label}>
            {i18Project('TXT_CUSTOMER_REPRESENTATIVE')}
          </Box>
          <Box
            className={classes.value}
            title={surveyInfo.customersRepresentative}
          >
            {surveyInfo.customersRepresentative}
          </Box>
        </Box>
        <Box>
          <Box className={classes.label}>{i18Project('TXT_SURVEY_POINTS')}</Box>
          <Box className={classes.value}>
            <StatusItem
              className={classes.point}
              typeStatus={{
                color: 'green',
                label: surveyInfo.surveyPoints || '--',
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootSurveyInformation: {},
  listFields: {
    display: 'flex',
    gap: theme.spacing(3),
    flexWrap: 'wrap',
  },
  label: {
    fontSize: 14,
    color: theme.color.black.secondary,
  },
  value: {
    fontSize: 14,
    marginTop: theme.spacing(0.5),
    fontWeight: 700,
    wordBreak: 'break-all',
  },
  point: {
    minWidth: '70px',
  },
}))

export default SurveyInformation

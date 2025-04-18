import ButtonAddPlus from '@/components/buttons/ButtonAddPlus'
import CardFormEdit from '@/components/Form/CardFormEdit'
import FormLayout from '@/components/Form/FormLayout'
import InputDropdown from '@/components/inputs/InputDropdown'
import { LangConstant } from '@/const'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import FormOTDateItem from './FormOTDateItem'
import { OTReportProject } from './ModalCreateOTRequest'

interface FormProjectOTReportItemProps {
  projectReport: OTReportProject
  index: number
  useDelete: boolean
  errors: any
  touched: any
  onAddReportOTForMoreDays: (index: number) => void
  onDeleteReportOTForProject: (index: number) => void
  onDeleteOTForMoreDays: (payload: {
    projectReportIndex: number
    otDateIndex: number
  }) => void
  onOTDatesChange: (payload: {
    value: any
    field: string
    otDateIndex: number
    projectReportIndex: number
  }) => void
  onOTProjectIdChange: (payload: {
    value: string
    projectReportIndex: number
  }) => void
  listProject: any[]
  disabledProject: boolean
  onResetDates: (projectReportIndex: number) => void
}

const FormProjectOTReportItem = ({
  projectReport,
  index,
  onAddReportOTForMoreDays,
  useDelete,
  onDeleteReportOTForProject,
  onDeleteOTForMoreDays,
  onOTDatesChange,
  onOTProjectIdChange,
  errors,
  touched,
  listProject,
  disabledProject = false,
  onResetDates,
}: FormProjectOTReportItemProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)
  const addReportOTForMoreDays = () => {
    onAddReportOTForMoreDays(index)
  }

  const deleteReportOTForProject = () => {
    onDeleteReportOTForProject(index)
  }

  const deleteOTForMoreDays = (otDateIndex: number) => {
    onDeleteOTForMoreDays({
      projectReportIndex: index,
      otDateIndex,
    })
  }

  const otDatesChange = (payload: {
    value: any
    field: string
    otDateIndex: number
  }) => {
    onOTDatesChange({
      ...payload,
      projectReportIndex: index,
    })
  }
  const otProjectIdChange = (projectId: any) => {
    onOTProjectIdChange({
      value: projectId,
      projectReportIndex: index,
    })
    onResetDates(index)
  }
  return (
    <Box className={classes.RootFormProjectOTReportItem}>
      <Box className={classes.title}>
        {i18Project('TXT_REPORT_OT_FOR_PROJECT')}
        &nbsp; #{index + 1}
      </Box>
      {useDelete && (
        <Box className={classes.actions}>
          <CardFormEdit
            hideBorder
            hideButtonCancel
            useDeleteMode
            onOpenDeleteMode={deleteReportOTForProject}
          />
        </Box>
      )}
      <FormLayout top={24}>
        <InputDropdown
          required
          isDisable={disabledProject}
          listOptions={listProject}
          error={!!errors?.projectId && touched?.projectId}
          errorMessage={errors?.projectId}
          label={i18Project('LB_PROJECT')}
          value={projectReport.projectId}
          placeholder={i18Project('LB_SELECT_PROJECT')}
          onChange={otProjectIdChange}
        />
      </FormLayout>
      <Box className={classes.projectOTDateList}>
        {projectReport.otDates.map((otDate, index) => (
          <FormOTDateItem
            projectId={projectReport.projectId}
            key={otDate.id}
            useDelete={projectReport.otDates.length > 1}
            otDate={otDate}
            index={index}
            errors={errors?.otDates?.[index]}
            touched={touched?.otDates?.[index]}
            onDeleteOTForMoreDays={deleteOTForMoreDays}
            onChange={otDatesChange}
          />
        ))}
      </Box>
      <ButtonAddPlus
        label={i18Project('TXT_REPORT_OT_FOR_MORE_DAYS')}
        onClick={addReportOTForMoreDays}
      />
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootFormProjectOTReportItem: {
    border: `1px solid ${theme.color.grey.secondary}`,
    borderRadius: '8px',
    padding: theme.spacing(2),
    position: 'relative',
  },
  title: {
    position: 'absolute',
    fontWeight: 700,
    color: theme.color.blue.primary,
    background: '#fff',
    top: '-10px',
  },
  actions: {
    position: 'absolute',
    right: theme.spacing(2),
  },
  projectOTDateList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}))

export default FormProjectOTReportItem

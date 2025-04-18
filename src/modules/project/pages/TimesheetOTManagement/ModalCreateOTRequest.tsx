import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import ButtonAddPlus from '@/components/buttons/ButtonAddPlus'
import Modal from '@/components/common/Modal'
import { LangConstant } from '@/const'
import { AppDispatch } from '@/store'
import { scrollToFirstErrorMessage, uuid } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
import { cloneDeep } from 'lodash'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { createOTReport, getListProjectReportOT } from '../../reducer/thunk'
import { OTReport } from '../../services/project.service'
import FormProjectOTReportItem from './FormProjectOTReportItem'
import useTimesheetOTManagementValidate from './useTimesheetOTManagementValidate'

interface ModalCreateOTRequestProps {
  onClose: (isReloadList?: boolean) => void
}

export interface OTDate {
  id: string | number
  otDate: Date | null
  from: string
  to: string
  hours: number
  reasonForOt: string
  otRequestId: number
}

export interface OTReportProject {
  id: string | number
  projectId: string | number
  otDates: OTDate[]
}

interface FormValues {
  reportDate: Date | null
  projectReports: OTReportProject[]
}

const initialOTReportProjects: FormValues = {
  reportDate: new Date(),
  projectReports: [
    {
      id: 1,
      projectId: '',
      otDates: [
        {
          id: 1,
          otDate: null,
          from: '',
          to: '',
          reasonForOt: '',
          hours: 0,
          otRequestId: 0,
        },
      ],
    },
  ],
}
const convertValue = (values: OTReportProject[]) => {
  const flattenedArray: {
    projectId: string | number
    otDate: number | undefined
    otFrom: string
    otTo: string
    reason: string
    hours: number
    otRequestId: number
  }[] = []
  values.forEach(projectReport => {
    projectReport.otDates.forEach(otDate => {
      flattenedArray.push({
        projectId: projectReport.projectId,
        otDate: otDate.otDate?.getTime(),
        otFrom: otDate.from,
        otTo: otDate.to,
        reason: otDate.reasonForOt,
        hours: otDate.hours,
        otRequestId: otDate.otRequestId,
      })
    })
  })
  return flattenedArray
}
const ModalCreateOTRequest = ({ onClose }: ModalCreateOTRequestProps) => {
  const randomId = uuid()
  const classes = useStyles()
  const { t: i18DailyReport } = useTranslation(LangConstant.NS_DAILY_REPORT)
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)
  const dispatch = useDispatch<AppDispatch>()
  const { otReportProjectsValidation } = useTimesheetOTManagementValidate()
  const [reportDate, setReportDate] = useState<number | undefined>(undefined)
  const [listProject, setListProject] = useState<any[]>([])
  const [disabledProject, setDisabledProject] = useState<boolean>(false)
  const form = useFormik({
    initialValues: initialOTReportProjects,
    validationSchema: otReportProjectsValidation,
    onSubmit: values => {
      const reportOT = {
        reportDate: values.reportDate?.getTime(),
        reports: convertValue(values.projectReports),
      }
      onSubmit(reportOT)
    },
  })
  const onSubmit = async (reportOT: OTReport) => {
    try {
      await dispatch(createOTReport(reportOT))
      !!onClose && onClose(true)
    } catch {}
  }
  const { errors, touched, values, setFieldValue, setErrors, setTouched } = form
  const changeReportDate = (newReportDate: Date | null) => {
    setFieldValue('reportDate', newReportDate)
    setReportDate(newReportDate?.getTime())
  }
  useEffect(() => {
    const currentListProject: any[] = []
    const fetchData = async () => {
      try {
        setDisabledProject(true)
        const reportListProject = await dispatch(getListProjectReportOT({}))
        setDisabledProject(false)
        reportListProject.payload.data.map((item: any) => {
          currentListProject.push({
            id: item.project.id,
            label: item.project.name,
            value: item.project.id,
            requestId: item.requestId,
            requestStartDate: item.otRequestStartDate,
            requestEndDate: item.otRequestEndDate,
          })
        })
        setListProject(currentListProject)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [reportDate, dispatch])

  const createReportForOtherProjects = () => {
    setFieldValue('projectReports', [
      ...values.projectReports,
      {
        id: randomId,
        projectId: '',
        otDates: [
          {
            id: 1,
            otDate: null,
            from: '',
            to: '',
            reasonForOt: '',
            hours: 0,
            otRequestId: 0,
          },
        ],
      },
    ])
  }

  const onAddReportOTForMoreDays = (index: number) => {
    setFieldValue(`projectReports[${index}].otDates`, [
      ...values.projectReports[index].otDates,
      {
        id: randomId,
        otDate: null,
        from: '',
        to: '',
        reasonForOt: '',
        hours: 0,
        otRequestId: 0,
      },
    ])
  }

  const onDeleteReportOTForProject = (index: number) => {
    const newProjectReports = cloneDeep(values.projectReports)
    newProjectReports.splice(index, 1)
    setFieldValue('projectReports', newProjectReports)
  }

  const onDeleteOTForMoreDays = (payload: {
    projectReportIndex: number
    otDateIndex: number
  }) => {
    const newOtDates = cloneDeep(
      values.projectReports[payload.projectReportIndex].otDates
    )
    newOtDates.splice(payload.otDateIndex, 1)
    setFieldValue(
      `projectReports[${payload.projectReportIndex}].otDates`,
      newOtDates
    )
  }

  const onOTDatesChange = (payload: {
    value: any
    field: string
    otDateIndex: number
    projectReportIndex: number
  }) => {
    setFieldValue(
      `projectReports[${payload.projectReportIndex}].otDates[${payload.otDateIndex}].${payload.field}`,
      payload.value
    )
  }

  const onResetDates = (projectReportIndex: number) => {
    setFieldValue(`projectReports[${projectReportIndex}].otDates`, [
      {
        id: randomId,
        otDate: null,
        from: '',
        to: '',
        reasonForOt: '',
        hours: 0,
        otRequestId: 0,
      },
    ])
  }

  const onOTProjectIdChange = (payload: {
    value: any
    projectReportIndex: number
  }) => {
    setFieldValue(
      `projectReports[${payload.projectReportIndex}].projectId`,
      payload.value
    )
  }
  const handleSubmit = () => {
    form.handleSubmit()
    setTimeout(() => {
      scrollToFirstErrorMessage()
    })
  }

  return (
    <Modal
      open
      width={800}
      title={i18DailyReport('TXT_OT_REPORT')}
      onClose={onClose}
      onSubmit={handleSubmit}
      useButtonCancel
      useButtonDontSave
      cancelOutlined
      onDontSave={onClose}
    >
      <Box className={classes.body}>
        <InputDatepicker
          required
          disabled
          label={i18DailyReport('LB_REPORT_DATE')}
          value={values.reportDate}
          error={!!errors.reportDate && touched.reportDate}
          errorMessage={errors.reportDate}
          onChange={changeReportDate}
        />
        <Box className={classes.projectReports}>
          {values.projectReports.map((projectReport, index) => (
            <FormProjectOTReportItem
              disabledProject={disabledProject}
              listProject={listProject}
              useDelete={values.projectReports.length > 1}
              key={projectReport.id}
              projectReport={projectReport}
              index={index}
              onAddReportOTForMoreDays={onAddReportOTForMoreDays}
              onDeleteReportOTForProject={onDeleteReportOTForProject}
              onDeleteOTForMoreDays={onDeleteOTForMoreDays}
              onOTDatesChange={onOTDatesChange}
              onOTProjectIdChange={onOTProjectIdChange}
              onResetDates={onResetDates}
              errors={errors.projectReports?.[index]}
              touched={touched.projectReports?.[index]}
            />
          ))}
        </Box>
        <ButtonAddPlus
          label={i18Project('LB_CREATE_REPORT_FOR_OTHER_PROJECTS')}
          onClick={createReportForOtherProjects}
        />
      </Box>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  body: {},
  projectReports: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    margin: theme.spacing(3, 0),
  },
}))

export default ModalCreateOTRequest

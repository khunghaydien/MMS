import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import CommonStep from '@/components/step/Stepper'
import { NS_PROJECT } from '@/const/lang.const'
import { PROJECT_LIST } from '@/const/path.const'
import { OptionItem, RangeDate } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { getMonthsBetween } from '@/utils/date'
import useProjectValidation from '../../utils/useProjectValidation'
import { AssignStaffItem } from '../project-detail-v2/project-resource-allocation/ModalAssignNewStaff'
import FormCreateProjectGeneral from './FormCreateProjectGeneral'
import FormCreateProjectResourceAllocation from './FormCreateProjectResourceAllocation'

export interface ProjectGeneralPayload {
  code?: string
  amSale: string
  billableMM: string
  branchId: string
  businessDomain: string
  customerId: string | number
  description: string
  divisionId: string
  driveLink: string
  endDate: number
  generateBitbucket: {
    autoGenerate: boolean
    name: string
  }
  generateGroupMail: {
    autoGenerate: boolean
    name: string
  }
  generateJira: {
    autoGenerate: boolean
    name: string
  }
  gitLink: string
  groupMail: string
  jiraLink: string
  name: string
  partnerIds: string | number
  productType: string
  projectManager: string | number
  projectRank: string
  projectType: string
  referenceLink: string
  slackLink: string
  startDate: number
  status: string | number
  subCustomer: string | number
  subProjectManagers: string | number
  technologyIds: string[] | number[]
}

export interface ProjectBillableManMonth {
  month: string
  billableEffort: number | string
  shareEffort: number | string
  actualEffort?: number | string
  assignEffort?: number | string
}

export interface ProjectGeneralValues {
  amSale: OptionItem
  billableMM: string
  branchId: string
  businessDomain: string
  customer: OptionItem
  description: string
  divisions: OptionItem[]
  driveLink: string
  endDate: Date | null
  generateBitbucket: {
    autoGenerate: boolean
    name: string
  }
  generateGroupMail: {
    autoGenerate: boolean
    name: string
  }
  generateJira: {
    autoGenerate: boolean
    name: string
  }
  gitLink: null
  groupMail: null
  jiraLink: null
  name: string
  partners: OptionItem[]
  productType: string
  projectManager: OptionItem
  projectRank: string
  projectType: string
  referenceLink: string
  slackLink: ''
  startDate: Date | null
  status: string | number
  subCustomer: string
  subProjectManagers: OptionItem[]
  technologies: OptionItem[]
}

const initProjectCreateValues: ProjectGeneralValues = {
  name: '',
  branchId: '',
  subProjectManagers: [],
  projectManager: {},
  divisions: [],
  startDate: null,
  endDate: null,
  projectRank: '',
  billableMM: '',
  projectType: '',
  productType: '',
  customer: {},
  partners: [],
  subCustomer: '',
  status: '',
  amSale: {},
  technologies: [],
  businessDomain: '',
  description: '',
  driveLink: '',
  slackLink: '',
  referenceLink: '',
  generateBitbucket: {
    autoGenerate: false,
    name: '',
  },
  generateGroupMail: {
    autoGenerate: false,
    name: '',
  },
  generateJira: {
    autoGenerate: false,
    name: '',
  },
  groupMail: null,
  gitLink: null,
  jiraLink: null,
}

const initBillableManMonth: ProjectBillableManMonth[] = []

const GENERAL_INFORMATION = 0
const RESOURCE_ALLOCATION = 1

const getHeadcountByField = (
  field: 'billableEffort' | 'shareEffort',
  projectBillableManMonth: ProjectBillableManMonth[]
) => {
  let result: any = []

  projectBillableManMonth.forEach(item => {
    let [month, year] = item.month.split('/')
    const _year = parseInt(year)
    let monthIndex = parseInt(month) - 1
    let yearEntry = result.find(
      (entry: { year: number }) => entry.year === _year
    )
    if (!yearEntry) {
      yearEntry = {
        year: +year,
        headcount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      }
      result.push(yearEntry)
    }
    yearEntry.headcount[monthIndex] =
      item[field] === '' ? 0 : parseInt(item[field].toString())
  })
  return result
}

const getTotalEffortByField = (
  field: 'billableEffort' | 'shareEffort',
  projectBillableManMonth: ProjectBillableManMonth[]
) => {
  let total = 0
  projectBillableManMonth.forEach(item => {
    total += +item[field]
  })
  return total
}

const ProjectCreate = () => {
  const classes = useStyles()
  const navigate = useNavigate()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)
  const { createProjectGeneralValidation } = useProjectValidation()

  const resourceAllocationFormik = useFormik({
    initialValues: {
      billableManMonth: initBillableManMonth,
      divisions: [] as OptionItem[],
      assignStaffs: [] as AssignStaffItem[],
    },
    onSubmit: () => {},
  })

  const generalFormik = useFormik({
    initialValues: initProjectCreateValues,
    validationSchema: createProjectGeneralValidation,
    onSubmit: values => {
      setInitBillableManMonth({
        startDate: values.startDate,
        endDate: values.endDate,
      })
      setActiveStep(RESOURCE_ALLOCATION)
    },
  })

  const [activeStep, setActiveStep] = useState(GENERAL_INFORMATION)

  const stepper = useMemo(() => {
    return [
      {
        step: GENERAL_INFORMATION,
        label: i18('TXT_GENERAL_INFORMATION'),
      },
      {
        step: RESOURCE_ALLOCATION,
        label: i18Project('TXT_RESOURCE_ALLOCATION'),
      },
    ]
  }, [i18Project, i18])

  const requestBody = useMemo(() => {
    const result = {
      projectInformation: {
        ...generalFormik.values,
        amSale: generalFormik.values.amSale?.id || '',
        customerId: generalFormik.values.customer?.id,
        divisionId: generalFormik.values.divisions?.[0]?.id,
        endDate: generalFormik.values.endDate?.getTime(),
        partnerIds: generalFormik.values.partners.length
          ? generalFormik.values.partners.map(item => item.id)
          : null,
        projectManager: generalFormik.values.projectManager?.id || '',
        startDate: generalFormik.values.startDate?.getTime(),
        subProjectManagers: generalFormik.values.subProjectManagers.length
          ? // @ts-ignore
            generalFormik.values.subProjectManagers.map(item => +item.id)
          : null,
        technologyIds: generalFormik.values.technologies.map(item => item.id),
      },
      assignStaff: resourceAllocationFormik.values.assignStaffs.map(
        (item: any) => ({
          endDate: item.assignEndDate?.getTime(),
          headcount: item.assignEffort,
          note: '',
          role: item.role,
          staffId: item.staff?.id,
          startDate: item.assignStartDate?.getTime(),
        })
      ),
      billableEffort: getHeadcountByField(
        'billableEffort',
        resourceAllocationFormik.values.billableManMonth
      ),
      shareEffort: resourceAllocationFormik.values.divisions[0]?.id
        ? [
            {
              divisionId:
                resourceAllocationFormik.values.divisions[0]?.id || '',
              effort: getHeadcountByField(
                'shareEffort',
                resourceAllocationFormik.values.billableManMonth
              ),
            },
          ]
        : [],
      totalContractEffort: getTotalEffortByField(
        'billableEffort',
        resourceAllocationFormik.values.billableManMonth
      ),
      totalShareEffort: getTotalEffortByField(
        'shareEffort',
        resourceAllocationFormik.values.billableManMonth
      ),
    }
    // @ts-ignore
    delete result.projectInformation.customer
    // @ts-ignore
    delete result.projectInformation.divisions
    // @ts-ignore
    delete result.projectInformation.partners
    // @ts-ignore
    delete result.projectInformation.technologies
    return result
  }, [generalFormik.values, resourceAllocationFormik.values])

  const setInitBillableManMonth = (payload: RangeDate) => {
    const months = getMonthsBetween(payload)
    resourceAllocationFormik.setFieldValue(
      'billableManMonth',
      months.map(month => ({
        ...month,
        billableEffort:
          resourceAllocationFormik.values.billableManMonth.find(
            item => item.month === month.month
          )?.billableEffort || '',
        shareEffort:
          resourceAllocationFormik.values.billableManMonth.find(
            item => item.month === month.month
          )?.shareEffort || '',
      }))
    )
  }

  const backToProjectList = () => {
    navigate(PROJECT_LIST)
  }

  return (
    <CommonScreenLayout
      useBackPage
      backLabel={i18Project('LB_BACK_TO_PROJECT_LIST')}
      onBack={backToProjectList}
    >
      <Box className={classes.createProjectContainer}>
        <Box className={classes.stepperContainer}>
          <CommonStep
            className={classes.stepper}
            activeStep={activeStep}
            configSteps={stepper}
          />
        </Box>
        {activeStep === GENERAL_INFORMATION && (
          <FormCreateProjectGeneral generalFormik={generalFormik} />
        )}
        {activeStep === RESOURCE_ALLOCATION && (
          <FormCreateProjectResourceAllocation
            generalDivisionId={generalFormik.values.divisions[0]?.id as string}
            requestBody={requestBody}
            resourceAllocationFormik={resourceAllocationFormik}
            onPrevious={() => setActiveStep(GENERAL_INFORMATION)}
          />
        )}
      </Box>
    </CommonScreenLayout>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  createProjectContainer: {
    paddingBottom: theme.spacing(10),
  },
  stepperContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
  },
  stepper: {
    width: '500px !important',
  },
}))

export default ProjectCreate

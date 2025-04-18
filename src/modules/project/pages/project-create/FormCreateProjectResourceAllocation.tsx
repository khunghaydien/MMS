import CommonButton from '@/components/buttons/CommonButton'
import { PathConstant } from '@/const'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createNewProject } from '../../reducer/thunk'
import { AssignStaffItem } from '../project-detail-v2/project-resource-allocation/ModalAssignNewStaff'
import CreateAssignStaffs from './CreateAssignStaffs'
import CreateBillableManMonth from './CreateBillableManMonth'
import { ProjectBillableManMonth } from './ProjectCreate'

interface FormCreateProjectResourceAllocationProps {
  resourceAllocationFormik: any
  onPrevious: () => void
  requestBody: any
  generalDivisionId: string
}

const FormCreateProjectResourceAllocation = ({
  resourceAllocationFormik,
  onPrevious,
  requestBody,
  generalDivisionId,
}: FormCreateProjectResourceAllocationProps) => {
  const classes = useStyles()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()

  const { values, setFieldValue } = resourceAllocationFormik

  const cellChange = (payload: {
    value: string
    index: number
    field: string
  }) => {
    setFieldValue(
      `billableManMonth[${payload.index}].${payload.field}`,
      payload.value
    )
  }

  const divisionChange = (value: OptionItem[]) => {
    setFieldValue('divisions', value)
    setFieldValue(
      'billableManMonth',
      values.billableManMonth.map(
        (billableManMonthItem: ProjectBillableManMonth) => ({
          ...billableManMonthItem,
          shareEffort: '',
        })
      )
    )
  }

  const onAssignStaffsChange = (newAssignStaffs: AssignStaffItem[]) => {
    setFieldValue('assignStaffs', newAssignStaffs)
  }

  const createProject = () => {
    dispatch(updateLoading(true))
    dispatch(createNewProject(requestBody))
      .unwrap()
      .then(() => {
        navigate(PathConstant.PROJECT_LIST)
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  return (
    <Box className={classes.Root}>
      <CreateBillableManMonth
        generalDivisionId={generalDivisionId}
        divisions={values.divisions}
        dataBillableManMonth={values.billableManMonth}
        onCellChange={cellChange}
        onDivisionChange={divisionChange}
      />
      <CreateAssignStaffs
        dataAssignStaffs={values.assignStaffs}
        onAssignStaffsChange={onAssignStaffsChange}
      />
      <Box className={classes.footerActions}>
        <CommonButton onClick={onPrevious}>{i18('LB_PREVIOUS')}</CommonButton>
        <CommonButton onClick={createProject}>{i18('LB_SUBMIT')}</CommonButton>
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  Root: { display: 'flex', flexDirection: 'column', gap: theme.spacing(3) },
  footerActions: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
  },
}))

export default FormCreateProjectResourceAllocation

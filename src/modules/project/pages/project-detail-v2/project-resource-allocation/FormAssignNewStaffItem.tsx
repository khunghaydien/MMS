import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import FormLayout from '@/components/Form/FormLayout'
import InputCurrency from '@/components/inputs/InputCurrency'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import SelectBranch from '@/components/select/SelectBranch'
import SelectDivisionSingle from '@/components/select/SelectDivisionSingle'
import SelectStaff from '@/components/select/SelectStaff'
import { LangConstant } from '@/const'
import { MODULE_PROJECT_CONST } from '@/const/app.const'
import { projectSelector } from '@/modules/project/reducer/project'
import { ProjectState } from '@/modules/project/types'
import { isMoreThan2023 } from '@/modules/project/utils'
import { EventInput } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { AssignStaffItem } from './ModalAssignNewStaff'

interface FormAssignNewStaffItemProps {
  assignStaff: AssignStaffItem
  index: number
  form: any
}

const FormAssignNewStaffItem = ({
  assignStaff,
  index,
  form,
}: FormAssignNewStaffItemProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)

  const { generalInfo }: ProjectState = useSelector(projectSelector)

  const errors = form.errors?.assignStaffList?.[index] || {}
  const touched = form.touched?.assignStaffList?.[index] || {}

  const staffCodes = form.values.assignStaffList
    ?.map((item: any) => item.staff?.code)
    ?.filter((i: number | undefined) => !!i)

  const minStartDate = useMemo(() => {
    return isMoreThan2023(generalInfo.startDate)
      ? generalInfo.startDate
      : new Date('01/01/2024')
  }, [generalInfo.startDate])

  const maxStartDate = useMemo(() => {
    return assignStaff.assignEndDate || generalInfo.endDate
  }, [generalInfo.endDate, assignStaff.assignEndDate])

  const minEndDate = useMemo(() => {
    return assignStaff.assignStartDate || minStartDate || generalInfo.startDate
  }, [assignStaff.assignStartDate, generalInfo.startDate, minStartDate])

  const maxEndDate = useMemo(() => {
    return generalInfo.endDate
  }, [generalInfo.endDate])

  const onStaffChange = (staff: any) => {
    form.setFieldValue(
      `assignStaffList[${index}].branchId`,
      staff.branch?.id || ''
    )
    form.setFieldValue(
      `assignStaffList[${index}].divisionId`,
      staff.division?.divisionId || ''
    )
    form.setFieldValue(`assignStaffList[${index}].staff`, staff)
  }

  const onDateChange = (date: Date, keyName: string) => {
    form.setFieldValue(`assignStaffList[${index}].${keyName}`, date)
  }

  const onAssignEffortChange = (value: string | number | undefined) => {
    form.setFieldValue(`assignStaffList[${index}].assignEffort`, value)
  }

  const onRoleChange = (e: EventInput) => {
    form.setFieldValue(`assignStaffList[${index}].role`, e.target.value)
  }

  return (
    <Box className={classes.RootFormAssignNewStaffItem}>
      <SelectStaff
        required
        useStaffCode
        isShowEffortUsed
        numberEllipsis={70}
        staffCodesIgnore={staffCodes}
        value={assignStaff.staff}
        label={i18('LB_STAFF')}
        placeholder={i18('PLH_SELECT_STAFF') as string}
        error={!!errors.staff && !!touched.staff}
        errorMessage={errors.staff}
        onChange={onStaffChange}
      />
      <FormLayout gap={24} top={24}>
        <Box width={162}>
          <SelectBranch
            disabled
            required
            value={assignStaff.branchId}
            moduleConstant={MODULE_PROJECT_CONST}
            onChange={() => {}}
          />
        </Box>
        <Box width={168}>
          <SelectDivisionSingle
            isDisable
            required
            moduleConstant={MODULE_PROJECT_CONST}
            label={i18('LB_DIVISION') || ''}
            placeholder={i18('PLH_SELECT_DIVISION') || ''}
            value={assignStaff.divisionId}
            onChange={() => {}}
          />
        </Box>
        <Box width={170}>
          <InputTextLabel
            disabled
            required
            useCounter={false}
            label={i18('LB_STAFF_CODE')}
            placeholder="E.g: MOR_MHN_01"
            value={assignStaff.staff?.code || ''}
          />
        </Box>
        <Box width={250}>
          <InputTextLabel
            disabled
            useCounter={false}
            label={i18('LB_STAFF_MAIL')}
            placeholder={i18('PLH_INPUT_EMAIL')}
            value={assignStaff.staff?.email || ''}
          />
        </Box>
      </FormLayout>
      <FormLayout gap={24} top={24}>
        <Box width={200}>
          <InputTextLabel
            required
            keyName="role"
            useCounter={false}
            label={i18Project('LB_ROLE')}
            value={assignStaff.role}
            placeholder={i18Project('PLH_ROLE')}
            error={!!errors.role && !!touched.role}
            errorMessage={errors.role}
            onChange={onRoleChange}
          />
        </Box>
        <InputDatepicker
          required
          keyName="assignStartDate"
          width={168}
          label={i18Project('LB_ASSIGN_START_DATE')}
          minDate={minStartDate}
          maxDate={maxStartDate}
          value={assignStaff.assignStartDate}
          error={!!errors.assignStartDate && !!touched.assignStartDate}
          errorMessage={errors.assignStartDate}
          onChange={onDateChange}
        />
        <InputDatepicker
          required
          keyName="assignEndDate"
          width={168}
          label={i18Project('LB_ASSIGN_END_DATE')}
          minDate={minEndDate}
          maxDate={maxEndDate}
          value={assignStaff.assignEndDate}
          error={!!errors.assignEndDate && !!touched.assignEndDate}
          errorMessage={errors.assignEndDate}
          onChange={onDateChange}
        />
        <Box width={240}>
          <InputCurrency
            required
            suffix="%"
            keyName="assignEffort"
            label={i18Project('TXT_ASSIGN_EFFORT')}
            placeholder={i18Project('PLH_ASSIGN_EFFORT')}
            error={!!errors.assignEffort && !!touched.assignEffort}
            errorMessage={errors.assignEffort}
            value={assignStaff.assignEffort}
            onChange={onAssignEffortChange}
          />
        </Box>
      </FormLayout>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootFormAssignNewStaffItem: {
    '& .list-options': {
      maxHeight: '235px',
    },
  },
}))

export default FormAssignNewStaffItem

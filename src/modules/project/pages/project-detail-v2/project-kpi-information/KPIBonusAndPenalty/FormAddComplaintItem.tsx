import InputDateFns from '@/components/Datepicker/InputDateFns'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputTextArea from '@/components/inputs/InputTextArea'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import { INPUT_TEXT_MAX_LENGTH } from '@/const/app.const'
import { NS_PROJECT } from '@/const/lang.const'
import {
  COMPLAINT_LEVELS,
  COMPLAINT_LEVELS_LABELS,
  COMPLAINT_POINTS,
} from '@/modules/project/const'
import { projectSelector } from '@/modules/project/reducer/project'
import { EventInput } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { ColTooltip } from '../../project-dashboard-detail/ProjectKPIInformationTable'
import { BonusAndPenaltyQuestionItem } from './ModalBonusAndPenaltyEvaluation'
import SelectPersonInCharge from './SelectPersonInCharge'

interface FormAddComplaintItemProps {
  complaint: BonusAndPenaltyQuestionItem
  onChange: Function
  errors: any
  touched: any
  evaluationMonth?: Date | null
}
const getFirstAndLastDayOfMonth = (
  date?: Date | null
): {
  firstDay: Date | null
  lastDay: Date | null
} => {
  let firstDay: Date | null = null
  let lastDay: Date | null = null
  if (date) {
    firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1)
    lastDay = new Date(nextMonth.getTime() - 1)
  }
  return { firstDay, lastDay }
}
const FormAddComplaintItem = ({
  complaint,
  onChange,
  errors,
  touched,
  evaluationMonth,
}: FormAddComplaintItemProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)
  const { firstDay, lastDay } = getFirstAndLastDayOfMonth(evaluationMonth)
  const { generalInfo } = useSelector(projectSelector)

  const onTextChange = (e: EventInput, keyName?: string) => {
    onChange({
      keyName: keyName || '',
      value: e.target.value,
    })
  }

  const onDateChange = (date: Date | null, keyName?: string) => {
    onChange({
      keyName: keyName || '',
      value: date,
    })
  }

  const onPersonInChargeChange = (staff: any) => {
    onChange({
      keyName: 'picRole',
      value: staff.role || '',
    })
    onChange({
      keyName: 'personInCharge',
      value: staff,
    })
  }

  const onCompaintLevelChange = (value: string) => {
    onChange({
      keyName: 'point',
      value: COMPLAINT_POINTS[value],
    })
    onChange({
      keyName: 'complaintLevel',
      value: value,
    })
  }

  return (
    <Box className={classes.RootFormAddComplaintItem}>
      <Box className={classes.rowFieldItem}>
        <InputTextLabel
          required
          keyName="complaintName"
          label={i18Project('TXT_COMPLAINT_NAME')}
          placeholder={i18Project('PLH_COMPLAINT')}
          value={complaint.complaintName}
          error={!!errors?.complaintName && !!touched?.complaintName}
          errorMessage={errors?.complaintName}
          onChange={onTextChange}
        />
        <InputDateFns
          required
          width={160}
          defaultCalendarMonth={evaluationMonth}
          keyName="complaintDate"
          label={i18Project('TXT_COMPLAINT_DATE')}
          minDate={firstDay || generalInfo.startDate}
          maxDate={lastDay || complaint.resolveDeadline || generalInfo.endDate}
          error={!!errors?.complaintDate && !!touched?.complaintDate}
          errorMessage={errors?.complaintDate}
          value={complaint.complaintDate}
          onChange={onDateChange}
        />
        <InputDateFns
          required
          width={160}
          defaultCalendarMonth={complaint.complaintDate}
          keyName="resolveDeadline"
          label={i18Project('TXT_RESOLVE_DEADLINE')}
          minDate={complaint.complaintDate || generalInfo.startDate}
          maxDate={generalInfo.endDate}
          error={!!errors?.resolveDeadline && !!touched?.resolveDeadline}
          errorMessage={errors?.resolveDeadline}
          value={complaint.resolveDeadline}
          onChange={onDateChange}
        />
      </Box>
      <Box className={classes.rowFieldItem}>
        <SelectPersonInCharge
          required
          width={400}
          value={complaint.personInCharge}
          error={!!errors?.personInCharge && !!touched?.personInCharge}
          errorMessage={errors?.personInCharge}
          onChange={onPersonInChargeChange}
        />
        <InputTextLabel
          keyName="picRole"
          label={i18Project('LB_ROLE')}
          placeholder={i18Project('PLH_ROLE')}
          value={complaint.picRole}
          useCounter={false}
          onChange={onTextChange}
        />
        <InputDateFns
          width={160}
          defaultCalendarMonth={complaint.resolveDeadline}
          keyName="resolveDate"
          label={i18Project('TXT_RESOLVE_DATE')}
          minDate={complaint.complaintDate || generalInfo.startDate}
          maxDate={generalInfo.endDate}
          error={!!errors?.resolveDate && !!touched?.resolveDate}
          errorMessage={errors?.resolveDate}
          value={complaint.resolveDate}
          onChange={onDateChange}
        />
      </Box>
      <Box className={classes.rowFieldItem}>
        <Box className={classes.boxComplaintLevel}>
          <InputDropdown
            required
            label={i18Project('TXT_COMPLAINT_LEVEL')}
            placeholder={i18Project('PLH_COMPLAINT_LEVEL')}
            listOptions={COMPLAINT_LEVELS}
            value={complaint.complaintLevel}
            error={!!errors?.complaintLevel && !!touched?.complaintLevel}
            errorMessage={errors?.complaintLevel}
            onChange={onCompaintLevelChange}
          />
          {!!complaint.complaintLevel && (
            <ColTooltip
              resetBackground
              colName=""
              section={COMPLAINT_LEVELS_LABELS[complaint.complaintLevel]}
            />
          )}
        </Box>
        <InputTextLabel
          required
          keyName="rootCause"
          label={i18Project('TXT_ROOT_CAUSE')}
          placeholder={i18Project('PLH_ROOT_CAUSE')}
          value={complaint.rootCause}
          error={!!errors?.rootCause && !!touched?.rootCause}
          errorMessage={errors?.rootCause}
          onChange={onTextChange}
        />
      </Box>
      <Box className={classes.rowFieldItem}>
        <InputTextArea
          height={80}
          maxLength={INPUT_TEXT_MAX_LENGTH}
          keyName="description"
          label={i18('LB_DESCRIPTION') as string}
          placeholder={i18('PLH_DESCRIPTION')}
          defaultValue={complaint.description}
          onChange={onTextChange}
        />
      </Box>
      <Box className={classes.rowFieldItem}>
        <InputTextArea
          height={80}
          maxLength={INPUT_TEXT_MAX_LENGTH}
          keyName="correctiveAction"
          label={i18Project('TXT_CORRECTIVE_ACTION') as string}
          placeholder={i18Project('PLH_CORRECTIVE_ACTION')}
          defaultValue={complaint.correctiveAction}
          onChange={onTextChange}
        />
        <InputTextArea
          height={80}
          maxLength={INPUT_TEXT_MAX_LENGTH}
          keyName="preventiveAction"
          label={i18Project('TXT_PREVENTIVE_ACTION') as string}
          placeholder={i18Project('PLH_PREVENTIVE_ACTION')}
          defaultValue={complaint.preventiveAction}
          onChange={onTextChange}
        />
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootFormAddComplaintItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  currencyField: {
    gap: '4px',
  },
  shareMonthItem: {
    display: 'flex',
    gap: theme.spacing(3),
  },
  shareMonthList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  deleteShareMonthBox: {
    marginTop: theme.spacing(3),
  },
  rowFieldItem: {
    display: 'flex',
    gap: theme.spacing(3),
  },
  shareMonthFeature: {
    background: theme.color.blue.small,
    padding: theme.spacing(2),
  },
  boxComplaintLevel: {
    minWidth: '235px',
    display: 'flex',
  },
}))

export default FormAddComplaintItem

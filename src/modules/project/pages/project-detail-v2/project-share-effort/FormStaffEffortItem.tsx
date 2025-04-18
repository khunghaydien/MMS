import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import ButtonAddPlus from '@/components/buttons/ButtonAddPlus'
import DeleteIcon from '@/components/icons/DeleteIcon'
import InputCurrency from '@/components/inputs/InputCurrency'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import SelectBranch from '@/components/select/SelectBranch'
import SelectDivisionShareEffort from '@/components/select/SelectDivisionShareEffort'
import SelectStaff from '@/components/select/SelectStaff'
import { LangConstant } from '@/const'
import { MODULE_PROJECT_CONST } from '@/const/app.const'
import { projectSelector } from '@/modules/project/reducer/project'
import { ProjectState } from '@/modules/project/types'
import { isMoreThan2023 } from '@/modules/project/utils'
import { getStaffShareEffort } from '@/reducer/common'
import { uuid } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { StaffEffortItem } from './ModalAddShareEffort'

interface FormStaffEffortItemProps {
  staffEffort: StaffEffortItem
  index: number
  form: any
}

const FormStaffEffortItem = ({
  staffEffort,
  index,
  form,
}: FormStaffEffortItemProps) => {
  const randomId = uuid()
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)

  const { generalInfo, shareEffortList }: ProjectState =
    useSelector(projectSelector)

  const errors = form.errors?.staffEffortList?.[index] || {}
  const touched = form.touched?.staffEffortList?.[index] || {}

  const staffCodesIgnore = useMemo(() => {
    return [
      ...shareEffortList.map(i => i.staffCode),
      ...form.values?.staffEffortList?.map((i: any) => i?.staff?.code),
    ].filter((i: string | undefined) => !!i)
  }, [shareEffortList, form.values?.shareEffortList])

  const staffQueries = useMemo(() => {
    return {
      divisionIds: staffEffort.divisionId,
    }
  }, [staffEffort.divisionId])

  const onDivisionChange = (divisionId: string, option: any) => {
    form.setFieldValue(`staffEffortList[${index}].branchId`, option.branchId)
    form.setFieldValue(`staffEffortList[${index}].staff`, {})
    form.setFieldValue(`staffEffortList[${index}].divisionId`, divisionId)
  }

  const onStaffChange = (staff: any) => {
    if (!staff?.id) {
      form.setFieldValue(`staffEffortList[${index}].branchId`, '')
    } else {
      form.setFieldValue(`staffEffortList[${index}].branchId`, staff.branch.id)
    }
    form.setFieldValue(`staffEffortList[${index}].staff`, staff)
  }

  const onShareMonthChange = (
    shareMonth: Date | null,
    shareMonthIndex: number
  ) => {
    form.setFieldValue(
      `staffEffortList[${index}].shareMonthList[${shareMonthIndex}].shareMonth`,
      shareMonth
    )
  }

  const onShareBMMChange = (
    shareBillableManMonth: string | number | undefined,
    shareMonthIndex: number
  ) => {
    form.setFieldValue(
      `staffEffortList[${index}].shareMonthList[${shareMonthIndex}].shareBillableManMonth`,
      shareBillableManMonth
    )
  }

  const addShareMonth = () => {
    form.setFieldValue(`staffEffortList[${index}].shareMonthList`, [
      ...JSON.parse(
        JSON.stringify(form.values.staffEffortList[index].shareMonthList)
      ),
      {
        id: randomId,
        shareMonth: null,
        shareBillableManMonth: '',
      },
    ])
  }

  const deleteShareMonth = (shareMonthIndex: number) => {
    const newShareMonthList = [
      ...form.values.staffEffortList[index].shareMonthList,
    ]
    newShareMonthList.splice(shareMonthIndex, 1)
    form.setFieldValue(
      `staffEffortList[${index}].shareMonthList`,
      newShareMonthList
    )
  }

  return (
    <Box className={classes.RootFormStaffEffortItem}>
      <Box className={classes.rowFieldItem}>
        <SelectDivisionShareEffort
          required
          error={!!errors.divisionId && !!touched.divisionId}
          errorMessage={errors.divisionId}
          value={staffEffort.divisionId}
          onChange={onDivisionChange}
        />
        {!!staffEffort.divisionId ? (
          <SelectStaff
            required
            isQueries
            callback={getStaffShareEffort}
            isStaffAssignment
            useStaffCode
            numberEllipsis={40}
            staffCodesIgnore={staffCodesIgnore}
            value={staffEffort.staff}
            label={i18('LB_STAFF')}
            placeholder={i18('PLH_SELECT_STAFF') as string}
            error={!!errors.staff && !!touched.staff}
            errorMessage={errors.staff}
            queries={staffQueries}
            onChange={onStaffChange}
          />
        ) : (
          <InputDropdown
            required
            isDisable
            label={i18('LB_STAFF')}
            placeholder={i18('PLH_SELECT_STAFF') as string}
            value=""
            onChange={() => {}}
          />
        )}
      </Box>
      <Box className={classes.rowFieldItem}>
        <SelectBranch
          disabled
          required
          value={staffEffort.branchId}
          moduleConstant={MODULE_PROJECT_CONST}
          onChange={() => {}}
        />
        <InputTextLabel
          disabled
          required
          useCounter={false}
          label={i18('LB_STAFF_CODE')}
          placeholder={i18('PLH_STAFF_CODE')}
          value={staffEffort.staff?.code || ''}
        />
        <InputTextLabel
          disabled
          useCounter={false}
          label={i18('LB_STAFF_MAIL')}
          placeholder={i18('PLH_INPUT_EMAIL')}
          value={staffEffort.staff?.email || ''}
        />
      </Box>
      <Box className={classes.shareMonthFeature}>
        <Box className={classes.shareMonthList}>
          {staffEffort.shareMonthList.map((item, index) => (
            <Box className={classes.shareMonthItem} key={item.id}>
              <InputDatepicker
                required
                width={160}
                openTo="month"
                label={i18Project('LB_SHARE_MONTH')}
                views={['year', 'month']}
                inputFormat={'MM/YYYY'}
                minDate={
                  isMoreThan2023(generalInfo.startDate)
                    ? generalInfo.startDate
                    : new Date('01/01/2024')
                }
                maxDate={generalInfo.endDate}
                error={
                  !!errors?.shareMonthList?.[index]?.shareMonth &&
                  touched?.shareMonthList?.[index]?.shareMonth
                }
                errorMessage={errors?.shareMonthList?.[index]?.shareMonth}
                value={item.shareMonth}
                onChange={(shareMonth: Date | null) =>
                  onShareMonthChange(shareMonth, index)
                }
              />
              <InputCurrency
                required
                className={classes.currencyField}
                label={i18Project('LB_SHARE_BMM')}
                placeholder={i18Project('PLH_SHARE_EFFORT')}
                error={
                  !!errors?.shareMonthList?.[index]?.shareBillableManMonth &&
                  touched?.shareMonthList?.[index]?.shareBillableManMonth
                }
                errorMessage={
                  errors?.shareMonthList?.[index]?.shareBillableManMonth
                }
                value={item.shareBillableManMonth}
                onChange={(value: string | number | undefined) =>
                  onShareBMMChange(value, index)
                }
              />
              <Box className={classes.deleteShareMonthBox}>
                {staffEffort.shareMonthList.length > 1 && (
                  <DeleteIcon onClick={() => deleteShareMonth(index)} />
                )}
              </Box>
            </Box>
          ))}
        </Box>
        <Box>
          <ButtonAddPlus
            label={i18Project('LB_ADD_SHARE_MONTH')}
            onClick={addShareMonth}
          />
        </Box>
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootFormStaffEffortItem: {
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
}))

export default FormStaffEffortItem

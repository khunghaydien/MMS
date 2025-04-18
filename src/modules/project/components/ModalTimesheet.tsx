import FormItem from '@/components/Form/FormItem/FormItem'
import FormLayout from '@/components/Form/FormLayout'
import CommonButton from '@/components/buttons/CommonButton'
import Modal from '@/components/common/Modal'
import InputDropdown from '@/components/inputs/InputDropdown'
import CustomTable from '@/components/table/CustomTable'
import { LangConstant } from '@/const'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { TableHeaderColumn } from '@/types'
import { formatDate, scrollToFirstErrorMessage } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useFormik } from 'formik'
import { isEmpty } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import {
  exportProjectTimeSheet,
  getProjectTime,
  getTimesheet,
} from '../reducer/thunk'
import useProjectValidation from '../utils/useProjectValidation'
interface IProps {
  open: boolean
  onCloseModal: () => void
  projectId: string
}

type Time = {
  id: string
  label: string
  value: string
}

const initialValues = {
  month: null,
  year: null,
}
const ModaleTimesheet = ({ open, onCloseModal, projectId }: IProps) => {
  const { t: i18nProject } = useTranslation(LangConstant.NS_PROJECT)
  const [listMonth, setListMonth] = useState<Time[]>([])
  const [listYear, setListYear] = useState<Time[]>([])
  const [listTimeProject, setListTimeProject] = useState([])
  const [listTimeSheetOT, setListTimeSheetOT] = useState<any>(null)
  const [defaultMonth, setDefaultMonth] = useState(null)
  const [defaultYear, setDefaultYear] = useState(null)
  const { modalRequestOT } = useProjectValidation()
  const [loading, setLoading] = useState(false)
  const [loadingTimeSheet, setLoadingTimeSheet] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>()
  const classes = useStyles()
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: modalRequestOT,
    onSubmit: (values: any, actions) => {
      scrollToFirstErrorMessage()
      !open &&
        actions.resetForm({
          values: initialValues,
        })
      onSubmit(values)
    },
  })

  const refactorStaffActualEffort = (item: any, index: any) => {
    const transformedDateTime = item.dateTime.reduce(
      (acc: any, dateObj: any) => {
        acc[dateObj.workingDate] = dateObj.totalHours
        return acc
      },
      {}
    )
    return {
      ...item,
      no: index === 'total' ? 'Total' : index + 1,
      isTotal: index === 'total',
      ...transformedDateTime,
    }
  }

  const getDaysInMonth = useMemo(() => {
    const year = formik.values.year
    const month = formik.values.month - 1
    const daysArray: TableHeaderColumn[] = []
    if (year && month.toString()) {
      const daysInMonth = new Date(year, month + 1, 0).getDate()
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day)
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' })
        const isWeekend = dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday'
        daysArray.push({
          id: formatDate(date),
          align: 'left',
          label: date.getDate() + ' ' + dayOfWeek.charAt(0),
          type: 'date',
          isWeekend: isWeekend,
        })
      }
    }
    return daysArray
  }, [formik.values.year, formik.values.month])

  const rows = useMemo(() => {
    if (loadingTimeSheet) return []
    if (listTimeSheetOT && !isEmpty(listTimeSheetOT.data.timeSheetOTTotal)) {
      const totalTimeSheetRow = refactorStaffActualEffort(
        listTimeSheetOT.data.timeSheetOTTotal,
        'total'
      )
      const listTimeSheetOTDetail =
        listTimeSheetOT.data.timeSheetOTByStaffsDetail.map(
          (item: any, index: any) => refactorStaffActualEffort(item, index)
        )
      listTimeSheetOTDetail.push(totalTimeSheetRow)
      return listTimeSheetOTDetail
    }
  }, [listTimeSheetOT, loadingTimeSheet])

  const headCells = useMemo(() => {
    let headCell: TableHeaderColumn[] = []
    if (!isEmpty(rows))
      headCell = [
        {
          id: 'no',
          align: 'left',
          label: 'NO.',
          isBlueBackground: true,
        },
        {
          id: 'member',
          align: 'left',
          label: 'Member (Staff Name)',
          isBlueBackground: true,
        },
        {
          id: 'position',
          align: 'left',
          label: 'Level (Position)',
          isBlueBackground: true,
        },
        {
          id: 'effort',
          align: 'left',
          label: 'Assign Effort',
          isBlueBackground: true,
        },
        ...getDaysInMonth,
        {
          id: 'standardWorkingHours',
          align: 'center',
          label: 'Standard working hours',
          isBlueBackground: true,
          maxWidth: '150px',
        },
        {
          id: 'actualWorkingHours',
          align: 'center',
          label: 'Actual working hours',
          isBlueBackground: true,
          maxWidth: '150px',
        },
        {
          id: 'weekdayOTHours',
          align: 'center',
          label: 'Weekday OT hours (Based on OT hours)',
          isBlueBackground: true,
          maxWidth: '150px',
        },
        {
          id: 'weekendOTHours',
          align: 'center',
          label: 'Weekend OT hours (Based on OT hours)',
          isBlueBackground: true,
          maxWidth: '150px',
        },
      ]
    return headCell
  }, [rows])

  const onSubmit = (values: any) => {}

  const handleClose = () => {
    onCloseModal()
  }

  const handleSelect = useCallback((value: any, field: string) => {
    formik.setFieldValue(field, value)
  }, [])

  const handleDownloadTimesheet = async () => {
    const payload: any = {}
    payload.projectId = projectId
    payload.month = formik.values.month
    payload.year = formik.values.year
    dispatch(updateLoading(true))
    await dispatch(exportProjectTimeSheet(payload))
      .unwrap()
      .then(() => {})
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  const handleGetProjectTime = () => {
    setLoading(true)
    dispatch(getProjectTime(projectId))
      .unwrap()
      .then((res: any) => {
        setDefaultYear(res.data.defaultYear)
        setDefaultMonth(res.data.defaultMonth)
        setListTimeProject(res.data.projectTimeResponseForOTS)
      })
      .finally(() => setLoading(false))
  }

  const handleTimesheet = async () => {
    const payload = {
      projectId: projectId,
      param: {
        year: formik.values.year,
        month: formik.values.month,
      },
    }
    setLoadingTimeSheet(true)
    const response = await dispatch(getTimesheet(payload)).unwrap()
    setListTimeSheetOT(response)
    setLoadingTimeSheet(false)
  }

  useEffect(() => {
    handleGetProjectTime()
  }, [])

  useEffect(() => {
    if (formik.values.month && formik.values.year) handleTimesheet()
  }, [formik.values.month, formik.values.year])

  useEffect(() => {
    setListYear(
      listTimeProject?.map((item: any) => ({
        id: item.year,
        label: item.year,
        value: item.year,
      }))
    )
  }, [listTimeProject])

  useEffect(() => {
    if (!isEmpty(listTimeProject)) {
      if (formik.values.year) {
        const listProjectMonth: any = listTimeProject.find(
          (item: any) => item.year === formik.values.year
        )
        if (listProjectMonth) {
          setListMonth(
            listProjectMonth?.month.map((item: any) => ({
              id: item.value,
              label: item.value,
              value: item.value,
            }))
          )
        }
      } else {
        formik.setFieldValue('month', defaultMonth)
        formik.setFieldValue('year', defaultYear)
      }
    } else {
      setListMonth([])
      formik.setFieldValue('month', '')
    }
  }, [formik.values.year, listTimeProject])

  return (
    <Modal
      isMinWidth
      width={'100%'}
      loading={loading}
      open={open}
      title={i18nProject('TXT_PREVIEW_TIMESHEET')}
      fontSizeTitle={22}
      onClose={handleClose}
      onSubmit={formik.handleSubmit}
      hideFooter
    >
      <form onSubmit={formik.handleSubmit} className={classes.mb20}>
        <Box className={clsx(classes.modalHeader, 'scrollbar')}>
          <FormLayout gap={24} className={classes.width30}>
            <FormItem label={i18nProject('LB_SELECT_YEAR')} required>
              <InputDropdown
                width={'100%'}
                listOptions={listYear}
                value={formik.values.year}
                onChange={value => handleSelect(value, 'year')}
                error={formik.touched.year && Boolean(formik.errors.year)}
                errorMessage={formik.errors.year || formik.errors.year}
              />
            </FormItem>
            <FormItem label={i18nProject('LB_SELECT_MONTH')} required>
              <InputDropdown
                width={'100%'}
                isDisable={!formik.values.year}
                listOptions={listMonth}
                value={formik.values.month}
                onChange={value => handleSelect(value, 'month')}
                error={formik.touched.month && Boolean(formik.errors.month)}
                errorMessage={formik.errors.month || formik.errors.month}
              />
            </FormItem>
          </FormLayout>
          <CommonButton
            height={40}
            width={200}
            onClick={handleDownloadTimesheet}
            disabled={!(formik.values.month && formik.values.year)}
          >
            {i18nProject('LB_DOWNLOAD_TIMESHEET')}
          </CommonButton>
        </Box>
      </form>

      {formik.values.year && formik.values.month && (
        <CustomTable
          loading={loadingTimeSheet}
          columns={headCells}
          rows={rows}
        />
      )}
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  modalHeader: {
    display: 'flex',
    alignItems: 'end',
    justifyContent: 'space-between',
  },
  width30: {
    width: '40%',
  },
  mb20: {
    marginBottom: '20px',
  },
}))

export default ModaleTimesheet

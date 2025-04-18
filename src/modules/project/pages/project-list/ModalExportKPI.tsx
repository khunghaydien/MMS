import Modal from '@/components/common/Modal'
import RangeMonthPicker from '@/components/Datepicker/RangeMonthPicker'
import FormItem from '@/components/Form/FormItem/FormItem'
import InputDropdown from '@/components/inputs/InputDropdown'
import { NS_PROJECT } from '@/const/lang.const'
import { updateLoading } from '@/reducer/screen'
import commonService from '@/services/common.service'
import { AppDispatch } from '@/store'
import { IDivision, OptionItem, RangeDate } from '@/types'
import { downloadFileFromByteArr, formatAnyToDate } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import * as Yup from 'yup'
import { ProjectService } from '../../services'

interface ModalExportKPIProps {
  onClose: () => void
}

interface InitialValues extends RangeDate {
  divisionId: string
}

const ModalExportKPI = ({ onClose }: ModalExportKPIProps) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const [divisions, setDivisions] = useState<OptionItem[]>([])

  const form = useFormik({
    initialValues: {
      divisionId: '',
      startDate: null,
      endDate: null,
    } as InitialValues,
    validationSchema: Yup.object({
      divisionId: Yup.string().required(
        i18('MSG_SELECT_REQUIRE', {
          name: i18('LB_DIVISION'),
        }) as string
      ),
      startDate: Yup.date()
        .nullable()
        .required(
          i18('MSG_SELECT_REQUIRE', {
            name: i18('LB_FROM_TO'),
          }) as string
        ),
      endDate: Yup.date()
        .nullable()
        .required(
          i18('MSG_SELECT_REQUIRE', {
            name: i18('LB_FROM_TO'),
          }) as string
        ),
    }),
    onSubmit: () => {
      onExportToExcel()
    },
  })
  const { values, errors, touched, setValues, handleSubmit, setFieldValue } =
    form

  const onRangeMonthPickerChange = (payload: RangeDate) => {
    setValues({
      ...values,
      ...payload,
    })
  }

  const onDivisionChange = (value: string) => {
    setFieldValue('divisionId', value)
  }

  const onExportToExcel = () => {
    dispatch(updateLoading(true))
    ProjectService.exportKPI({
      requestBody: {
        startMonth: formatAnyToDate(values.startDate).getMonth() + 1,
        startYear: formatAnyToDate(values.startDate).getFullYear(),
        endMonth: formatAnyToDate(values.endDate).getMonth() + 1,
        endYear: formatAnyToDate(values.endDate).getFullYear(),
        divisionId: values.divisionId,
      },
    })
      .then((res: AxiosResponse) => {
        downloadFileFromByteArr(res.data)
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  const getDivisions = () => {
    dispatch(updateLoading(true))

    commonService
      .getDivisionsExportKPI()
      .then((res: AxiosResponse) => {
        setDivisions(
          res.data.map((item: IDivision) => ({
            id: item.divisionId,
            value: item.divisionId,
            label: item.name,
          }))
        )
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  useEffect(() => {
    getDivisions()
  }, [])

  return (
    <Modal
      open
      width={467}
      labelSubmit="Export"
      title={i18Project('TXT_EXPORT_KPI')}
      onClose={onClose}
      onSubmit={() => handleSubmit()}
    >
      <Box className={classes.body}>
        <InputDropdown
          required
          width={416}
          label={i18Project('LB_DIVISION') || ''}
          placeholder={i18Project('PLH_SELECT_DIVISION') || ''}
          value={values.divisionId}
          onChange={onDivisionChange}
          error={touched.divisionId && !!errors.divisionId}
          errorMessage={errors.divisionId}
          listOptions={divisions}
        />
        <FormItem
          error={
            (!!errors.startDate && touched.startDate) ||
            (!!errors.endDate && touched.endDate)
          }
          errorMessage={errors.startDate || errors.endDate}
        >
          <RangeMonthPicker
            required
            error={
              (!!errors.startDate && touched.startDate) ||
              (!!errors.endDate && touched.endDate)
            }
            title={{
              to: i18('LB_TO_V2'),
              from: i18('LB_FROM'),
            }}
            startDate={values.startDate}
            endDate={values.endDate}
            onChange={onRangeMonthPickerChange}
          />
        </FormItem>
      </Box>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
}))

export default ModalExportKPI

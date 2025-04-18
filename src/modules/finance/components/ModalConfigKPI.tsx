import Modal from '@/components/common/Modal'
import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import FormLayout from '@/components/Form/FormLayout'
import InputDropdown from '@/components/inputs/InputDropdown'
import { LangConstant } from '@/const'
import {
  MODULE_FINANCE_CONST,
  SUB_MODULE_STAFF_FILTER,
} from '@/const/app.const'
import { commonSelector, CommonState, getDivisions } from '@/reducer/common'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { DivisionType, IDivision } from '@/types'
import { getDateFromDayOfYear } from '@/utils'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'
import clsx from 'clsx'
import { useFormik } from 'formik'
import { isEmpty } from 'lodash'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { listModule } from '../const'
import formikConfig from '../hook/FormikConfigKpi'
import { financeSelector, setConfigKpi } from '../reducer/finance'
import { createNewConfigKpi, getFinanceKpi } from '../reducer/thunk'
import { IConfigBranchExpected, IConfigKpi, IDataFilter } from '../types'
import BranchConfigExpected, { IBranchExpected } from './BranchConfigExpected'

export interface IProps {
  setBranchId: Dispatch<SetStateAction<string>>
  branchId: string
  dataFilter: IDataFilter
  getFinanceDashboard: (payload: IDataFilter) => void
  onCloseModal: () => void
}

const ModalConfigKpi = ({
  setBranchId,
  branchId,
  dataFilter,
  onCloseModal,
  getFinanceDashboard,
}: IProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { configKpi, configurations } = useSelector(financeSelector)
  const { divisions }: CommonState = useSelector(commonSelector)
  const { t: i18 } = useTranslation()
  const { t: i18FinanceLang } = useTranslation(LangConstant.NS_FINANCE)
  const { modalConfigKpiValidation } = formikConfig()
  const classes = useStyles()
  const [dataBranch, setDataBranch] = useState<IBranchExpected>({
    id: '',
    branchId: '',
    division: [],
    expectedKPI: '',
  })

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: configKpi,
    validationSchema: modalConfigKpiValidation,
    onSubmit: (values: IConfigKpi, actions) => {
      if (dataBranch.branchId) {
        dispatch(createNewConfigKpi(values))
          .unwrap()
          .then(() => {
            getFinanceDashboard(dataFilter)
          })
          .finally(() => {
            actions.resetForm({ values })
            callApiFinanceKpi()
          })
      }
    },
  })

  const divisionList = useMemo(
    () =>
      divisions.find((item: DivisionType) => item.branches.id === branchId)
        ?.divisions || [],
    [divisions, branchId]
  )

  const branchExpectedCurrent = useMemo(() => {
    return (
      configurations?.find(
        (item: IConfigBranchExpected) => item.branchId == branchId
      ) || {
        id: null,
        branchId: branchId || null,
        division: [],
        expectedKPI: '',
      }
    )
  }, [configurations, branchId])

  useEffect(() => {
    const _divisionList = divisionList?.map((item: IDivision) => {
      const itemFound = branchExpectedCurrent?.division?.find(
        division => division.divisionId == item.divisionId
      )
      if (itemFound) {
        return {
          divisionId: itemFound.divisionId,
          expectedKPI: itemFound.expectedKPI,
          id: itemFound.id,
        }
      } else {
        return {
          divisionId: item.divisionId,
          expectedKPI: '',
        }
      }
    })
    setDataBranch({
      id: branchExpectedCurrent?.id || '',
      branchId: branchExpectedCurrent?.branchId || '',
      division: _divisionList,
      expectedKPI: branchExpectedCurrent?.expectedKPI?.toString() || '',
    })
  }, [branchExpectedCurrent, divisionList])

  const allowedYears = useMemo(() => {
    const currentYear = new Date().getFullYear()
    return [(currentYear - 1).toString(), currentYear.toString()]
  }, [])

  const handleChangeConfig = (value: IConfigBranchExpected) => {
    formik.setFieldValue('configuration', [value])
  }

  const handleChangeBranch = (value: string) => {
    setBranchId(isEmpty(value) ? '-1' : value)
  }

  const handleClose = () => {
    onCloseModal()
  }
  const callApiFinanceKpi = () => {
    dispatch(
      getFinanceKpi({
        module: formik.values?.moduleId,
        year: formik.values?.year,
      })
    )
      .unwrap()
      .then((res: any) => {
        dispatch(updateLoading(false))
        if (
          !Boolean(formik.values?.moduleId) ||
          !Boolean(formik.values?.year)
        ) {
          setBranchId('')
        }
      })
      .finally(() => {
        updateLoading(false)
      })
  }

  useEffect(() => {
    if (formik.values?.moduleId || formik.values?.year) {
      dispatch(updateLoading(true))
    }
    callApiFinanceKpi()
  }, [formik.values?.moduleId, formik.values?.year])

  useEffect(() => {
    if (!branchId && configurations && configurations.length > 0) {
      dispatch(
        setConfigKpi({
          moduleId: formik.values.moduleId,
          year: formik.values.year,
          configuration: configurations,
        })
      )
      setBranchId(configurations[0]?.branchId || '')
    }
  }, [configurations, branchId])

  useEffect(() => {
    dispatch(
      getDivisions({
        moduleConstant: MODULE_FINANCE_CONST,
        subModuleConstant: SUB_MODULE_STAFF_FILTER,
      })
    )
  }, [])

  return (
    <Modal
      open
      labelSubmit={i18('LB_UPDATE') || ''}
      title={i18FinanceLang('LB_KPI_CONFIGURATION')}
      onClose={handleClose}
      onSubmit={formik.handleSubmit}
    >
      <form onSubmit={formik.handleSubmit}>
        <Box className={clsx(classes.listFields, 'scrollbar')}>
          <FormLayout gap={24}>
            <InputDropdown
              label={i18FinanceLang('LB_MODULE') || ''}
              listOptions={listModule}
              value={formik.values?.moduleId || ''}
              placeholder={i18FinanceLang('PLH_SELECT_MODULE') || ''}
              required
              error={
                formik.touched.moduleId && Boolean(formik.errors?.moduleId)
              }
              errorMessage={
                formik.errors?.moduleId
                  ? (formik.errors?.moduleId as string)
                  : ''
              }
              onChange={(value: string) => {
                formik.setFieldValue('moduleId', value)
              }}
            />
            <InputDatepicker
              required
              allowedYears={allowedYears}
              label={i18FinanceLang('LB_YEAR')}
              inputFormat={'YYYY'}
              views={['year']}
              openTo={'year'}
              placeholder={i18FinanceLang('PLH_SELECT_YEAR') || ''}
              value={getDateFromDayOfYear(Number(formik.values?.year || ''), 1)}
              error={formik.touched.year && Boolean(formik.errors?.year)}
              errorMessage={
                formik.errors?.year ? (formik.errors?.year as string) : ''
              }
              onChange={(value: Date) => {
                formik.setFieldValue(
                  'year',
                  value ? value?.getFullYear() : value
                )
              }}
            />
          </FormLayout>
          <FormLayout gap={24} top={24}>
            <BranchConfigExpected
              formikError={formik.errors}
              formikTouched={formik.touched}
              formikValues={branchExpectedCurrent}
              setData={setDataBranch}
              data={dataBranch}
              divisionList={divisionList}
              onChange={handleChangeConfig}
              onChangeBranch={handleChangeBranch}
              isDisable={
                !Boolean(formik.values?.moduleId) ||
                !Boolean(formik.values?.year)
              }
            />
          </FormLayout>
        </Box>
      </form>
    </Modal>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  listFields: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    maxHeight: '600px',
    overflowX: 'hidden',
  },
  modalBody: {
    padding: theme.spacing(0, 3),
  },
  buttonCancel: {
    padding: theme.spacing(1, 2),
    cursor: 'pointer',
    color: `${theme.color.black.secondary} !important`,
  },
  btnSubmit: {
    width: 'max-content !important',
  },
}))
export default ModalConfigKpi

import CardAvatar from '@/components/common/CardAvatar'
import Modal from '@/components/common/Modal'
import ConditionalRender from '@/components/ConditionalRender'
import CommonTable from '@/components/table/CommonTable'
import { LangConstant } from '@/const'
import { EVALUATION_CYCLE_STATUS } from '@/modules/mbo/const'
import {
  initUpdateAppraisees,
  updateAppraiseesValidation,
} from '@/modules/mbo/formik/cycleFormik'
import {
  CycleState,
  cycleSelector,
  getCycleDetail,
  updateEvaluationCycle,
} from '@/modules/mbo/reducer/cycle'
import { alertSuccess, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import {
  BackEndGlobalResponse,
  IEmployee,
  OptionItem,
  TableHeaderColumn,
} from '@/types'
import { BorderColor } from '@mui/icons-material'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
import i18next from 'i18next'
import _ from 'lodash'
import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import CycleSelectAppraisees from '../CycleSelectAppraisees'

const headCellAppraisees: TableHeaderColumn[] = [
  {
    id: 'code',
    align: 'left',
    label: i18next.t('common:LB_STAFF_CODE'),
  },
  {
    id: 'name',
    align: 'left',
    label: i18next.t('common:LB_STAFF_NAME'),
  },
  {
    id: 'email',
    align: 'left',
    label: i18next.t('common:LB_EMAIL'),
  },
]

const CycleAppraiseesList = () => {
  const classes = useStyles()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)
  const { evaluationCycle, payloadCycle, isDetailFetching }: CycleState =
    useSelector(cycleSelector)

  const [listAppraisees, setListAppraisees] = useState<IEmployee[]>([])
  const [toggleAddAppraiseeModal, setToggleAddAppraiseeModal] = useState(false)

  const isEditMode =
    !isDetailFetching &&
    (evaluationCycle.status.id === EVALUATION_CYCLE_STATUS.NOT_START ||
      evaluationCycle.status.id === EVALUATION_CYCLE_STATUS.UP_COMING)

  const formik = useFormik({
    initialValues: initUpdateAppraisees,
    validationSchema: updateAppraiseesValidation,
    onSubmit: () => {
      handleUpdateCycleAppraiseesList()
    },
  })

  const handleToggleAddModal = () => {
    setToggleAddAppraiseeModal(current => !current)
  }

  const handleAddNewAppraisee = () => {
    formik.handleSubmit()
  }

  const handleUpdateCycleAppraiseesList = () => {
    dispatch(updateLoading(true))
    dispatch(
      updateEvaluationCycle({
        cycleId: params.cycleId || '',
        requestBody: {
          appraisees: formik.values.appraisees,
        },
      })
    )
      .unwrap()
      .then((res: BackEndGlobalResponse) => {
        dispatch(
          alertSuccess({
            message: i18('MSG_UPDATE_SUCCESS', {
              labelName: `${i18Mbo('LB_APPRAISEE')}`,
            }),
          })
        )
        dispatch(getCycleDetail(params.cycleId || ''))
      })
      .finally(() => {
        dispatch(updateLoading(false))
        handleToggleAddModal()
      })
  }

  const isTouched = useMemo(() => {
    const _appraisees = listAppraisees.map((item: OptionItem) => item.id)
    const _formikValue = formik.values.appraisees
    return !_.isEqual(_appraisees, _formikValue)
  }, [listAppraisees, formik.values])

  useLayoutEffect(() => {
    const createTableRecord = () => {
      if (evaluationCycle) {
        const _appraisees = evaluationCycle.appraisees?.map(
          (item: OptionItem, index: number) => {
            return {
              no: index + 1,
              id: item.id || '',
              code: item.code || '',
              name: item.label || '',
              employeeId: item.code || '',
              email: item.email || '',
              position: item.positionName || '',
            }
          }
        )
        setListAppraisees(_appraisees)
      }
    }

    createTableRecord()
  }, [evaluationCycle])

  useEffect(() => {
    const setFormikValue = () => {
      formik.setValues({
        ...formik.values,
        appraisees: payloadCycle.appraisees,
      })
    }

    setFormikValue()
  }, [payloadCycle.appraisees])

  return (
    <Box className={classes.rootCycleAppraiseesList}>
      <Box className={classes.content}>
        <ConditionalRender
          conditional={evaluationCycle.isTemplate && !isDetailFetching}
        >
          <Box className={classes.appliedAll}>
            {i18Mbo('TXT_APPLIED_FOR_ALL_EMPLOYEE')}
          </Box>
        </ConditionalRender>
        {!evaluationCycle.isTemplate && (
          <Box className={classes.listApplied}>
            <Box className={classes.typeView}>
              <Box className={classes.flex}></Box>
              {isEditMode && (
                <Box
                  className={classes.buttonWrapper}
                  onClick={handleToggleAddModal}
                >
                  <BorderColor />
                  <Box>{i18('LB_EDIT')}</Box>
                </Box>
              )}
            </Box>
            <Box className={classes.viewTable}>
              <CommonTable
                loading={isDetailFetching}
                columns={headCellAppraisees}
                rows={listAppraisees.map(item => ({
                  ...item,
                  name: (
                    <CardAvatar
                      info={{
                        name: item.name,
                        position: item.position,
                      }}
                    />
                  ),
                }))}
              />
            </Box>
          </Box>
        )}
      </Box>
      <Modal
        width={'100%'}
        open={toggleAddAppraiseeModal}
        onClose={handleToggleAddModal}
        onSubmit={handleAddNewAppraisee}
        title={i18Mbo('LB_EDIT_APPRAISEES_LIST')}
        submitDisabled={!isTouched}
        labelSubmit={i18('LB_UPDATE') || ''}
      >
        <Box className={classes.modalContainer}>
          <CycleSelectAppraisees
            cycleCycleAppraiseesList={listAppraisees}
            formikErrors={formik.errors}
            formikTouched={formik.touched}
          />
        </Box>
      </Modal>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootCycleAppraiseesList: {
    position: 'relative',
    minHeight: '300px',
  },
  content: {},
  buttonWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    border: `1px solid ${theme.color.grey.primary}`,
    borderRadius: '50px',
    background: '#FFFFFF',
    cursor: 'pointer',
    color: theme.color.black.secondary,
    transition: 'all .1s',
    '&.disabled': {
      pointerEvents: 'none',
    },
    '& svg': {
      fontSize: 20,
    },
    '&:hover': {
      backgroundColor: theme.color.blue.primary,
      borderColor: theme.color.blue.primary,
      color: '#FFFFFF !important',
      '& *': {
        color: '#FFFFFF !important',
      },
    },
  },
  modalContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  ButtonContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },
  appliedAll: {
    fontStyle: 'italic',
    fontWeight: '700',
  },
  listApplied: {},
  typeView: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',

    margin: theme.spacing(1, 0),
    '& .typeViewIcon': {
      cursor: 'pointer',
      color: theme.color.black.secondary,
    },
    '& .active': {
      color: theme.color.blue.primary,
    },
  },
  viewGrid: {
    display: 'flex',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
    borderRadius: '4px',
    border: `1px solid ${theme.color.grey.secondary}`,
    padding: theme.spacing(2),
    '&.loading': {
      height: 300,
    },
  },
  viewTable: {},
  flex: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  flexSpaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  btnAddAppraise: {
    margin: theme.spacing(1, 0),
    display: 'flex',
    justifyContent: 'end',
  },
  wrapLoading: {
    display: 'flex',
  },
}))
export default CycleAppraiseesList

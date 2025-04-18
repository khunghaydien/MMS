import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import CardFormEdit from '@/components/Form/CardFormEdit'
import FormLayout from '@/components/Form/FormLayout'
import ToggleSectionIcon from '@/components/icons/ToggleSectionIcon'
import InputCurrency from '@/components/inputs/InputCurrency'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import { LangConstant } from '@/const'
import { projectSelector } from '@/modules/project/reducer/project'
import { ProjectService } from '@/modules/project/services'
import { ProjectState } from '@/modules/project/types'
import { isLessThan2023, isMoreThan2023 } from '@/modules/project/utils'
import { alertError, alertSuccess, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { EventInput } from '@/types'
import { formatDate } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import StringFormat from 'string-format'
import { Assignment } from './ModalStaffAssignDetails'
import { useAssignStaffValidation } from './useAssignStaffValidation'

interface FormAssignmentItemProps {
  hideHeaderActions?: boolean
  assignment: Assignment
  listAssignment: Assignment[]
  staffAssignment: any
  index: number
  staffId: number
  getStaffAssignmentDetails: Function
  onDeleteAssignmentModeAdd: (index: number) => void
  reGetListAssignHeadcount: Function
  onCloseModal: Function
}

const initAssignment: Assignment = {
  id: '',
  role: '',
  endDate: null,
  startDate: null,
  headcount: '',
  mode: 'add',
  note: '',
}

const FormAssignmentItem = ({
  hideHeaderActions,
  assignment,
  staffAssignment,
  getStaffAssignmentDetails,
  listAssignment,
  onDeleteAssignmentModeAdd,
  index,
  staffId,
  reGetListAssignHeadcount,
  onCloseModal,
}: FormAssignmentItemProps) => {
  const classes = useStyles()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)
  const { t: i18Contract } = useTranslation(LangConstant.NS_CONTRACT)
  const { assignmentValidation } = useAssignStaffValidation()

  const { generalInfo, permissionResourceAllocation }: ProjectState =
    useSelector(projectSelector)

  const [showBody, setShowBody] = useState(assignment.mode === 'add')
  const [modeView, setModeView] = useState(true)
  const [dataView, setDataView] = useState<Assignment>(initAssignment)
  const [openModalDelete, setOpenModalDelete] = useState(false)
  const form = useFormik({
    initialValues: initAssignment,
    validationSchema: assignmentValidation,
    onSubmit: values => {
      if (values.mode === 'add') {
        addNewAssignment()
      } else {
        updateAssignment()
      }
    },
  })
  const { values, errors, touched } = form

  const useCardFormEdit = useMemo(() => {
    return assignment.mode === 'edit'
      ? isMoreThan2023(assignment.startDate) ||
          isMoreThan2023(assignment.endDate)
      : true
  }, [assignment])

  const buttonUseDetailEditDisabled = useMemo(() => {
    if (assignment.mode === 'add') {
      return false
    }
    return JSON.stringify(dataView) === JSON.stringify(form.values)
  }, [dataView, form.values, assignment.mode])

  const useButtonDelete = useMemo(() => {
    return (
      (modeView || assignment.mode === 'add') &&
      (assignment.mode === 'edit'
        ? isMoreThan2023(assignment.startDate) &&
          isMoreThan2023(assignment.endDate)
        : true)
    )
  }, [modeView, assignment, listAssignment])

  const minStartDate = useMemo(() => {
    return isMoreThan2023(generalInfo.startDate)
      ? generalInfo.startDate
      : new Date('01/01/2024')
  }, [generalInfo.startDate])

  const maxStartDate = useMemo(() => {
    return values.endDate || generalInfo.endDate
  }, [generalInfo.endDate, values.endDate])

  const minEndDate = useMemo(() => {
    return values.startDate || minStartDate || generalInfo.startDate
  }, [values.startDate, generalInfo.startDate, minStartDate])

  const maxEndDate = useMemo(() => {
    return generalInfo.endDate
  }, [generalInfo.endDate])

  const cancelEditMode = () => {
    setShowBody(true)
    if (assignment.mode === 'edit') {
      setModeView(true)
    }
  }

  const openEditMode = () => {
    setModeView(false)
    setShowBody(true)
  }

  const changeRole = (e: EventInput) => {
    form.setFieldValue('role', e.target.value)
  }

  const changeAssignDate = (value: Date, field: string) => {
    form.setFieldValue(field, value || null)
  }

  const changeAssignEffort = (value?: string) => {
    form.setFieldValue('headcount', value)
  }

  const handleSubmit = () => {
    form.handleSubmit()
  }

  const addNewAssignment = () => {
    const payload = {
      projectId: params.projectId as string,
      requestBody: [
        {
          assignment: [
            {
              role: values.role,
              startDate: values.startDate?.getTime() as number,
              endDate: values.endDate?.getTime() as number,
              headcount: +values.headcount,
              note: '',
            },
          ],
          staffId: staffId,
        },
      ],
    }
    dispatch(updateLoading(true))
    ProjectService.assignNewStaff(payload)
      .then(() => {
        dispatch(
          alertSuccess({
            message: i18Project('MSG_CREATE_PROJECT_STAFF_ASSIGNMENT_SUCCESS'),
          })
        )
        setModeView(true)
        getStaffAssignmentDetails()
        reGetListAssignHeadcount()
      })
      .catch((err: { message: string }[]) => {
        dispatch(
          alertError({
            message: err?.[0]?.message,
          })
        )
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  const updateAssignment = () => {
    const payload = {
      projectId: params.projectId as string,
      projectStaffId: staffAssignment.projectStaffId,
      projectStaffHeadcountId: values.id,
      requestBody: {
        role: values.role,
        startDate: values.startDate?.getTime() as number,
        endDate: values.endDate?.getTime() as number,
        headcount: +values.headcount,
        note: '',
      },
    }
    dispatch(updateLoading(true))
    ProjectService.updateAssignment(payload as any)
      .then(() => {
        getStaffAssignmentDetails()
        reGetListAssignHeadcount()
        dispatch(
          alertSuccess({
            message: i18('MSG_UPDATE_SUCCESS', {
              labelName: i18Project('LB_ASSIGNMENT'),
            }),
          })
        )
      })
      .catch((err: { message: string }[]) => {
        dispatch(
          alertError({
            message: err?.[0]?.message,
          })
        )
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }
  const handleDeleteAssignmentHeadcount = () => {
    dispatch(updateLoading(true))
    ProjectService.deleteAssignmentHeadcount({
      projectId: params.projectId as string,
      projectStaffId: staffAssignment.projectStaffId,
      projectStaffHeadcountId: values.id as number,
    })
      .then(() => {
        if (
          listAssignment.filter(item => typeof item.id === 'number').length ===
          1
        ) {
          onCloseModal()
        }
        getStaffAssignmentDetails()
        reGetListAssignHeadcount()
        dispatch(
          alertSuccess({
            message: i18('MSG_DELETE_SUCCESS', {
              labelName: i18Project('LB_ASSIGNMENT'),
            }),
          })
        )
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }
  const deleteAssignment = () => {
    if (assignment.mode === 'add') {
      onDeleteAssignmentModeAdd(index)
    } else {
      setOpenModalDelete(true)
    }
  }

  useEffect(() => {
    setDataView(assignment)
    setModeView(assignment.mode === 'edit')
    if (assignment.mode === 'edit') {
      form.setValues(assignment)
    }
  }, [assignment])

  return (
    <Box className={classes.RootFormAssignmentItem}>
      <Box className={classes.header}>
        <Box className={classes.headerTitleName}>
          {assignment.mode === 'edit' && (
            <ToggleSectionIcon
              open={showBody}
              onToggle={() => setShowBody(!showBody)}
            />
          )}
          <Box className={classes.name}>
            Assignment&nbsp;
            {!!dataView.startDate && (
              <Box component="span">{`(${formatDate(
                dataView.startDate as Date
              )} - ${formatDate(dataView.endDate as Date)})`}</Box>
            )}
          </Box>
        </Box>
        {!hideHeaderActions &&
          useCardFormEdit &&
          !!permissionResourceAllocation.updateStaffAssignment && (
            <Box className={classes.headerActions}>
              <CardFormEdit
                hideBorder
                hideIcons
                hideButtonCancel={assignment.mode === 'add'}
                buttonUseDetailEditDisabled={buttonUseDetailEditDisabled}
                useDetailEditMode={!modeView}
                useDetailViewMode={modeView}
                useDeleteMode={useButtonDelete}
                onOpenEditMode={openEditMode}
                onCancelEditMode={cancelEditMode}
                onSaveAs={handleSubmit}
                onOpenDeleteMode={deleteAssignment}
              />
            </Box>
          )}
      </Box>
      {showBody && (
        <Box className={classes.body}>
          {modeView && (
            <Box className={classes.listFields}>
              <Box className={classes.option}>
                <Box className={classes.label}>{i18Project('LB_ROLE')}</Box>
                <Box className={classes.value}>{dataView.role}</Box>
              </Box>
              <Box className={classes.option}>
                <Box className={classes.label}>
                  {i18Project('LB_ASSIGN_START_DATE')}
                </Box>
                <Box className={classes.value}>
                  {formatDate(dataView.startDate as Date)}
                </Box>
              </Box>
              <Box className={classes.option}>
                <Box className={classes.label}>
                  {i18Project('LB_ASSIGN_END_DATE')}
                </Box>
                <Box className={classes.value}>
                  {formatDate(dataView.endDate as Date)}
                </Box>
              </Box>
              <Box className={classes.option}>
                <Box className={classes.label}>
                  {i18Project('TXT_ASSIGN_EFFORT')} (%)
                </Box>
                <Box className={classes.value}>{dataView.headcount}%</Box>
              </Box>
            </Box>
          )}
          {!modeView && (
            <Box className={classes.listFieldsViewEdit}>
              <FormLayout gap={24}>
                <Box width={200}>
                  <InputTextLabel
                    required
                    useCounter={false}
                    label={i18Project('LB_ROLE')}
                    placeholder={i18Project('PLH_ROLE')}
                    error={!!errors.role && !!touched.role}
                    errorMessage={errors.role}
                    value={values.role}
                    onChange={changeRole}
                  />
                </Box>
                <InputDatepicker
                  required
                  width={160}
                  disabled={isLessThan2023(dataView.startDate)}
                  keyName="startDate"
                  label={i18Project('LB_ASSIGN_START_DATE')}
                  minDate={minStartDate}
                  maxDate={maxStartDate}
                  error={!!errors.startDate && !!touched.startDate}
                  errorMessage={errors.startDate}
                  value={values.startDate}
                  onChange={changeAssignDate}
                />
                <InputDatepicker
                  required
                  width={160}
                  disabled={isLessThan2023(dataView.endDate)}
                  keyName="endDate"
                  label={i18Project('LB_ASSIGN_END_DATE')}
                  minDate={minEndDate}
                  maxDate={maxEndDate}
                  error={!!errors.endDate && !!touched.endDate}
                  errorMessage={errors.endDate}
                  value={values.endDate}
                  onChange={changeAssignDate}
                />
                <Box width={240}>
                  <InputCurrency
                    required
                    suffix="%"
                    disabled={isLessThan2023(dataView.startDate)}
                    className={classes.currencyField}
                    label={i18Project('TXT_ASSIGN_EFFORT')}
                    placeholder={i18Project('PLH_ASSIGN_EFFORT')}
                    error={!!errors.headcount && !!touched.headcount}
                    errorMessage={errors.headcount}
                    value={values.headcount}
                    onChange={changeAssignEffort}
                  />
                </Box>
              </FormLayout>
            </Box>
          )}
        </Box>
      )}
      {openModalDelete && (
        <ModalDeleteRecords
          open
          titleMessage={i18Contract('TXT_DELETE_STAFF')}
          subMessage={StringFormat(
            i18Contract('MSG_CONFIRM_STAFF_ASSIGNMENT_DELETE'),
            staffAssignment.staffName
          )}
          onClose={() => setOpenModalDelete(false)}
          onSubmit={handleDeleteAssignmentHeadcount}
        />
      )}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootFormAssignmentItem: {
    border: `1px solid ${theme.color.grey.secondary}`,
    borderRadius: '8px',
  },
  currencyField: {
    gap: '4px',
  },
  header: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
  },
  headerActions: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  body: {
    borderTop: `1px solid ${theme.color.grey.secondary}`,
    padding: theme.spacing(2),
  },
  headerTitleName: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  name: {
    color: theme.color.blue.primary,
    fontWeight: 500,
  },
  listFields: {
    display: 'flex',
    gap: theme.spacing(2.5, 1),
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  option: {
    width: 'max-content',
  },
  label: {
    fontSize: 14,
    color: theme.color.black.secondary,
  },
  value: {
    fontSize: 14,
    marginTop: theme.spacing(0.5),
    fontWeight: 700,
  },
  listFieldsViewEdit: {},
}))

export default FormAssignmentItem

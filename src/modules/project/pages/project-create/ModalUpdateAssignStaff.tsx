import CardFormEdit from '@/components/Form/CardFormEdit'
import FormLayout from '@/components/Form/FormLayout'
import Modal from '@/components/common/Modal'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import { NS_CONTRACT, NS_PROJECT } from '@/const/lang.const'
import { formatDate } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
import { Fragment, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import StringFormat from 'string-format'
import FormAssignNewStaffItem from '../project-detail-v2/project-resource-allocation/FormAssignNewStaffItem'
import { AssignStaffItem } from '../project-detail-v2/project-resource-allocation/ModalAssignNewStaff'
import { useAssignStaffValidation } from '../project-detail-v2/project-resource-allocation/useAssignStaffValidation'

const ViewDetail = ({ assignStaff }: { assignStaff: any }) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  return (
    <Box className={classes.RootViewDetail}>
      <Box className={classes.listFields}>
        <FormLayout gap={24}>
          <Box className={classes.option}>
            <Box className={classes.label}>{i18('LB_STAFF_CODE')}</Box>
            <Box className={classes.value}>{assignStaff.staff?.code}</Box>
          </Box>
          <Box className={classes.option}>
            <Box className={classes.label}>{i18('LB_STAFF_NAME')}</Box>
            <Box className={classes.value}>{assignStaff.staff?.name}</Box>
          </Box>
          <Box className={classes.option}>
            <Box className={classes.label}>{i18('LB_EMAIL')}</Box>
            <Box className={classes.value}>{assignStaff.staff?.email}</Box>
          </Box>
        </FormLayout>
        <FormLayout gap={24}>
          <Box className={classes.option}>
            <Box className={classes.label}>{i18('LB_BRANCH')}</Box>
            <Box className={classes.value}>
              {assignStaff.staff?.branch?.name}
            </Box>
          </Box>
          <Box className={classes.option}>
            <Box className={classes.label}>{i18('LB_DIVISION')}</Box>
            <Box className={classes.value}>
              {assignStaff.staff?.division?.name}
            </Box>
          </Box>
          <Box className={classes.option}>
            <Box className={classes.label}>{i18Project('LB_ROLE')}</Box>
            <Box className={classes.value}>{assignStaff.role}</Box>
          </Box>
        </FormLayout>
        <FormLayout gap={24}>
          <Box className={classes.option}>
            <Box className={classes.label}>{i18('LB_START_DATE')}</Box>
            <Box className={classes.value}>
              {formatDate(assignStaff.assignStartDate)}
            </Box>
          </Box>
          <Box className={classes.option}>
            <Box className={classes.label}>{i18('LB_END_DATE')}</Box>
            <Box className={classes.value}>
              {formatDate(assignStaff.assignEndDate)}
            </Box>
          </Box>
          <Box className={classes.option}>
            <Box className={classes.label}>
              {i18Project('TXT_ASSIGN_EFFORT')}
            </Box>
            <Box className={classes.value}>{assignStaff.assignEffort}%</Box>
          </Box>
        </FormLayout>
      </Box>
    </Box>
  )
}

interface ModalUpdateAssignStaffProps {
  onClose: () => void
  staff: any
  onSubmit: (assignStaffItem: AssignStaffItem) => void
  onDelete: (id: string) => void
}

const ModalUpdateAssignStaff = ({
  staff,
  onClose,
  onSubmit,
  onDelete,
}: ModalUpdateAssignStaffProps) => {
  const classes = useStyles()
  const { t: i18Project } = useTranslation(NS_PROJECT)
  const { t: i18Contract } = useTranslation(NS_CONTRACT)

  const { assignNewStaffValidation } = useAssignStaffValidation()

  const form = useFormik({
    initialValues: {
      assignStaffList: [{ ...staff }] as AssignStaffItem[],
    },
    validationSchema: assignNewStaffValidation,
    onSubmit: values => {
      onSubmit(values.assignStaffList[0])
      setUseDetailViewMode(true)
      setStaffView(values.assignStaffList[0])
    },
  })

  const [useDetailViewMode, setUseDetailViewMode] = useState(true)
  const [staffView, setStaffView] = useState(staff)
  const [openModalDelete, setOpenModalDelete] = useState(false)

  const buttonSubmitDisabled = useMemo(() => {
    return (
      JSON.stringify(staff) === JSON.stringify(form.values.assignStaffList[0])
    )
  }, [staff, form.values.assignStaffList])

  const onCancel = () => {
    setUseDetailViewMode(true)
  }

  const closeModalDeleteStaffAssignment = () => {
    setOpenModalDelete(false)
  }

  const deleteStaffAssignment = () => {
    onDelete(staffView.id)
  }

  return (
    <Fragment>
      {openModalDelete && (
        <ModalDeleteRecords
          open
          titleMessage={i18Contract('TXT_DELETE_STAFF')}
          subMessage={StringFormat(
            i18Contract('MSG_CONFIRM_STAFF_ASSIGNMENT_DELETE'),
            staffView.staffName
          )}
          onClose={closeModalDeleteStaffAssignment}
          onSubmit={deleteStaffAssignment}
        />
      )}
      <Modal
        open
        hideFooter
        width={888}
        title={i18Project('TXT_STAFF_ASSIGNMENT_DETAILS')}
        onClose={onClose}
      >
        <Box className={classes.RootForm}>
          <Box className={classes.title}>
            {i18Project('LB_STAFF_ASSIGNMENT')}
          </Box>
          <Box className={classes.actions}>
            <CardFormEdit
              hideBorder
              buttonUseDetailEditDisabled={buttonSubmitDisabled}
              useDeleteMode={useDetailViewMode}
              useDetailEditMode={!useDetailViewMode}
              useDetailViewMode={useDetailViewMode}
              onOpenEditMode={() => setUseDetailViewMode(false)}
              onCancelEditMode={onCancel}
              onOpenDeleteMode={() => setOpenModalDelete(true)}
              onSaveAs={() => form.handleSubmit()}
            />
          </Box>
          {useDetailViewMode && <ViewDetail assignStaff={staffView} />}
          {!useDetailViewMode && (
            <Box className={classes.boxStaff}>
              <FormAssignNewStaffItem
                index={0}
                form={form}
                assignStaff={form.values.assignStaffList[0]}
              />
            </Box>
          )}
        </Box>
      </Modal>
    </Fragment>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  body: {},
  RootForm: {
    border: `1px solid ${theme.color.grey.secondary}`,
    borderRadius: '8px',
    padding: theme.spacing(2),
    position: 'relative',
  },
  title: {
    position: 'absolute',
    fontWeight: 700,
    color: theme.color.blue.primary,
    background: '#fff',
    top: '-10px',
  },
  actions: {
    position: 'absolute',
    right: theme.spacing(2),
  },
  RootViewDetail: {},
  listFields: {
    display: 'flex',
    gap: theme.spacing(2),
    flexDirection: 'column',
  },
  option: {
    width: 'max-content',
    minWidth: '200px',
  },
  label: {
    fontSize: 14,
    color: theme.color.black.secondary,
  },
  value: {
    fontSize: 14,
    marginTop: theme.spacing(0.5),
    fontWeight: 700,
    whiteSpace: 'pre-line',
  },
  boxStaff: {
    paddingTop: theme.spacing(3),
  },
}))

export default ModalUpdateAssignStaff

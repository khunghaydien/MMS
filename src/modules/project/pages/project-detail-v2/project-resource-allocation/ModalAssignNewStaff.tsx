import FormLayout from '@/components/Form/FormLayout'
import ButtonAddPlus from '@/components/buttons/ButtonAddPlus'
import Modal from '@/components/common/Modal'
import DeleteIcon from '@/components/icons/DeleteIcon'
import { LangConstant } from '@/const'
import { ProjectService } from '@/modules/project/services'
import { alertError, alertSuccess, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { IStaffInfo } from '@/types'
import { uuid } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import FormAssignNewStaffItem from './FormAssignNewStaffItem'
import { useAssignStaffValidation } from './useAssignStaffValidation'

interface ModalAssignNewStaffProps {
  onClose: () => void
  reGetListAssignHeadcount?: Function
  onProjectCreateAssignStaffs?: (assignStaffs: AssignStaffItem[]) => void
}

export interface AssignStaffItem {
  id?: string | number
  staff: IStaffInfo
  branchId: string
  divisionId: string
  code: string
  email: string
  role: string
  assignStartDate: Date | null
  assignEndDate: Date | null
  assignEffort: string | number
}

const initAssignStaff = {
  id: 1,
  staff: {},
  branchId: '',
  divisionId: '',
  code: '',
  email: '',
  role: '',
  assignStartDate: null,
  assignEndDate: null,
  assignEffort: '',
}

const initialValues = {
  assignStaffList: [{ ...initAssignStaff }] as AssignStaffItem[],
}

const MAX_ASSIGN_STAFF_LIST = 10

const ModalAssignNewStaff = ({
  onClose,
  reGetListAssignHeadcount,
  onProjectCreateAssignStaffs,
}: ModalAssignNewStaffProps) => {
  const classes = useStyles()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)

  const { assignNewStaffValidation } = useAssignStaffValidation()

  const form = useFormik({
    initialValues,
    validationSchema: assignNewStaffValidation,
    onSubmit: values => {
      if (!params.projectId) {
        !!onProjectCreateAssignStaffs &&
          onProjectCreateAssignStaffs(values.assignStaffList)
        return
      }
      const payload = {
        projectId: params.projectId as string,
        requestBody: values.assignStaffList.map(item => ({
          assignment: [
            {
              role: item.role,
              startDate: item.assignStartDate?.getTime() as number,
              endDate: item.assignEndDate?.getTime() as number,
              headcount: +item.assignEffort,
              note: '',
            },
          ],
          staffId: item.staff.id,
        })),
      }
      dispatch(updateLoading(true))
      ProjectService.assignNewStaff(payload)
        .then(() => {
          dispatch(
            alertSuccess({
              message: i18Project(
                'MSG_CREATE_PROJECT_STAFF_ASSIGNMENT_SUCCESS'
              ),
            })
          )
          onClose()
          !!reGetListAssignHeadcount && reGetListAssignHeadcount()
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
    },
  })

  const { assignStaffList } = form.values
  const randomId = uuid()

  const onDeleteAssignStaff = (assignStaffIndex: number) => {
    const newAssignStaffList: AssignStaffItem[] = [...assignStaffList]
    newAssignStaffList.splice(assignStaffIndex, 1)
    form.setFieldValue('assignStaffList', newAssignStaffList)
  }

  const addNewAssignStaffItem = () => {
    const newAssignStaffItem = {
      ...initAssignStaff,
      id: randomId,
      staff: {},
    }
    form.setFieldValue('assignStaffList', [
      ...assignStaffList,
      newAssignStaffItem,
    ])
  }

  const handleSubmit = () => {
    form.handleSubmit()
  }

  useEffect(() => {
    form.setFieldValue(`assignStaffList[0].id`, randomId)
  }, [])

  return (
    <Modal
      open
      cancelOutlined
      useButtonCancel
      useButtonDontSave
      width={888}
      title={i18Project('LB_ASSIGN_NEW_STAFF')}
      onClose={onClose}
      onDontSave={onClose}
      onSubmit={handleSubmit}
    >
      <Box className={classes.bodyAssignStaff}>
        <Box className={classes.assignStaffList}>
          {assignStaffList.map((assignStaff, index) => (
            <Box className={classes.boxAssignStaffItem} key={assignStaff.id}>
              <Box className={classes.staffIndex}>{`${i18('LB_STAFF')} #${
                index + 1
              }`}</Box>
              {assignStaffList.length > 1 && (
                <Box className={classes.boxDeleteIcon}>
                  <DeleteIcon onClick={() => onDeleteAssignStaff(index)} />
                </Box>
              )}
              <FormAssignNewStaffItem
                index={index}
                form={form}
                assignStaff={assignStaff}
              />
            </Box>
          ))}
        </Box>
        <FormLayout top={16}>
          <ButtonAddPlus
            disabled={
              assignStaffList.length === MAX_ASSIGN_STAFF_LIST ||
              !assignStaffList[assignStaffList.length - 1]?.staff?.id
            }
            label={i18Project('LB_ASSIGN_NEW_STAFF')}
            onClick={addNewAssignStaffItem}
          />
        </FormLayout>
      </Box>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  bodyAssignStaff: {},
  assignStaffList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  boxAssignStaffItem: {
    position: 'relative',
    border: `1px solid ${theme.color.grey.secondary}`,
    padding: theme.spacing(3, 2, 2, 2),
    borderRadius: '4px',
  },
  staffIndex: {
    color: theme.color.blue.primary,
    fontWeight: 700,
    position: 'absolute',
    top: '-10px',
    left: '8px',
    background: '#fff',
    padding: theme.spacing(0, 1),
  },
  boxDeleteIcon: {
    position: 'absolute',
    right: '5px',
    top: theme.spacing(1),
  },
}))

export default ModalAssignNewStaff

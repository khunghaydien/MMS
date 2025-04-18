import FormLayout from '@/components/Form/FormLayout'
import ButtonAddPlus from '@/components/buttons/ButtonAddPlus'
import Modal from '@/components/common/Modal'
import { LangConstant } from '@/const'
import { projectSelector } from '@/modules/project/reducer/project'
import { ProjectService } from '@/modules/project/services'
import { ProjectState } from '@/modules/project/types'
import { uuid } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import FormAssignmentItem from './FormAssignmentItem'

interface ModalStaffAssignDetailsProps {
  onClose: () => void
  staff: any
  reGetListAssignHeadcount: Function
}

export interface Assignment {
  id: string | number
  role: string
  startDate: Date | null
  endDate: Date | null
  headcount: string | number
  mode: 'edit' | 'add' | ''
  note: string
}

const ModalStaffAssignDetails = ({
  onClose,
  staff,
  reGetListAssignHeadcount,
}: ModalStaffAssignDetailsProps) => {
  const ramdomId = uuid()
  const params = useParams()
  const classes = useStyles()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)

  const { permissionResourceAllocation }: ProjectState =
    useSelector(projectSelector)

  const [listAssignment, setListAssignment] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [staffId, setStaffId] = useState(0)

  const addNewAssignment = () => {
    const newAssignment: Assignment = {
      id: ramdomId,
      role: '',
      startDate: null,
      endDate: null,
      headcount: '',
      mode: 'add',
      note: '',
    }
    const newListAssignment: Assignment[] = [newAssignment, ...listAssignment]
    setListAssignment(newListAssignment)
  }

  const getStaffAssignmentDetails = () => {
    setLoading(true)
    const payload = {
      projectId: params.projectId as string,
      projectStaffId: staff.projectStaffId,
    }
    ProjectService.getStaffAssignmentDetails(payload)
      .then((res: AxiosResponse) => {
        const data = res.data || {
          listAssignment: [],
          staff: {
            id: 0,
          },
        }
        setListAssignment(
          data.listAssignment.map((item: Assignment) => ({
            ...item,
            startDate: new Date(item.startDate || 0),
            endDate: new Date(item.endDate || 0),
            mode: 'edit',
          }))
        )
        setStaffId(+data.staff.id)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const onDeleteAssignmentModeAdd = (index: number) => {
    const newListAssignment: Assignment[] = [...listAssignment]
    newListAssignment.splice(index, 1)
    setListAssignment(newListAssignment)
  }

  useEffect(() => {
    getStaffAssignmentDetails()
  }, [])

  return (
    <Modal
      open
      hideFooter
      width={800}
      title={i18Project('TXT_STAFF_ASSIGNMENT_DETAILS')}
      onClose={onClose}
      loading={loading}
    >
      <Box className={classes.bodyStaffAssignmentDetails}>
        <StaffGeneralInformation staff={staff} />

        <FormLayout top={24} bottom={16}>
          {!!permissionResourceAllocation.updateStaffAssignment && (
            <ButtonAddPlus
              label={i18Project('LB_ADD_NEW_ASSIGNMENT')}
              onClick={addNewAssignment}
            />
          )}
        </FormLayout>
        <Box className={classes.listAssignment}>
          {listAssignment.map((assignment, index) => (
            <FormAssignmentItem
              staffId={staffId}
              staffAssignment={staff}
              key={assignment.id}
              assignment={assignment}
              listAssignment={listAssignment}
              getStaffAssignmentDetails={() => getStaffAssignmentDetails()}
              reGetListAssignHeadcount={() => reGetListAssignHeadcount()}
              index={index}
              onDeleteAssignmentModeAdd={onDeleteAssignmentModeAdd}
              onCloseModal={() => onClose()}
            />
          ))}
        </Box>
      </Box>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  bodyStaffAssignmentDetails: {},
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
  listAssignment: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
}))

export default ModalStaffAssignDetails

export const StaffGeneralInformation = ({ staff }: { staff: any }) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()

  return (
    <Box className={classes.listFields}>
      <Box className={classes.option}>
        <Box className={classes.label}>{i18('LB_STAFF_NAME')}</Box>
        <Box className={classes.value}>{staff.staffName}</Box>
      </Box>
      <Box className={classes.option}>
        <Box className={classes.label}>{i18('LB_STAFF_CODE')}</Box>
        <Box className={classes.value}>{staff.code}</Box>
      </Box>
      <Box className={classes.option}>
        <Box className={classes.label}>{i18('LB_EMAIL')}</Box>
        <Box className={classes.value}>{staff.staffEmail}</Box>
      </Box>
      <Box className={classes.option}>
        <Box className={classes.label}>{i18('LB_BRANCH')}</Box>
        <Box className={classes.value}>{staff.branch}</Box>
      </Box>
      <Box className={classes.option}>
        <Box className={classes.label}>{i18('LB_DIVISION')}</Box>
        <Box className={classes.value}>{staff.division}</Box>
      </Box>
    </Box>
  )
}

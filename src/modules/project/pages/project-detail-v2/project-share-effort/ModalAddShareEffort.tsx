import FormLayout from '@/components/Form/FormLayout'
import ButtonAddPlus from '@/components/buttons/ButtonAddPlus'
import Modal from '@/components/common/Modal'
import DeleteIcon from '@/components/icons/DeleteIcon'
import { LangConstant } from '@/const'
import { createShareEffort } from '@/modules/project/reducer/thunk'
import { CreateShareEffortRequestBodyItem } from '@/modules/project/types'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { IStaffInfo } from '@/types'
import { uuid } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import FormStaffEffortItem from './FormStaffEffortItem'
import { useShareEffortValidation } from './useShareEffortValidation'

interface ModalAddShareEffortProps {
  onClose: () => void
  onSubmit: Function
}

export interface StaffEffortItem {
  id?: string | number
  divisionId: string
  staff: IStaffInfo
  branchId: string
  shareMonthList: {
    id: string | number
    shareBillableManMonth: string | number
    shareMonth: Date | null
  }[]
}

const initStaffShareEffort = {
  id: 1,
  divisionId: '',
  branchId: '',
  staff: {},
  shareMonthList: [
    {
      id: 1,
      shareMonth: null,
      shareBillableManMonth: '',
    },
  ],
}

const initialValues = {
  staffEffortList: [{ ...initStaffShareEffort }] as StaffEffortItem[],
}

const MAX_SHARE_EFFORT_LIST = 10

const ModalShareEffort = ({ onClose, onSubmit }: ModalAddShareEffortProps) => {
  const classes = useStyles()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)

  const { addShareEffortValidation } = useShareEffortValidation()

  const form = useFormik({
    initialValues,
    validationSchema: addShareEffortValidation,
    onSubmit: values => {
      const requestBody: CreateShareEffortRequestBodyItem[] =
        values.staffEffortList.map(staffEffort => ({
          staffId: staffEffort.staff.id as number,
          listProjectShareEffortMonth: staffEffort.shareMonthList.map(
            shareMonthItem => ({
              shareEffort: +shareMonthItem.shareBillableManMonth,
              year: new Date(
                shareMonthItem.shareMonth as any
              )?.getFullYear() as number,
              month:
                (new Date(
                  shareMonthItem.shareMonth as any
                )?.getMonth() as number) + 1,
            })
          ),
        }))
      dispatchCreateShareEffort(requestBody)
    },
  })

  const { staffEffortList } = form.values
  const randomId = uuid()

  const addNewShareEffort = () => {
    const newShareEffort = {
      ...initStaffShareEffort,
      id: randomId,
      staff: {},
    }
    form.setFieldValue('staffEffortList', [...staffEffortList, newShareEffort])
  }

  const dispatchCreateShareEffort = (
    requestBody: CreateShareEffortRequestBodyItem[]
  ) => {
    const payload = {
      projectId: params.projectId as string,
      requestBody,
    }
    dispatch(updateLoading(true))
    dispatch(createShareEffort(payload))
      .unwrap()
      .then(() => {
        onClose()
        onSubmit()
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  const handleSubmit = () => {
    form.handleSubmit()
  }

  const onDeleteStaffEffort = (staffEffortIndex: number) => {
    const newStaffEffortList: StaffEffortItem[] = [...staffEffortList]
    newStaffEffortList.splice(staffEffortIndex, 1)
    form.setFieldValue('staffEffortList', newStaffEffortList)
  }

  return (
    <Modal
      open
      cancelOutlined
      useButtonCancel
      useButtonDontSave
      width={800}
      labelSubmit={i18('LB_FINISH') as string}
      title={i18Project('LB_ADD_SHARE_EFFORT')}
      onClose={onClose}
      onDontSave={onClose}
      onSubmit={handleSubmit}
    >
      <Box className={classes.bodyModalShareEffort}>
        <Box className={classes.shareEffortList}>
          {staffEffortList.map((staffEffort, index) => (
            <Box className={classes.boxStaffEffortItem} key={staffEffort.id}>
              <Box className={classes.staffIndex}>{`${i18('LB_STAFF')} #${
                index + 1
              }`}</Box>
              {staffEffortList.length > 1 && (
                <Box className={classes.boxDeleteIcon}>
                  <DeleteIcon onClick={() => onDeleteStaffEffort(index)} />
                </Box>
              )}
              <FormStaffEffortItem
                index={index}
                form={form}
                staffEffort={staffEffort}
              />
            </Box>
          ))}
        </Box>
        <FormLayout top={16}>
          <ButtonAddPlus
            disabled={
              staffEffortList.length === MAX_SHARE_EFFORT_LIST ||
              !staffEffortList[staffEffortList.length - 1]?.staff?.id
            }
            label={i18Project('LB_ADD_NEW_SHARE_EFFORT')}
            onClick={addNewShareEffort}
          />
        </FormLayout>
      </Box>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  bodyModalShareEffort: {},
  shareEffortList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  boxStaffEffortItem: {
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

export default ModalShareEffort

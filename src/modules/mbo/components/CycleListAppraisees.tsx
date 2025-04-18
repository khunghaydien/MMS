import ConditionalRender from '@/components/ConditionalRender'
import FormItem from '@/components/Form/FormItem/FormItem'
import CommonButton from '@/components/buttons/CommonButton'
import InputErrorMessage from '@/components/common/InputErrorMessage'
import DeleteIcon from '@/components/icons/DeleteIcon'
import CommonTable from '@/components/table/CommonTable'
import { LangConstant } from '@/const'
import { IEmployee, TableHeaderColumn } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import i18next from 'i18next'
import { cloneDeep } from 'lodash'
import { Dispatch, SetStateAction, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

const headCellsListAppraisees: TableHeaderColumn[] = [
  {
    id: 'code',
    align: 'left',
    label: i18next.t('common:LB_STAFF_CODE'),
    checked: false,
  },
  {
    id: 'fullName',
    align: 'left',
    label: i18next.t('common:LB_STAFF_NAME'),
    checked: false,
  },
  {
    id: 'position',
    align: 'left',
    label: i18next.t('common:LB_POSITION'),
    checked: false,
  },
  {
    id: 'delete',
    align: 'left',
    label: i18next.t('common:LB_ACTION'),
  },
]

interface IProps {
  setListAppraisees: Dispatch<SetStateAction<IEmployee[]>>
  listAppraisees: IEmployee[]
  setListEmployees: Dispatch<SetStateAction<IEmployee[]>>
  listEmployees: IEmployee[]
  error?: boolean
  errorMessage?: any
  required?: boolean
}

const CycleListAppraisees = ({
  setListAppraisees,
  listAppraisees,
  setListEmployees,
  listEmployees,
  required = false,
  error,
  errorMessage,
}: IProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)

  const handleDeleteAppraise = (staff: any) => {
    const _listAppraisees = cloneDeep(listAppraisees)
    const appraise = listAppraisees.find(
      (item: IEmployee) => item.id.toString() == staff.id
    )
    if (!!appraise) {
      setListEmployees([...listEmployees, appraise])
      setListAppraisees(
        _listAppraisees.filter((item: IEmployee) => item.id != appraise.id)
      )
    }
  }

  const rows = useMemo(
    () =>
      listAppraisees.map((item: IEmployee, index: number) => ({
        id: item.id,
        code: item.employeeId,
        fullName: item.name,
        employeeId: item.employeeId,
        position: item.position,
        useDeleteIcon: true,
      })),

    [listAppraisees]
  )

  const handleDeleteAll = () => {
    setListEmployees([...listEmployees, ...listAppraisees])
    setListAppraisees([])
  }

  return (
    <Box className={classes.rootListAppraisees}>
      <FormItem required={required} label={i18Mbo('TXT_LIST_APPRAISEES')}>
        <ConditionalRender conditional={!!error && !!errorMessage}>
          <InputErrorMessage
            className={clsx(classes.errorMessage)}
            content={''}
          />
        </ConditionalRender>
        <Box
          className={clsx(
            classes.CycleAppraiseesList,
            required && error && classes.error
          )}
        >
          <CommonTable
            maxHeight={500}
            columns={headCellsListAppraisees}
            rows={rows}
            onDeleteClick={handleDeleteAppraise}
          />
          <Box className={classes.buttonDeleteAll}>
            <Box>
              <ConditionalRender conditional={!!error && !!errorMessage}>
                <InputErrorMessage
                  className={classes.errorMessage}
                  content={errorMessage || ''}
                />
              </ConditionalRender>
            </Box>

            <CommonButton
              color="error"
              onClick={handleDeleteAll}
              disabled={rows.length == 0}
            >
              <Box className={classes.flexCenter}>
                <DeleteIcon data-title="button" /> {i18('LB_DELETE_ALL')}
              </Box>
            </CommonButton>
          </Box>
        </Box>
      </FormItem>
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootListAppraisees: {
    border: `1px solid ${theme.color.grey.primary}`,
    borderRadius: '4px',
    padding: theme.spacing(2),
    borderLeft: 'none',
    width: '60%',
    borderTopLeftRadius: 'unset',
    borderBottomLeftRadius: 'unset',
  },
  appraiseesTitle: {
    display: 'flex',
    fontSize: '14px',
    alignItems: 'center',
    fontWeight: '700',
    marginBottom: '8px',
  },
  CycleAppraiseesList: {
    marginTop: theme.spacing(2),
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  buttonDeleteAll: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(2),
    '& svg': {
      color: '#FFFFFF',
    },
  },
  errorMessage: {
    marginTop: theme.spacing(1),
  },
  error: {
    borderColor: theme.color.error.primary,
  },
  displayNone: {
    display: 'none',
  },
}))
export default CycleListAppraisees

import FormItem from '@/components/Form/FormItem/FormItem'
import ButtonAddWithIcon from '@/components/buttons/ButtonAddWithIcon'
import AutoCompleteSearchCustom from '@/components/common/AutoCompleteSearchCustom'
import NoData from '@/components/common/NoData'
import InputSearch from '@/components/inputs/InputSearch'
import LoadingSkeleton from '@/components/loading/LoadingSkeleton'
import { LangConstant } from '@/const'
import { INPUT_TIME_DELAY } from '@/const/app.const'
import {
  CommonState,
  commonSelector,
  getPositionBranch,
} from '@/reducer/common'
import { AppDispatch } from '@/store'
import { IEmployee, OptionItem } from '@/types'
import { Add } from '@mui/icons-material'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import _, { cloneDeep } from 'lodash'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

interface IProps {
  setListAppraisees: Dispatch<SetStateAction<IEmployee[]>>
  listAppraisees: IEmployee[]
  setListEmployees: Dispatch<SetStateAction<IEmployee[]>>
  listEmployees: IEmployee[]
  loading: boolean
  setQueries: Dispatch<
    SetStateAction<{
      name: string
      positionId: string
    }>
  >
  queries: any
}

const CycleListEmployee = ({
  setListAppraisees,
  listAppraisees,
  setListEmployees,
  setQueries,
  listEmployees,
  loading,
  queries,
}: IProps) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)
  const [valueSearch, setValueSearch] = useState('')
  const [selectPosition, setSelectPosition] = useState<OptionItem>({})
  const { listPositionBranch }: CommonState = useSelector(commonSelector)

  function handleDebounceFn(newValueSearch: string) {
    setQueries({ ...queries, name: newValueSearch })
  }

  const debounceFn = useCallback(
    _.debounce(handleDebounceFn, INPUT_TIME_DELAY),
    [queries]
  )

  const handleSearchChange = (newValueSearch: string) => {
    setValueSearch(newValueSearch)
    debounceFn(newValueSearch.trim())
  }

  const handleAddAppraisees = (value: IEmployee) => {
    const _listEmployees = cloneDeep(listEmployees)
    setListAppraisees([...listAppraisees, value])
    const employeeIndex = listEmployees.findIndex(item => item.id == value.id)
    if (employeeIndex > -1) {
      _listEmployees.splice(employeeIndex, 1)
      setListEmployees(_listEmployees)
    }
  }

  const handleAddAllMember = () => {
    setListAppraisees([...listAppraisees, ...listEmployees])
    setListEmployees([])
  }

  const handleSelectPosition = (value: OptionItem) => {
    setSelectPosition(value)
    setQueries({
      ...queries,
      positionId: value?.id?.toString() || '',
    })
  }

  useEffect(() => {
    dispatch(getPositionBranch({}))
  }, [])

  return (
    <Box className={classes.rootListEmployee}>
      <Box className={classes.employeeTitle}>
        {i18Mbo('TXT_LIST_EMPLOYEES')}
      </Box>
      <Box className={classes.headerFilters}>
        <InputSearch
          label={i18('LB_SEARCH')}
          placeholder={`${i18('LB_STAFF_NAME')}`}
          value={valueSearch || ''}
          onChange={handleSearchChange}
          width={400}
        />
        <FormItem label={i18('LB_POSITION')}>
          <AutoCompleteSearchCustom
            multiple={false}
            placeholder={i18('PLH_SELECT', {
              labelName: i18('LB_POSITION'),
            })}
            value={selectPosition}
            listOptions={listPositionBranch}
            onChange={handleSelectPosition}
          />
        </FormItem>
      </Box>

      <Box className={classes.employeeList}>
        {!loading &&
          listEmployees.map(item => (
            <Box
              className={classes.employeeItem}
              key={item.id}
              onClick={() => {
                handleAddAppraisees(item)
              }}
            >
              <Box className={classes.employeeName}>
                <Box className={'name'}>
                  {item.employeeId} - {item.name}
                </Box>
                <Box className={'position'}>{item.position}</Box>
              </Box>
              <Add
                data-title="icon-add"
                className={clsx(classes.iconAdd, 'button-add')}
              />
            </Box>
          ))}
        {loading && <LoadingSkeleton height="100%" />}
        {(!listEmployees || listEmployees?.length == 0) && !loading && (
          <NoData />
        )}
      </Box>
      <Box className={classes.buttonAddAll}>
        <ButtonAddWithIcon
          className={'button-add'}
          onClick={handleAddAllMember}
          disabled={listEmployees.length == 0}
        >
          {i18Mbo('LB_ADD_ALL_MEMBER', {
            numberEmployee: listEmployees.length,
          })}
        </ButtonAddWithIcon>
      </Box>
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootListEmployee: {
    border: `1px solid ${theme.color.grey.primary}`,
    borderRadius: '4px',
    padding: theme.spacing(2),
    width: '40%',
    borderTopRightRadius: 'unset',
    borderBottomRightRadius: 'unset',
  },
  employeeTitle: {
    display: 'flex',
    fontSize: '14px',
    alignItems: 'center',
    fontWeight: '700',
    marginBottom: '8px',
  },
  employeeList: {
    border: `1px solid ${theme.color.grey.primary}`,
    borderRadius: '4px',
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '500px',
    minHeight: '250px',
    height: '400px',
    overflow: 'auto',
    position: 'relative',
  },
  employeeItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1),
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      cursor: 'pointer',
      '& .button-add': {
        display: 'block',
      },
    },
    '& .button-add': {
      display: 'none',
    },
  },
  employeeName: {
    '& .name': {
      fontWeight: '700',
      fontSize: '0.9em',
    },
    '& .position': {
      fontWeight: '400',
      fontSize: '0.8em',
    },
  },
  buttonAddAll: {
    display: 'flex',
    justifyContent: 'end',
    marginTop: theme.spacing(2),
  },
  iconAdd: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    borderRadius: '50%',
    backgroundColor: theme.color.blue.primary,
    color: theme.color.white,
  },
  headerFilters: {
    display: 'flex',
    gap: theme.spacing(3),
    alignItems: 'flex-end',
  },
}))
export default CycleListEmployee

import { BRANCH_TYPE, SUB_MODULE_STAFF_FILTER } from '@/const/app.const'
import { commonSelector, CommonState, getDivisions } from '@/reducer/common'
import { AppDispatch } from '@/store'
import {
  DivisionType,
  IDivision,
  IDivisionByProjectType,
  OptionItem,
} from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { memo, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import InputTitle from '../common/InputTitle'
import InputAutocomplete from '../inputs/InputAutocomplete'

interface IProps {
  value?: OptionItem[]
  width?: number | string
  useLabel?: boolean
  onChange: (value: OptionItem[]) => void
  error?: boolean
  errorMessage?: string
  placeholder?: any
  branchId?: string
  label?: any
  required?: boolean
  disabled?: boolean
  isProject?: boolean
  isAllDivision?: boolean
  moduleConstant: number
  subModuleConstant?: number
}

const SelectDivision = ({
  width,
  value,
  useLabel,
  placeholder,
  onChange,
  error,
  errorMessage,
  branchId,
  label,
  required = false,
  disabled = false,
  isProject = false,
  isAllDivision = true,
  moduleConstant,
  subModuleConstant = SUB_MODULE_STAFF_FILTER,
}: IProps) => {
  const location = useLocation()
  const dispatch = useDispatch<AppDispatch>()
  const classes = useStyles()
  const { divisions, divisionByProject }: CommonState =
    useSelector(commonSelector)

  const listOptions: any = useMemo(() => {
    if (isProject && isAllDivision) {
      const result: any[] = []
      divisionByProject.forEach((item: IDivisionByProjectType) => {
        if (branchId && branchId !== BRANCH_TYPE.ALL_BRANCH.id) {
          if (branchId === item.branchId) {
            result.push(item)
          }
        } else {
          result.push(item)
        }
      })
      return result.map((item: IDivisionByProjectType) => ({
        label: item.name,
        value: item.divisionId,
        code: item.divisionId,
        id: item.divisionId,
      }))
    } else {
      const result: any[] = []
      divisions.forEach((item: DivisionType) => {
        if (branchId && branchId !== BRANCH_TYPE.ALL_BRANCH.id) {
          if (branchId === item.branches.id) {
            result.push(...item.divisions)
          }
        } else {
          result.push(...item.divisions)
        }
      })
      return result.map((item: IDivision) => ({
        ...item,
        label: item.name,
        value: item.divisionId,
        id: item.divisionId,
      }))
    }
  }, [divisionByProject, divisions, branchId])

  useEffect(() => {
    dispatch(
      getDivisions({
        moduleConstant,
        subModuleConstant,
      })
    )
  }, [])

  return (
    <Box className={clsx(classes.rootFormItem)}>
      {!useLabel && !!label && <InputTitle title={label} required={required} />}
      <Box className={classes.formContent}>
        <InputAutocomplete
          label={useLabel ? label : ''}
          placeholder={placeholder}
          listOptions={listOptions}
          onChange={onChange}
          defaultTags={value}
          error={error}
          errorMessage={errorMessage}
          width={width}
          disabled={disabled}
        />
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootFormItem: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    fontSize: 14,
  },
  formContent: {
    width: '100%',
  },
}))

export default memo(SelectDivision)

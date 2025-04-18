import InputAutocomplete from '@/components/inputs/InputAutocomplete'
import { LangConstant } from '@/const'
import { INPUT_TEXT_MAX_LENGTH } from '@/const/app.const'
import { commonSelector, CommonState, getPositions } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { IPosition, OptionItem, PositionType } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { memo, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import InputTitle from '../common/InputTitle'

interface IProps {
  value: any
  label?: string
  width?: number | string
  useLabel?: boolean
  onChange: (value: OptionItem[]) => void
  error?: boolean
  errorMessage?: any
  required?: boolean
  placeholder?: any
  disabled?: boolean
  divisionIds?: string[]
  maxLength?: number
  listOptionsProp?: OptionItem[]
}

const SelectPosition = ({
  width,
  value,
  useLabel,
  onChange,
  error,
  errorMessage,
  label,
  required = false,
  placeholder,
  disabled = false,
  divisionIds = [],
  maxLength = INPUT_TEXT_MAX_LENGTH,
  listOptionsProp,
}: IProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18nProject } = useTranslation(LangConstant.NS_PROJECT)
  const { listPosition }: CommonState = useSelector(commonSelector)
  const classes = useStyles()

  const listOptions: OptionItem[] = useMemo(() => {
    if (listOptionsProp) return listOptionsProp
    const result: any[] = []
    const positionObjectId: any = {}

    listPosition.forEach((item: PositionType) => {
      if (divisionIds.length > 0) {
        if (divisionIds.includes(item.division.divisionId)) {
          item.positions.forEach((position: IPosition) => {
            if (!positionObjectId[position.id]) {
              result.push({
                ...position,
                label: position.name,
                value: position.id,
                id: position.id,
              })
              positionObjectId[position.id] = true
            }
          })
        }
      }
    })
    return result
  }, [listPosition, divisionIds])

  useEffect(() => {
    if (!listPosition.length && !listOptionsProp) {
      dispatch(getPositions())
    }
  }, [])

  return (
    <Box className={clsx(classes.rootFormItem)} style={{ width }}>
      {!useLabel && !!label && <InputTitle title={label} required={required} />}
      <Box className={classes.formContent}>
        <InputAutocomplete
          width={width}
          maxLength={maxLength}
          placeholder={
            !useLabel ? i18nProject('LB_SELECT_POSITION') : placeholder
          }
          listOptions={listOptions}
          onChange={onChange}
          defaultTags={value}
          error={error}
          errorMessage={errorMessage}
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

export default memo(SelectPosition)

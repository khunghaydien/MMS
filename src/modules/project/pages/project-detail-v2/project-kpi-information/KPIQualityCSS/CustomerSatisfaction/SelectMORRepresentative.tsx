import AutoCompleteSearchCustom from '@/components/common/AutoCompleteSearchCustom'
import InputTitle from '@/components/common/InputTitle'
import { CHANGE_TIME_DELAY } from '@/const/app.const'
import { NS_PROJECT } from '@/const/lang.const'
import { commonSelector, getMorRepresentative } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

interface SelectMORRepresentativeProps {
  width?: string | number
  required?: boolean
  value: OptionItem | {}
  error?: boolean
  errorMessage?: string
  onChange: (value: OptionItem | {}) => void
}

const SelectMORRepresentative = ({
  width,
  required,
  value,
  error,
  errorMessage,
  onChange,
}: SelectMORRepresentativeProps) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const params = useParams()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const { loadingMorRepresentative, morRepresentative } =
    useSelector(commonSelector)

  const changeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleChange = (value: OptionItem) => {
    onChange(value || {})
  }

  const onInputChange = (value: string) => {
    if (changeTimeoutRef.current) {
      clearTimeout(changeTimeoutRef.current)
    }
    changeTimeoutRef.current = setTimeout(() => {
      dispatch(
        getMorRepresentative({
          projectId: params.projectId as string,
          keyword: value,
        })
      )
    }, CHANGE_TIME_DELAY)
  }

  useEffect(() => {
    if (!morRepresentative.length) {
      dispatch(
        getMorRepresentative({
          projectId: params.projectId as string,
          keyword: '',
        })
      )
    }
  }, [])

  return (
    <Box
      className={clsx(classes.rootFormItem)}
      style={{ width: width || '100%' }}
    >
      <InputTitle
        title={i18Project('TXT_MOR_REPRESENTATIVE')}
        required={required}
      />
      <Box className={classes.formContent}>
        <AutoCompleteSearchCustom
          customZIndex
          isCustomFilter
          multiple={false}
          placeholder={i18('PLH_SELECT_STAFF')}
          listOptions={morRepresentative}
          onChange={handleChange}
          onInputChange={onInputChange}
          value={value}
          error={error}
          errorMessage={errorMessage}
          width={width}
          loading={loadingMorRepresentative}
          numberEllipsis={100}
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

export default SelectMORRepresentative

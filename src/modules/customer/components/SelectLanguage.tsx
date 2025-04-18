import AutoCompleteSearchCustom from '@/components/common/AutoCompleteSearchCustom'
import InputTitle from '@/components/common/InputTitle'
import { LIST_OF_LANGUAGES } from '@/const/app.const'
import { OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface IProps {
  value: OptionItem[]
  width?: number | string
  onChange: (value: OptionItem[]) => void
  error?: boolean
  errorMessage?: string
  required?: boolean
  label?: string
}

const SelectLanguage = ({
  width = '100%',
  value,
  onChange,
  error,
  errorMessage,
  label,
  required = false,
}: IProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()

  const _label = useMemo(() => {
    return label || i18('LB_LANGUAGE')
  }, [label])

  const handleChange = (value: OptionItem[]) => {
    onChange(value)
  }

  return (
    <Box className={clsx(classes.rootFormItem)}>
      {!!_label && <InputTitle title={_label} required={required} />}
      <Box className={classes.formContent}>
        <AutoCompleteSearchCustom
          multiple
          placeholder={i18('PLH_SELECT_LANGUAGE')}
          listOptions={LIST_OF_LANGUAGES}
          onChange={handleChange}
          value={value}
          error={error}
          errorMessage={errorMessage}
          width={width}
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

export default SelectLanguage

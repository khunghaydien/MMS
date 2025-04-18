import InputErrorMessage from '@/components/common/InputErrorMessage'
import { LangConstant } from '@/const'
import { INPUT_TEXT_MAX_LENGTH } from '@/const/app.const'
import { OptionItem } from '@/types'
import {
  Autocomplete,
  Box,
  CircularProgress,
  createFilterOptions,
  TextField,
  Theme,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface InputAutocompleteProps {
  placeholder?: any
  width?: number | string
  defaultTags?: OptionItem[]
  listOptions: OptionItem[]
  uniqueKey?: string
  error?: boolean
  errorMessage?: any
  onChange: (tags: any) => void
  size?: 'small' | 'medium'
  disabled?: boolean
  maxLength?: number
  label?: string
  multiple?: boolean
  loading?: boolean
  maxWidth?: number | string
}

const filterOptions = createFilterOptions({
  matchFrom: 'any',
  stringify: (option: OptionItem) => option.label || '',
  trim: true,
})

const InputAutocomplete = ({
  placeholder,
  width,
  defaultTags,
  listOptions,
  onChange,
  uniqueKey = 'value',
  error,
  errorMessage,
  size = 'small',
  disabled = false,
  maxLength = INPUT_TEXT_MAX_LENGTH,
  label = '',
  loading = false,
  multiple = true,
  maxWidth,
}: InputAutocompleteProps) => {
  const classes = useStyles()
  const { t: i18nCommon } = useTranslation(LangConstant.NS_COMMON)

  const [open, setOpen] = useState(false)

  const handleChange = (_: any, _tags: any) => {
    if (_tags.length > maxLength) return
    onChange(_tags)
    setOpen(false)
  }

  const defaultValue: OptionItem[] = useMemo(() => {
    if (!defaultTags || !defaultTags.length) return []
    const listSelected = defaultTags.map((item: any) =>
      item[uniqueKey].toString()
    )
    return listOptions.filter((e: any) =>
      listSelected.includes(e[uniqueKey].toString())
    )
  }, [defaultTags, listOptions])

  return (
    <Box
      className={clsx(classes.rootInputAutocomplete, disabled && 'disabled')}
      style={{ width, maxWidth: width || maxWidth }}
    >
      <Autocomplete
        open={open}
        className={clsx(
          classes.autoCompleteSearch,
          error && classes.error,
          disabled && 'disabled'
        )}
        multiple={multiple}
        filterOptions={filterOptions}
        style={{ width }}
        options={listOptions}
        value={defaultValue}
        onOpen={() => !disabled && setOpen(true)}
        onClose={() => setOpen(false)}
        getOptionLabel={(option: OptionItem) =>
          option.label ? option.label : ''
        }
        renderOption={(props, option: OptionItem) => (
          <Box component="li" {...props} key={option.value} outside-root="*">
            {option.label}
          </Box>
        )}
        renderInput={params => {
          params.inputProps.readOnly = defaultTags?.length === maxLength
          return (
            <TextField
              label={label}
              placeholder={placeholder}
              className={classes.textInput}
              {...params}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )
        }}
        onChange={handleChange}
        size={size}
        disabled={disabled}
        noOptionsText={i18nCommon('MSG_NO_DATA_AVAILABLE')}
        loading={loading && !listOptions.length}
      />
      {error && (
        <InputErrorMessage
          className={classes.errorMessage}
          content={errorMessage}
        />
      )}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootInputAutocomplete: {
    maxWidth: '290px',
  },
  autoCompleteSearch: {
    backgroundColor: '#FFFFFF',
    '&.disabled': {
      backgroundColor: theme.color.grey.tertiary,
    },
  },
  errorMessage: {
    marginTop: theme.spacing(1),
  },
  error: {
    '& fieldset': {
      borderColor: theme.color.error.primary,
    },
  },
  textInput: {
    '&	.MuiInputBase-root': {
      minHeight: theme.spacing(5),
    },
    '& input': {
      fontSize: 16,
    },

    '& label': {
      color: theme.color.black.tertiary,
      fontSize: 14,
    },
  },
}))

export default InputAutocomplete

import { Box, TextField, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import InputTitle from '../common/InputTitle'

interface InputYearProps {
  value: Date | null
  placeholder?: string
  label?: string
  required?: boolean
  width?: number
  onChange: (value: Date | null) => void
}

const InputYear = ({
  value,
  label,
  required,
  width = 160,
  placeholder,
  onChange,
}: InputYearProps) => {
  const classes = useStyles()

  return (
    <Box sx={{ width }}>
      {!!label && <InputTitle title={label} required={required} />}
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker
          className={classes.rootInputYear}
          inputFormat="yyyy"
          views={['year']}
          value={value}
          onChange={onChange}
          renderInput={params => (
            <TextField
              {...params}
              inputProps={{
                ...params.inputProps,
                readOnly: true,
                placeholder: placeholder || 'Select Year',
              }}
              helperText={null}
            />
          )}
        />
      </LocalizationProvider>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootInputYear: {
    '& .MuiInputBase-root': {
      height: theme.spacing(5),
    },
  },
}))

export default InputYear

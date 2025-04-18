import { FormControlLabel, Theme } from '@mui/material'
import { withStyles } from '@mui/styles'

export default withStyles((theme: Theme) => ({
  root: {
    margin: '0 !important',
    '& .Mui-checked': {
      color: `${theme.color.blue.primary} !important`,
    },
  },
}))(FormControlLabel)

import { OptionItem } from '@/types'
import { MoreHoriz } from '@mui/icons-material'
import { Box, Button, Menu, MenuItem, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ButtonActionsProps {
  listOptions: OptionItem[]
  label?: string
  onChooseOption?: (option: OptionItem) => void
  endIcon?: ReactElement
}

const ButtonActions = ({
  listOptions,
  onChooseOption,
  label,
  endIcon,
}: ButtonActionsProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = (option: OptionItem) => {
    setAnchorEl(null)
    !!onChooseOption && onChooseOption(option)
  }

  return (
    <Box className={classes.rootButtonActions}>
      <Button
        className={classes.button}
        variant="contained"
        data-title="btn"
        onClick={handleClick}
      >
        <span className={classes.labelAction}>
          {label || i18('TXT_ACTION')}
        </span>
        {endIcon || <MoreHoriz data-title="icon-add" />}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {listOptions.map((option: OptionItem) => (
          <MenuItem
            key={option.id}
            disabled={option.disabled}
            onClick={() => handleClose(option)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootButtonActions: {},
  labelAction: {
    marginRight: theme.spacing(0.5),
  },
  button: {
    height: 40,
    borderRadius: 4,
    '&:hover': {
      backgroundColor: `${theme.color.orange.primary} !important`,
    },
  },
}))

export default ButtonActions

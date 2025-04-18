import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useLayoutEffect, useState } from 'react'

interface ToggleSectionIconProps {
  open: boolean
  onToggle?: (open: boolean) => void
}

const ToggleSectionIcon = ({ open, onToggle }: ToggleSectionIconProps) => {
  const classes = useStyles()

  const [openInternal, setOpenInternal] = useState(false)

  const handleToggle = () => {
    const newOpen = !open
    setOpenInternal(newOpen)
    !!onToggle && onToggle(newOpen)
  }

  useLayoutEffect(() => {
    if (open !== openInternal) {
      setOpenInternal(open)
    }
  }, [open])

  return (
    <Box className={classes.toggleSectionIcon} onClick={handleToggle}>
      {!!openInternal && <IndeterminateCheckBoxIcon className={classes.icon} />}

      {!openInternal && (
        <Box className={classes.hideIcon}>
          <Box className={classes.line}></Box>
          <IndeterminateCheckBoxIcon className={classes.icon} />
        </Box>
      )}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  toggleSectionIcon: {
    cursor: 'pointer',
    height: theme.spacing(3),
  },
  icon: {
    color: `${theme.color.blue.primary} !important`,
  },
  hideIcon: {
    position: 'relative',
    height: theme.spacing(3),
  },
  line: {
    backgroundColor: '#FFFFFF',
    width: '2px',
    height: '8px',
    position: 'absolute',
    top: '8px',
    left: '11px',
  },
}))

export default ToggleSectionIcon

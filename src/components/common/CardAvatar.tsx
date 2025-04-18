import { getAbbreviations, invertColor } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import String2Color from 'string-to-color'

interface CardAvatarProps {
  info: any
  onClick?: () => void
}

const CardAvatar = ({ info, onClick }: CardAvatarProps) => {
  const colorBackground = String2Color(info.name)
  const colorShortName = invertColor(colorBackground)
  const shortName = getAbbreviations(info.name)
  const classes = useStyles({
    background: colorBackground,
    color: colorShortName,
  })

  const handleClick = () => {
    !!onClick && onClick()
  }

  return (
    <Box className={classes.rootCardAvatar} onClick={handleClick}>
      <Box className={classes.avatar}>{shortName || 'A'}</Box>
      <Box className={classes.info}>
        <Box className="username">{info.name}</Box>
        <Box className="position">{info.position}</Box>
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  info: {
    '& .username': {
      fontSize: '18px',
      fontWeight: '700',
      maxWidth: '240px',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
    '& .position': {
      fontSize: '14px',
      fontWeight: '400',
    },
  },
  rootCardAvatar: {
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    width: '40px',
    height: '40px',
    background: ({ background }: any) => background,
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: ({ color }: any) => color,
    marginRight: '10px',
    position: 'relative',
  },
}))

export default CardAvatar

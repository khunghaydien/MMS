import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'

interface IProps {
  width?: number
  color?: string
  label?: any
  onClick?: () => void
}

const defaultProps = {
  width: 24,
  color: '#666666',
}

const useStyles = makeStyles((theme: Theme) => ({
  rootBackIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    cursor: 'pointer',
  },
}))

export default function BackIcon({
  width,
  color,
  onClick,
  label,
}: IProps & typeof defaultProps) {
  const classes = useStyles()

  return (
    <Box className={classes.rootBackIcon} onClick={onClick}>
      <svg
        style={{ cursor: 'pointer' }}
        width={width}
        height={width}
        viewBox={`0 0 ${width} ${width}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_543_6115)">
          <path
            d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
            fill={color}
          />
        </g>
        <defs>
          <clipPath id="clip0_543_6115">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <Box>{label}</Box>
    </Box>
  )
}

BackIcon.defaultProps = defaultProps

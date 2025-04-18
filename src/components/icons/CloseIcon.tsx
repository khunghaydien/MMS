import { Box } from '@mui/material'
import SvgIcon from './SvgIcon'

interface CloseIconProps {
  width: number
  height: number
  onClick?: () => void
}

const CloseIcon = ({ width, height, onClick }: CloseIconProps) => {
  return (
    <Box onClick={onClick} style={{ cursor: 'pointer', width: 'max-content' }}>
      <SvgIcon width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <g clipPath="url(#clip0_376_24293)">
          <path
            d="M18 6.41L16.59 5L11 10.59L5.41 5L4 6.41L9.59 12L4 17.59L5.41 19L11 13.41L16.59 19L18 17.59L12.41 12L18 6.41Z"
            fill="#666666"
          />
        </g>
        <defs>
          <clipPath id="clip0_376_24293">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </SvgIcon>
    </Box>
  )
}

CloseIcon.defaultProps = {
  width: 24,
  height: 24,
}

export default CloseIcon

import { PRIORITY_STATUS } from '@/modules/customer/const'
import { Box } from '@mui/material'
import { Fragment } from 'react'

const Low = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <svg width="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
        <path
          d="M12.5 6.1c.5-.3 1.1-.1 1.4.4.3.5.1 1.1-.3 1.3l-5 3c-.3.2-.7.2-1 0l-5-3c-.6-.2-.7-.9-.4-1.3.2-.5.9-.7 1.3-.4L8 8.8l4.5-2.7z"
          fill="#0065ff"
        />
      </svg>
      <Box>Low</Box>
    </Box>
  )
}

const Medium = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <svg
        width="24"
        version="1.1"
        id="Warstwa_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 16 16"
        xmlSpace="preserve"
      >
        <g id="icon_x2F_16px_x2F_medium-priority-">
          <g>
            <path
              className="medium"
              d="M3,4h10c0.6,0,1,0.4,1,1s-0.4,1-1,1H3C2.4,6,2,5.6,2,5S2.4,4,3,4z M3,10h10c0.6,0,1,0.4,1,1s-0.4,1-1,1H3
			c-0.6,0-1-0.4-1-1S2.4,10,3,10z"
            />
          </g>
        </g>
      </svg>
      <Box sx={{ marginTop: '2px' }}>Medium</Box>
    </Box>
  )
}

const High = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <svg width="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
        <path
          d="M3.5 9.9c-.5.3-1.1.1-1.4-.3s-.1-1.1.4-1.4l5-3c.3-.2.7-.2 1 0l5 3c.5.3.6.9.3 1.4-.3.5-.9.6-1.4.3L8 7.2 3.5 9.9z"
          fill="#ff5630"
        />
      </svg>
      <Box sx={{ marginTop: '2px' }}>High</Box>
    </Box>
  )
}

interface PriorityStatusProps {
  priority: string | number
}

const PriorityStatus = ({ priority }: PriorityStatusProps) => {
  switch (priority) {
    case PRIORITY_STATUS.low:
      return <Low />
    case PRIORITY_STATUS.medium:
      return <Medium />
    case PRIORITY_STATUS.high:
      return <High />
    default:
      return <Fragment />
  }
}

export default PriorityStatus

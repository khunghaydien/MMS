import { Box } from '@mui/material'

interface IProp {
  color?: string
  label?: string
}

const HightIcon = ({ color = '#ff5630', label = '' }: IProp) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <svg width="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
        <path
          d="M3.5 9.9c-.5.3-1.1.1-1.4-.3s-.1-1.1.4-1.4l5-3c.3-.2.7-.2 1 0l5 3c.5.3.6.9.3 1.4-.3.5-.9.6-1.4.3L8 7.2 3.5 9.9z"
          fill={color}
        />
      </svg>
      <Box sx={{ marginTop: '2px' }} style={{ color }}>
        {label}
      </Box>
    </Box>
  )
}
export default HightIcon

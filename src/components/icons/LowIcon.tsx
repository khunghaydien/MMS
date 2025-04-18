import { Box } from '@mui/system'

interface IProp {
  color?: string
  label?: string
}
const LowIcon = ({ color = '#0065ff', label = '' }: IProp) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <svg width="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
        <path
          d="M12.5 6.1c.5-.3 1.1-.1 1.4.4.3.5.1 1.1-.3 1.3l-5 3c-.3.2-.7.2-1 0l-5-3c-.6-.2-.7-.9-.4-1.3.2-.5.9-.7 1.3-.4L8 8.8l4.5-2.7z"
          fill={color || ''}
        />
      </svg>
      <Box sx={{ marginTop: '2px' }} style={{ color }}>
        {label}
      </Box>
    </Box>
  )
}

export default LowIcon

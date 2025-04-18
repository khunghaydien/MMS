import { Box } from '@mui/material'

interface IProp {
  color?: string
  label?: string
}

const MediumIcon = ({ color = '#ff5630', label = '' }: IProp) => {
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
      <Box sx={{ marginTop: '2px' }} style={{ color }}>
        {label}
      </Box>
    </Box>
  )
}
export default MediumIcon

import SvgIcon from './SvgIcon'

interface CheckboxIconProps {
  width: number
  height: number
}

const CheckboxIcon = ({ width, height }: CheckboxIconProps) => {
  return (
    <SvgIcon width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path
        d="M19 5V19H5V5H19ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z"
        fill="black"
        fillOpacity="0.6"
      />
    </SvgIcon>
  )
}

CheckboxIcon.defaultProps = {
  width: 24,
  height: 24,
  checked: false,
}

export default CheckboxIcon

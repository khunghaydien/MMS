interface IProps {
  width?: number | string
  height?: number | string
  color?: string
}

function DropdownHoverIcon({
  width = 48,
  height = 48,
  color = '#FFFFFF',
}: IProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 12 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10.1017 0.5L6 5.23624L1.8983 0.5L10.1017 0.5Z" stroke={color} />
    </svg>
  )
}

export default DropdownHoverIcon

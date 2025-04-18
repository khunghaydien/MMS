interface IProps {
  width?: number | string
  height?: number | string
  color?: string
}

function DropdownIcon({ width = 48, height = 48, color = '#FFFFFF' }: IProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 12 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_727_2)">
        <path
          d="M1.89828 5.5L5.99998 0.76376L10.1017 5.5L1.89828 5.5Z"
          stroke={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_727_2">
          <rect
            width="12"
            height="6"
            fill="white"
            transform="matrix(-1 0 0 -1 12 6)"
          />
        </clipPath>
      </defs>
    </svg>
  )
}

export default DropdownIcon

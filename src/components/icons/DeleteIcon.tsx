import { Delete } from '@mui/icons-material'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { MouseEvent } from 'react'
import SvgIcon from './SvgIcon'

interface DeleteIconProps {
  width: number
  height: number
  className?: string
  onClick?: () => void
}

const DeleteIcon = ({ width, height, className, onClick }: DeleteIconProps) => {
  const classes = useStyles()

  const handleClick = (e: MouseEvent<SVGSVGElement>) => {
    e.stopPropagation()
    !!onClick && onClick()
  }

  return (
    <SvgIcon width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Delete
        className={clsx(classes.deleteIcon, className)}
        onClick={e => handleClick(e)}
      />
    </SvgIcon>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  deleteIcon: {
    color: theme.color.black.secondary,
    cursor: 'pointer',
  },
}))

DeleteIcon.defaultProps = {
  width: 24,
  height: 24,
}

export default DeleteIcon

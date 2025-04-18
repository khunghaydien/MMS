import { cleanObject } from '@/utils'
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useRef } from 'react'

interface IButtonTransition {
  toggleButton: boolean
  setToggleButton: (toggleTransition: boolean) => void
  top?: number | string
  bottom?: number | string
  left?: number | string
  right?: number | string
  timeout: number
  label: string
  direction: 'left' | 'right'
}

const ButtonTransition = ({
  top = '',
  bottom = '',
  left = '',
  right = '',
  timeout,
  label,
  toggleButton,
  setToggleButton,
  direction,
}: IButtonTransition) => {
  const buttonRef = useRef<HTMLElement | null>(null)
  const classes = useStyles({
    warperWidth: buttonRef.current?.offsetWidth,
    top,
    left,
    right,
    timeout,
    toggleButton,
  })

  const handleToggleButton = () => {
    setToggleButton(!toggleButton)
  }

  return (
    <Box
      className={clsx(classes.rootCloseIcon)}
      sx={cleanObject({ top, left, right, bottom })}
    >
      <Box
        ref={buttonRef}
        onClick={handleToggleButton}
        className={clsx(classes.iconWarper, direction)}
      >
        <Box className={clsx(classes.label, direction, 'label')}>{label}</Box>
        {direction === 'left' ? (
          <ArrowForwardIos
            className={clsx(
              classes.closeIcon,
              !toggleButton && 'rotate',
              direction
            )}
          />
        ) : (
          <ArrowBackIos
            className={clsx(
              classes.closeIcon,
              !toggleButton && 'rotate',
              direction
            )}
          />
        )}
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => {
  return {
    closeIcon: {
      transition: ({ timeout }: any) => `${timeout}ms ease !important`,
      '&.rotate': {
        '&.left': {
          transform: `translateX(${theme.spacing(0)}) rotate(180deg)`,
        },
        '&.right': {
          transform: `translateX(${theme.spacing(-1)}) rotate(180deg)`,
        },
      },
    },
    rootCloseIcon: {
      overflow: 'hidden',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      position: 'absolute',
      height: theme.spacing(6),
      width: ({ warperWidth }: any) => warperWidth,
      transition: ({ timeout }: any) => `${timeout}ms ease !important`,
    },
    iconWarper: {
      zIndex: 100,
      height: theme.spacing(6),
      display: 'flex',
      gap: theme.spacing(1),
      padding: theme.spacing(1),
      alignItems: 'center',
      border: `1px solid ${theme.color.grey.primary}`,
      backgroundColor: theme.color.white,
      whiteSpace: 'nowrap',
      position: 'absolute',

      '&.left': {
        left: ({ warperWidth }: any) => `${warperWidth - 40}px`,
        flexDirection: 'row-reverse',
        borderBottomLeftRadius: theme.spacing(10),
        borderTopLeftRadius: theme.spacing(10),
        borderRight: 0,
        '&:hover': {
          transition: ({ timeout }: any) => `${timeout}ms ease !important`,
          transform: ({ toggleButton, warperWidth }: any) =>
            !toggleButton ? `translateX(-${warperWidth - 40 + 'px'})` : '',
        },
      },
      '&.right': {
        right: ({ warperWidth }: any) => `${warperWidth - 40}px`,
        borderBottomRightRadius: theme.spacing(10),
        borderTopRightRadius: theme.spacing(10),
        borderLeft: 0,
        '&:hover': {
          transition: ({ timeout }: any) => `${timeout}ms ease !important`,
          transform: ({ toggleButton, warperWidth }: any) =>
            !toggleButton ? `translateX(${warperWidth - 40 + 'px'})` : '',
        },
      },
    },
    label: {
      flex: 1,
    },
  }
})
export default ButtonTransition

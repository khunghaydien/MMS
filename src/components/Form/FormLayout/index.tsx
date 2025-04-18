import { Box } from '@mui/material'
import clsx from 'clsx'
import { CSSProperties, memo, ReactNode, useEffect, useRef } from 'react'

export const EXPORT_STRING = (number: Number, key: any) => {
  let text = ''
  for (let index = 0; index < Number(number); index++) {
    text = text.concat(' ' + key)
  }
  return text
}

type TypeProps = {
  children: ReactNode
  id?: any
  className?: any
  layout?: number
  padding?: number
  gap?: number
  top?: number
  width?: string | number
  bottom?: number
  styles?: CSSProperties
  display?: 'flex' | 'grid'
}
const FormLayout = ({
  children,
  layout,
  id,
  className,
  padding,
  gap,
  top,
  width,
  bottom,
  styles,
  display = 'flex',
}: TypeProps) => {
  const ref = useRef<any>()

  useEffect(() => {
    if (ref.current) {
      if (layout) {
        ref.current.style.gridTemplateColumns = EXPORT_STRING(layout, 'auto')
      } else {
        ref.current.style.gridTemplateColumns = 'auto'
      }
      //Padding và bottom
      if (padding) {
        ref.current.style.padding = `${padding}px ${padding}px ${
          bottom ? bottom : padding
        }px ${padding}px`
      }
      // gap
      if (gap) {
        ref.current.style.gap = `${gap}px`
      }
      // margin-top
      if (top) {
        ref.current.style.marginTop = `${top}px`
      }

      if (bottom) {
        ref.current.style.marginBottom = `${bottom}px`
      }
    }
  }, [ref.current])

  return (
    <Box
      style={{
        ...(styles ? styles : {}),
        display: display,
        width: width,
      }}
      id={id}
      className={clsx(className)}
      ref={ref}
    >
      {children}
    </Box>
  )
}

export default memo(FormLayout)

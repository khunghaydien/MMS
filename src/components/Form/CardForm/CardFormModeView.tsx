import CardForm from '@/components/Form/CardForm'
import { OptionItem } from '@/types'
import { cleanObject } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { ReactNode } from 'react'
import FormItem from '../FormItem/FormItem'

interface DataRenderProp extends OptionItem {
  width?: number
}

export const FieldListOptions = ({
  dataRendering,
  isVertical = true,
  className,
}: {
  dataRendering: DataRenderProp[]
  isVertical?: boolean
  className?: string
}) => {
  const classes = useStyles()
  return (
    <Box
      className={clsx(
        classes.CardFormModeViewBox,
        !isVertical && classes.horizontal,
        className
      )}
    >
      {dataRendering
        .filter(option => !!option.value)
        .map(option => (
          <Box key={option.id} className={clsx(classes.optionItem)}>
            {isVertical ? (
              <>
                <Box
                  className={clsx(classes.label)}
                  sx={cleanObject({
                    width: option.width ? `${option.width}px` : null,
                  })}
                >
                  {option.label}:
                </Box>
                <Box className={classes.value}>{option.value}</Box>
              </>
            ) : (
              <FormItem label={option.label}>
                <span className={classes.code}>{option.code}</span>
                <span className={classes.value}>{option.value}</span>
              </FormItem>
            )}
          </Box>
        ))}
    </Box>
  )
}

interface CardFormModeViewProps {
  dataRendering: DataRenderProp[]
  isLoading?: boolean
  title: string
  isVertical?: boolean
  isStatus?: boolean
  childrenEndHead?: ReactNode
}

const CardFormModeView = ({
  dataRendering,
  isLoading,
  title,
  isVertical = true,
  isStatus = false,
  childrenEndHead,
}: CardFormModeViewProps) => {
  return (
    <CardForm
      title={title}
      isLoading={!!isLoading}
      childrenEndHead={childrenEndHead}
    >
      <FieldListOptions dataRendering={dataRendering} isVertical={isVertical} />
    </CardForm>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  CardFormModeViewBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  horizontal: {
    flexWrap: 'wrap',
    flexDirection: 'initial',
    gap: theme.spacing(6),
    rowGap: theme.spacing(2),
    '& .horizontalLabel': {
      width: 'auto',
    },
  },
  optionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    minWidth: '120px',
  },
  label: {
    width: theme.spacing(15),
    fontWeight: 700,
    fontSize: 14,
  },
  code: {
    fontWeight: 700,
  },
  value: {
    lineHeight: 1.2,
    wordBreak: 'break-all',
  },
}))

export default CardFormModeView

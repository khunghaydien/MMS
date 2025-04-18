import informationImage from '@/ui/images/info.svg'
import { AddBox, IndeterminateCheckBox } from '@mui/icons-material'
import { Box, Paper, Theme, Tooltip } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useState } from 'react'
import StatusItem, { IStatusType } from '../common/StatusItem'

interface CardFormToggleBodyProps {
  className?: string
  title: string
  children: any
  TooltipContent?: any
  HeaderRight?: any
  status?: IStatusType
  HeaderCenter?: any
  open?: boolean
  setOpen?: (val: boolean) => void
}

const CardFormToggleBody = ({
  className,
  title,
  children,
  TooltipContent,
  HeaderRight,
  status,
  HeaderCenter,
  open = true,
  setOpen,
}: CardFormToggleBodyProps) => {
  const classes = useStyles()

  const [showBody, setShowBody] = useState(open)

  const toggle = () => {
    setShowBody(!showBody)
    !!setOpen && setOpen(!showBody)
  }

  return (
    <Paper
      elevation={2}
      className={clsx(classes.RootCardFormToggleBody, className)}
    >
      <Box className={classes.header}>
        <Box className={classes.titleBox}>
          <Box className={classes.toggle} onClick={toggle}>
            {showBody ? <IndeterminateCheckBox /> : <AddBox />}
          </Box>
          <Box className={classes.title}>{title}</Box>
          {!!TooltipContent && (
            <Tooltip
              classes={{ tooltip: classes.tooltipBox }}
              title={TooltipContent}
            >
              <img
                className={classes.iconI}
                src={informationImage}
                alt="information"
              />
            </Tooltip>
          )}
          {!!status && (
            <StatusItem className={classes.statusItem} typeStatus={status} />
          )}
        </Box>
        {!!HeaderCenter && <Box>{HeaderCenter}</Box>}
        {!!HeaderRight && <Box>{HeaderRight}</Box>}
      </Box>
      {showBody && <Box className={classes.body}>{children}</Box>}
    </Paper>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootCardFormToggleBody: {
    width: '100%',
    borderRadius: 0,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottom: `1px solid ${theme.color.grey.grayE}`,
    minHeight: '65px',
  },
  titleBox: {
    display: 'flex',
    gap: theme.spacing(0.5),
    alignItems: 'center',
  },
  title: { fontSize: 18, fontWeight: 700, color: theme.color.blue.primary },
  body: {
    padding: 16,
  },
  toggle: {
    '& svg': {
      color: theme.color.blue.primary,
      cursor: 'pointer',
    },
    height: theme.spacing(3),
  },
  tooltipBox: {
    backgroundColor: '#fff !important',
  },
  iconI: {
    width: '18px',
    marginTop: '-10px',
    marginLeft: '5px',
    cursor: 'pointer',
  },
  statusItem: {
    marginLeft: theme.spacing(3),
  },
}))

export default CardFormToggleBody

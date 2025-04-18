import { getAbbreviations, invertColor } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import moment from 'moment'
import { useCallback } from 'react'
import String2Color from 'string-to-color'
import ProjectActivityEventIcon from './ProjectActivityEventIcon'
import { Log } from './ProjectActivityLog'
import ProjectActivityObjectIcon from './ProjectActivityObjectIcon'

interface ProjectActivityLogListItemProps {
  log: Log
  onClick: (log: Log) => void
}

const ProjectActivityLogListItem = ({
  log,
  onClick,
}: ProjectActivityLogListItemProps) => {
  const colorBackground = String2Color(log.staff?.name || 'Staff Name')
  const colorShortName = invertColor(colorBackground)
  const shortName = getAbbreviations(log.staff?.name || 'Staff Name')
  const classes = useStyles({
    background: colorBackground,
    color: colorShortName,
  })

  const click = useCallback(() => {
    onClick(log)
  }, [])

  return (
    <Box className={classes.RootProjectActivityLogListItem} onClick={click}>
      <Box className={classes.logInfo}>
        <Box className={classes.avatar}>{shortName || 'A'}</Box>
        <Box>
          <Box
            className={classes.description}
            dangerouslySetInnerHTML={{
              __html: log.description,
            }}
          />
          <Box className={classes.boxModified}>
            <ProjectActivityEventIcon event={log.event} />
            <Box className={classes.modified}>
              {moment(log.createdAt).format('DD/MMM/YY HH:mm:ss')}
            </Box>
          </Box>
        </Box>
      </Box>
      <ProjectActivityObjectIcon object={log.object} />
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootProjectActivityLogListItem: {
    borderBottom: `1px solid ${theme.color.grey.secondary}`,
    paddingBottom: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    alignItems: 'flex-start',
    padding: theme.spacing(1),
    cursor: 'pointer',
    minHeight: '59px',
    '&:hover': {
      borderRadius: '4px',
      background: theme.color.grey.tertiary,
      border: `1px solid ${theme.color.grey.secondary}`,
    },
  },
  logInfo: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
  },
  avatar: {
    minWidth: '40px',
    height: '40px',
    background: ({ background }: any) => background,
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: ({ color }: any) => color,
    marginRight: '10px',
    position: 'relative',
  },
  description: {
    fontSize: 14,
  },
  boxModified: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginTop: theme.spacing(0.5),
  },
  modified: {
    fontSize: 12,
  },
}))

export default ProjectActivityLogListItem

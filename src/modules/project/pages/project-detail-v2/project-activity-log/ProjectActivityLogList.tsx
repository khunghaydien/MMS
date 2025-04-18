import NoData from '@/components/common/NoData'
import CardFormSeeMore from '@/components/Form/CardFormSeeMore'
import LoadingSkeleton from '@/components/loading/LoadingSkeleton'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Log } from './ProjectActivityLog'
import ProjectActivityLogListItem from './ProjectActivityLogListItem'

interface ProjectActivityLogListProps {
  logList: Log[]
  loading: boolean
  onClick: (log: Log) => void
}

const ProjectActivityLogList = ({
  logList,
  loading,
  onClick,
}: ProjectActivityLogListProps) => {
  const classes = useStyles()

  return (
    <Box className={classes.RootProjectActivityLogList}>
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <CardFormSeeMore hideHeader>
          {!!logList.length ? (
            <Box className={classes.logList}>
              {logList.map(log => (
                <ProjectActivityLogListItem
                  key={log.id}
                  log={log}
                  onClick={onClick}
                />
              ))}
            </Box>
          ) : (
            <NoData />
          )}
        </CardFormSeeMore>
      )}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootProjectActivityLogList: {},
  logList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
}))

export default ProjectActivityLogList

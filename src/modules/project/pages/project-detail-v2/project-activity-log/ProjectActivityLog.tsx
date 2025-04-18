import FormItem from '@/components/Form/FormItem/FormItem'
import InputAutocomplete from '@/components/inputs/InputAutocomplete'
import InputDropdown from '@/components/inputs/InputDropdown'
import { NS_PROJECT } from '@/const/lang.const'
import {
  LIMIT_DEFAULT,
  PAGE_CURRENT_DEFAULT,
  ROWS_PER_PAGE_OPTIONS,
} from '@/const/table.const'
import {
  ACTIVITY_LOG_TIME_VALUES,
  PROJECT_ACTIVITY_LOG_EVENT_VALUES,
  PROJECT_ACTIVITY_LOG_OBJECT_VALUES,
} from '@/modules/project/const'
import {
  setKpiDetailMenu,
  setProjectDashboardScreenDetail,
} from '@/modules/project/reducer/project'
import { getProjectActivityLog } from '@/modules/project/reducer/thunk'
import { AppDispatch } from '@/store'
import { OptionItem, Pagination } from '@/types'
import { Box, TablePagination, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
  PROJECT_DASHBOARD_TAB,
  PROJECT_GENERAL_INFORMATION_TAB,
  PROJECT_RESOURCE_ALLOCATION_TAB,
} from '../ProjectDetail'
import ProjectActivityLogList from './ProjectActivityLogList'

interface ProjectActivityLogState extends Pagination {
  event: OptionItem[]
  time: string | number
  object: OptionItem[]
}

export interface Log {
  id: number
  createdAt: number
  staff: {
    id: string | number
    name: string
    code: string
    email: string
    startDate: null
    endDate: null
  }
  object: number
  event: number
  description: string
}

interface ProjectActivityLogProps {
  changeRootProjectTab: Dispatch<SetStateAction<number>>
}

const ProjectActivityLog = ({
  changeRootProjectTab,
}: ProjectActivityLogProps) => {
  const classes = useStyles()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const ALL_EVENT_OPTION = useMemo(() => {
    return {
      id: '*',
      value: '*',
      label: i18('TXT_ALL_EVENTS') as string,
    }
  }, [i18])

  const ALL_OBJECT_OPTION = useMemo(() => {
    return {
      id: '*',
      value: '*',
      label: i18('TXT_ALL_OBJECTS') as string,
    }
  }, [i18])

  const [loading, setLoading] = useState(false)
  const [queries, setQueries] = useState<ProjectActivityLogState>({
    pageSize: LIMIT_DEFAULT,
    pageNum: PAGE_CURRENT_DEFAULT,
    event: [ALL_EVENT_OPTION],
    time: ACTIVITY_LOG_TIME_VALUES.LAST_24_HOURS,
    object: [ALL_OBJECT_OPTION],
  })
  const [totalElements, setTotalElements] = useState(0)
  const [logList, setLogList] = useState<Log[]>([])

  const eventOptions: OptionItem[] = [
    ALL_EVENT_OPTION,
    {
      id: PROJECT_ACTIVITY_LOG_EVENT_VALUES.ADD,
      value: PROJECT_ACTIVITY_LOG_EVENT_VALUES.ADD,
      label: i18('LB_ADD') as string,
    },
    {
      id: PROJECT_ACTIVITY_LOG_EVENT_VALUES.UPDATE,
      value: PROJECT_ACTIVITY_LOG_EVENT_VALUES.UPDATE,
      label: i18('LB_UPDATE') as string,
    },
    {
      id: PROJECT_ACTIVITY_LOG_EVENT_VALUES.REMOVE,
      value: PROJECT_ACTIVITY_LOG_EVENT_VALUES.REMOVE,
      label: i18('LB_REMOVE') as string,
    },
    {
      id: PROJECT_ACTIVITY_LOG_EVENT_VALUES.DELIVER,
      value: PROJECT_ACTIVITY_LOG_EVENT_VALUES.DELIVER,
      label: i18Project('TXT_DELIVER') as string,
    },
  ]

  const timeOptions: OptionItem[] = [
    {
      id: '*',
      value: '*',
      label: i18('TXT_ALL_TIME') as string,
    },
    {
      id: ACTIVITY_LOG_TIME_VALUES.LAST_24_HOURS,
      value: ACTIVITY_LOG_TIME_VALUES.LAST_24_HOURS,
      label: i18('TXT_LAST_24_HOURS') as string,
    },
    {
      id: ACTIVITY_LOG_TIME_VALUES.LAST_3_DAYS,
      value: ACTIVITY_LOG_TIME_VALUES.LAST_3_DAYS,
      label: i18('TXT_LAST_3_DAYS') as string,
    },
    {
      id: ACTIVITY_LOG_TIME_VALUES.LAST_WEEK,
      value: ACTIVITY_LOG_TIME_VALUES.LAST_WEEK,
      label: i18('TXT_LAST_WEEK') as string,
    },
    {
      id: ACTIVITY_LOG_TIME_VALUES.LAST_MONTH,
      value: ACTIVITY_LOG_TIME_VALUES.LAST_MONTH,
      label: i18('TXT_LAST_MONTH') as string,
    },
    {
      id: ACTIVITY_LOG_TIME_VALUES.LAST_3_MONTHS,
      value: ACTIVITY_LOG_TIME_VALUES.LAST_3_MONTHS,
      label: i18('TXT_LAST_3_MONTHS') as string,
    },
    {
      id: ACTIVITY_LOG_TIME_VALUES.LAST_6_MONTHS,
      value: ACTIVITY_LOG_TIME_VALUES.LAST_6_MONTHS,
      label: i18('TXT_LAST_6_MONTHS') as string,
    },
    {
      id: ACTIVITY_LOG_TIME_VALUES.LAST_YEAR,
      value: ACTIVITY_LOG_TIME_VALUES.LAST_YEAR,
      label: i18('TXT_LAST_YEAR') as string,
    },
  ]

  const objectOptions: OptionItem[] = [
    ALL_OBJECT_OPTION,
    {
      id: PROJECT_ACTIVITY_LOG_OBJECT_VALUES.GENERAL_INFORMATION,
      value: PROJECT_ACTIVITY_LOG_OBJECT_VALUES.GENERAL_INFORMATION,
      label: i18('TXT_GENERAL_INFORMATION') as string,
    },
    {
      id: PROJECT_ACTIVITY_LOG_OBJECT_VALUES.KPI_CSS,
      value: PROJECT_ACTIVITY_LOG_OBJECT_VALUES.KPI_CSS,
      label: i18Project('TXT_KPI_CSS') as string,
    },
    {
      id: PROJECT_ACTIVITY_LOG_OBJECT_VALUES.KPI_TIMELINESS,
      value: PROJECT_ACTIVITY_LOG_OBJECT_VALUES.KPI_TIMELINESS,
      label: i18Project('TXT_KPI_TIMELINESS') as string,
    },
    {
      id: PROJECT_ACTIVITY_LOG_OBJECT_VALUES.KPI_PCV,
      value: PROJECT_ACTIVITY_LOG_OBJECT_VALUES.KPI_PCV,
      label: i18Project('TXT_KPI_PCV') as string,
    },
    {
      id: PROJECT_ACTIVITY_LOG_OBJECT_VALUES.KPI_BONUS_AND_PENALTY,
      value: PROJECT_ACTIVITY_LOG_OBJECT_VALUES.KPI_BONUS_AND_PENALTY,
      label: i18Project('TXT_KPI_BONUS_AND_PENALTY') as string,
    },
    {
      id: PROJECT_ACTIVITY_LOG_OBJECT_VALUES.RESOURCE_ALLOCATION,
      value: PROJECT_ACTIVITY_LOG_OBJECT_VALUES.RESOURCE_ALLOCATION,
      label: i18Project('TXT_RESOURCE_ALLOCATION') as string,
    },
  ]

  const onSelectOptionsChange = (payload: {
    optionsSelected: OptionItem[]
    field: string
    listOptions: OptionItem[]
  }) => {
    const { optionsSelected, field, listOptions } = payload
    const allOption = listOptions[0]
    const isChooseAll =
      (optionsSelected.length === 1 && optionsSelected[0]?.id === '*') ||
      (optionsSelected.length > 1 &&
        optionsSelected[optionsSelected.length - 1]?.id === '*')

    if (isChooseAll) {
      setQueries({
        ...queries,
        [field]: [allOption],
      })
    } else if (optionsSelected.length > 1 && optionsSelected[0]?.id === '*') {
      setQueries({
        ...queries,
        [field]: optionsSelected.filter(option => option.id !== '*'),
      })
    } else {
      setQueries({
        ...queries,
        [field]: optionsSelected,
      })
    }
  }

  const clickActivityLogItem = (log: Log) => {
    if (log.object === PROJECT_ACTIVITY_LOG_OBJECT_VALUES.GENERAL_INFORMATION) {
      changeRootProjectTab(PROJECT_GENERAL_INFORMATION_TAB)
      return
    }
    if (log.object === PROJECT_ACTIVITY_LOG_OBJECT_VALUES.RESOURCE_ALLOCATION) {
      changeRootProjectTab(PROJECT_RESOURCE_ALLOCATION_TAB)
      return
    }

    changeRootProjectTab(PROJECT_DASHBOARD_TAB)
    setTimeout(() => {
      dispatch(setProjectDashboardScreenDetail('KPI_INFORMATION'))
    }, 300)
    if (log.object === PROJECT_ACTIVITY_LOG_OBJECT_VALUES.KPI_CSS) {
      dispatch(setKpiDetailMenu('quality'))
    }
    if (log.object === PROJECT_ACTIVITY_LOG_OBJECT_VALUES.KPI_PCV) {
      dispatch(setKpiDetailMenu('process'))
    }
    if (log.object === PROJECT_ACTIVITY_LOG_OBJECT_VALUES.KPI_TIMELINESS) {
      dispatch(setKpiDetailMenu('delivery'))
    }
    if (
      log.object === PROJECT_ACTIVITY_LOG_OBJECT_VALUES.KPI_BONUS_AND_PENALTY
    ) {
      dispatch(setKpiDetailMenu('plusAndMinus'))
    }
  }

  const onPageChange = (_: unknown, newPage: number) => {
    setQueries({
      ...queries,
      pageNum: newPage + 1,
    })
  }

  const onPageSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQueries({
      ...queries,
      pageSize: +e.target.value,
    })
  }

  const getProjectActivityLogAPI = () => {
    setTimeout(() => {
      setLoading(true)
    })
    const queryParameters = {
      ...queries,
      time: queries.time !== '*' ? queries.time : null,
      event:
        queries.event[0]?.id !== '*'
          ? queries.event.map((item: OptionItem) => item.value)?.join(',')
          : null,
      object:
        queries.object[0]?.id !== '*'
          ? queries.object.map((item: OptionItem) => item.value)?.join(',')
          : null,
    }
    dispatch(
      getProjectActivityLog({
        projectId: params.projectId as string,
        queryParameters,
      })
    )
      .unwrap()
      .then(({ data }: AxiosResponse) => {
        setTotalElements(data.totalElements)
        setLogList(data.content)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getProjectActivityLogAPI()
  }, [queries])

  return (
    <Box className={classes.RootProjectActivityLog}>
      <Box className={classes.listFilters}>
        <Box width={200}>
          <InputDropdown
            label={i18('TXT_TIME')}
            placeholder={i18('PLH_SELECT_TIME')}
            value={queries.time}
            listOptions={timeOptions}
            onChange={(value: string) =>
              setQueries({ ...queries, time: value })
            }
          />
        </Box>
        <Box className={classes.filterItem}>
          <FormItem label={i18('TXT_OBJECT')}>
            <InputAutocomplete
              maxWidth="100%"
              placeholder={i18('PLH_SELECT_OBJECT')}
              listOptions={objectOptions}
              defaultTags={queries.object}
              onChange={(options: OptionItem[]) =>
                onSelectOptionsChange({
                  optionsSelected: options,
                  field: 'object',
                  listOptions: objectOptions,
                })
              }
            />
          </FormItem>
        </Box>
        <Box className={classes.filterItem}>
          <FormItem label={i18('TXT_EVENT')}>
            <InputAutocomplete
              maxWidth="405px"
              placeholder={i18('PLH_SELECT_EVENT')}
              listOptions={eventOptions}
              defaultTags={queries.event}
              onChange={(options: OptionItem[]) =>
                onSelectOptionsChange({
                  optionsSelected: options,
                  field: 'event',
                  listOptions: eventOptions,
                })
              }
            />
          </FormItem>
        </Box>
      </Box>
      <ProjectActivityLogList
        logList={logList}
        loading={loading}
        onClick={clickActivityLogItem}
      />
      {!!logList.length && (
        <TablePagination
          component="div"
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          count={totalElements}
          rowsPerPage={queries.pageSize}
          page={queries.pageNum - 1}
          onPageChange={onPageChange}
          onRowsPerPageChange={onPageSizeChange}
        />
      )}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootProjectActivityLog: {},
  listFilters: {
    display: 'flex',
    gap: theme.spacing(3),
    marginBottom: theme.spacing(2),
    flexWrap: 'wrap',
    alignItems: 'flex-end',
  },
  filterItem: {
    flex: 1,
  },
}))

export default ProjectActivityLog

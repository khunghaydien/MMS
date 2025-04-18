import CardForm from '@/components/Form/CardForm'
import FormItem from '@/components/Form/FormItem/FormItem'
import CardAvatar from '@/components/common/CardAvatar'
import InputAutocomplete from '@/components/inputs/InputAutocomplete'
import InputDropdown from '@/components/inputs/InputDropdown'
import CommonTable from '@/components/table/CommonTable'
import { NS_PROJECT } from '@/const/lang.const'
import { LIMIT_DEFAULT, PAGE_CURRENT_DEFAULT } from '@/const/table.const'
import {
  ACTIVITY_LOG_TIME_VALUES,
  DELIVERY_ACTIVITY_LOG_EVENT_LABELS,
  DELIVERY_ACTIVITY_LOG_EVENT_VALUES,
  DELIVERY_ACTIVITY_LOG_OBJECT_TYPE_LABELS,
} from '@/modules/project/const'
import { ProjectService } from '@/modules/project/services'
import commonService from '@/services/common.service'
import {
  IStaffInfo,
  OptionItem,
  Pagination,
  SortChangePayload,
  TableHeaderColumn,
} from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

interface DeliveryActivityLogState extends Pagination {
  time: string | number
  event: OptionItem[]
  milestone: OptionItem[]
  person: OptionItem[]
  orderBy: string
  sortBy: string
}

interface ActivityLogItemApi {
  id: number
  time: number
  milestone: string
  person: IStaffInfo
  event: number
  objectType: number
  description: string
}

interface DeliveryActivityLogProps {
  countReloadApi: number
}

const DeliveryActivityLog = ({ countReloadApi }: DeliveryActivityLogProps) => {
  const classes = useStyles()
  const params = useParams()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const ALL_EVENT_OPTION = useMemo(() => {
    return {
      id: '*',
      value: '*',
      label: i18('TXT_ALL_EVENTS') as string,
    }
  }, [i18])

  const ALL_MILESTONE_OPTION = useMemo(() => {
    return {
      id: '*',
      value: '*',
      label: i18Project('TXT_ALL_MILESTONE') as string,
    }
  }, [i18])
  const ALL_PERSON_OPTION = useMemo(() => {
    return {
      id: '*',
      value: '*',
      label: i18Project('TXT_ALL_PERSON') as string,
    }
  }, [i18])

  const initColumns = useMemo(() => {
    return [
      {
        id: 'time',
        label: i18('TXT_TIME'),
        sortBy: 'time',
        orderBy: 'desc',
      },
      {
        id: 'milestone',
        label: i18Project('TXT_MILESTONE'),
        sortBy: 'milestone',
        orderBy: 'desc',
      },
      {
        id: 'person',
        label: i18('TXT_PERSON'),
      },
      {
        id: 'event',
        label: i18('TXT_EVENT'),
      },
      {
        id: 'objectType',
        label: i18('TXT_OBJECT'),
      },
      {
        id: 'description',
        label: i18('LB_DESCRIPTION'),
      },
    ] as TableHeaderColumn[]
  }, [i18])

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

  const eventOptions: OptionItem[] = [
    ALL_EVENT_OPTION,
    {
      id: DELIVERY_ACTIVITY_LOG_EVENT_VALUES.EDIT,
      value: DELIVERY_ACTIVITY_LOG_EVENT_VALUES.EDIT,
      label: i18('LB_EDIT') as string,
    },
    {
      id: DELIVERY_ACTIVITY_LOG_EVENT_VALUES.ADD,
      value: DELIVERY_ACTIVITY_LOG_EVENT_VALUES.ADD,
      label: i18('LB_ADD') as string,
    },
    {
      id: DELIVERY_ACTIVITY_LOG_EVENT_VALUES.DELIVER,
      value: DELIVERY_ACTIVITY_LOG_EVENT_VALUES.DELIVER,
      label: i18Project('TXT_DELIVER') as string,
    },
    {
      id: DELIVERY_ACTIVITY_LOG_EVENT_VALUES.DELETE,
      value: DELIVERY_ACTIVITY_LOG_EVENT_VALUES.DELETE,
      label: i18('LB_DELETE') as string,
    },
  ]

  const [loading, setLoading] = useState(false)
  const [totalElements, setTotalElements] = useState(0)
  const [activityLogList, setActivityLogList] = useState<ActivityLogItemApi[]>(
    []
  )
  const [columns, setColumns] = useState(initColumns)
  const [queries, setQueries] = useState<DeliveryActivityLogState>({
    pageSize: LIMIT_DEFAULT,
    pageNum: PAGE_CURRENT_DEFAULT,
    time: ACTIVITY_LOG_TIME_VALUES.LAST_24_HOURS,
    milestone: [ALL_MILESTONE_OPTION],
    event: [ALL_EVENT_OPTION],
    person: [ALL_PERSON_OPTION],
    orderBy: 'desc',
    sortBy: 'time',
  })
  const [milestoneOptions, setMilestoneOptions] = useState<OptionItem[]>([
    ALL_MILESTONE_OPTION,
  ])
  const [personOptions, setPersonOptions] = useState<OptionItem[]>([
    ALL_PERSON_OPTION,
  ])

  const rows = useMemo(() => {
    return activityLogList.map(activityLog => ({
      id: activityLog.id,
      time: moment(activityLog.time).format('DD/MM/YYYY, HH:mm:ss'),
      milestone: activityLog.milestone,
      person: (
        <CardAvatar
          info={{
            name: activityLog.person?.name || 'Admin',
            position: activityLog.person?.code || 'MOR',
          }}
        />
      ),
      event: DELIVERY_ACTIVITY_LOG_EVENT_LABELS[activityLog.event],
      objectType:
        DELIVERY_ACTIVITY_LOG_OBJECT_TYPE_LABELS[activityLog.objectType],
      description: activityLog.description,
    }))
  }, [activityLogList])

  const onSortChange = ({
    nextOrderBy,
    sortBy,
    newColumns,
  }: SortChangePayload) => {
    setColumns(newColumns)
    const newQueries = {
      ...queries,
      orderBy: nextOrderBy,
      sortBy,
    }
    setQueries(newQueries)
  }

  const onPageChange = (newPage: number) => {
    setQueries({
      ...queries,
      pageNum: newPage,
    })
  }

  const onPageSizeChange = (newPageSize: number) => {
    setQueries({
      ...queries,
      pageSize: newPageSize,
      pageNum: 1,
    })
  }

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

  const fillDataList = ({ data }: AxiosResponse) => {
    const { totalElements, content } = data
    setTotalElements(totalElements)
    setActivityLogList(content)
  }

  const getDeliveryActivityLog = () => {
    setTimeout(() => {
      setLoading(true)
    })
    const payload = {
      projectId: params.projectId as string,
      queryParameters: {
        ...queries,
        allPersons:
          queries.person.length === personOptions.length - 1 ||
          queries.person[0]?.id === '*' ||
          !queries.person.length,
        personAdmin: queries.person.some(option => option.id === 'admin'),
        time: queries.time !== '*' ? queries.time : null,
        milestone:
          queries.milestone[0]?.id !== '*'
            ? queries.milestone.map((item: OptionItem) => item.value)?.join(',')
            : null,
        event:
          queries.event[0]?.id !== '*'
            ? queries.event.map((item: OptionItem) => item.value)?.join(',')
            : null,
        person:
          queries.person[0]?.id !== '*' && queries.person[0]?.id !== 'admin'
            ? queries.person
                .filter(option => option.id !== 'admin')
                .map((item: OptionItem) => item.value)
                ?.join(',')
            : null,
      },
    }
    ProjectService.getDeliveryActivityLog(payload)
      .then(fillDataList)
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getDeliveryActivityLog()
  }, [queries])

  useEffect(() => {
    commonService
      .getMilestoneProject(params.projectId as string)
      .then(({ data }: AxiosResponse) => {
        const { content } = data
        setMilestoneOptions([
          ALL_MILESTONE_OPTION,
          ...content.map((item: any) => ({
            id: +item.id,
            value: +item.id,
            label: item.name,
          })),
        ])
      })
    commonService
      .getPersonActivityLogMilestoneProject(params.projectId as string)
      .then(({ data }: AxiosResponse) => {
        const { content } = data
        setPersonOptions([
          ALL_PERSON_OPTION,
          ...content.map((item: any) => ({
            id: +item.id || 'admin',
            value: +item.id || 'admin',
            label: item.name,
          })),
        ])
      })
  }, [countReloadApi])

  useEffect(() => {
    if (countReloadApi) {
      getDeliveryActivityLog()
    }
  }, [countReloadApi])

  return (
    <CardForm
      title={i18Project('TXT_ACTIVITY_LOG')}
      className={classes.RootDeliveryActivityLog}
    >
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
          <FormItem label={i18Project('TXT_MILESTONE')}>
            <InputAutocomplete
              maxWidth="405px"
              placeholder={i18Project('PLH_SELECT_MILESTONE')}
              listOptions={milestoneOptions}
              defaultTags={queries.milestone}
              onChange={(options: OptionItem[]) =>
                onSelectOptionsChange({
                  optionsSelected: options,
                  field: 'milestone',
                  listOptions: milestoneOptions,
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
        <Box className={classes.filterItem}>
          <FormItem label={i18('TXT_PERSON')}>
            <InputAutocomplete
              maxWidth="405px"
              placeholder={i18('PLH_SELECT_PERSON')}
              listOptions={personOptions}
              defaultTags={queries.person}
              onChange={(options: OptionItem[]) =>
                onSelectOptionsChange({
                  optionsSelected: options,
                  field: 'person',
                  listOptions: personOptions,
                })
              }
            />
          </FormItem>
        </Box>
      </Box>
      <CommonTable
        loading={loading}
        columns={columns}
        rows={rows}
        onSortChange={onSortChange}
        pagination={{
          pageNum: queries.pageNum,
          pageSize: queries.pageSize,
          totalElements: totalElements,
          onPageChange,
          onPageSizeChange,
        }}
      />
    </CardForm>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
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
  RootDeliveryActivityLog: {
    marginTop: 'unset !important',
  },
}))

export default DeliveryActivityLog

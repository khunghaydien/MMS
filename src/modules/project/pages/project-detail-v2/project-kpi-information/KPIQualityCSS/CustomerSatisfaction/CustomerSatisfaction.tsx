import ConditionalRender from '@/components/ConditionalRender'
import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import CardFormToggleBody from '@/components/Form/CardFormToggleBody'
import ButtonActions from '@/components/buttons/ButtonActions'
import StatusItem, { IStatusType } from '@/components/common/StatusItem'
import InputSearch from '@/components/inputs/InputSearch'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import CommonTable from '@/components/table/CommonTable'
import { ApiConstant } from '@/const'
import { INPUT_TIME_DELAY } from '@/const/app.const'
import { NS_PROJECT } from '@/const/lang.const'
import { LIMIT_DEFAULT } from '@/const/table.const'
import {
  CSS_STATUS_LABELS,
  CSS_STATUS_VALUES,
  SURVEY_FORM_STATE_LABELS,
  SURVEY_FROM_STATE_VALUES,
  SURVEY_TYPE_VALUES,
} from '@/modules/project/const'
import { projectSelector } from '@/modules/project/reducer/project'
import {
  getAllSurveyNames,
  getAveragePointsSurvey,
  getListSurvey,
} from '@/modules/project/reducer/thunk'
import { ProjectService } from '@/modules/project/services'
import { alertSuccess, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { OptionItem, TableHeaderColumn } from '@/types'
import { themeColors } from '@/ui/mui/v5'
import { formatDate } from '@/utils'
import {
  Delete,
  Edit,
  KeyboardArrowDown,
  Link,
  Visibility,
} from '@mui/icons-material'
import { Box, Button, TableCell, TableRow, Theme, Tooltip } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import clsx from 'clsx'
import { useFormik } from 'formik'
import _ from 'lodash'
import {
  Fragment,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import KPIMetricsTooltip from '../../../project-dashboard-detail/KPIMetricsTooltip'
import useKPIValidation from '../../useKPIValidation'
import ModalCreateNewSurvey from './ModalCreateNewSurvey'
import ModalEditSurvey from './ModalEditSurvey'
import ModalSurveySuccessfullyCreated from './ModalSurveySuccessfullyCreated'
import ModalEvaluateProjectBase from './project-base/ModalEvaluateProjectBase'
import ModalResultProjectBase from './project-base/ModalResultProjectBase'
import ModalEvaluateProjectLabo from './project-labo/ModalEvaluateProjectLabo'
import ModalResultProjectLabo from './project-labo/ModalResultProjectLabo'

export interface SurveyFormValues {
  name: string
  createdDate: Date | null
  closedDate: Date | null
  morRepresentative: any
  customerRepresentative: string
  language: string
  brseAvailable?: string
  project: {
    name: string
    startDate: Date | null
    endDate: Date | null
  }
}

interface ListSurveyItemApi {
  closedDate: number
  createdAt: number
  customerSurveyId: number | null
  formState: number
  surveyId: number
  surveyName: string
  surveyPoint: number | null
  surveyStatus: number
  surveyType: number
}

export const getCSSStatus = (statusValue: number) => {
  let status: IStatusType = {
    label: '',
    color: '',
  }
  switch (statusValue) {
    case CSS_STATUS_VALUES.ABNORMAL:
      status = {
        label: CSS_STATUS_LABELS[CSS_STATUS_VALUES.ABNORMAL],
        color: 'earthy',
      }
      break
    case CSS_STATUS_VALUES.GOOD:
      status = {
        label: CSS_STATUS_LABELS[CSS_STATUS_VALUES.GOOD],
        color: 'green',
      }
      break
    case CSS_STATUS_VALUES.ACCEPTABLE:
      status = {
        label: CSS_STATUS_LABELS[CSS_STATUS_VALUES.ACCEPTABLE],
        color: 'blue',
      }
      break
    case CSS_STATUS_VALUES.CONCERNING:
      status = {
        label: CSS_STATUS_LABELS[CSS_STATUS_VALUES.CONCERNING],
        color: 'orange',
      }
      break
    case CSS_STATUS_VALUES.NOT_GOOD:
      status = {
        label: CSS_STATUS_LABELS[CSS_STATUS_VALUES.NOT_GOOD],
        color: 'red',
      }
      break
    default:
      status = {
        label: 'N/A',
        color: 'grey',
      }
  }
  return status
}

export const getSurveyURL = (survey: any) => {
  const origin =
    ApiConstant.ENVIRONMENT === 'production'
      ? 'https://ec2-18-136-170-35.ap-southeast-1.compute.amazonaws.com'
      : window.location.origin
  return `${origin}/survey/${survey.id || survey.surveyId}/project/${
    survey.project?.id || survey.projectId
  }`
}

const CustomerSatisfaction = () => {
  const classes = useStyles()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const createNewSurvayOptions = [
    {
      id: SURVEY_TYPE_VALUES.PROJECT_BASE,
      value: SURVEY_TYPE_VALUES.PROJECT_BASE,
      label: i18Project('TXT_PROJECT_BASE_LABO_HOST_SURVEY'),
    },
    {
      id: SURVEY_TYPE_VALUES.PROJECT_LABO,
      value: SURVEY_TYPE_VALUES.PROJECT_LABO,
      label: i18Project('TXT_LABO_TASK_BASE_SURVEY'),
    },
  ]

  const columns: TableHeaderColumn[] = [
    {
      id: 'no',
      label: i18('LB_NO'),
    },
    {
      id: 'surveyName',
      label: i18Project('TXT_SURVEY_NAME'),
      ellipsisNumber: 50,
    },
    {
      id: 'type',
      label: i18Project('LB_SURVEY_TYPE'),
    },
    {
      id: 'createdDate',
      label: i18('TXT_CREATED_DATE'),
    },
    {
      id: 'closedDate',
      label: i18Project('LB_CLOSE_DATE'),
    },
    {
      id: 'surveyPoints',
      label: i18Project('TXT_SURVEY_POINTS'),
    },
    {
      id: 'status',
      label: i18('LB_STATUS'),
    },
    {
      id: 'formState',
      label: i18Project('LB_FORM_STATE'),
    },
    {
      id: 'result',
      label: i18('LB_RESULT'),
    },
    {
      id: 'action',
      label: i18('LB_ACTION'),
      align: 'right',
    },
  ]

  const {
    generalInfo,
    nameSurveyProject,
    permissionProjectKPI,
    kpiRangeDateFilter,
  } = useSelector(projectSelector)
  const { surveyFormValidation } = useKPIValidation({ nameSurveyProject })

  const [optionCreateNewSurvey, setOptionCreateNewSurvey] = useState(0)
  const [queries, setQueries] = useState({
    surveyName: '',
    pageSize: LIMIT_DEFAULT,
    pageNum: 1,
    startDate: kpiRangeDateFilter.startDate || generalInfo.startDate,
    endDate: kpiRangeDateFilter.endDate || generalInfo.endDate,
  })
  const [valueSearch, setValueSearch] = useState('')
  const [openModalDeleteSurvey, setOpenModalDeleteSurvey] = useState(false)
  const [surveySelected, setSurveySelected] = useState<any>({})
  const [openModalPreviewForm, setOpenModalPreviewForm] = useState(false)
  const [modeModal, setModeModal] = useState<'preview' | 'edit'>('preview')
  const [openModalSuccessfully, setOpenModalSuccessfully] = useState(false)
  const [openModalCreateSurvey, setOpenModalCreateSurvey] = useState(false)
  const [openModalResult, setOpenModalResult] = useState(false)
  const [openModalEditSurvey, setOpenModalEditSurvey] = useState(false)
  const [surveyURL, setSurveyURL] = useState('')
  const [loadingListSurvey, setLoadingListSurvey] = useState(false)
  const [totalElements, setTotalElements] = useState(0)
  const [listSurvey, setListSurvey] = useState<ListSurveyItemApi[]>([])
  const [copying, setCopying] = useState(false)
  const [averagePoints, setAveragePoints] = useState(0)
  const [averageStatus, setAverageStatus] = useState(0)
  const [overallStatus, setOverallStatus] = useState(0)

  const copyingTimeout = useRef<NodeJS.Timeout | null>(null)

  const toggleCopy = useCallback((status: boolean) => {
    if (status) {
      setCopying(status)
    } else {
      copyingTimeout.current = setTimeout(() => {
        setCopying(false)
      }, 500)
    }
  }, [])

  const onCopy = async (surveyURL: string) => {
    toggleCopy(true)
    if (copyingTimeout.current) {
      clearTimeout(copyingTimeout.current)
    }
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(surveyURL).finally(() => {
        toggleCopy(false)
      })
    } else {
      const textArea = document.createElement('textarea')
      textArea.value = surveyURL
      textArea.style.position = 'absolute'
      textArea.style.left = '-999999px'
      document.body.prepend(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
      } catch (error) {
        console.error(error)
      } finally {
        textArea.remove()
        toggleCopy(false)
      }
    }
  }

  const initialFormDataCreatedValues: SurveyFormValues = useMemo(() => {
    return {
      name: '',
      createdDate: new Date(),
      closedDate: null,
      morRepresentative: {},
      project: {
        name: generalInfo.name,
        startDate: generalInfo.startDate,
        endDate: generalInfo.endDate,
      },
      customerRepresentative: '',
      language: '',
      brseAvailable: 'yes',
    }
  }, [generalInfo])

  const formDataCreateSurvey = useFormik({
    initialValues: initialFormDataCreatedValues,
    validationSchema: surveyFormValidation,
    onSubmit: () => {
      setOpenModalPreviewForm(true)
    },
  })

  const onClickResult = (e: MouseEvent<HTMLElement>, survey: any) => {
    e.stopPropagation()
    setSurveySelected(survey)
    setOptionCreateNewSurvey(survey.surveyType)
    setOpenModalResult(true)
  }

  const onCopyLink = (e: MouseEvent<HTMLDivElement>, survey: any) => {
    e.stopPropagation()
    onCopy(getSurveyURL(survey))
  }

  const onClickEdit = (e: MouseEvent<HTMLDivElement>, survey: any) => {
    e.stopPropagation()
    setSurveySelected(survey)
    setOptionCreateNewSurvey(survey.surveyType)
    setOpenModalEditSurvey(true)
  }

  const rows = useMemo(() => {
    return listSurvey.map((survey, index) => {
      return {
        id: `${survey.surveyId} - ${index} - ${survey.customerSurveyId}`,
        surveyId: survey.surveyId,
        no: (queries.pageNum - 1) * queries.pageSize + index + 1,
        surveyName: survey.surveyName,
        surveyType: survey.surveyType,
        type:
          survey.surveyType === SURVEY_TYPE_VALUES.PROJECT_BASE
            ? i18Project('TXT_PROJECT_BASE_LABO_HOST')
            : i18Project('TXT_LABO_TASK_BASE'),
        createdDate: formatDate(survey.createdAt),
        closedDate: formatDate(survey.closedDate),
        surveyPoints: survey.surveyPoint || '--',
        seeDetails:
          survey.formState === SURVEY_FROM_STATE_VALUES.OPEN &&
          !!permissionProjectKPI.summaryResultCreate,
        status: <StatusItem typeStatus={getCSSStatus(survey.surveyStatus)} />,
        formState: (
          <Button
            variant="outlined"
            className={clsx(
              classes.formStateBtn,
              survey.formState === SURVEY_FROM_STATE_VALUES.CLOSED && 'closed'
            )}
          >
            {SURVEY_FORM_STATE_LABELS[survey.formState]}
          </Button>
        ),
        result: !!permissionProjectKPI.summaryResultView ? (
          <Box
            className={clsx(
              classes.resultIcon,
              !survey.surveyPoint && 'disabled'
            )}
            onClick={e => onClickResult(e, survey)}
          >
            <Visibility />
          </Box>
        ) : (
          <Fragment />
        ),
        action: (
          <Box className={classes.actions}>
            <ConditionalRender
              conditional={
                survey.formState === SURVEY_FROM_STATE_VALUES.OPEN &&
                !!permissionProjectKPI.summaryCopyURL
              }
            >
              {copying && survey.surveyId === surveySelected.surveyId ? (
                <Box color={themeColors.color.green.primary}>
                  {i18('LB_COPIED')}
                </Box>
              ) : (
                <Tooltip
                  title={i18Project('TXT_COPY_SURVEY_URL')}
                  onClick={e => {
                    setSurveySelected(survey)
                    onCopyLink(e, survey)
                  }}
                >
                  <Link />
                </Tooltip>
              )}
            </ConditionalRender>
            {!survey.surveyPoint &&
              survey.formState === SURVEY_FROM_STATE_VALUES.OPEN &&
              permissionProjectKPI.surveyFormUpdate && (
                <Tooltip
                  title={i18Project('TXT_EDIT_SURVEY_FORM')}
                  onClick={e => onClickEdit(e, survey)}
                >
                  <Edit className={classes.editIcon} />
                </Tooltip>
              )}
            {!survey.surveyPoint &&
              survey.formState === SURVEY_FROM_STATE_VALUES.OPEN &&
              !!permissionProjectKPI.surveyFormDelete && (
                <Tooltip
                  title={i18Project('TXT_DELETE_SURVEY')}
                  onClick={e => {
                    e.stopPropagation()
                    setOpenModalDeleteSurvey(true)
                    setSurveySelected(survey)
                  }}
                >
                  <Delete />
                </Tooltip>
              )}
          </Box>
        ),
      }
    })
  }, [listSurvey, queries, copying])

  const onChooseCreateNewSurveyOption = (option: OptionItem) => {
    setOptionCreateNewSurvey(option.value as number)
    setOpenModalCreateSurvey(true)
    setModeModal('preview')
  }

  const debounceFn = useCallback(
    _.debounce(handleDebounceFn, INPUT_TIME_DELAY),
    [queries]
  )

  function handleDebounceFn(surveyName: string) {
    const newQueryParameters = {
      ...queries,
      surveyName,
      pageNum: 1,
      pageSize: LIMIT_DEFAULT,
    }
    setQueries(newQueryParameters)
  }

  const handleSearchChange = (newValueSearch: string) => {
    setValueSearch(newValueSearch)
    debounceFn(newValueSearch.trim())
  }

  const onRangeDateChange = (date: Date | null, field: string) => {
    setQueries({
      ...queries,
      [field]: date,
    })
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

  const deleteSurvey = () => {
    dispatch(updateLoading(true))
    ProjectService.deleteSurvey({
      projectId: params.projectId as string,
      surveyId: surveySelected.surveyId,
    })
      .then(() => {
        getListSurveyApi()
        dispatch(getAllSurveyNames(params.projectId as string))
        dispatch(
          alertSuccess({
            message: `${i18Project('TXT_SURVEY')}: ${i18('MSG_DELETE_SUCCESS', {
              labelName: surveySelected.surveyName,
            })}`,
          })
        )
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  const onClickSurveyRow = (survey: any) => {
    setSurveySelected(survey)
    setModeModal('edit')
    setOpenModalPreviewForm(true)
    setOpenModalCreateSurvey(false)
    setOptionCreateNewSurvey(survey.surveyType)
  }

  const onSuccessfullyAdded = (survey: any) => {
    getListSurveyApi()
    setOpenModalSuccessfully(true)
    setOpenModalPreviewForm(false)
    setOptionCreateNewSurvey(0)
    formDataCreateSurvey.setValues(initialFormDataCreatedValues)
    formDataCreateSurvey.setErrors({})
    formDataCreateSurvey.setTouched({})
    setSurveyURL(getSurveyURL(survey))
  }

  const fillListSurveyFromApi = ({ data }: AxiosResponse) => {
    setListSurvey(data.content)
    setTotalElements(data.totalElements)
  }

  const getListSurveyApi = () => {
    setTimeout(() => {
      setLoadingListSurvey(true)
    })
    const payload = {
      projectId: params.projectId as string,
      queryParameters: {
        ...queries,
        startDate:
          typeof queries.startDate == 'object'
            ? queries.startDate?.getTime()
            : 0,
        endDate:
          typeof queries.endDate == 'object' ? queries.endDate?.getTime() : 0,
      },
    }
    dispatch(getListSurvey(payload))
      .unwrap()
      .then(fillListSurveyFromApi)
      .finally(() => {
        setLoadingListSurvey(false)
      })
  }

  const getAveragePointsApi = () => {
    const payload = {
      projectId: params.projectId as string,
      queryParameters: {
        ...queries,
        startDate:
          typeof queries.startDate == 'object'
            ? queries.startDate?.getTime()
            : 0,
        endDate:
          typeof queries.endDate == 'object' ? queries.endDate?.getTime() : 0,
      },
    }
    dispatch(getAveragePointsSurvey(payload))
      .unwrap()
      .then(({ data }: AxiosResponse) => {
        setAveragePoints(data.averagePoints || 0)
        setAverageStatus(data.averageStatus.id)
        setOverallStatus(data.overallStatus.id)
      })
  }

  const closeModalSurveyForm = () => {
    setOptionCreateNewSurvey(0)
    setOpenModalCreateSurvey(false)
    setOpenModalEditSurvey(false)
    setSurveySelected({})
    formDataCreateSurvey.setErrors({})
    formDataCreateSurvey.setTouched({})
    formDataCreateSurvey.setValues(initialFormDataCreatedValues)
  }

  useEffect(() => {
    dispatch(getAllSurveyNames(params.projectId as string))
  }, [])

  useEffect(() => {
    getListSurveyApi()
    getAveragePointsApi()
  }, [queries])

  return (
    <Fragment>
      {!!optionCreateNewSurvey && openModalCreateSurvey && (
        <ModalCreateNewSurvey
          formik={formDataCreateSurvey}
          optionCreateNewSurvey={optionCreateNewSurvey}
          onClose={closeModalSurveyForm}
        />
      )}
      {!!optionCreateNewSurvey && openModalEditSurvey && (
        <ModalEditSurvey
          initSurvey={surveySelected}
          optionCreateNewSurvey={optionCreateNewSurvey}
          onClose={closeModalSurveyForm}
          onSuccessfullyUpdated={() => {
            getListSurveyApi()
          }}
        />
      )}
      {openModalSuccessfully && (
        <ModalSurveySuccessfullyCreated
          surveyURL={surveyURL}
          onClose={() => setOpenModalSuccessfully(false)}
        />
      )}
      {optionCreateNewSurvey === SURVEY_TYPE_VALUES.PROJECT_BASE &&
        openModalPreviewForm && (
          <ModalEvaluateProjectBase
            surveyId={surveySelected.surveyId}
            mode={modeModal}
            dataPreview={formDataCreateSurvey.values}
            onClose={() => setOpenModalPreviewForm(false)}
            onSuccessfullyAdded={onSuccessfullyAdded}
            onSuccessfullyEvaluated={() => {
              getListSurveyApi()
              getAveragePointsApi()
              dispatch(getAllSurveyNames(params.projectId as string))
            }}
          />
        )}
      {optionCreateNewSurvey === SURVEY_TYPE_VALUES.PROJECT_LABO &&
        openModalPreviewForm && (
          <ModalEvaluateProjectLabo
            surveyId={surveySelected.surveyId}
            mode={modeModal}
            dataPreview={formDataCreateSurvey.values}
            onClose={() => setOpenModalPreviewForm(false)}
            onSuccessfullyAdded={onSuccessfullyAdded}
            onSuccessfullyEvaluated={() => {
              getListSurveyApi()
              getAveragePointsApi()
              dispatch(getAllSurveyNames(params.projectId as string))
            }}
          />
        )}
      {optionCreateNewSurvey === SURVEY_TYPE_VALUES.PROJECT_BASE &&
        openModalResult && (
          <ModalResultProjectBase
            surveyId={surveySelected.surveyId}
            onClose={() => {
              setOptionCreateNewSurvey(0)
              setOpenModalResult(false)
            }}
            onGetCustomerSatisfaction={() => {
              getListSurveyApi()
              getAveragePointsApi()
            }}
          />
        )}
      {optionCreateNewSurvey === SURVEY_TYPE_VALUES.PROJECT_LABO &&
        openModalResult && (
          <ModalResultProjectLabo
            surveyId={surveySelected.surveyId}
            onClose={() => {
              setOptionCreateNewSurvey(0)
              setOpenModalResult(false)
            }}
            onGetCustomerSatisfaction={() => {
              getListSurveyApi()
              getAveragePointsApi()
            }}
          />
        )}
      {openModalDeleteSurvey && (
        <ModalDeleteRecords
          open
          titleMessage={i18Project('TXT_DELETE_SURVEY')}
          subMessage={i18Project('MSG_CONFIRM_SURVEY_DELETE', {
            labelName: surveySelected.surveyName,
          })}
          onClose={() => setOpenModalDeleteSurvey(false)}
          onSubmit={deleteSurvey}
        />
      )}
      <CardFormToggleBody
        title={i18Project('TXT_CUSTOMER_SATISFACTION')}
        status={getCSSStatus(overallStatus)}
        TooltipContent={<KPIMetricsTooltip section="css" />}
        HeaderRight={
          !!permissionProjectKPI.surveyFormCreate ? (
            <ButtonActions
              label={i18Project('TXT_CREATE_NEW_SURVEY') as string}
              listOptions={createNewSurvayOptions}
              endIcon={<KeyboardArrowDown />}
              onChooseOption={onChooseCreateNewSurveyOption}
            />
          ) : (
            <Fragment />
          )
        }
      >
        <Box className={classes.tableContainer}>
          <Box className={classes.filters}>
            <InputSearch
              placeholder={i18Project('PLH_SEARCH_SURVEY')}
              label={i18Project('LB_SEARCH')}
              value={valueSearch}
              onChange={handleSearchChange}
            />
            <Box className={classes.dateField}>
              <Box className={classes.label}>{i18('LB_CREATED_DATE_FROM')}</Box>
              <InputDatepicker
                keyName="startDate"
                width={160}
                maxDate={queries.endDate}
                value={queries.startDate}
                onChange={onRangeDateChange}
              />
            </Box>
            <Box className={classes.dateField}>
              <Box className={classes.label}>{i18('LB_TO_V2')}</Box>
              <InputDatepicker
                keyName="endDate"
                width={160}
                minDate={queries.startDate}
                value={queries.endDate}
                onChange={onRangeDateChange}
              />
            </Box>
          </Box>
          <CommonTable
            loading={loadingListSurvey}
            columns={columns}
            rows={rows}
            onRowClick={onClickSurveyRow}
            pagination={{
              pageNum: queries.pageNum,
              pageSize: queries.pageSize,
              totalElements: totalElements,
              onPageChange,
              onPageSizeChange,
            }}
            LastRow={
              <TableRow>
                <TableCell colSpan={4}></TableCell>
                <TableCell colSpan={1}>
                  <Box component="b">{i18Project('TXT_AVERAGE_POINTS')}</Box>
                </TableCell>
                <TableCell colSpan={1}>
                  <Box>{averagePoints?.toFixed(2) || '--'}</Box>
                </TableCell>
                <TableCell colSpan={4}>
                  <StatusItem typeStatus={getCSSStatus(averageStatus)} />
                </TableCell>
              </TableRow>
            }
          />
        </Box>
      </CardFormToggleBody>
    </Fragment>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  tableContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  filters: {
    display: 'flex',
    gap: theme.spacing(3),
  },
  dateField: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
  },
  formStateBtn: {
    borderRadius: '10px !important',
    pointerEvents: 'none',
    '&.closed': {
      color: theme.color.green.primary,
      borderColor: theme.color.green.primary,
    },
  },
  resultIcon: {
    cursor: 'pointer',
    '& svg': {
      color: theme.color.black.secondary,
    },
    '&.disabled': {
      pointerEvents: 'none',
      '& svg': {
        color: theme.color.grey.secondary,
      },
    },
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& svg': {
      color: theme.color.black.secondary,
      cursor: 'pointer',
    },
    '& > svg:nth-child(1)': {
      width: '45px',
    },
  },
  editIcon: {
    width: '45px !important',
  },
}))

export default CustomerSatisfaction

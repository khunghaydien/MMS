import ConditionalRender from '@/components/ConditionalRender'
import CardFormEdit from '@/components/Form/CardFormEdit'
import FormItem from '@/components/Form/FormItem/FormItem'
import FormLayout from '@/components/Form/FormLayout'
import InputAutocompleteSingle from '@/components/inputs/InputAutocompleteSingle'
import InputCheckbox from '@/components/inputs/InputCheckbox'
import InputCurrency from '@/components/inputs/InputCurrency'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputTextArea from '@/components/inputs/InputTextArea'
import { LangConstant } from '@/const'
import { commonSelector } from '@/reducer/common'
import { alertSuccess, commonErrorAlert, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { EventInput, OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import { useFormik } from 'formik'
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import { WORK_TYPE, WORK_TYPE_DAY_OFF, WORK_TYPE_VALUE } from '../../const'
import {
  dailyReportSelector,
  setCountReCallApiDailyReports,
  setDailyReportId,
} from '../../reducer/dailyReport'
import dailyReportService from '../../services/dailyReport.service'
import { AddDailyReportRequestBody } from '../../types'

const ViewDetail = ({ report }: { report: any }) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)
  const { t: i18DailyReport } = useTranslation(LangConstant.NS_DAILY_REPORT)

  const isDayOffFullDay =
    report.workType?.id === +WORK_TYPE_VALUE.DAY_OFF_FULL_DAY

  const isDayOfHalfDay =
    report.workType?.id === +WORK_TYPE_VALUE.DAY_OFF_HALF_DAY

  const useIssuesAndSuggestion =
    (!!report.improvement || !!report.suggestionForImprovement) &&
    !isDayOffFullDay &&
    !isDayOfHalfDay

  return (
    <Box className={classes.RootViewDetail}>
      <Box className={classes.listFields}>
        <FormLayout gap={24}>
          <Box className={classes.option}>
            <Box className={classes.label}>
              {i18DailyReport('LB_WORKING_TYPE')}
            </Box>
            <Box className={classes.value}>{report.workType.name}</Box>
          </Box>
          {!!report.project?.name && (
            <Box className={classes.option}>
              <Box className={classes.label}>{i18Project('LB_PROJECT')}</Box>
              <Box className={classes.value}>{report.project?.name}</Box>
            </Box>
          )}
          {!!report.workingHours && (
            <Box className={classes.option}>
              <Box className={classes.label}>
                {i18DailyReport('LB_WORKING_HOURS')}
              </Box>
              <Box className={classes.value}>{report.workingHours}</Box>
            </Box>
          )}
        </FormLayout>
        {!!report.workingDescription && !isDayOffFullDay && (
          <FormLayout gap={24}>
            <Box className={classes.option}>
              <Box className={classes.label}>{i18('LB_DESCRIPTION')}</Box>
              <Box className={classes.value}>{report.workingDescription}</Box>
            </Box>
          </FormLayout>
        )}
        {useIssuesAndSuggestion && (
          <FormLayout gap={24}>
            {!!report.improvement && (
              <Box className={classes.option}>
                <Box className={classes.label}>
                  {i18DailyReport('LB_ISSUES')}
                </Box>
                <Box className={classes.value}>{report.improvement}</Box>
              </Box>
            )}
            {!!report.suggestionForImprovement && (
              <Box className={classes.option}>
                <Box className={classes.label}>
                  {i18DailyReport('LB_SUGGESTIONS_FOR_IMPROVEMENT')}
                </Box>
                <Box className={classes.value}>
                  {report.suggestionForImprovement}
                </Box>
              </Box>
            )}
          </FormLayout>
        )}
      </Box>
    </Box>
  )
}

interface IProps {
  index: number
  report: any
  reportDate: number
  isViewOnly: boolean
  currentReportList: any[]
  setCurrentReportList: Dispatch<SetStateAction<any[]>>
  onDeleteForm: (payload: { report: any; index: number }) => void
  onCreateSuccess: (index: number, newDailyReport: any) => void
}

const FormWorkingHoursItem = ({
  index,
  report,
  onDeleteForm,
  reportDate,
  isViewOnly,
  onCreateSuccess,
  currentReportList,
  setCurrentReportList,
}: IProps) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18DailyReport } = useTranslation(LangConstant.NS_DAILY_REPORT)
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)

  const { projectStaffs } = useSelector(commonSelector)
  const { countReCallApiDailyReports, dailyReportId } =
    useSelector(dailyReportSelector)

  const [useDetailViewMode, setUseDetailViewMode] = useState(
    report.mode === 'detail'
  )
  const [useIssuesAndSuggestions, setUseIssuesAndSuggestions] = useState(
    !!report.improvement || !!report.suggestionForImprovement
  )
  const [reportTemp, setReportTemp] = useState(report)

  const form = useFormik({
    initialValues: {
      id: 1,
      isWorking: true,
      projectId: report.project?.id || '',
      workType: report.workType.id,
      workingHours: report.workingHours,
      workingDescription: report.workingDescription,
      improvement: report.improvement,
      suggestionForImprovement: report.suggestionForImprovement,
      workTypeName: report.workType.name,
      projectName: report.project?.name || '',
    },
    validationSchema: Yup.object({
      workType: Yup.string().required(
        i18('MSG_SELECT_REQUIRE', {
          name: i18DailyReport('LB_WORKING_TYPE'),
        }) as string
      ),
      workingHours: Yup.string().when(['isWorking', 'workType'], {
        is: (isWorking: boolean, workType: string | number) =>
          !!isWorking && +workType !== +WORK_TYPE_VALUE.DAY_OFF_FULL_DAY,
        then: Yup.string()
          .required(
            i18('MSG_INPUT_REQUIRE', {
              name: i18DailyReport('LB_WORKING_HOURS'),
            }) as string
          )
          .test(
            'hours',
            'Working Hours cannot be more than 24 hours of all projects combined',
            (val: any) => +val <= 24
          )
          .test(
            'hours',
            'Working Hours cannot be equal to 0 hours of all projects combined',
            (val: any) => +val > 0
          ),
      }),
      projectId: Yup.string().when('workType', {
        is: (workType: string | number) =>
          +workType === +WORK_TYPE_VALUE.PROJECT_REPORT,
        then: Yup.string().required(
          i18('MSG_SELECT_REQUIRE', {
            name: i18Project('LB_PROJECT'),
          }) as string
        ),
      }),
    }),
    onSubmit: () => {
      if (typeof report.id === 'number') {
        updateDailyReportItem()
      } else {
        createDailyReportItem()
      }
    },
  })
  const { values, setFieldValue, errors, touched } = form

  const isHalfDayOff = +values.workType === +WORK_TYPE_VALUE.DAY_OFF_HALF_DAY
  const isFullDayOff = +values.workType === +WORK_TYPE_VALUE.DAY_OFF_FULL_DAY

  const listProjectsOptions = useMemo(() => {
    const allProjectIds = currentReportList
      .map((report: any) => report?.project?.id)
      .filter((id: string) => !!id)
    const listProjectIdsIgnore = allProjectIds.filter(
      id => id !== values.projectId
    )
    return projectStaffs.filter(
      item => !listProjectIdsIgnore.includes(item.id as string)
    )
  }, [currentReportList, projectStaffs, values.projectId])

  const buttonSubmitDisabled = useMemo(() => {
    return (
      JSON.stringify({
        workType: reportTemp.workType.id,
        projectId: reportTemp.project?.id,
        workingHours: +reportTemp.workingHours,
        workingDescription: reportTemp.workingDescription,
        improvement: reportTemp.improvement,
        suggestionForImprovement: reportTemp.suggestionForImprovement,
      }) ===
      JSON.stringify({
        workType: values.workType,
        projectId: values.projectId,
        workingHours: +values.workingHours,
        workingDescription: values.workingDescription,
        improvement: values.improvement,
        suggestionForImprovement: values.suggestionForImprovement,
      })
    )
  }, [reportTemp, values])

  const createDailyReportItem = () => {
    dispatch(updateLoading(true))
    if (dailyReportId) {
      const payload = {
        dailyReportId: dailyReportId,
        requestBody: {
          dailyDetailId: 0,
          improvement: values.improvement,
          projectId: values.projectId,
          suggestionForImprovement: values.suggestionForImprovement,
          workType: values.workType,
          workingDescription: values.workingDescription,
          workingHours: +values.workingHours,
        },
      }
      dailyReportService
        .createDailyReportDetail(payload)
        .then((res: AxiosResponse) => {
          const newDailyReport = {
            ...reportTemp,
            id: res.data?.id,
            dailyDetailId: 0,
            improvement: values.improvement,
            suggestionForImprovement: values.suggestionForImprovement,
            workingDescription: values.workingDescription,
            workingHours: +values.workingHours,
            workType: {
              id: values.workType,
              name: values.workTypeName,
            },
            project: {
              id: values.projectId,
              name: values.projectName,
            },
          }
          setReportTemp(newDailyReport)
          onCreateSuccess(index, newDailyReport)
          setUseDetailViewMode(true)
          dispatch(
            setCountReCallApiDailyReports(countReCallApiDailyReports + 1)
          )
          dispatch(
            alertSuccess({
              message: i18DailyReport('MSG_CREATE_WORKING_SUCCESS'),
            })
          )
        })
        .catch(() => {
          dispatch(commonErrorAlert())
        })
        .finally(() => {
          dispatch(updateLoading(false))
        })
    } else {
      const requestBody: AddDailyReportRequestBody = {
        improvement: '',
        note: '',
        noteWorkDescription: '',
        statusReport: 0,
        reportDate: reportDate,
        dailyReportDetails: [
          {
            dailyDetailId: null,
            improvement: values.improvement,
            projectId: values.projectId,
            suggestionForImprovement: values.suggestionForImprovement,
            workType: +values.workType,
            workingDescription: values.workingDescription,
            workingHours: +values.workingHours,
          },
        ],
        otReportDetails: [],
      }
      dailyReportService
        .addDailyReport(requestBody)
        .then((res: AxiosResponse) => {
          const newDailyReport = {
            ...reportTemp,
            id: res.data?.dailyReportDetails?.[0]?.id || 0,
            dailyDetailId: null,
            improvement: values.improvement,
            suggestionForImprovement: values.suggestionForImprovement,
            workingDescription: values.workingDescription,
            workingHours: +values.workingHours,
            workType: {
              id: values.workType,
              name: values.workTypeName,
            },
            project: {
              id: values.projectId,
              name: values.projectName,
            },
          }
          onCreateSuccess(index, newDailyReport)
          dispatch(setDailyReportId(res.data?.dailyReportId))
          setUseDetailViewMode(true)
          dispatch(
            setCountReCallApiDailyReports(countReCallApiDailyReports + 1)
          )
          dispatch(
            alertSuccess({
              message: i18DailyReport('MSG_CREATE_WORKING_SUCCESS'),
            })
          )
        })
        .catch(() => {
          dispatch(commonErrorAlert())
        })
        .finally(() => {
          dispatch(updateLoading(false))
        })
    }
  }

  const updateDailyReportItem = () => {
    const payload = {
      dailyReportId: dailyReportId,
      requestBody: {
        dailyDetailId: report.id,
        improvement: values.improvement,
        projectId: values.projectId,
        suggestionForImprovement: values.suggestionForImprovement,
        workType: values.workType,
        workingDescription: values.workingDescription,
        workingHours: +values.workingHours,
      },
    }
    dispatch(updateLoading(true))
    dailyReportService
      .updateDailyReportDetail(payload)
      .then(() => {
        setReportTemp({
          ...reportTemp,
          dailyDetailId: report.id,
          improvement: values.improvement,
          suggestionForImprovement: values.suggestionForImprovement,
          workingDescription: values.workingDescription,
          workingHours: +values.workingHours,
          workType: {
            id: values.workType,
            name: values.workTypeName,
          },
          project: {
            id: values.projectId,
            name: values.projectName,
          },
        })
        setUseDetailViewMode(true)
        dispatch(setCountReCallApiDailyReports(countReCallApiDailyReports + 1))
        dispatch(
          alertSuccess({
            message: i18DailyReport('MSG_UPDATE_WORKING_SUCCESS'),
          })
        )
      })
      .catch(() => {
        dispatch(commonErrorAlert())
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  const onWorkTypeChange = (
    newWorkType: string | number,
    option?: OptionItem
  ) => {
    if (+newWorkType === +WORK_TYPE_VALUE.DAY_OFF_HALF_DAY) {
      setFieldValue('workingHours', 4)
    } else {
      setFieldValue('workingHours', '')
    }
    setFieldValue('projectId', '')
    setFieldValue('projectName', '')
    setFieldValue('workType', newWorkType)
    setFieldValue('workTypeName', option?.label || '')
  }

  const onProjectChange = (projectId: string, option?: OptionItem | null) => {
    setFieldValue('projectId', projectId)
    setFieldValue('projectName', option?.label || '')
    const newCurrentReportList = [...currentReportList]
    newCurrentReportList[index].project = {
      ...(newCurrentReportList[index].project || {}),
      id: projectId,
    }
    setCurrentReportList(newCurrentReportList)
  }

  const onDelete = () => {
    onDeleteForm({
      report,
      index,
    })
  }

  const onCancel = () => {
    setFieldValue('workType', report.workType.id)
    setFieldValue('workTypeName', report.workType.name)
    setFieldValue('workingHours', report.workingHours)
    setFieldValue('workingDescription', report.workingDescription)
    setFieldValue('improvement', report.improvement)
    setFieldValue('suggestionForImprovement', report.suggestionForImprovement)
    setFieldValue('projectId', report.project?.id || '')
    setFieldValue('projectName', report.project?.name || '')
    setUseDetailViewMode(true)
  }

  useEffect(() => {
    setReportTemp(report)
  }, [report])

  return (
    <Box className={classes.RootFormWorkingHoursItem}>
      <Box className={classes.title}>
        {i18DailyReport('TXT_DAILY_REPORT')}
        &nbsp; #{index + 1}
      </Box>
      {!isViewOnly && (
        <Box className={classes.actions}>
          {report.mode === 'detail' && (
            <CardFormEdit
              hideBorder
              buttonUseDetailEditDisabled={buttonSubmitDisabled}
              useDeleteMode={useDetailViewMode}
              useDetailEditMode={!useDetailViewMode}
              useDetailViewMode={useDetailViewMode}
              onOpenEditMode={() => setUseDetailViewMode(false)}
              onCancelEditMode={onCancel}
              onOpenDeleteMode={onDelete}
              onSaveAs={() => form.handleSubmit()}
            />
          )}
          {report.mode === 'add' && (
            <CardFormEdit
              hideBorder
              hideButtonCancel
              useDeleteMode
              buttonUseDetailEditDisabled={false}
              useDetailEditMode={!useDetailViewMode}
              onOpenDeleteMode={onDelete}
              onSaveAs={() => form.handleSubmit()}
            />
          )}
        </Box>
      )}
      {useDetailViewMode && <ViewDetail report={reportTemp} />}
      {!useDetailViewMode && (
        <Fragment>
          <FormLayout gap={24} top={24}>
            <InputDropdown
              required
              width={
                values.workType === +WORK_TYPE_VALUE.PROJECT_REPORT
                  ? '50%'
                  : '100%'
              }
              value={values.workType}
              error={!!errors?.workType && !!touched?.workType}
              errorMessage={errors?.workType as string}
              listOptions={[...WORK_TYPE, ...WORK_TYPE_DAY_OFF]}
              label={i18DailyReport('LB_WORKING_TYPE')}
              placeholder={i18DailyReport('PLH_SELECT_WORK_TYPE')}
              onChange={onWorkTypeChange}
            />
            {values.workType === +WORK_TYPE_VALUE.PROJECT_REPORT && (
              <FormItem required label={i18('LB_PROJECT')}>
                <InputAutocompleteSingle
                  width={'100%'}
                  disabled={values.workType !== +WORK_TYPE_VALUE.PROJECT_REPORT}
                  listOptions={listProjectsOptions}
                  placeholder={i18DailyReport('PLH_SELECT_PROJECT')}
                  value={values.projectId}
                  error={!!errors?.projectId && !!touched?.projectId}
                  errorMessage={errors?.projectId}
                  onChange={onProjectChange}
                />
              </FormItem>
            )}
          </FormLayout>
          {!isFullDayOff && (
            <Fragment>
              <Box className={classes.formChildDailyReport}>
                <FormLayout gap={24}>
                  <Box width={140}>
                    <InputCurrency
                      suffix=""
                      required
                      disabled={isHalfDayOff}
                      className={classes.workingHour}
                      label={i18DailyReport('LB_WORKING_HOURS')}
                      placeholder={i18DailyReport('PLH_WORKING_HOURS')}
                      error={!!errors?.workingHours && !!touched?.workingHours}
                      errorMessage={errors?.workingHours}
                      value={values.workingHours}
                      onChange={(value: string | undefined) =>
                        setFieldValue(`workingHours`, value as string)
                      }
                    />
                  </Box>
                  <InputTextArea
                    height={120}
                    label={i18DailyReport('LB_REPORT_DESCRIPTION') as string}
                    placeholder={i18DailyReport('PLH_WORKING_DESCRIPTION')}
                    defaultValue={values.workingDescription}
                    onChange={(event: EventInput) =>
                      setFieldValue('workingDescription', event.target.value)
                    }
                  />
                </FormLayout>
                <ConditionalRender conditional={!isHalfDayOff}>
                  <Fragment>
                    <InputCheckbox
                      label={i18DailyReport('LB_ISSUES_AND_SUGGESTIONS')}
                      checked={useIssuesAndSuggestions}
                      onClick={() =>
                        setUseIssuesAndSuggestions(!useIssuesAndSuggestions)
                      }
                    />
                    {useIssuesAndSuggestions && (
                      <FormLayout gap={24}>
                        <InputTextArea
                          height={80}
                          label={i18DailyReport('LB_ISSUES') as string}
                          placeholder={i18DailyReport('PLH_ISSUES')}
                          defaultValue={values.improvement}
                          onChange={(event: EventInput) =>
                            setFieldValue('improvement', event.target.value)
                          }
                        />
                        <InputTextArea
                          height={80}
                          label={
                            i18DailyReport(
                              'LB_SUGGESTION_FOR_IMPROVEMENT'
                            ) as string
                          }
                          placeholder={i18DailyReport(
                            'PLH_SUGGESTION_FOR_IMPROVEMENT'
                          )}
                          defaultValue={values.suggestionForImprovement}
                          onChange={(event: EventInput) =>
                            setFieldValue(
                              'suggestionForImprovement',
                              event.target.value
                            )
                          }
                        />
                      </FormLayout>
                    )}
                  </Fragment>
                </ConditionalRender>
              </Box>
            </Fragment>
          )}
        </Fragment>
      )}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootFormWorkingHoursItem: {
    border: `1px solid ${theme.color.grey.secondary}`,
    borderRadius: '8px',
    padding: theme.spacing(2),
    position: 'relative',
  },
  RootViewDetail: {
    paddingTop: theme.spacing(5),
  },
  reportOTBox: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  formChildDailyReport: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    backgroundColor: theme.color.blue.small,
    padding: theme.spacing(2),
  },
  workingHour: {
    maxWidth: '100% !important',
  },
  noteOT: {
    fontWeight: 600,
    fontSize: 14,
  },
  title: {
    position: 'absolute',
    fontWeight: 700,
    color: theme.color.blue.primary,
    background: '#fff',
    top: '-10px',
  },
  actions: {
    position: 'absolute',
    right: theme.spacing(2),
  },
  listFields: {
    display: 'flex',
    gap: theme.spacing(2),
    flexDirection: 'column',
  },
  option: {
    width: 'max-content',
    minWidth: '200px',
  },
  label: {
    fontSize: 14,
    color: theme.color.black.secondary,
  },
  value: {
    fontSize: 14,
    marginTop: theme.spacing(0.5),
    fontWeight: 700,
    whiteSpace: 'pre-line',
  },
}))

export default FormWorkingHoursItem

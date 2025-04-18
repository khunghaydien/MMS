import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import CardFormEdit from '@/components/Form/CardFormEdit'
import FormLayout from '@/components/Form/FormLayout'
import ButtonAddPlus from '@/components/buttons/ButtonAddPlus'
import Modal from '@/components/common/Modal'
import DeleteIcon from '@/components/icons/DeleteIcon'
import InputCurrency from '@/components/inputs/InputCurrency'
import LoadingSkeleton from '@/components/loading/LoadingSkeleton'
import { LangConstant } from '@/const'
import { projectSelector } from '@/modules/project/reducer/project'
import { ProjectService } from '@/modules/project/services'
import { ProjectState, ShareEffortListItem } from '@/modules/project/types'
import { isMoreThan2023 } from '@/modules/project/utils'
import { alertError, alertSuccess, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { formatNumberToCurrencyBigInt, uuid } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import { useFormik } from 'formik'
import moment from 'moment'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { useShareEffortValidation } from './useShareEffortValidation'

interface ShareMonthItem {
  id: number | string
  month: number
  year: number
  shareBMM: number | string
  fullDate: Date | null
}

interface ModalDetailShareEffortProps {
  shareEffort: ShareEffortListItem
  onClose: () => void
  onEdit: () => void
}

const ModalDetailShareEffort = ({
  onClose,
  shareEffort,
  onEdit,
}: ModalDetailShareEffortProps) => {
  const randomId = uuid()
  const classes = useStyles()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)

  const { shareMonthFeature } = useShareEffortValidation()
  const { generalInfo, permissionResourceAllocation }: ProjectState =
    useSelector(projectSelector)

  const [useEditShareMonth, setUseEditShareMonth] = useState(false)
  const [shareMonthListModeView, setShareMonthListModeView] = useState<
    ShareMonthItem[]
  >([])
  const [loading, setLoading] = useState(true)

  const form = useFormik({
    initialValues: {
      shareMonthList: [] as ShareMonthItem[],
    },
    validationSchema: shareMonthFeature,
    onSubmit: () => {
      dispatchUpdateDetailShareEffort()
    },
  })
  const { values, errors, touched, setErrors, setTouched, setValues } = form

  const totalShareBMMView = useMemo(() => {
    let total = 0
    shareMonthListModeView.forEach(item => {
      total += +item.shareBMM
    })
    return total
  }, [shareMonthListModeView])

  const buttonUseDetailEditDisabled = useMemo(() => {
    return (
      JSON.stringify(shareMonthListModeView) ===
      JSON.stringify(values.shareMonthList)
    )
  }, [shareMonthListModeView, values.shareMonthList])

  const addShareMonth = () => {
    form.setFieldValue('shareMonthList', [
      ...values.shareMonthList,
      {
        id: randomId,
        year: 0,
        month: 0,
        fullDate: null,
        shareBMM: '',
      },
    ])
  }

  const onShareMonthChange = (
    shareMonth: Date | null,
    shareMonthIndex: number
  ) => {
    form.setFieldValue(
      `shareMonthList[${shareMonthIndex}].month`,
      (shareMonth?.getMonth() as number) + 1
    )
    form.setFieldValue(
      `shareMonthList[${shareMonthIndex}].year`,
      shareMonth?.getFullYear()
    )
    form.setFieldValue(
      `shareMonthList[${shareMonthIndex}].fullDate`,
      shareMonth
    )
  }

  const onShareBMMChange = (
    shareBillableManMonth: string | number | undefined,
    shareMonthIndex: number
  ) => {
    form.setFieldValue(
      `shareMonthList[${shareMonthIndex}].shareBMM`,
      +(shareBillableManMonth || 0)
    )
  }

  const deleteShareMonth = (shareMonthIndex: number) => {
    const newShareMonthList = [...values.shareMonthList]
    newShareMonthList.splice(shareMonthIndex, 1)
    form.setFieldValue('shareMonthList', newShareMonthList)
  }

  const cancelEditMode = () => {
    setErrors({})
    setTouched({})
    setValues({
      shareMonthList: [...shareMonthListModeView],
    })
    setUseEditShareMonth(false)
  }

  const dispatchGetDetailShareMonthList = () => {
    setLoading(true)
    const payload = {
      projectId: params.projectId as string,
      shareEffortId: shareEffort.projectShareId,
    }
    ProjectService.getDetailShareMonthList(payload)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          const shareMonthList = res.data.map((i: any) => ({
            ...i,
            fullDate: new Date(i.year, i.month - 1),
          }))
          setValues({
            shareMonthList,
          })
          setShareMonthListModeView(shareMonthList)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const dispatchUpdateDetailShareEffort = () => {
    const payload = {
      projectId: params.projectId as string,
      shareEffortId: shareEffort.projectShareId,
      requestBody: values.shareMonthList.map(i => ({
        year: i.year as number,
        month: i.month as number,
        shareBMM: i.shareBMM as number,
      })),
    }
    dispatch(updateLoading(true))
    ProjectService.updateDetailShareMonthList(payload)
      .then(() => {
        onEdit()
        dispatchGetDetailShareMonthList()
        dispatch(
          alertSuccess({
            message: i18('MSG_UPDATE_SUCCESS', {
              labelName: i18Project('TXT_SHARE_EFFORT'),
            }),
          })
        )
        setUseEditShareMonth(false)
        onClose()
      })
      .catch((err: { field: string; message: string }[]) => {
        dispatch(
          alertError({
            message: err?.[0]?.message,
          })
        )
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  useEffect(() => {
    dispatchGetDetailShareMonthList()
  }, [])

  return (
    <Modal
      open
      hideFooter
      width={useEditShareMonth ? 800 : 700}
      title={i18Project('TXT_SHARE_EFFORT_DETAILS')}
      onClose={onClose}
    >
      {loading && (
        <Box className={classes.body}>
          <LoadingSkeleton />
        </Box>
      )}
      {!loading && (
        <Box className={classes.body}>
          <Box className={classes.listFields}>
            <Box className={classes.option}>
              <Box className={classes.label}>{i18('LB_STAFF_NAME')}</Box>
              <Box className={classes.value}>{shareEffort.staffName}</Box>
            </Box>
            <Box className={classes.option}>
              <Box className={classes.label}>{i18('LB_STAFF_CODE')}</Box>
              <Box className={classes.value}>{shareEffort.staffCode}</Box>
            </Box>
            <Box className={classes.option}>
              <Box className={classes.label}>{i18('LB_STAFF_MAIL')}</Box>
              <Box className={classes.value}>{shareEffort.staffEmail}</Box>
            </Box>
            <Box className={classes.option}>
              <Box className={classes.label}>{i18('LB_BRANCH')}</Box>
              <Box className={classes.value}>{shareEffort.branch}</Box>
            </Box>
            <Box className={classes.option}>
              <Box className={classes.label}>{i18('LB_DIVISION')}</Box>
              <Box className={classes.value}>{shareEffort.division}</Box>
            </Box>
          </Box>
          <Box className={classes.shareMonthFeature}>
            <Box className={classes.actions}>
              {!!permissionResourceAllocation.updateShareEffort && (
                <CardFormEdit
                  hideBorder
                  buttonUseDetailEditDisabled={buttonUseDetailEditDisabled}
                  onSaveAs={() => form.handleSubmit()}
                  useDetailEditMode={useEditShareMonth}
                  useDetailViewMode={!useEditShareMonth}
                  onOpenEditMode={() => setUseEditShareMonth(true)}
                  onCancelEditMode={cancelEditMode}
                />
              )}
            </Box>
            {!useEditShareMonth && (
              <Fragment>
                <Box className={classes.shareMonthList}>
                  {shareMonthListModeView.map(item => (
                    <FormLayout gap={24} key={item.id}>
                      <Box className={classes.option}>
                        <Box className={classes.label}>
                          {i18Project('LB_SHARE_MONTH')}
                        </Box>
                        <Box className={classes.value}>
                          {moment(
                            new Date(item.year, item.month - 1).getTime()
                          ).format('MM/YYYY')}
                        </Box>
                      </Box>
                      <Box className={classes.option}>
                        <Box className={classes.label}>
                          {i18Project('LB_SHARE_BMM')}
                        </Box>
                        <Box className={classes.value}>
                          {formatNumberToCurrencyBigInt(item.shareBMM)}
                        </Box>
                      </Box>
                    </FormLayout>
                  ))}
                </Box>
                <Box className={classes.totalShareBMM}>
                  <Box className={classes.label} component="b">
                    {i18Project('TXT_TOTAL_SHARE_BMM_OF_STAFF')}:
                  </Box>
                  <Box component="b">
                    &nbsp;{formatNumberToCurrencyBigInt(totalShareBMMView)}
                  </Box>
                </Box>
              </Fragment>
            )}
            {useEditShareMonth && (
              <Fragment>
                <Box className={classes.shareMonthList}>
                  {values.shareMonthList.map((item, index) => (
                    <Box className={classes.shareMonthItem} key={item.id}>
                      <InputDatepicker
                        readOnly
                        required
                        width={160}
                        openTo="month"
                        label={i18Project('LB_SHARE_MONTH')}
                        views={['year', 'month']}
                        inputFormat={'MM/YYYY'}
                        minDate={
                          isMoreThan2023(generalInfo.startDate)
                            ? generalInfo.startDate
                            : new Date('01/01/2024')
                        }
                        maxDate={generalInfo.endDate}
                        error={
                          !!(errors.shareMonthList?.[index] as any)?.fullDate &&
                          touched.shareMonthList?.[index]?.fullDate
                        }
                        errorMessage={
                          (errors.shareMonthList?.[index] as any)?.fullDate
                        }
                        value={item.fullDate}
                        onChange={(shareMonth: Date | null) =>
                          onShareMonthChange(shareMonth, index)
                        }
                      />
                      <InputCurrency
                        required
                        className={classes.currencyField}
                        label={i18Project('LB_SHARE_BMM')}
                        placeholder={i18Project('PLH_SHARE_EFFORT')}
                        error={
                          !!(errors.shareMonthList?.[index] as any)?.shareBMM &&
                          touched.shareMonthList?.[index]?.shareBMM
                        }
                        errorMessage={
                          (errors.shareMonthList?.[index] as any)?.shareBMM
                        }
                        value={item.shareBMM}
                        onChange={(value: string | number | undefined) =>
                          onShareBMMChange(value, index)
                        }
                      />
                      <Box className={classes.deleteShareMonthBox}>
                        {values.shareMonthList.length > 1 && (
                          <DeleteIcon onClick={() => deleteShareMonth(index)} />
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
                <Box>
                  <ButtonAddPlus
                    label={i18Project('LB_ADD_SHARE_MONTH')}
                    onClick={addShareMonth}
                  />
                </Box>
              </Fragment>
            )}
          </Box>
        </Box>
      )}
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  body: {
    '& .TableContainer': {
      overflowX: 'hidden',
    },
  },
  option: {
    width: 'max-content',
  },
  label: {
    fontSize: 14,
    color: theme.color.black.secondary,
  },
  value: {
    fontSize: 14,
    marginTop: theme.spacing(0.5),
    fontWeight: 700,
  },
  listFields: {
    display: 'flex',
    gap: theme.spacing(2.5, 1),
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  shareMonthFeature: {
    background: theme.color.blue.small,
    padding: theme.spacing(2),
    marginTop: theme.spacing(3),
    position: 'relative',
  },
  actions: {
    position: 'absolute',
    right: '12px',
  },
  shareMonthList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  shareMonthItem: {
    display: 'flex',
    gap: theme.spacing(3),
  },
  currencyField: {
    gap: '4px',
  },
  deleteShareMonthBox: {
    marginTop: theme.spacing(3),
  },
  totalShareBMM: {
    '& *': {
      color: theme.color.blue.primary,
    },
  },
}))

export default ModalDetailShareEffort

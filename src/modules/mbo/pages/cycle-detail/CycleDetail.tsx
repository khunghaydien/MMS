import CommonButton from '@/components/buttons/CommonButton'
import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import DialogBox from '@/components/modal/DialogBox'
import { LangConstant, PathConstant } from '@/const'
import { MBO_CYCLE_LIST } from '@/const/path.const'
import { useCallbackPrompt } from '@/hooks/useCallbackPrompt'
import { alertError } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { scrollToFirstErrorMessage } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useFormik } from 'formik'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import StringFormat from 'string-format'
import { cycleValidation, initCreateCycle } from '../../formik/cycleFormik'
import {
  createCycle,
  getCycleDetail,
  setPayloadCycle,
} from '../../reducer/cycle'
import CreateCycle from './CreateCycle'
import CycleInformation from './CycleInformation'
import StepCycle from './StepCycle'

interface ICycleDetailProps {
  isDetailPage: boolean
}

const initDataCycle = {
  evaluationCycleTemplateId: '',
  appraisees: [],
  appraiser: '',
  reviewer: '',
}

const CycleDetail = ({ isDetailPage }: ICycleDetailProps) => {
  const classes = useStyles()
  const navigate = useNavigate()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)
  const dispatch = useDispatch<AppDispatch>()
  const params = useParams()

  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [loadingInformation, setLoadingInformation] = useState(false)

  const formik = useFormik({
    initialValues: initCreateCycle,
    validationSchema: cycleValidation,
    onSubmit: (values: any, actions) => {
      dispatch(createCycle(values))
        .unwrap()
        .then(() => {
          formik.resetForm({ values: initDataCycle })
          dispatch(setPayloadCycle(initDataCycle))
          handleNavigateToListPage()
        })
      setShowDialog(false)
    },
  })

  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(showDialog)

  const handleNavigateToListPage = () => {
    navigate(PathConstant.MBO_CYCLE_LIST)
  }

  const handleSubmit = () => {
    formik.handleSubmit()
    setTimeout(() => {
      scrollToFirstErrorMessage()
    })
  }
  const compareChangeData = () => {
    return !(
      JSON.stringify({
        evaluationCycleTemplateId: formik.values.evaluationCycleTemplateId,
        appraisees: formik.values.appraisees,
      }) ===
      JSON.stringify({
        evaluationCycleTemplateId: initDataCycle.evaluationCycleTemplateId,
        appraisees: initDataCycle.appraisees,
      })
    )
  }

  const isChangeData = useMemo(
    () => (isDetailPage ? false : compareChangeData()),
    [formik.values]
  )

  useEffect(() => {
    setShowDialog(isChangeData)
  }, [isChangeData])

  useEffect(() => {
    if (!!params.cycleId) {
      setLoadingInformation(true)
      dispatch(getCycleDetail(params.cycleId || ''))
        .unwrap()
        .catch(error => {
          if (error[0]?.field === 'evaluationTemplateId') {
            navigate(MBO_CYCLE_LIST)
          }
          dispatch(
            alertError({
              message: StringFormat(
                i18('MSG_SCREEN_NOT_FOUND'),
                i18Mbo('LB_CYCLE') || ''
              ),
            })
          )
        })
        .finally(() => {
          setLoadingInformation(false)
        })
    }
  }, [])

  return (
    <Fragment>
      <DialogBox
        // @ts-ignore
        showDialog={showPrompt}
        confirmNavigation={confirmNavigation}
        cancelNavigation={cancelNavigation}
      />
      <CommonScreenLayout
        useBackPage
        backLabel={i18Mbo('TXT_BACK_TO_CYCLE_LIST')}
        onBack={handleNavigateToListPage}
      >
        <form onSubmit={formik.handleSubmit}>
          {isDetailPage ? (
            <Box className={classes.detailCycle}>
              <CycleInformation loadingInformation={loadingInformation} />
              <StepCycle loadingStep={loadingInformation} />
            </Box>
          ) : (
            <Box className={clsx(classes.createCycle, 'scrollbar')}>
              <CreateCycle
                formikValues={formik.values}
                formikErrors={formik.errors}
                formikTouched={formik.touched}
                formikSetValues={formik.setValues}
              />
            </Box>
          )}
          {!isDetailPage && (
            <Box className={classes.footerActions}>
              <CommonButton onClick={handleSubmit}>
                {i18('LB_SUBMIT')}
              </CommonButton>
            </Box>
          )}
        </form>
      </CommonScreenLayout>
    </Fragment>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  detailCycle: {},
  createCycle: {},
  footerActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(3),
  },
}))

export default CycleDetail

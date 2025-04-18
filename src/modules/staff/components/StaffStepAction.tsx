import CommonButton from '@/components/buttons/CommonButton'
import ConditionalRender from '@/components/ConditionalRender'
import { AppDispatch } from '@/store'
import { StepConfig } from '@/types'
import { Button, Theme } from '@mui/material'
import Box from '@mui/material/Box'
import { makeStyles } from '@mui/styles'
import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { STAFF_STEP } from '../const'
import { setActiveStep } from '../reducer/staff'

interface IProps {
  activeStep: number
  configSteps: StepConfig[]
  onNext?: () => void
  isViewDetail?: boolean
  disabledBtnNext?: boolean
  isShowNext?: boolean
  isOutsource?: boolean
}

function StaffStepAction(props: IProps) {
  const {
    activeStep,
    configSteps,
    onNext = () => {},
    isViewDetail = false,
    disabledBtnNext = false,
    isShowNext = true,
    isOutsource,
  } = props
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { t: i18 } = useTranslation()

  const classes = useStyles()

  const handleBack = () => {
    if (activeStep === STAFF_STEP.GENERAL_INFORMATION) {
      navigate(-1)
      return
    }
    dispatch(setActiveStep(activeStep - 1))
  }

  const textButtonNext = useMemo(() => {
    return activeStep === configSteps.length - 1 || isOutsource
      ? i18('LB_SUBMIT')
      : isViewDetail
      ? i18('LB_SUBMIT')
      : i18('LB_NEXT')
  }, [activeStep, configSteps, isViewDetail])

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <ConditionalRender conditional={!isViewDetail && activeStep !== 0}>
          <Button
            onClick={handleBack}
            className={classes.prevBtn}
            variant="text"
          >
            {i18('LB_PREVIOUS')}
          </Button>
        </ConditionalRender>
        <Box sx={{ flex: '1 1 auto' }} />
        <ConditionalRender conditional={isShowNext}>
          <CommonButton
            className={classes.nextBtn}
            variant="contained"
            type="submit"
            onClick={onNext}
            disabled={disabledBtnNext}
          >
            {textButtonNext}
          </CommonButton>
        </ConditionalRender>
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  nextBtn: {
    '&.MuiButtonBase-root': {
      fontSize: 14,
      fontWeight: 500,
      height: theme.spacing(5),
      width: theme.spacing(12),
    },
  },
  prevBtn: {
    '&.MuiButtonBase-root': {
      textTransform: 'capitalize',
      color: theme.color.blue.primary,
      fontSize: 14,

      '&:hover': {
        backgroundColor: 'transparent !important',
      },
    },
  },
}))

export default memo(StaffStepAction)

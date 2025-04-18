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
import { PROJECT_STEP } from '../../const'
import { setActiveStep } from '../../reducer/project'

interface IProps {
  activeStep: number
  configSteps: StepConfig[]
  onNext: () => void
  isViewDetail?: boolean
  disabledBtnNext?: boolean
  isShowNext?: boolean
  className?: string
  customButtonLabel?: string
}

function ProjectStepAction(props: IProps) {
  const {
    activeStep,
    configSteps,
    onNext = () => {},
    isViewDetail = false,
    disabledBtnNext = false,
    isShowNext = true,
    className,
    customButtonLabel,
  } = props
  const { t: i18 } = useTranslation()

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const classes = useStyles()

  const handleBack = () => {
    if (activeStep === PROJECT_STEP.GENERAL_INFORMATION) {
      navigate(-1)
      return
    }
    dispatch(setActiveStep(activeStep - 1))
  }

  const textButtonNext = useMemo(() => {
    return activeStep === configSteps.length - 1
      ? i18('LB_SUBMIT')
      : isViewDetail
      ? customButtonLabel || i18('LB_UPDATE')
      : i18('LB_NEXT')
  }, [activeStep, configSteps, isViewDetail])

  return (
    <Box sx={{ width: '100%' }} className={className}>
      <Box
        sx={{ display: 'flex', flexDirection: 'row', pt: isViewDetail ? 0 : 3 }}
      >
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
            type="submit"
            className={classes.nextBtn}
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
      width: 'max-content',
      marginTop: '12px',
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

export default memo(ProjectStepAction)

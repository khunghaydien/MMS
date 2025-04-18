import { StepConfig } from '@/types'
import { StepButton } from '@mui/material'
import Box from '@mui/material/Box'
import Step from '@mui/material/Step'
import Stepper from '@mui/material/Stepper'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { cloneDeep } from 'lodash'
import { useEffect, useState } from 'react'

interface IProps {
  configSteps: StepConfig[]
  activeStep: number
  className?: string
  nonLinear?: boolean
  onClickStep?: (step: number) => void
  listStepHadFillData?: number[]
}

export default function CommonStep(props: IProps) {
  const {
    configSteps,
    activeStep,
    className,
    nonLinear = false,
    onClickStep = () => {},
    listStepHadFillData,
  } = props

  const classes = useStyles()
  const [completed, setCompleted] = useState<{
    [k: number]: boolean
  }>({})

  const checkActionStep = (step: number) => {
    if (!listStepHadFillData && !nonLinear) return false
    if (!listStepHadFillData && nonLinear) return true
    return !!listStepHadFillData && listStepHadFillData.includes(step)
  }

  useEffect(() => {
    if (!nonLinear) {
      if (activeStep <= 0) return
      const newCompleted = cloneDeep(completed)
      newCompleted[activeStep - 1] = true
      setCompleted(newCompleted)
    }
  }, [activeStep])

  return (
    <Box
      sx={{ width: '100%' }}
      className={clsx(classes.rootStepper, className)}
    >
      <Stepper activeStep={activeStep} alternativeLabel nonLinear>
        {configSteps.map((item: StepConfig) => {
          return (
            <Step
              key={item.step}
              completed={completed[item.step]}
              className={clsx(!checkActionStep(item.step) && 'readonly')}
            >
              <StepButton
                color="inherit"
                onClick={() => {
                  if (!checkActionStep(item.step) || item.step === activeStep) {
                    return
                  } else {
                    onClickStep(item.step)
                  }
                }}
              >
                {item.label}
              </StepButton>
            </Step>
          )
        })}
      </Stepper>
    </Box>
  )
}

const useStyles = makeStyles(() => ({
  rootStepper: {
    '& .readonly': {
      pointerEvents: 'none',
    },
  },
}))

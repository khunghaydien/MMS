import CommonButton from '@/components/buttons/CommonButton'
import TooltipWithWarningIcon from '@/components/common/TooltipWithWarningIcon'
import ConditionalRender from '@/components/ConditionalRender'
import { LangConstant } from '@/const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { AppDispatch } from '@/store'
import { Button, Theme } from '@mui/material'
import Box from '@mui/material/Box'
import { makeStyles } from '@mui/styles'
import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CONTRACT_STEP } from '../const'
import { setActiveStep } from '../reducer/contract'

interface IProps {
  activeStep: number
  configSteps: any
  onNext?: () => void
  isDetailPage?: boolean
  disabledBtnNext?: boolean
  useWarning?: boolean
}

function ContractStepAction(props: IProps) {
  const {
    activeStep,
    configSteps,
    onNext = () => {},
    isDetailPage = false,
    disabledBtnNext = false,
    useWarning,
  } = props
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { t: i18 } = useTranslation()
  const { t: i18Contract } = useTranslation(LangConstant.NS_CONTRACT)

  const { permissions }: AuthState = useSelector(selectAuth)

  const classes = useStyles()

  const handleBack = () => {
    if (activeStep === CONTRACT_STEP.GENERAL_INFORMATION) {
      navigate(-1)
      return
    }
    dispatch(setActiveStep(activeStep - 1))
  }

  const textButtonNext = useMemo(() => {
    return activeStep === configSteps.length - 1
      ? i18('LB_SUBMIT')
      : isDetailPage
      ? i18('LB_UPDATE')
      : i18('LB_NEXT')
  }, [activeStep, configSteps, isDetailPage])

  const isShowBtnSubmit = useMemo(() => {
    if (!isDetailPage) return true
    return permissions.useContractUpdate
  }, [permissions])

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          pt: 2,
          alignItems: 'center',
        }}
      >
        <ConditionalRender conditional={!isDetailPage && activeStep !== 0}>
          <Button
            onClick={handleBack}
            className={classes.prevBtn}
            variant="text"
          >
            {i18('LB_PREVIOUS')}
          </Button>
        </ConditionalRender>
        <Box sx={{ flex: '1 1 auto' }} />
        {!!useWarning && (
          <Box className={classes.tooltipIcon}>
            <TooltipWithWarningIcon
              content={i18Contract('MSG_STAFF_DATE_ERROR')}
            />
          </Box>
        )}
        <ConditionalRender conditional={isShowBtnSubmit}>
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
  tooltipIcon: {
    marginRight: theme.spacing(1),
  },
}))

export default memo(ContractStepAction)

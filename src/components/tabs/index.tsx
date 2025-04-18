import { StepConfig } from '@/types'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import CommonButton from '../buttons/CommonButton'

interface IProps {
  configTabs: StepConfig[]
  activeTab: number
  className?: string
  nonLinear?: boolean
  onClickTab?: (step: number) => void
  listStepHadFillData?: number[]
  disabled?: boolean
  onButtonClick?: () => void
  buttonTitle?: string
}

export default function CommonTabs(props: IProps) {
  const {
    configTabs,
    activeTab,
    className,
    onClickTab = () => {},
    disabled = false,
    buttonTitle,
    onButtonClick,
  } = props

  const classes = useStyles()

  const handleChange = (event: React.SyntheticEvent, newTab: number) => {
    onClickTab(newTab)
  }
  const handleButtonClick = () => {
    !!onButtonClick && onButtonClick()
  }

  return (
    <Box
      className={clsx(
        classes.rootTab,
        className,
        buttonTitle ? classes.horizontal : ''
      )}
      sx={{ borderBottom: 1, borderColor: 'divider' }}
    >
      <Tabs value={activeTab} onChange={handleChange}>
        {configTabs.map((item: StepConfig) => (
          <Tab
            icon={item.icon}
            iconPosition="start"
            disabled={disabled || !!item.disabled}
            key={item.step}
            label={item.label}
            style={{ textTransform: 'none' }}
            value={item.step}
          />
        ))}
      </Tabs>
      {buttonTitle && (
        <CommonButton height={40} onClick={handleButtonClick}>
          {buttonTitle}
        </CommonButton>
      )}
    </Box>
  )
}

const useStyles = makeStyles(() => ({
  rootTab: {
    width: '100%',
    marginBottom: '24px',
    '& .readonly': {
      pointerEvents: 'none',
    },
  },
  horizontal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}))

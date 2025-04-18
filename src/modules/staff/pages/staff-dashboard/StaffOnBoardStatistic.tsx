import CardForm from '@/components/Form/CardForm'
import HightIcon from '@/components/icons/HightIcon'
import LowIcon from '@/components/icons/LowIcon'
import MediumIcon from '@/components/icons/MediumIcon'
import { LangConstant } from '@/const'
import { formatNumberDecimal } from '@/utils'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'
import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { staffSelector } from '../../reducer/staff'
import { StaffState } from '../../types'

interface IProp {
  isLoading: boolean
}
const StaffOnBoardStatistic = ({ isLoading }: IProp) => {
  const classes = useStyles()
  const { staffDashboardOnboardStatistic }: StaffState =
    useSelector(staffSelector)
  const { t: i18nStaff } = useTranslation(LangConstant.NS_STAFF)

  const percentageOfDifference = useMemo(() => {
    return formatNumberDecimal(
      staffDashboardOnboardStatistic?.totalRatio || 0,
      2
    )
  }, [staffDashboardOnboardStatistic])

  const percentageOfDifferenceComponent = useMemo(() => {
    if (percentageOfDifference > 0)
      return (
        <HightIcon color={'#66BB6A'} label={`${percentageOfDifference}%`} />
      )
    else if (percentageOfDifference < 0)
      return <LowIcon color={'#FF3C3C'} label={`${percentageOfDifference}%`} />
    else
      return (
        <MediumIcon color={'#ffab02'} label={`${percentageOfDifference}%`} />
      )
  }, [percentageOfDifference])

  return (
    <CardForm
      isLoading={isLoading}
      title={i18nStaff('TXT_ONBOARD_STATISTIC') || ''}
      className={classes.rootStaffOnBoardStatistic}
    >
      <Box className={classes.contentOnBoard}>
        <Box className="numberOnboard">
          {staffDashboardOnboardStatistic?.totalNewOnboard || 0}
        </Box>
        <Box className="subTitle">{i18nStaff('TXT_NEW_ONBOARD') || ''}</Box>
        <Box className="percentageOfDifference">
          {percentageOfDifferenceComponent}
        </Box>

        <Box className="percentageDescription">
          {i18nStaff('TXT_FROM_PREVIOUS_DATE') || ''}
        </Box>
      </Box>
    </CardForm>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootStaffOnBoardStatistic: {
    height: '100%',
    width: '100%',
  },
  contentOnBoard: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    '& .numberOnboard': {
      fontWeight: 700,
      fontSize: '60px',
      display: 'flex',
      justifyContent: 'center',
    },
    '& .subTitle': {
      fontWeight: 700,
      fontSize: '20px',
      display: 'flex',
      justifyContent: 'center',
    },
    '& .percentageOfDifference': {
      fontWeight: 700,
      fontSize: '20px',
      display: 'flex',
      justifyContent: 'center',
      color: '#FF3C3C',
      gap: '10px',
      margin: '5px 0',
    },
    '& .percentageDescription': {
      fontWeight: 400,
      fontSize: '16px',
      display: 'flex',
      justifyContent: 'center',
    },
  },
}))
export default memo(StaffOnBoardStatistic)

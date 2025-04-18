import CardForm from '@/components/Form/CardForm'
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

const StaffTurnoverRate = ({ isLoading }: { isLoading: boolean }) => {
  const classes = useStyles()
  const { staffDashboardTurnoverRate }: StaffState = useSelector(staffSelector)
  const { t: i18nStaff } = useTranslation(LangConstant.NS_STAFF)

  //memo
  const turnoverRate = useMemo(() => {
    return formatNumberDecimal(staffDashboardTurnoverRate, 2) || 0
  }, [staffDashboardTurnoverRate])

  return (
    <CardForm
      title={i18nStaff('TXT_TURNOVER_RATE') || ''}
      className={classes.rootStaffTurnoverRate}
      isLoading={isLoading}
    >
      <Box className={classes.contentTurnoverRate}>
        <Box className="numberTurnoverRate">{turnoverRate}%</Box>
        <Box className="subTitle">{i18nStaff('TXT_TURNOVER_RATE') || ''}</Box>
      </Box>
    </CardForm>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootStaffTurnoverRate: {
    height: '100%',
    width: '100%',
  },
  contentTurnoverRate: {
    marginTop: '50px',
    display: 'flex',
    justifyContent: 'center',
    '& .numberTurnoverRate': {
      fontWeight: 700,
      fontSize: '60px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    '& .subTitle': {
      fontWeight: 700,
      fontSize: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
}))
export default memo(StaffTurnoverRate)

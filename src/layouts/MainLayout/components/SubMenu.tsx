import { setInitialContract } from '@/modules/contract/reducer/contract'
import { setInitialCustomer } from '@/modules/customer/reducer/customer'
import { setInitialPartner } from '@/modules/customer/reducer/partner'
import { setInitialDailyReport } from '@/modules/daily-report/reducer/dailyReport'
import { setInitialDashboard } from '@/modules/dashboard/reducer/dashboard'
import { setInitialFinance } from '@/modules/finance/reducer/finance'
import { setInitialCriteria } from '@/modules/mbo/reducer/criteria'
import { setInitialCycle } from '@/modules/mbo/reducer/cycle'
import { setInitialEvaluation } from '@/modules/mbo/reducer/evaluation-process'
import { setInitialProject } from '@/modules/project/reducer/project'

import modules from '@/modules/routes'
import { setInitialStaff } from '@/modules/staff/reducer/staff'
import { AuthState, selectAuth } from '@/reducer/auth'
import { resetToggleDropDown } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { NavItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
interface ISubMenu {
  moduleName: string
}

const SubMenu = ({ moduleName }: ISubMenu) => {
  const classes = useStyles()
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { permissions }: AuthState = useSelector(selectAuth)
  const { pathname } = location

  const features = useMemo(() => {
    return modules.find(md => md.name === moduleName)?.features || []
  }, [moduleName])

  const handleNavigateManagementPage = (path: string) => {
    dispatch(setInitialCustomer())
    dispatch(setInitialStaff())
    dispatch(setInitialContract())
    dispatch(setInitialPartner())
    dispatch(setInitialDailyReport())
    dispatch(setInitialDashboard())
    dispatch(setInitialFinance())
    dispatch(setInitialCriteria())
    dispatch(setInitialCycle())
    dispatch(setInitialEvaluation())
    dispatch(setInitialProject())
    navigate(path)
  }

  const handleSidebarClick = (nav: NavItem) => {
    handleNavigateManagementPage(nav.pathNavigate)
    dispatch(resetToggleDropDown({ key: moduleName, value: true }))
  }

  const isActive = (activeChildren: string) => {
    return pathname.includes(activeChildren)
  }

  return (
    <Box className={clsx(classes.navList)}>
      {features
        .filter(feature => permissions[feature.role] || feature.role === '')
        .map((navItem: NavItem) => (
          <Box
            title={navItem.label}
            key={navItem.id}
            className={clsx(
              classes.navItem,
              isActive(navItem.activeChildren) && 'active'
            )}
            onClick={() =>
              !isActive(navItem.activeChildren) && handleSidebarClick(navItem)
            }
          >
            <Box>{navItem.label}</Box>
          </Box>
        ))}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  navList: {
    margin: theme.spacing(1, 1, 1, 1),
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing(3),
    gap: theme.spacing(1),
  },
  navItem: {
    position: 'relative',
    fontSize: 15,
    cursor: 'pointer',
    lineHeight: 1,
    borderRadius: '4px',
    width: 'calc(100%)',
    padding: theme.spacing(1),
    backgroundColor: 'transparent',
    color: theme.color.black.secondary,
    '&:hover': {
      backgroundColor: theme.color.grey.secondary,
    },

    '&.active': {
      fontWeight: 700,
      color: theme.color.white,
      backgroundColor: theme.color.blue.primary,
    },

    '&:first-child': {
      '&::before': {
        zIndex: 0,
        height: theme.spacing(3),
        top: `-${theme.spacing(1)}`,
      },
    },

    '&::before': {
      content: '" "',
      position: 'absolute',
      width: theme.spacing(2),
      height: theme.spacing(8),
      borderLeft: `2px solid ${theme.color.grey.primary}`,
      borderBottom: `2px solid ${theme.color.grey.primary}`,
      borderRadius: '0px 0px 0px 4px',
      top: `-${theme.spacing(6)}`,
      left: `-${theme.spacing(2)}`,
    },
  },
}))

export default SubMenu

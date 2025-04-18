import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import Notifications from '@/components/notify/Notifications'
import { PathConstant } from '@/const'
import { NS_SETTING } from '@/const/lang.const'
import { MODULE_SETTINGS } from '@/const/path.const'
import { useClickOutside2 } from '@/hooks'
import { AuthState, logout, selectAuth } from '@/reducer/auth'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { getAbbreviations, invertColor } from '@/utils'
import { KeyboardArrowDown, Logout, Settings } from '@mui/icons-material'
import { Box, Grow, Paper, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import String2Color from 'string-to-color'
import morLogo from '../../../ui/images/mor-logo-single.png'

const HeaderTop = () => {
  const { t: i18 } = useTranslation()
  const { t: i18Setting } = useTranslation(NS_SETTING)
  const { staff }: AuthState = useSelector(selectAuth)
  const { pathname } = useLocation()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const colorBackground = String2Color(staff?.name)
  const colorShortName = invertColor(colorBackground)
  const classes = useStyles({
    background: colorBackground,
    color: colorShortName,
  })
  const shortName = getAbbreviations(staff?.name || '')
  const dropDownRef = useRef<any>(null)
  const [toggleDropDownMenu, setToggleDropDownMenu] = useState(false)
  const [isShowModalLogout, setIsShowModalLogout] = useState(false)

  useClickOutside2(dropDownRef, () => {
    setToggleDropDownMenu(false)
  })

  const handleToggleMenu = () => {
    setToggleDropDownMenu(current => !current)
  }

  const handleNavigateToModule = (pathNavigate: string) => {
    const isCurrentModule: boolean = pathname.includes(pathNavigate)
    if (!isCurrentModule) {
      navigate(pathNavigate)
    }
    setToggleDropDownMenu(false)
  }

  const handleLogout = () => {
    dispatch(updateLoading(true))
    dispatch(logout())
      .unwrap()
      .then(() => {
        window.location.href = PathConstant.LOGIN
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  return (
    <Box className={classes.rootHeaderLayout}>
      <Box className="header-left">
        <img
          style={{
            width: '40px',
          }}
          src={morLogo}
        />
        <Box className="title">{i18('TXT_APP_NAME')}</Box>
      </Box>
      <Box className="header-right">
        <Box className={classes.headerDots}>
          <Notifications />
        </Box>
        <Box className={classes.containerProfile} ref={dropDownRef}>
          <Box
            className={clsx(classes.myProfile, toggleDropDownMenu && 'active')}
            onClick={handleToggleMenu}
          >
            <Box className={classes.avatar}>{shortName || 'A'}</Box>
            <Box className={classes.info}>
              <Box className="username">{staff?.name || 'Admin'}</Box>
              <Box className="position">{staff?.positionName || 'MOR'}</Box>
            </Box>
            <KeyboardArrowDown className={classes.profileIcon} />
          </Box>
          <Grow
            in={toggleDropDownMenu}
            style={{ transformOrigin: '0 0 0' }}
            {...(toggleDropDownMenu ? { timeout: 200 } : {})}
          >
            {
              <Paper className={classes.dropDownMenu}>
                <Box
                  title={i18Setting('TXT_SETTINGS')}
                  className={classes.module}
                  onClick={() => {
                    handleNavigateToModule(MODULE_SETTINGS)
                  }}
                >
                  <Settings />
                  <Box>{i18Setting('TXT_SETTINGS')}</Box>
                </Box>
                <Box
                  className={classes.module}
                  onClick={() => setIsShowModalLogout(true)}
                  title="logout"
                >
                  <Logout />
                  <Box>{i18('LB_LOG_OUT')}</Box>
                </Box>
              </Paper>
            }
          </Grow>
        </Box>
        <ModalDeleteRecords
          labelSubmit={i18('LB_LOG_OUT')}
          open={isShowModalLogout}
          onClose={() => setIsShowModalLogout(false)}
          onSubmit={handleLogout}
          titleMessage={i18('LB_LOG_OUT')}
          subMessage={i18('MSG_LOG_OUT')}
        />
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootHeaderLayout: {
    width: '100%',
    height: theme.spacing(9),
    background: '#ffffff',
    alignItems: 'center',
    padding: theme.spacing(1, 4, 1, 1.5),
    borderBottom: `1px solid ${theme.color.grey.secondary}`,
    zIndex: '3',
    display: 'flex',
    justifyContent: 'space-between',
    '& .title': {
      fontWeight: 700,
      fontSize: 18,
      color: theme.color.blue.primary,
    },
    '& .header-right': {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    },
    '& .header-left': {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
    },
  },
  headerDots: {
    display: 'flex',
  },
  avatar: {
    width: '40px',
    height: '40px',
    background: ({ background }: any) => background,
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: ({ color }: any) => color,
    marginRight: '10px',
    position: 'relative',
  },
  info: {
    '& .username': {
      fontSize: '18px',
      fontWeight: '700',
      maxWidth: '240px',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
    '& .position': {
      fontSize: '14px',
      fontWeight: '400',
    },
  },
  line: {
    width: '1px',
    height: '50px',
    background: '#dee2e6',
    margin: '0 10px 0 10px',
  },
  containerProfile: {
    position: 'relative',
  },
  profileIcon: {
    marginLeft: theme.spacing(1),
  },
  myProfile: {
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: theme.spacing(1),
    borderRadius: '4px',
    background: theme.color.blue.six,
    '&.active': {
      backgroundColor: theme.color.grey.secondary,
    },
    '&:hover': {
      backgroundColor: theme.color.grey.secondary,
    },
  },
  dropDownMenu: {
    zIndex: 100,
    position: 'absolute',
    right: 0,
    marginTop: theme.spacing(0.5),
    width: '100%',
    minWidth: theme.spacing(22),
    backgroundColor: theme.color.white,
    border: `1px solid ${theme.color.grey.secondary}`,
  },
  module: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    cursor: 'pointer',
    fontSize: 16,
    lineHeight: 1,
    borderRadius: '4px',
    padding: theme.spacing(1, 1),
    backgroundColor: 'transparent',
    color: theme.color.black.secondary,
    '&:hover': {
      backgroundColor: theme.color.grey.secondary,
    },
  },
}))

export default HeaderTop

import ButtonTransition from '@/components/buttons/ButtonTransition'
import ModalFeedBack, { IFeedBack } from '@/components/modal/ModalFeedBack'
import { ID_MODULE_SETTING } from '@/const/app.const'
import modules from '@/modules/routes'
import { AuthState, selectAuth } from '@/reducer/auth'
import { sendFeedback } from '@/reducer/common'
import { alertSuccess, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import morLogoSingle from '@/ui/images/mor-logo-single.png'
import { themeColors } from '@/ui/mui/v5'
import { Facebook, Feedback, ScreenSearchDesktop } from '@mui/icons-material'
import { Box, Collapse, Theme, Tooltip } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { Fragment, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import NavigationModule from './NavigationModule'

interface ILeftNavigation {}

const LeftNavigation = ({}: ILeftNavigation) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { t: i18 } = useTranslation()
  const { permissions, staff }: AuthState = useSelector(selectAuth)

  const [toggleLeftNavigation, setToggleLeftNavigation] = useState(true)
  const [isShowFeedback, setIsShowFeedback] = useState(false)

  const handleNavigateToModule = (pathNavigate: string) => {
    const isCurrentModule: boolean = pathname.includes(pathNavigate)
    if (!isCurrentModule) {
      navigate(pathNavigate)
    }
  }

  const checkShowModule = (listPermission: Array<string>) => {
    return listPermission.some((key: string) => permissions[key])
  }

  const isActive = (moduleName: string) => {
    const currentModuleName = pathname.split('/')[1]
    return moduleName === currentModuleName
  }

  const haveFeature = (moduleName: string) => {
    const moduleFeature =
      modules.find(md => md.name === moduleName)?.features || []
    return !!moduleFeature.length
  }

  const modulesForHrOutsourcing = modules.filter(function (item) {
    return item?.name !== 'staff'
  })

  const modulesFormat =
    staff?.branch?.name === 'HR Outsourcing' ? modulesForHrOutsourcing : modules

  const links = useMemo(
    () => [
      {
        id: 1,
        defaultIcon: (
          <Facebook sx={{ color: themeColors.color.blue.primary }} />
        ),
        url: 'https://www.facebook.com/morjsc',
        tooltip: 'Facebook: MOR Software JSC',
      },
      {
        id: 2,
        defaultIcon: (
          <ScreenSearchDesktop sx={{ color: themeColors.color.blue.primary }} />
        ),
        url: 'http://wiki.mor-software.com/',
        tooltip: 'MOR Wiki',
      },
      {
        id: 3,
        defaultIcon: <img style={{ width: '22px' }} src={morLogoSingle} />,
        url: 'https://morsoftware.com/',
        tooltip: 'Website of MOR Software page',
      },
    ],
    []
  )

  const submitFeedBack = (value: IFeedBack) => {
    dispatch(updateLoading(true))
    dispatch(sendFeedback(value))
      .unwrap()
      .then(() => {
        setIsShowFeedback(false)
        dispatch(
          alertSuccess({
            message: i18('MSG_FEEDBACK_SUCCESS'),
          })
        )
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  const openNewTab = (url: string) => {
    window.open(url)
  }

  return (
    <Fragment>
      <Box className={classes.rootLeftNavigation}>
        <ButtonTransition
          bottom={'100px'}
          left={'calc(100% - 1px)'}
          timeout={200}
          label={i18('LB_MENU')}
          toggleButton={toggleLeftNavigation}
          setToggleButton={setToggleLeftNavigation}
          direction="right"
        />
        <Collapse
          in={toggleLeftNavigation}
          orientation="horizontal"
          timeout={200}
        >
          <Box
            className={clsx(classes.containerLeftNavigation, 'position-rel')}
          >
            <Box className={classes.modules}>
              <Box className={clsx('scrollbar', 'container-module')}>
                {modulesFormat.map(
                  md =>
                    checkShowModule(md.roles) &&
                    (md.id != ID_MODULE_SETTING ? (
                      <NavigationModule
                        key={md.id}
                        isActive={isActive(md.name)}
                        haveFeature={haveFeature(md.name)}
                        labelName={md.labelName}
                        name={md.name}
                        ModuleIcon={md.Icon}
                        onClick={() => handleNavigateToModule(md.pathNavigate)}
                      />
                    ) : (
                      ''
                    ))
                )}
              </Box>
              <Box className={clsx(classes.modules, classes.bottomContainer)}>
                <Box className={classes.socialBox}>
                  {links.map(link => (
                    <Tooltip title={link.tooltip} key={link.id}>
                      <Box
                        className={classes.iconBox}
                        onClick={() => openNewTab(link.url)}
                      >
                        {link.defaultIcon}
                      </Box>
                    </Tooltip>
                  ))}
                </Box>
                <Box
                  className={classes.feedbackBox}
                  onClick={() => {
                    setIsShowFeedback(true)
                  }}
                >
                  <Feedback />
                  <Box>{i18('LB_FEEDBACK')}</Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Collapse>
      </Box>
      {isShowFeedback && (
        <ModalFeedBack
          onClose={() => setIsShowFeedback(false)}
          onSubmit={submitFeedBack}
        />
      )}
    </Fragment>
  )
}

const useStyles = makeStyles((theme: Theme) => {
  const borderGrey = `1px solid ${theme.color.grey.secondary}`
  return {
    rootLeftNavigation: {
      position: 'relative',
    },
    logout: {
      width: '100%',
      height: '54px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '&:hover': {
        backgroundColor: theme.color.grey.secondary,
      },
    },

    bottomContainer: {
      margin: 'unset !important',
      position: 'absolute',
      bottom: 0,
      width: '100%',
      background: theme.color.white,
    },
    logoutImg: {
      color: theme.color.black.secondary,
      width: '24px !important',
      height: '24px !important',
      transform: 'rotate(180deg)',
    },
    containerLeftNavigation: {
      position: 'relative',
      zIndex: 2,
      width: '210px',
      height: '100%',
      background: theme.color.white,
      borderRight: borderGrey,
    },
    modules: {
      '& .container-module': {
        height: 'calc(100vh - 72px)',
        overflow: 'auto',
      },
      '& .scrollbar::-webkit-scrollbar': {
        width: '2px !important',
      },
    },
    feedbackBox: {
      background: theme.color.grey.tertiary,
      display: 'flex',
      padding: theme.spacing(1.5, 1),
      justifyContent: 'center',
      alignItems: 'center',
      gap: theme.spacing(1),
      color: theme.color.blue.primary,
      fontWeight: 500,
      cursor: 'pointer',
      '&:hover': {
        background: theme.color.blue.six,
      },
    },
    socialBox: {
      display: 'flex',
      justifyContent: 'center',
      gap: theme.spacing(1),
      alignItems: 'center',
      marginBottom: theme.spacing(1),
    },
    iconBox: {
      cursor: 'pointer',
      height: '32px',
      border: `1px solid ${theme.color.blue.primary}`,
      borderRadius: theme.spacing(1),
      padding: theme.spacing(0.5),
      '&:hover': {
        transform: 'scale(1.05)',
      },
    },
  }
})

export default LeftNavigation

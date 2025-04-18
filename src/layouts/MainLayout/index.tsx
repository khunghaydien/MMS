import Processing from '@/components/common/Processing'
import { PathConstant } from '@/const'
import { EMAIL } from '@/const/api.const'
import { RESET_EMAIL_INTERNAL, SCREEN_TABLET } from '@/const/app.const'
import { AuthState, getSelfInfo, selectAuth } from '@/reducer/auth'
import { ScreenState, selectScreen, setIsShowSideBar } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AllRoutesOfFeatures from './components/AllRoutesOfFeatures'
import HeaderTop from './components/HeaderTop'
import LeftNavigation from './components/LeftNavigation'

const MainLayout = () => {
  const classes = useStyles()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const emailInterval = useRef<NodeJS.Timeout | null>(null)

  const { email, permissions }: AuthState = useSelector(selectAuth)
  const { isLoading }: ScreenState = useSelector(selectScreen)

  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  })
  const [hasRequestProfile, setHasRequestProfile] = useState(false)

  const isRoles = useMemo(() => {
    return !!Object.keys(permissions).length
  }, [permissions])

  if (!email) {
    window.location.href = PathConstant.LOGIN
  }

  const onPageScroll = () => {
    const mainLayout = document.getElementById('main__layout') as HTMLDivElement
    const categoriesKPIElement = document.getElementById(
      'categoriesKPI'
    ) as HTMLDivElement
    const kpiRightContent = document.getElementById(
      'kpi-right-content'
    ) as HTMLDivElement
    if (!categoriesKPIElement) return
    const sticky = categoriesKPIElement.offsetTop
    if (mainLayout.scrollTop > 140 && mainLayout.scrollTop < 210) {
      categoriesKPIElement.classList.remove('kpi-categories-sticky')
      kpiRightContent.style.paddingLeft = 'unset'
      kpiRightContent.style.width = 'calc(100% - 110px)'
      return
    }
    if (mainLayout.scrollTop > sticky - 13) {
      categoriesKPIElement.classList.add('kpi-categories-sticky')
      kpiRightContent.style.paddingLeft = '130px'
      kpiRightContent.style.width = '100%'
    } else {
      categoriesKPIElement.classList.remove('kpi-categories-sticky')
      kpiRightContent.style.paddingLeft = 'unset'
      kpiRightContent.style.width = 'calc(100% - 110px)'
    }
  }

  useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      })
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (dimensions.width > SCREEN_TABLET) {
      dispatch(setIsShowSideBar(true))
    } else {
      dispatch(setIsShowSideBar(false))
    }
  }, [dimensions])

  useEffect(() => {
    if (!email) return
    if (!isRoles && hasRequestProfile) {
      navigate(PathConstant.LOGIN)
      return
    }
    !isRoles &&
      dispatch(getSelfInfo()).finally(() => {
        setHasRequestProfile(true)
      })
  }, [hasRequestProfile])

  useEffect(() => {
    if (emailInterval.current) {
      clearInterval(emailInterval.current)
    }
    emailInterval.current = setInterval(() => {
      const newEmail = localStorage.getItem(EMAIL) || ''
      if (!newEmail) {
        window.location.href = PathConstant.LOGIN
        return
      }
    }, RESET_EMAIL_INTERNAL)
    return () => {
      !!emailInterval.current && clearInterval(emailInterval.current)
    }
  }, [])

  return !isRoles ? (
    <Processing open />
  ) : (
    <Fragment>
      <Processing open={isLoading} />
      <Box className={classes.mainLayout}>
        <Box className={classes.main}>
          <HeaderTop />
          <Box className={classes.container}>
            <LeftNavigation />
            <Box
              id="main__layout"
              className={clsx(classes.pages, 'pages', 'scrollbar')}
              onScroll={onPageScroll}
            >
              <AllRoutesOfFeatures />
            </Box>
          </Box>
        </Box>
      </Box>
    </Fragment>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  mainLayout: {
    padding: 0,
  },
  main: {
    height: '100vh',
    width: 'calc(100%)',
    overflow: 'clip',
  },
  container: {
    display: 'flex',
    height: 'calc(100% - 72px)',
  },
  pages: {
    position: 'relative',
    overflow: 'auto',
    flex: 1,
    height: 'calc(100% - 2px)',
  },
}))

export default MainLayout

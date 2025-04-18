import {
  CommonState,
  commonSelector,
  resetToggleDropDown,
  setToggleDropDown,
} from '@/reducer/common'
import { AppDispatch } from '@/store'
import { KeyboardArrowRight, SvgIconComponent } from '@mui/icons-material'
import { Box, Collapse, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SubMenu from './SubMenu'
interface INavigationModule {
  isActive: boolean
  haveFeature: boolean
  labelName: string
  name: string
  ModuleIcon: SvgIconComponent
  onClick: () => void
}

const NavigationModule = ({
  isActive,
  haveFeature,
  labelName,
  name,
  ModuleIcon,
  onClick,
}: INavigationModule) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const containerRef = useRef(null)
  const { toggleDropDownSubMenu }: CommonState = useSelector(commonSelector)

  const handleModuleClick = () => {
    if (haveFeature) {
      dispatch(
        setToggleDropDown({ key: name, value: !toggleDropDownSubMenu[name] })
      )
    } else {
      dispatch(resetToggleDropDown({ key: name, value: true }))
      onClick()
    }
  }

  useEffect(() => {
    if (isActive && haveFeature) {
      dispatch(
        setToggleDropDown({ key: name, value: !toggleDropDownSubMenu[name] })
      )
    }
  }, [])

  return (
    <Box className={clsx(classes.rootModule)}>
      <Box
        title={labelName}
        className={clsx(classes.module, isActive && 'active')}
        onClick={handleModuleClick}
        ref={containerRef}
      >
        <ModuleIcon
          className={clsx(classes.moduleIcon, isActive && 'active')}
        />
        <Box className={classes.moduleLabel}>{labelName}</Box>
        {haveFeature && (
          <KeyboardArrowRight
            className={clsx(
              classes.moduleDropDownIcon,
              toggleDropDownSubMenu[name] && 'active'
            )}
          />
        )}
      </Box>
      <Collapse
        orientation="vertical"
        in={toggleDropDownSubMenu[name] && haveFeature}
      >
        <SubMenu moduleName={name} />
      </Collapse>
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootModule: {
    marginTop: theme.spacing(1),
  },
  module: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    cursor: 'pointer',
    fontSize: 15,
    fontWeight: 500,
    lineHeight: 1,
    borderRadius: '4px',
    width: 'calc(100%)',
    padding: theme.spacing(1, 1),
    backgroundColor: 'transparent',
    color: theme.color.black.secondary,
    '&:hover': {
      backgroundColor: `${theme.color.grey.secondary}`,
    },
    '&.active': {
      fontWeight: 500,
      color: theme.color.white,
      backgroundColor: `${theme.color.blue.primary}`,
    },
  },
  moduleIcon: {
    fontSize: '24px !important',
    color: theme.color.black.secondary,
    '&.active': {
      color: theme.color.white,
      backgroundColor: `${theme.color.blue.primary}`,
    },
  },
  moduleLabel: {
    flex: 1,
  },
  moduleDropDownIcon: {
    color: 'inherits',
    fontSize: '20px !important',
    '&.active': {
      transform: 'rotate(90deg)',
    },
  },
}))

export default NavigationModule

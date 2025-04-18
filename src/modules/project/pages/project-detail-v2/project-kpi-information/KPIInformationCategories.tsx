import { NS_PROJECT } from '@/const/lang.const'
import {
  projectSelector,
  setKpiDetailMenu,
} from '@/modules/project/reducer/project'
import { ProjectState } from '@/modules/project/types'
import { AppDispatch } from '@/store'
import {
  BakeryDining,
  Iso,
  PunchClock,
  RequestQuote,
  StarOutline,
} from '@mui/icons-material'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

const KPIInformationCategories = () => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Project } = useTranslation(NS_PROJECT)
  const { kpiDetailMenu, permissionProjectKPI }: ProjectState =
    useSelector(projectSelector)

  const categories = [
    {
      id: 'quality',
      label: i18Project('TXT_QUALITY'),
      Icon: StarOutline,
      isVisible:
        !!permissionProjectKPI.deliveryViewTimeliness ||
        !!permissionProjectKPI.viewBugRate ||
        !!permissionProjectKPI.viewLeakageRate,
    },
    {
      id: 'cost',
      label: i18Project('TXT_EE'),
      Icon: RequestQuote,
      isVisible: !!permissionProjectKPI.costEffortEfficiency,
    },
    {
      id: 'delivery',
      label: i18Project('TXT_TIMELINESS'),
      Icon: PunchClock,
      isVisible:
        !!permissionProjectKPI.deliveryViewTimeliness ||
        !!permissionProjectKPI.deliveryViewActivityLog,
    },
    {
      id: 'process',
      label: i18Project('TXT_PCV'),
      Icon: BakeryDining,
      isVisible: !!permissionProjectKPI.processView,
    },
    {
      id: 'plusAndMinus',
      label: i18Project('TXT_BONUS_AND_PENALTY'),
      Icon: Iso,
      isVisible:
        !!permissionProjectKPI.plusAndMinusViewOverallEvaluation ||
        !!permissionProjectKPI.customerComplaintSummary,
    },
  ]

  return (
    <Box className={classes.RootKPIInformationCategories} id="categoriesKPI">
      {categories
        .filter(category => !!category.isVisible)
        .map(category => (
          <Box
            key={category.id}
            className={clsx(
              classes.menuItem,
              kpiDetailMenu === category.id && 'active'
            )}
            onClick={() => dispatch(setKpiDetailMenu(category.id))}
          >
            <Box className={classes.boxIcon}>
              <category.Icon />
            </Box>
            <Box component="span" className={classes.menuName}>
              {category.label}
            </Box>
          </Box>
        ))}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootKPIInformationCategories: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  menuItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    width: '105px',
    gap: theme.spacing(1),
    '& svg': {
      color: theme.color.black.secondary,
    },
    '&:hover': {
      color: theme.color.blue.primary,
      fontWeight: 700,
      '& div': {
        border: `2px solid ${theme.color.blue.primary}`,
        padding: theme.spacing(0.4),
      },
    },
    '&:hover svg': {
      color: theme.color.blue.primary,
    },
    '&.active': {
      color: theme.color.blue.primary,
      fontWeight: 700,
      pointerEvents: 'none',
    },
    '&.active svg': {
      color: '#fff',
    },
    '&.active div': {
      background: theme.color.blue.primary,
      borderColor: theme.color.blue.primary,
    },
  },
  menuName: {
    fontSize: 14,
  },
  boxIcon: {
    border: `1px solid ${theme.color.grey.secondary}`,
    borderRadius: '8px',
    padding: theme.spacing(0.5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

export default KPIInformationCategories

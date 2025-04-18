import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import { LangConstant } from '@/const'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import CriteriaFilter from './CriteriaFilter'
import TableCriteria from './TableCriteria'

const CriteriaList = () => {
  const classes = useStyles()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)

  return (
    <CommonScreenLayout title={i18Mbo('LB_CRITERIA_LIST')}>
      <Box className={classes.criteriaContainer}>
        <CriteriaFilter />
        <TableCriteria />
      </Box>
    </CommonScreenLayout>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootCriteriaList: {},
  title: {
    fontSize: 16,
    fontWeight: 700,
    borderBottom: `1px solid ${theme.color.grey.secondary}`,
    width: 'max-content',
    paddingBottom: '28px',
  },
  criteriaContainer: {
    marginTop: theme.spacing(3),
  },
}))
export default CriteriaList

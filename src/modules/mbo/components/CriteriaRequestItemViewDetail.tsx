import { LangConstant } from '@/const'
import { OptionItem } from '@/types'
import { replaceWithBr } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { CriteriaRequest } from '../models'

interface IProps {
  criteriaSelection: CriteriaRequest
}

const CriteriaRequestItemViewDetail = ({ criteriaSelection }: IProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)

  const detailValues = useMemo(() => {
    return [
      {
        id: 'name',
        label: i18Mbo('LB_CRITERIA_NAME'),
        value: criteriaSelection.name,
      },
      {
        id: 'description',
        label: i18('LB_DESCRIPTION'),
        value: criteriaSelection.description,
      },
    ]
  }, [criteriaSelection.name, criteriaSelection.description])

  return (
    <Box className={classes.criteriaRequestItemViewDetail}>
      <Box className={classes.general}>
        {detailValues.map(
          (option: OptionItem) =>
            !!option.value && (
              <Box className={classes.option} key={option.id}>
                <Box className={classes.label}>{option.label}:</Box>
                <Box
                  className="content"
                  dangerouslySetInnerHTML={{
                    __html: replaceWithBr(option.value.toString()),
                  }}
                />
              </Box>
            )
        )}
      </Box>
      <Box className={classes.evaluationScale}>
        <Box className={classes.evaluationScaleTitle}>
          {i18Mbo('LB_EVALUATION_SCALE')}
        </Box>
        <Box className={classes.tableEvaluation}>
          {criteriaSelection.criteriaDetail.map(evaluation => (
            <Box className={classes.evaluation} key={evaluation.id}>
              <Box className={classes.score}>{evaluation.score}</Box>
              <Box className={classes.content}>{evaluation.content}</Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  criteriaRequestItemViewDetail: {
    marginTop: theme.spacing(3),
  },
  general: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  option: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(3),
  },
  label: {
    width: theme.spacing(15),
    fontSize: 14,
    fontWeight: 700,
  },
  evaluationScale: {
    marginTop: theme.spacing(2),
  },
  evaluationScaleTitle: {
    fontWeight: 700,
    fontSize: 14,
    marginBottom: theme.spacing(1),
  },
  tableEvaluation: {
    border: `1px solid ${theme.color.grey.primary}`,
    borderRadius: '4px',
    borderBottom: '0px',
  },
  evaluation: {
    display: 'flex',
  },
  score: {
    padding: theme.spacing(1, 1.5),
    borderRight: `1px solid ${theme.color.grey.primary}`,
    borderBottom: `1px solid ${theme.color.grey.primary}`,
    width: theme.spacing(6),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
  },
  content: {
    flex: 1,
    padding: theme.spacing(1, 1.5),
    borderBottom: `1px solid ${theme.color.grey.primary}`,
    wordBreak: 'break-all',
  },
  value: {
    flex: 1,
  },
}))

export default CriteriaRequestItemViewDetail

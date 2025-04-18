import CommonTable from '@/components/table/CommonTable'
import { LangConstant } from '@/const'
import { TableHeaderColumn } from '@/types'
import { Box, Theme, Tooltip } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { IAppraiser } from '../models'
import ItemRowCellEndEvaluation from './ItemRowCellEndEvaluation'

interface IProps {
  appraisers: IAppraiser[]
  appraisee: any
  criteria: any
  isFinalScore?: boolean
  showDifficultyRow?: boolean
}

const TableTaskOrAttitudeEvaluation = ({
  appraisers,
  appraisee,
  criteria,
  isFinalScore = false,
  showDifficultyRow = false,
}: IProps) => {
  const classes = useStyles()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)

  const ToolTipAppraiser = (
    title: string,
    score: string,
    content: string,
    reasonDifficulty: string
  ) => {
    return (
      <Box className={classes.toolTipScore}>
        <Box className={'toolTipName'}>{title}</Box>
        {!!score && (
          <Box className={'toolTipDescription'}>
            <Box className={classes.topTooltip}>
              <Box className={classes.taskScore}>{score}</Box>
              <Box>{content}</Box>
            </Box>
            {!!reasonDifficulty && (
              <Box>
                {i18Mbo('LB_DIFFICULTY_REASON')}: {reasonDifficulty}
              </Box>
            )}
          </Box>
        )}
      </Box>
    )
  }

  const attitudeHeadCellsDefault: TableHeaderColumn[] = [
    {
      id: 'name',
      align: 'left',
      label: i18Mbo('LB_EVALUATION_CRITERIA'),
      ellipsisNumber: 200,
    },
    {
      id: 'weight',
      align: 'left',
      label: i18Mbo('LB_WEIGHT'),
    },
  ]
  const attitudeHeadCells = useMemo(() => {
    let _attitudeHeadCells: TableHeaderColumn[] = [...attitudeHeadCellsDefault]
    if (!!appraisee) {
      _attitudeHeadCells.push({
        id: 'appraisee',
        align: 'center',
        label: !!appraisee?.name
          ? appraisee?.name || ''
          : `${i18Mbo('LB_APPRAISEE')}`,
        isHighlight: true,
      })
    }
    const lengthAppraisers = appraisers?.length || 0
    appraisers?.forEach((appraiser: IAppraiser, index: number) => {
      if (index == lengthAppraisers - 1) {
        _attitudeHeadCells.push({
          id: 'final',
          align: 'center',
          label: isFinalScore ? i18Mbo('LB_FINAL_SCORE') : appraiser.name,
          isHighlight: true,
        })
      } else {
        _attitudeHeadCells.push({
          id: `appraiser${index}`,
          align: 'center',
          label: !!appraiser.name
            ? `${appraiser.name}${appraiser.isDraft ? ' (Draft)' : ''}`
            : `${i18Mbo('LB_APPRAISER')} ${index + 1}`,
          isHighlight: true,
        })
      }
    })
    return _attitudeHeadCells
  }, [attitudeHeadCellsDefault, appraisers, appraisee])

  const attitudeListRows = useMemo(() => {
    const _attitudeListRows = criteria?.map((item: any, a: number) => {
      let _attitudeListRow: any = {
        id: item.id,
        name: item.name,
        description: item.description,
        weight: `${item.weight}%`,
      }
      const scores: number[] = []
      if (!!appraisee) {
        const taskEvaluationCriteriaAppraisee =
          appraisee.taskEvaluationDetails?.find(
            (taskEvaluation: any) => taskEvaluation.criteria.id == item.id
          )
        scores.push(taskEvaluationCriteriaAppraisee?.criteriaDetail?.score)
        _attitudeListRow = {
          ..._attitudeListRow,
          appraisee: (
            <Tooltip
              title={ToolTipAppraiser(
                item?.name || '',
                taskEvaluationCriteriaAppraisee?.criteriaDetail?.score || '',
                taskEvaluationCriteriaAppraisee?.criteriaDetail?.content || '',
                ''
              )}
            >
              <Box>
                {taskEvaluationCriteriaAppraisee?.criteriaDetail?.score || 0}
              </Box>
            </Tooltip>
          ),
        }
      }
      const lengthAppraisers = appraisers.length
      appraisers.forEach((appraiser: any, index: number) => {
        const taskEvaluationCriteria = appraiser.taskEvaluationDetails?.find(
          (taskEvaluation: any) => taskEvaluation.criteria.id == item.id
        )
        scores.push(taskEvaluationCriteria?.criteriaDetail?.score)
        _attitudeListRow = {
          ..._attitudeListRow,
          [`${index == lengthAppraisers - 1 ? `final` : `appraiser${index}`}`]:
            (
              <Tooltip
                title={ToolTipAppraiser(
                  item?.name || '',
                  taskEvaluationCriteria?.criteriaDetail?.score || '',
                  taskEvaluationCriteria?.criteriaDetail?.content || '',
                  ''
                )}
              >
                <Box>{taskEvaluationCriteria?.criteriaDetail?.score || 0}</Box>
              </Tooltip>
            ),
        }
      })
      const perfectScores = scores.filter(score => !!score)
      const firstScore = perfectScores[0]
      const areAllElementsEqual = perfectScores.every(
        score => score === firstScore
      )
      _attitudeListRow = {
        ..._attitudeListRow,
        background: areAllElementsEqual ? '' : '#FFE993',
      }
      return _attitudeListRow
    })
    return _attitudeListRows
  }, [criteria, appraisers, appraisee])

  const finalScoreCellData = useMemo(() => {
    return [
      { score: appraisee.averageScore, label: '' },
      ...appraisers.map((item: any) => ({
        score: item.averageScore || 0,
        label: '',
      })),
    ]
  }, [appraisee, appraisers])

  const difficultyCellData = useMemo(() => {
    return [
      { score: '', label: appraisee.difficultyLabel },
      ...appraisers.map((item: any) => ({
        score: item.difficulty,
        label: item.difficultyLabel,
        reasonDifficulty: item.reasonDifficulty,
      })),
    ]
  }, [appraisee, appraisers])

  return (
    <CommonTable
      columns={attitudeHeadCells}
      rows={attitudeListRows}
      LastRow={
        <>
          <ItemRowCellEndEvaluation
            rowLabel={i18Mbo('LB_AVERAGE_SCORE')}
            cellData={finalScoreCellData}
          />
          {showDifficultyRow && (
            <ItemRowCellEndEvaluation
              useHighlight
              useTooltip
              getTooltip={ToolTipAppraiser}
              rowLabel={i18Mbo('LB_DIFFICULTY')}
              cellData={difficultyCellData}
            />
          )}
        </>
      }
    />
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  taskScore: {
    border: '1px solid',
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  toolTipScore: {
    padding: theme.spacing(0.5),
    '& .toolTipName': {
      fontWeight: 700,
      fontSize: 12,
    },
    '& .toolTipDescription': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(1),
    },
  },
  topTooltip: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}))

export default TableTaskOrAttitudeEvaluation

import DeleteIcon from '@/components/icons/DeleteIcon'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import { LangConstant } from '@/const'
import { INPUT_TEXTAREA_MAX_LENGTH } from '@/const/app.const'
import { EventInput } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { SCORE_LIST_OPTIONS } from '../const'
import { ICriteriaDetailRequest } from '../models'

interface CriteriaDetailRequestItemProps {
  criteriaDetailRequest: ICriteriaDetailRequest
  index: number
  onChange: (
    newCriteriaDetailRequest: ICriteriaDetailRequest,
    index: number
  ) => void
  criteriaDetailRequestsCounter: number
  onDeleteIconClick?: (
    criteriaDetailRequest: ICriteriaDetailRequest,
    index: number
  ) => void
  errors: any
  touched: any
  listScoresExist: string[]
}

const CriteriaDetailRequestItem = ({
  criteriaDetailRequest,
  index,
  onChange,
  criteriaDetailRequestsCounter,
  onDeleteIconClick,
  errors,
  touched,
  listScoresExist,
}: CriteriaDetailRequestItemProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)

  const scoreListOptions = useMemo(() => {
    const currentScore = criteriaDetailRequest.score
    const listScoresExistIgnore = listScoresExist.filter(
      score => score !== currentScore
    )
    return SCORE_LIST_OPTIONS.filter(
      option => !listScoresExistIgnore.map(n => +n).includes(+option.value)
    )
  }, [listScoresExist, criteriaDetailRequest.score])

  const handleScoreChange = (score: string) => {
    const newCriteriaDetailRequest = {
      ...criteriaDetailRequest,
      score,
    }
    onChange(newCriteriaDetailRequest, index)
  }

  const handleContentChange = (e: EventInput) => {
    const newCriteriaDetailRequest = {
      ...criteriaDetailRequest,
      content: e.target.value,
    }
    onChange(newCriteriaDetailRequest, index)
  }

  const handleDeleteIconClick = () => {
    !!onDeleteIconClick && onDeleteIconClick(criteriaDetailRequest, index)
  }

  return (
    <Box className={classes.criteriaDetailRequestItem}>
      <InputDropdown
        width={100}
        isShowClearIcon={false}
        value={criteriaDetailRequest.score}
        label={i18('LB_SCORE')}
        listOptions={scoreListOptions}
        onChange={handleScoreChange}
      />
      <Box sx={{ flex: 1 }}>
        <InputTextLabel
          maxLength={INPUT_TEXTAREA_MAX_LENGTH}
          error={!!errors.content && !!touched.content}
          errorMessage={errors.content as string}
          value={criteriaDetailRequest.content}
          label={i18Mbo('LB_CRITERIA_CONTENT')}
          placeholder={i18Mbo('PLH_CRITERIA_CONTENT')}
          onChange={handleContentChange}
        />
      </Box>
      {criteriaDetailRequestsCounter > 1 && (
        <DeleteIcon
          className={classes.deleteIcon}
          onClick={handleDeleteIconClick}
        />
      )}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  criteriaDetailRequestItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(3),
  },
  deleteIcon: {
    marginTop: theme.spacing(3.5),
  },
}))

export default CriteriaDetailRequestItem

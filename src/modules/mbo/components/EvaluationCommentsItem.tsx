import ConditionalRender from '@/components/ConditionalRender'
import { OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'

interface EvaluationCommentsItemProps {
  comment: string
  multiComment?: OptionItem[]
}

const EvaluationCommentsItem = ({
  comment,
  multiComment = [],
}: EvaluationCommentsItemProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()

  return (
    <Box className={classes.rootEvaluationCommentsItem}>
      <ConditionalRender conditional={!!comment || !!multiComment.length}>
        {!!multiComment.length && (
          <Box className={classes.optionCriteriaDetails}>
            {multiComment?.map((item: any) => (
              <Box key={item.id} className={classes.option}>
                <Box className={classes.label}>{item.name}:</Box>
                <Box>{item.comment}</Box>
              </Box>
            ))}
          </Box>
        )}
        {!!comment && <Box className={classes.commentText}>{comment}</Box>}
      </ConditionalRender>
      <ConditionalRender conditional={!comment && !multiComment?.length}>
        <Box className={classes.noComment}>{i18('LB_NO_COMMENT')}</Box>
      </ConditionalRender>
    </Box>
  )
}

export default EvaluationCommentsItem

const useStyles = makeStyles((theme: Theme) => ({
  rootEvaluationCommentsItem: {},
  optionCriteriaDetails: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  commentText: {},
  option: { display: 'flex', alignItems: 'stretch', gap: theme.spacing(1) },
  label: {
    fontWeight: 700,
    fontSize: 14,
    width: '300px',
    minWidth: '300px',
    maxWidth: '300px',
  },
  noComment: { color: theme.color.grey.primary },
}))

import CardForm from '@/components/Form/CardForm'
import { OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'

const levelDescriptionCriteria: OptionItem[] = [
  {
    id: 1,
    label: 'S',
    value:
      'Ability to instruct others on business and technique, provide system proposal',
  },
  {
    id: 2,
    label: 'A',
    value: 'Ability to publish software product to be developed by yourself',
  },
  {
    id: 3,
    label: 'B',
    value: 'Ability to develop and operate the whole software product',
  },
  {
    id: 4,
    label: 'C',
    value: 'Have experience in developing and operating the software product',
  },
  {
    id: 5,
    label: 'D',
    value:
      'Have experience in developing a very simple application/ software product',
  },
]

const LevelDescriptionCriteria = () => {
  const classes = useStyles()

  return (
    <CardForm title="Level Description Criteria">
      <Box className={classes.levelDescriptionCriteria}>
        {levelDescriptionCriteria.map((item: OptionItem) => (
          <Box className={classes.levelItem} key={item.id}>
            <Box className="bold">{item.label}:</Box>
            <Box>{item.value}</Box>
          </Box>
        ))}
      </Box>
    </CardForm>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  levelDescriptionCriteria: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  levelItem: {
    display: 'flex',
    gap: theme.spacing(0.5),
  },
}))

export default LevelDescriptionCriteria

import CardForm from '@/components/Form/CardForm'
import { OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'

interface PersonalInformationProps {
  personalInformation: OptionItem[]
}

const PersonalInformation = ({
  personalInformation,
}: PersonalInformationProps) => {
  const classes = useStyles()

  return (
    <CardForm title="Personal Information">
      <Box className={classes.personalInformation}>
        {personalInformation.map((item: OptionItem) => (
          <Box className={classes.infoItem} key={item.id}>
            <Box className="bold">{item.label}:</Box>
            <Box>{item.value}</Box>
          </Box>
        ))}
      </Box>
    </CardForm>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  personalInformation: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  infoItem: {
    display: 'flex',
    gap: theme.spacing(0.5),
  },
}))

export default PersonalInformation

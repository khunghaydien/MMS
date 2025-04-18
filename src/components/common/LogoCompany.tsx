import logoMORUrl from '@/ui/images/logo-mor.png'
import { makeStyles } from '@mui/styles'

interface LogoCompanyProps {
  width: number
  height: number
}

const LogoCompany = (props: LogoCompanyProps) => {
  const classes = useStyles({ ...props })
  return <img className={classes.rootLogoCompany} src={logoMORUrl} {...props} />
}

const useStyles = makeStyles(() => ({
  rootLogoCompany: {
    width: (props: LogoCompanyProps) => `${props.width}px`,
    height: (props: LogoCompanyProps) => `${props.height}px`,
  },
}))

LogoCompany.defaultProps = {
  width: 185,
  height: 62.5,
}

export default LogoCompany

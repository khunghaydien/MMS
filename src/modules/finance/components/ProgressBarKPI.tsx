import { formatNumber } from '@/utils'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
interface PropsType {
  done: number
}
const ProgressBarKPI = ({ done }: PropsType) => {
  const [style, setStyle] = useState({})
  const classes = useStyle()
  useEffect(() => {
    let timer = setTimeout(() => {
      const newStyle = {
        opacity: 1,
        width: `${done >= 100 ? 100 : done}%`,
      }

      setStyle(newStyle)
    }, 200)
    return () => {
      clearTimeout(timer)
    }
  }, [done])
  return (
    <div className={clsx(classes.progress)}>
      <div className={clsx(classes.progressDone)} style={style}></div>
      <div className={clsx(classes.textContent)}>
        <div className={clsx(classes.complete)}>
          {`${formatNumber(done)} %`}
        </div>
        <div className={clsx(classes.completeDone)}>100 %</div>
      </div>
    </div>
  )
}

const useStyle = makeStyles((theme: Theme) => ({
  progress: {
    backgroundColor: '#d8d8d8',
    borderRadius: '20px',
    position: 'relative',
    margin: '15px 0',
    height: '10px',
    width: '100%',
  },
  progressDone: {
    background: `linear-gradient(to left, ${theme.color.green.primary}, ${theme.color.green.primary})`,
    boxShadow: `0 3px 3px -5px ${theme.color.green.primary}, 0 2px 5px ${theme.color.green.primary}`,
    borderRadius: '20px',
    color: '#000',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: 0,
    opacity: 0,
    transition: '1s ease 0.3s',
  },
  textContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItem: 'center',
    padding: '20px 0',
  },
  complete: {
    color: theme.color.green.primary,
    fontWeight: 'bold',
  },
  completeDone: {
    fontWeight: 'bold',
    color: theme.color.green.primary,
  },
}))

export default ProgressBarKPI

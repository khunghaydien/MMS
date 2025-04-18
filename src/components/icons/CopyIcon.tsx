import { ContentCopy } from '@mui/icons-material'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { MouseEvent, useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface CopyIconProps {
  content: any
}

const CopyIcon = ({ content }: CopyIconProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()

  const [copying, setCopying] = useState(false)

  const copyingTimeout = useRef<NodeJS.Timeout | null>(null)

  const toggleCopy = useCallback((status: boolean) => {
    if (status) {
      setCopying(status)
    } else {
      copyingTimeout.current = setTimeout(() => {
        setCopying(false)
      }, 500)
    }
  }, [])

  const handleCopyCode = async (code: string) => {
    toggleCopy(true)
    if (copyingTimeout.current) {
      clearTimeout(copyingTimeout.current)
    }
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(code).finally(() => {
        toggleCopy(false)
      })
    } else {
      const textArea = document.createElement('textarea')
      textArea.value = code
      textArea.style.position = 'absolute'
      textArea.style.left = '-999999px'
      document.body.prepend(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
      } catch (error) {
        console.error(error)
      } finally {
        textArea.remove()
        toggleCopy(false)
      }
    }
  }

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    handleCopyCode(content)
  }

  return (
    <Box className={classes.copyIcon}>
      {copying ? (
        <Box className={classes.copiedLabel}>{i18('LB_COPIED')}</Box>
      ) : (
        <Box onClick={handleClick}>
          <ContentCopy className={classes.icon} />
        </Box>
      )}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  copyIcon: {
    width: theme.spacing(4),
  },
  icon: {
    color: theme.color.black.secondary,
  },
  copiedLabel: {
    color: theme.color.green.primary,
    fontWeight: 700,
  },
}))

export default CopyIcon

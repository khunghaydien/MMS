import { FAKE_LOADING_TIME_DELAY } from '@/const/app.const'
import { staffSelector } from '@/modules/staff/reducer/staff'
import { StaffState } from '@/modules/staff/types'
import { downloadFileFromByteArr, getIframeLink } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { isEmpty } from 'lodash'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Modal from '../common/Modal'
import LoadingSkeleton from '../loading/LoadingSkeleton'

interface ModalPreviewImagesProps {
  titleMessage: string
  open: boolean
  onClose: () => void
  url: string
  type?: string
}

const ModalPreviewImages = ({
  open,
  onClose,
  titleMessage,
  url,
  type,
}: ModalPreviewImagesProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()

  const { fileContent, fileName }: StaffState = useSelector(staffSelector)

  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const [loading, setLoading] = useState(true)

  const isPdfDocs = !type?.includes('image')

  const onSubmit = () => {
    if (!isEmpty(url)) {
      downloadFileFromByteArr({
        fileName: fileName || '',
        fileContent: fileContent || '',
      })
    }
    onClose()
  }

  const onLoad = () => {
    setLoading(false)
  }

  useEffect(() => {
    if (isPdfDocs) {
      intervalRef.current = setInterval(() => {
        if (
          iframeRef.current?.contentDocument?.URL === 'about:blank' &&
          loading
        ) {
          iframeRef.current.src = getIframeLink(url)
        } else {
          setLoading(false)
        }
      }, 3000)
    } else {
      setTimeout(() => {
        setLoading(false)
      }, FAKE_LOADING_TIME_DELAY)
    }
    return () => {
      if (intervalRef.current && isPdfDocs) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <Modal
      width="100%"
      className={classes.rootModal}
      open={open}
      title={titleMessage}
      submitDisabled={loading}
      labelSubmit={i18('LB_DOWNLOAD') as string}
      onClose={onClose}
      onSubmit={onSubmit}
    >
      <Box className={classes.foreground}>
        {isPdfDocs ? (
          <Fragment>
            <iframe
              ref={iframeRef}
              onLoad={onLoad}
              src={getIframeLink(url)}
              allowFullScreen
            />
            {loading && <LoadingSkeleton usePositionAbsolute />}
          </Fragment>
        ) : (
          <Fragment>
            <img
              src={url}
              style={{
                width: 'unset',
              }}
            />
            {loading && <LoadingSkeleton usePositionAbsolute />}
          </Fragment>
        )}
      </Box>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootModal: {
    '& .MuiPaper-root': {
      width: '100vw',
      height: '100vh',
    },
    '& .modal': {
      height: '100%',
    },
    '& .modal-content': {
      padding: '0 !important',
      // height: '',
    },
  },
  description: {
    fontSize: '16px !important',
    wordBreak: 'break-all',
  },
  foreground: {
    position: 'relative',
    background: theme.color.grey.secondary,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItem: 'center',
    '& img': {},
    '& iframe': {
      width: '100%',
      height: '100%',
      overflow: 'scroll',
      display: 'flex',
      justifyContent: 'center',
    },
    '& .root-loading-skeleton': {
      height: '100%',
    },
  },
  confirmed: {
    marginTop: theme.spacing(2),
  },
}))

export default ModalPreviewImages

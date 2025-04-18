import {
  DEFAULT_FILE_MAX_SIZE,
  DEFAULT_MAX_FILES,
  DEFAULT_UPLOAD_ACCEPT_FILE_TYPES,
} from '@/const/app.const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { alertError, alertSuccess } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { FileItem, UploadAcceptFileTypes } from '@/types'
import { uuid } from '@/utils'
import { CloudUpload } from '@mui/icons-material'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import StringFormat from 'string-format'
import ModalDeleteRecords from '../modal/ModalDeleteRecords'
import ModalPreviewImages from '../modal/ModalPreviewImages'
import ListFiles from './ListFiles'
import NoData from './NoData'

interface IProps {
  uploadAcceptFileTypes?: UploadAcceptFileTypes
  maxFiles?: number
  maxSize?: number
  listFiles?: FileItem[]
  useDelete?: boolean
  usePreview?: boolean
  readonly?: boolean
  onChange?: (acceptedFiles: FileItem[]) => void
  onDeleteFile?: (fileItem: FileItem | null) => void
  total?: number
  namespace?: string
  showAlertSuccess?: boolean
  setShowAlertSuccess?: Dispatch<SetStateAction<boolean>>
  useLastModified?: boolean
}

const defaultListFiles: FileItem[] = []

const UploadFile = ({
  uploadAcceptFileTypes = DEFAULT_UPLOAD_ACCEPT_FILE_TYPES,
  maxFiles = DEFAULT_MAX_FILES,
  maxSize = DEFAULT_FILE_MAX_SIZE,
  listFiles = defaultListFiles,
  useDelete = true,
  usePreview = true,
  onChange,
  onDeleteFile,
  readonly = false,
  total = 0,
  namespace,
  showAlertSuccess,
  setShowAlertSuccess,
  useLastModified = true,
}: IProps) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { role }: AuthState = useSelector(selectAuth)
  const [fileNameSuccess, setFileNameSuccess] = useState('')

  const [modalDeleteFile, setModalDeleteFile] = useState({
    isOpen: false,
    fileId: '',
    fileName: '',
  })
  const [modalPreviewFile, setModalPreviewFile] = useState({
    isOpen: false,
    fileId: '',
    fileName: '',
    url: '',
    type: '',
  })
  const [fileItemSelected, setFileItemSelected] = useState<FileItem | null>(
    null
  )
  const [countSelected, setCountSelected] = useState(1)

  const supportedFormats = useMemo(() => {
    let result = ''
    Object.values(uploadAcceptFileTypes).forEach(
      (item: string[], index: number) => {
        const _item: any = item.toString().toUpperCase()
        result = result + _item.replaceAll('.', ' ')
        if (index < Object.values(uploadAcceptFileTypes).length - 1) {
          result = result + ','
        }
      }
    )
    return result
  }, [uploadAcceptFileTypes])

  const handleFileChange = (
    acceptedFiles: File[],
    fileRejections: FileRejection[]
  ) => {
    const fileLengthError = total + acceptedFiles.length > maxFiles
    if ((fileRejections && !!fileRejections.length) || fileLengthError) {
      if (
        fileRejections[0]?.errors?.[0]?.code === 'too-many-files' ||
        fileLengthError
      ) {
        dispatch(
          alertError({
            message: StringFormat(
              i18('MSG_UPLOAD_MAX_NUMBER_FILE_ERROR'),
              maxFiles.toString()
            ),
          })
        )
      } else if (fileRejections[0]?.errors?.[0]?.code === 'file-too-large') {
        dispatch(
          alertError({
            message: StringFormat(
              i18('MSG_UPLOAD_FILE_MAX_SIZE_ERROR'),
              (maxSize / (1024 * 1024)).toString()
            ),
          })
        )
      } else {
        dispatch(
          alertError({
            message: StringFormat(
              i18('MSG_UPLOAD_FILE_TYPE_ERROR'),
              supportedFormats
            ),
          })
        )
      }
    } else {
      setCountSelected(acceptedFiles.length)
      setFileNameSuccess(acceptedFiles[0].name)
      !!onChange &&
        onChange(
          acceptedFiles.map((file: File) => ({
            FileObject: file,
            id: uuid(),
          }))
        )
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileChange,
    accept: uploadAcceptFileTypes,
    maxFiles,
    maxSize,
  })

  const handleDeleteFile = () => {
    !!onDeleteFile && onDeleteFile(fileItemSelected)
  }

  const openModalDeleteFile = (fileItem: FileItem) => {
    setModalDeleteFile({
      isOpen: true,
      fileId: fileItem.id,
      fileName: fileItem.FileObject.name,
    })
    setFileItemSelected(fileItem)
  }

  const closeModalDeleteFile = () => {
    setModalDeleteFile({
      isOpen: false,
      fileId: '',
      fileName: '',
    })
  }

  const openModalPreviewFile = (fileItem: FileItem) => {
    setModalPreviewFile({
      isOpen: true,
      fileId: fileItem.id,
      fileName: fileItem.FileObject.name,
      url: fileItem?.url || '',
      type: fileItem.FileObject.type,
    })
  }

  const closeModalPreviewFile = () => {
    setModalPreviewFile({
      isOpen: false,
      fileId: '',
      fileName: '',
      url: '',
      type: '',
    })
  }

  useEffect(() => {
    if (!!showAlertSuccess && listFiles.length) {
      dispatch(
        alertSuccess({
          message:
            countSelected > 1
              ? StringFormat(i18('MSG_UPLOAD_MULTIPLE_FILE'), namespace || '')
              : StringFormat(i18('MSG_UPLOAD_FILE_SUCCESS'), fileNameSuccess),
        })
      )
      !!setShowAlertSuccess && setShowAlertSuccess(false)
    }
  }, [showAlertSuccess, listFiles])

  return (
    <Fragment>
      {modalDeleteFile.isOpen && (
        <ModalDeleteRecords
          open
          titleMessage={i18('TXT_DELETE_FILE')}
          subMessage={StringFormat(
            i18('TXT_DELETE_FILE_CONFIRMED'),
            modalDeleteFile.fileName
          )}
          onClose={closeModalDeleteFile}
          onSubmit={handleDeleteFile}
        />
      )}
      {modalPreviewFile.isOpen && (
        <ModalPreviewImages
          open
          titleMessage={modalPreviewFile.fileName}
          type={modalPreviewFile.type}
          url={modalPreviewFile.url}
          onClose={closeModalPreviewFile}
        />
      )}
      <Box className={classes.uploadFile}>
        {!readonly && (
          <Box
            className={classes.inputFileContainer}
            {...getRootProps()}
            sx={{
              pointerEvents: readonly ? 'none' : '',
            }}
          >
            <input style={{ display: 'none' }} {...getInputProps()} />
            <CloudUpload className={classes.uploadIcon} />
            <Box className={classes.title}>{i18('TXT_UPLOAD_FILES')}</Box>
            <Box className={classes.uploadAcceptFileTypes}>
              {i18('TXT_SUPPORTED_FORMATS')}
              {supportedFormats}
            </Box>
          </Box>
        )}

        {readonly && listFiles.length === 0 && (
          <Box style={{ height: '200px' }}>
            <NoData />
          </Box>
        )}

        {!!listFiles.length && (
          <ListFiles
            useLastModified={useLastModified}
            usePreview={usePreview}
            useDelete={useDelete}
            listFiles={listFiles}
            onDeleteFile={openModalDeleteFile}
            onPreviewFile={openModalPreviewFile}
          />
        )}
      </Box>
    </Fragment>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  uploadFile: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  inputFileContainer: {
    '&:hover': {
      backgroundColor: theme.color.grey.secondary,
    },
    background: theme.color.grey.tertiary,
    border: `1px solid ${theme.color.grey.secondary}`,
    borderRadius: theme.spacing(0.5),
    textAlign: 'center',
    cursor: 'pointer',
    padding: theme.spacing(4, 1),
    width: '100%',
  },
  title: {
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
  uploadIcon: {
    color: theme.color.blue.primary,
    width: `${theme.spacing(5)} !important`,
    height: `${theme.spacing(5)} !important`,
  },
  uploadAcceptFileTypes: {
    fontSize: 14,
  },
}))

export default UploadFile

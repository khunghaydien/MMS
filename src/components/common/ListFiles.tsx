import { FileItem } from '@/types'
import { VisibilityRounded } from '@mui/icons-material'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import moment from 'moment'
import DeleteIcon from '../icons/DeleteIcon'

interface IProps {
  listFiles: FileItem[]
  usePreview: boolean
  useDelete: boolean
  useLastModified?: boolean
  onDeleteFile?: (fileItem: FileItem) => void
  onPreviewFile?: (fileItem: FileItem) => void
}

const ListFiles = ({
  usePreview,
  useDelete,
  listFiles,
  onDeleteFile,
  onPreviewFile,
  useLastModified = true,
}: IProps) => {
  const classes = useStyles()

  return (
    <Box className={classes.listFiles}>
      {listFiles.map((fileItem: FileItem) => (
        <Box key={fileItem.id} className={classes.fileItem}>
          <Box
            className={classes.fileNameContainer}
            title={fileItem.FileObject.name}
          >
            <Box className={classes.fileNameBox}>
              <Box className={classes.name}>{fileItem.FileObject.name}</Box>
              <Box className={classes.fileType}>
                {` (${
                  fileItem.FileObject.name.split('.')[
                    fileItem.FileObject.name.split('.').length - 1
                  ]
                })`}
              </Box>
            </Box>
            {useLastModified && (
              <span className={classes.lastModified}>
                {moment(fileItem.FileObject.lastModified).format('DD/MM/YYYY')}
              </span>
            )}
          </Box>
          <Box className={classes.fileActions}>
            {usePreview && (
              <VisibilityRounded
                onClick={() => !!onPreviewFile && onPreviewFile(fileItem)}
              />
            )}
            {useDelete && (
              <DeleteIcon
                onClick={() => !!onDeleteFile && onDeleteFile(fileItem)}
              />
            )}
          </Box>
        </Box>
      ))}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  listFiles: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  fileItem: {
    border: `1px solid ${theme.color.grey.secondary}`,
    padding: theme.spacing(0.5, 2),
    borderRadius: theme.spacing(0.5),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  fileNameContainer: {
    width: 'calc(100% - 56px)',
    wordBreak: 'break-word',
  },
  fileName: {
    fontWeight: 700,
  },
  lastModified: {
    fontSize: 14,
    marginTop: theme.spacing(0.6),
    display: 'inline-block',
  },
  fileActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
    width: '56px',
    '& svg': {
      color: theme.color.black.secondary,
      cursor: 'pointer',
    },
  },
  fileNameBox: {
    display: 'flex',
    gap: theme.spacing(0.5),
  },
  name: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '600px',
  },
  fileType: {
    fontWeight: 700,
    textTransform: 'uppercase',
  },
}))

export default ListFiles

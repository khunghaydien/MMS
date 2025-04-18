import UploadFile from '@/components/common/UploadFile'
import ConditionalRender from '@/components/ConditionalRender'
import CardForm from '@/components/Form/CardForm'
import TablePaginationShare from '@/components/table/TablePaginationShare'
import { LangConstant, TableConstant } from '@/const'
import { setCVs, staffSelector } from '@/modules/staff/reducer/staff'
import { createCV, getCVs } from '@/modules/staff/reducer/thunk'
import { StaffState } from '@/modules/staff/types'
import { AuthState, selectAuth } from '@/reducer/auth'
import { deleteFile } from '@/reducer/common'
import { alertError, alertSuccess, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { EventInput, FileItem } from '@/types'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import i18next from 'i18next'
import { cloneDeep } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import StringFormat from 'string-format'
interface IProps {
  isViewDetail: boolean
  staffId: string
}

function CVCard({ isViewDetail, staffId }: IProps) {
  const classes = useStyles()
  const { t: i18Staff } = useTranslation(LangConstant.NS_STAFF)
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { cvs, totalElementsCVs }: StaffState = useSelector(staffSelector)
  const { permissions }: AuthState = useSelector(selectAuth)

  const [pageUploadCurrent, setPageUploadCurrent] = useState(
    TableConstant.PAGE_CURRENT_DEFAULT
  )
  const [pageLimit, setPageLimit] = useState(TableConstant.LIMIT_DEFAULT)
  const [showAlertSuccess, setShowAlertSuccess] = useState(false)

  const rowsPageCurrent = useMemo(() => {
    let rowsPage = cloneDeep(cvs)
    isViewDetail
      ? rowsPage
      : (rowsPage = rowsPage.slice(
          (pageUploadCurrent - 1) * pageLimit,
          (pageUploadCurrent - 1) * pageLimit + pageLimit
        ))
    return rowsPage
  }, [cvs, pageUploadCurrent, pageLimit])

  const totalElements = useMemo(
    () => (isViewDetail ? totalElementsCVs : cvs.length),
    [totalElementsCVs, isViewDetail, cvs]
  )

  const handleFilesChange = (acceptedFiles: FileItem[]) => {
    if (rowsPageCurrent.length >= 5) {
      dispatch(
        alertError({
          message: StringFormat(i18('MSG_UPLOAD_MAX_NUMBER_FILE_ERROR'), '5'),
        })
      )
    } else if (isViewDetail) {
      const formData = new FormData()
      acceptedFiles.forEach((fileItem: FileItem) => {
        formData.append('cvs', fileItem.FileObject)
      })
      dispatch(updateLoading(true))
      dispatch(createCV({ staffId, data: formData }))
        .unwrap()
        .then(() => {
          dispatch(
            getCVs({
              staffId: staffId,
              queries: { pageNum: pageUploadCurrent, pageSize: pageLimit },
            })
          )
        })
        .finally(() => setShowAlertSuccess(true))
    } else {
      dispatch(setCVs([...acceptedFiles, ...cvs]))
      setShowAlertSuccess(true)
    }
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    if (isViewDetail) {
      dispatch(
        getCVs({
          staffId: staffId,
          queries: { pageNum: newPage, pageSize: pageLimit },
        })
      )
    }
    setPageUploadCurrent(newPage)
  }

  const handleChangeRowsPerPage = (event: EventInput) => {
    const pageCurrent = TableConstant.PAGE_CURRENT_DEFAULT
    const pageSize = parseInt(event.target.value, 10)
    setPageUploadCurrent(pageCurrent)
    setPageLimit(pageSize)
    if (isViewDetail) {
      dispatch(
        getCVs({
          staffId: staffId,
          queries: { pageNum: pageCurrent, pageSize },
        })
      )
    }
  }

  const handleDeleteCertificateFile = (fileItem: FileItem | null) => {
    if (isViewDetail) {
      dispatch(updateLoading(true))
      dispatch(
        deleteFile({
          fileName: fileItem?.FileObject.name,
          id: fileItem?.id,
        })
      )
        .unwrap()
        .then(() => {
          dispatch(
            getCVs({
              staffId: staffId,
              queries: { pageNum: pageUploadCurrent, pageSize: pageLimit },
            })
          )
        })
    } else {
      const newCVs: FileItem[] = [...cvs]
      const fileIndex = newCVs.findIndex(
        (item: FileItem) => item.id === fileItem?.id
      )
      if (fileIndex > -1) {
        newCVs.splice(fileIndex, 1)
        dispatch(setCVs(newCVs))
        dispatch(
          alertSuccess({
            message: i18next.t('common:MSG_DELETE_FILE_SUCCESS', {
              fileName: fileItem?.FileObject.name,
            }),
          })
        )
      }
    }
  }

  useEffect(() => {
    if (isViewDetail) {
      dispatch(
        getCVs({
          staffId,
          queries: { pageNum: pageUploadCurrent, pageSize: pageLimit },
        })
      )
    }
  }, [isViewDetail])

  return (
    <CardForm
      title={i18Staff('TXT_CV') as string}
      className={classes.rootCertificateCard}
    >
      <UploadFile
        maxFiles={5}
        namespace="cvs"
        showAlertSuccess={showAlertSuccess}
        setShowAlertSuccess={setShowAlertSuccess}
        total={totalElements}
        readonly={isViewDetail && !permissions.useStaffOutsourcingUpdate}
        usePreview={isViewDetail}
        useDelete={!isViewDetail || permissions.useStaffOutsourcingUpdate}
        listFiles={rowsPageCurrent}
        onChange={handleFilesChange}
        onDeleteFile={handleDeleteCertificateFile}
      />
      <ConditionalRender conditional={!!totalElements} fallback={''}>
        <TablePaginationShare
          rowsPerPageOptions={[]}
          totalElements={totalElements}
          pageLimit={pageLimit}
          currentPage={pageUploadCurrent}
          onChangePage={handleChangePage}
          onChangeLimitPage={handleChangeRowsPerPage}
        />
      </ConditionalRender>
    </CardForm>
  )
}
const useStyles = makeStyles((themeMui: Theme) => ({
  rootCertificateCard: {
    // height: '100%',
  },
}))
export default CVCard

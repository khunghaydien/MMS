import UploadFile from '@/components/common/UploadFile'
import ConditionalRender from '@/components/ConditionalRender'
import CardForm from '@/components/Form/CardForm'
import TablePaginationShare from '@/components/table/TablePaginationShare'
import { LangConstant, TableConstant } from '@/const'
import { ACCEPT_DEFAULT_UPLOAD } from '@/const/app.const'
import { setCertificates, staffSelector } from '@/modules/staff/reducer/staff'
import {
  createCertificate,
  getCertificates,
} from '@/modules/staff/reducer/thunk'
import { StaffState } from '@/modules/staff/types'
import { AuthState, selectAuth } from '@/reducer/auth'
import { deleteFile } from '@/reducer/common'
import { alertSuccess, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { EventInput, FileItem } from '@/types'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import i18next from 'i18next'
import { cloneDeep } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
interface IProps {
  isViewDetail: boolean
  staffId: string
}

function CertificateCard({ isViewDetail, staffId }: IProps) {
  const classes = useStyles()
  const { t: i18Staff } = useTranslation(LangConstant.NS_STAFF)
  const dispatch = useDispatch<AppDispatch>()

  const { certificates, totalElementsCertificate, isUpdateStaff }: StaffState =
    useSelector(staffSelector)
  const { permissions }: AuthState = useSelector(selectAuth)

  const [pageUploadCurrent, setPageUploadCurrent] = useState(
    TableConstant.PAGE_CURRENT_DEFAULT
  )
  const [pageLimit, setPageLimit] = useState(TableConstant.LIMIT_DEFAULT)
  const [showAlertSuccess, setShowAlertSuccess] = useState(false)

  const rowsPageCurrent = useMemo(() => {
    let rowsPage = cloneDeep(certificates)
    isViewDetail
      ? rowsPage
      : (rowsPage = rowsPage.slice(
          (pageUploadCurrent - 1) * pageLimit,
          (pageUploadCurrent - 1) * pageLimit + pageLimit
        ))
    return rowsPage
  }, [certificates, pageUploadCurrent, pageLimit])

  const totalElements = useMemo(
    () => (isViewDetail ? totalElementsCertificate : certificates.length),
    [totalElementsCertificate, isViewDetail, certificates]
  )

  const handleFilesChange = (acceptedFiles: FileItem[]) => {
    if (isViewDetail) {
      const formData = new FormData()
      acceptedFiles.forEach((fileItem: FileItem) => {
        formData.append('certificate', fileItem.FileObject)
      })
      dispatch(updateLoading(true))
      dispatch(createCertificate({ staffId, data: formData }))
        .unwrap()
        .then(() => {
          dispatch(
            getCertificates({
              staffId: staffId,
              queries: { pageNum: pageUploadCurrent, pageSize: pageLimit },
            })
          )
        })
        .finally(() => setShowAlertSuccess(true))
    } else {
      dispatch(setCertificates([...acceptedFiles, ...certificates]))
      setShowAlertSuccess(true)
    }
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    if (isViewDetail) {
      dispatch(
        getCertificates({
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
        getCertificates({
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
            getCertificates({
              staffId: staffId,
              queries: { pageNum: pageUploadCurrent, pageSize: pageLimit },
            })
          )
        })
    } else {
      const newCertificates: FileItem[] = [...certificates]
      const fileIndex = newCertificates.findIndex(
        (item: FileItem) => item.id === fileItem?.id
      )
      if (fileIndex > -1) {
        newCertificates.splice(fileIndex, 1)
        dispatch(setCertificates(newCertificates))
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
        getCertificates({
          staffId,
          queries: { pageNum: pageUploadCurrent, pageSize: pageLimit },
        })
      )
    }
  }, [isViewDetail])

  return (
    <CardForm
      title={i18Staff('TXT_CERTIFICATE_INFORMATION') as string}
      className={classes.rootCertificateCard}
    >
      <UploadFile
        maxFiles={25}
        namespace="Certificates"
        showAlertSuccess={showAlertSuccess}
        setShowAlertSuccess={setShowAlertSuccess}
        total={totalElements}
        uploadAcceptFileTypes={ACCEPT_DEFAULT_UPLOAD}
        usePreview={isViewDetail}
        useDelete={!isViewDetail || permissions.useStaffUpdate}
        readonly={
          isViewDetail && (!permissions.useStaffUpdate || !isUpdateStaff)
        }
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
export default CertificateCard

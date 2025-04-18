import UploadFile from '@/components/common/UploadFile'
import ConditionalRender from '@/components/ConditionalRender'
import CardForm from '@/components/Form/CardForm'
import TablePaginationShare from '@/components/table/TablePaginationShare'
import { TableConstant } from '@/const'
import {
  ACCEPT_CONTRACT_UPLOAD,
  DEFAULT_FILE_MAX_SIZE,
} from '@/const/app.const'
import StaffStepAction from '@/modules/staff/components/StaffStepAction'
import { CONFIG_STAFF_STEP } from '@/modules/staff/const'
import { setContracts, staffSelector } from '@/modules/staff/reducer/staff'
import { createContract, getContracts } from '@/modules/staff/reducer/thunk'
import { StaffState } from '@/modules/staff/types'
import { AuthState, selectAuth } from '@/reducer/auth'
import { deleteFile } from '@/reducer/common'
import { alertSuccess, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { FileItem } from '@/types'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import i18next from 'i18next'
import { cloneDeep } from 'lodash'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

interface IProps {
  onSubmit: () => void
}
const Contract = ({ onSubmit }: IProps) => {
  const params = useParams()
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()

  const { permissions }: AuthState = useSelector(selectAuth)
  const {
    activeStep,
    contracts,
    totalElementsContract,
    isUpdateStaff,
  }: StaffState = useSelector(staffSelector)

  const [pageUploadCurrent, setPageUploadCurrent] = useState(
    TableConstant.PAGE_CURRENT_DEFAULT
  )
  const [showAlertSuccess, setShowAlertSuccess] = useState(false)
  const [pageLimit, setPageLimit] = useState(TableConstant.LIMIT_DEFAULT)

  const staffId: string | number = useMemo(() => {
    return params.staffId || ''
  }, [params.staffId])

  const isViewDetail = useMemo(() => {
    return !!staffId
  }, [staffId])

  const rowsPageCurrent: any[] = useMemo(() => {
    let rowsPage = cloneDeep(contracts)
    if (!isViewDetail) {
      rowsPage = rowsPage.slice(
        (pageUploadCurrent - 1) * pageLimit,
        (pageUploadCurrent - 1) * pageLimit + pageLimit
      )
    }
    return rowsPage
  }, [contracts, pageUploadCurrent, pageLimit])

  const handleFilesChange = (acceptedFiles: FileItem[]) => {
    if (isViewDetail) {
      const formData = new FormData()
      acceptedFiles.forEach((fileItem: FileItem) => {
        formData.append('contract', fileItem.FileObject)
      })
      dispatch(updateLoading(true))
      dispatch(createContract({ staffId, data: formData }))
        .unwrap()
        .then(() => {
          dispatch(
            getContracts({
              staffId: staffId,
              queries: { pageNum: pageUploadCurrent, pageSize: pageLimit },
            })
          )
        })
        .finally(() => setShowAlertSuccess(true))
    } else {
      dispatch(setContracts([...acceptedFiles, ...contracts]))
      setShowAlertSuccess(true)
    }
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    if (isViewDetail) {
      dispatch(
        getContracts({
          staffId: staffId,
          queries: { pageNum: newPage, pageSize: pageLimit },
        })
      )
    }
    setPageUploadCurrent(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    const pageCurrent = TableConstant.PAGE_CURRENT_DEFAULT
    const pageSize = parseInt(event.target.value, 10)
    setPageUploadCurrent(pageCurrent)
    setPageLimit(pageSize)
    if (isViewDetail) {
      dispatch(
        getContracts({
          staffId: staffId,
          queries: { pageNum: pageCurrent, pageSize },
        })
      )
    }
  }

  const handleNext = () => {
    onSubmit()
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
            getContracts({
              staffId: staffId,
              queries: { pageNum: pageUploadCurrent, pageSize: pageLimit },
            })
          )
        })
    } else {
      const newContracts: FileItem[] = [...contracts]
      const fileIndex = newContracts.findIndex(
        (item: FileItem) => item.id === fileItem?.id
      )
      if (fileIndex > -1) {
        newContracts.splice(fileIndex, 1)
        dispatch(setContracts(newContracts))
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
        getContracts({
          staffId: staffId,
          queries: { pageNum: pageUploadCurrent, pageSize: pageLimit },
        })
      )
    }
  }, [])

  return (
    <>
      <CardForm
        title={i18('TXT_CONTRACT_INFORMATION') as string}
        className={classes.rootContract}
      >
        <UploadFile
          namespace="Contracts"
          showAlertSuccess={showAlertSuccess}
          setShowAlertSuccess={setShowAlertSuccess}
          total={isViewDetail ? totalElementsContract : contracts.length}
          maxSize={DEFAULT_FILE_MAX_SIZE * 3}
          usePreview={isViewDetail}
          useDelete={!isViewDetail || permissions.useStaffUpdate}
          readonly={
            isViewDetail && (!permissions.useStaffUpdate || !isUpdateStaff)
          }
          listFiles={rowsPageCurrent}
          uploadAcceptFileTypes={ACCEPT_CONTRACT_UPLOAD}
          onChange={handleFilesChange}
          onDeleteFile={handleDeleteCertificateFile}
        />
        <ConditionalRender conditional={!!contracts.length} fallback={''}>
          <TablePaginationShare
            rowsPerPageOptions={[]}
            totalElements={
              isViewDetail ? totalElementsContract : contracts.length
            }
            pageLimit={pageLimit}
            currentPage={pageUploadCurrent}
            onChangePage={handleChangePage}
            onChangeLimitPage={handleChangeRowsPerPage}
          />
        </ConditionalRender>
      </CardForm>
      <ConditionalRender conditional={!isViewDetail} fallback={''}>
        <StaffStepAction
          configSteps={CONFIG_STAFF_STEP}
          activeStep={activeStep}
          onNext={handleNext}
        />
      </ConditionalRender>
    </>
  )
}
const useStyles = makeStyles((themeMui: Theme) => ({
  rootContract: {
    height: '100%',
  },
}))
export default Contract

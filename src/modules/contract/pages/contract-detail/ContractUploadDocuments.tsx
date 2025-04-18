import CardForm from '@/components/Form/CardForm'
import UploadFile from '@/components/common/UploadFile'
import TablePaginationShare from '@/components/table/TablePaginationShare'
import { LangConstant, TableConstant } from '@/const'
import { DEFAULT_FILE_MAX_SIZE } from '@/const/app.const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { alertSuccess, commonErrorAlert, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { EventInput, FileItem } from '@/types'
import { Timeline } from '@mui/icons-material'
import { Fragment, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { CONTRACT_HISTORY_TYPE } from '../../const'
import {
  IContractState,
  contractSelector,
  setDocuments,
} from '../../reducer/contract'
import { getContractUploadDocuments } from '../../reducer/thunk'
import { ContractService } from '../../services'
import ModalActivityContractGeneral from './ModalActivityContractGeneral'

interface ContractUploadDocumentProps {
  isDetailPage: boolean
}

const ContractUploadDocuments = ({
  isDetailPage,
}: ContractUploadDocumentProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const params = useParams()
  const { t: i18Contract } = useTranslation(LangConstant.NS_CONTRACT)
  const { t: i18 } = useTranslation()
  const { documents, totalDocs }: IContractState = useSelector(contractSelector)
  const { permissions }: AuthState = useSelector(selectAuth)

  const [isOpenModalActivity, setIsOpenModalActivity] = useState(false)
  const [pageUploadCurrent, setPageUploadCurrent] = useState(
    TableConstant.PAGE_CURRENT_DEFAULT
  )
  const [pageLimit, setPageLimit] = useState(TableConstant.LIMIT_DEFAULT)
  const [showAlertSuccess, setShowAlertSuccess] = useState(false)

  const rowsPageCurrent = useMemo(() => {
    let rowsPage = structuredClone(documents)
    isDetailPage
      ? rowsPage
      : (rowsPage = rowsPage.slice(
          (pageUploadCurrent - 1) * pageLimit,
          (pageUploadCurrent - 1) * pageLimit + pageLimit
        ))
    return rowsPage
  }, [documents, pageUploadCurrent, pageLimit])

  const deleteDocumentWithAPI = async (fileId: string, fileName: string) => {
    dispatch(updateLoading(true))
    const { contractId } = params
    ContractService.deleteDocument(contractId as string, fileId).then(() => {
      getDocuments({ pageNum: 1, pageSize: TableConstant.LIMIT_DEFAULT })
      dispatch(
        alertSuccess({
          message: i18('MSG_DELETE_FILE_SUCCESS', {
            fileName: fileName,
          }),
        })
      )
    })
  }

  const handleDeleteFile = (fileItem: FileItem | null) => {
    if (isDetailPage) {
      deleteDocumentWithAPI(fileItem?.id || '', fileItem?.FileObject.name || '')
    } else {
      const newDocuments: FileItem[] = [...documents]
      const fileIndex = newDocuments.findIndex(
        (item: FileItem) => item.id === fileItem?.id
      )
      if (fileIndex > -1) {
        newDocuments.splice(fileIndex, 1)
        dispatch(setDocuments(newDocuments))
        dispatch(
          alertSuccess({
            message: i18('MSG_DELETE_FILE_SUCCESS', {
              fileName: fileItem?.FileObject.name,
            }),
          })
        )
      }
    }
  }

  const createContractDocumentsWithAPI = (acceptedFiles: FileItem[]) => {
    dispatch(updateLoading(true))
    const { contractId } = params
    let formData = new FormData()
    acceptedFiles
      .map((file: FileItem) => file.FileObject)
      .forEach((item: File) => {
        formData.append('documents', item)
      })
    ContractService.createContractDocuments({
      contractId: contractId as string,
      formData,
    })
      .then(() => {
        dispatch(
          getContractUploadDocuments({
            contractId: contractId as string,
            queries: {
              pageNum: 1,
              pageSize: TableConstant.LIMIT_DEFAULT,
            },
          })
        )
          .unwrap()
          .finally(() => {
            setShowAlertSuccess(true)
          })
      })
      .catch(() => {
        dispatch(commonErrorAlert())
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  const getDocuments = (
    queries: { pageNum: number; pageSize: number },
    callback?: () => void
  ) => {
    dispatch(updateLoading(true))
    const { contractId } = params
    dispatch(
      getContractUploadDocuments({
        contractId: contractId as string,
        queries,
      })
    )
      .unwrap()
      .then(() => {
        !!callback && callback()
      })
      .finally(() => dispatch(updateLoading(false)))
  }

  const handlePageChange = (_: unknown, newPage: number) => {
    if (isDetailPage) {
      getDocuments({ pageNum: newPage, pageSize: pageLimit }, () => {
        setPageUploadCurrent(newPage)
      })
    } else {
      setPageUploadCurrent(newPage)
    }
  }

  const handleRowsPerPageChange = (event: EventInput) => {
    const pageSize = parseInt(event.target.value, 10)
    if (isDetailPage) {
      getDocuments({ pageNum: 1, pageSize }, () => {
        setPageUploadCurrent(1)
        setPageLimit(pageSize)
      })
    } else {
      setPageUploadCurrent(1)
      setPageLimit(pageSize)
    }
  }

  const handleFilesChange = (acceptedFiles: FileItem[]) => {
    if (isDetailPage) {
      createContractDocumentsWithAPI(acceptedFiles)
    } else {
      dispatch(setDocuments([...acceptedFiles, ...documents]))
      setShowAlertSuccess(true)
    }
  }

  return (
    <Fragment>
      {isOpenModalActivity && (
        <ModalActivityContractGeneral
          historyType={CONTRACT_HISTORY_TYPE.UPLOAD_DOCUMENTS}
          contractId={params.contractId as string}
          onClose={() => setIsOpenModalActivity(false)}
        />
      )}
      <CardForm
        title={i18Contract('TXT_UPLOAD_DOCUMENTS')}
        titleIcon={isDetailPage ? <Timeline /> : ''}
        onTitleIconClick={() => setIsOpenModalActivity(true)}
      >
        <UploadFile
          namespace="Documents"
          showAlertSuccess={showAlertSuccess}
          setShowAlertSuccess={setShowAlertSuccess}
          total={isDetailPage ? totalDocs : documents.length}
          maxSize={DEFAULT_FILE_MAX_SIZE * 3}
          listFiles={rowsPageCurrent}
          usePreview={isDetailPage}
          useDelete={!isDetailPage || permissions.useContractUpdate}
          readonly={isDetailPage && !permissions.useContractUpdate}
          onDeleteFile={handleDeleteFile}
          onChange={handleFilesChange}
        />
        {!!rowsPageCurrent.length && (
          <TablePaginationShare
            rowsPerPageOptions={[]}
            totalElements={isDetailPage ? totalDocs : documents.length}
            pageLimit={pageLimit}
            currentPage={pageUploadCurrent}
            onChangePage={handlePageChange}
            onChangeLimitPage={handleRowsPerPageChange}
          />
        )}
      </CardForm>
    </Fragment>
  )
}

export default ContractUploadDocuments

import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import CommonTable from '@/components/table/CommonTable'
import { LangConstant, PathConstant } from '@/const'
import { AppDispatch } from '@/store'
import { SortChangePayload, TableHeaderColumn } from '@/types'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Dispatch, Fragment, SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import StringFormat from 'string-format'
import { IListContractsParams } from '../../models'
import {
  IContractState,
  contractSelector,
  setContractQueryParameters,
} from '../../reducer/contract'
import { deleteContract } from '../../reducer/thunk'

interface TableContractListProps {
  params: IListContractsParams
  headCells: TableHeaderColumn[]
  setHeadCells: Dispatch<SetStateAction<TableHeaderColumn[]>>
  rows: any
  getListContractsApi: (queryParameters: IListContractsParams) => void
}
const TableContractList = ({
  params,
  headCells,
  setHeadCells,
  rows,
  getListContractsApi,
}: TableContractListProps) => {
  const classes = useStyles()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Contract } = useTranslation(LangConstant.NS_CONTRACT)

  const { total, contractQueryParameters, isListFetching }: IContractState =
    useSelector(contractSelector)

  const [modalDeleteContract, setModalDeleteContract] = useState({
    isOpen: false,
    contractId: '',
    contractNumber: '',
  })

  const handlePageChange = (newPage: number) => {
    const newQueryParameters = {
      ...contractQueryParameters,
      pageNum: newPage,
    }
    dispatch(setContractQueryParameters(newQueryParameters))
  }

  const handlePageSizeChange = (newPageSize: number) => {
    const newQueryParameters = {
      ...contractQueryParameters,
      pageNum: 1,
      pageSize: newPageSize,
    }
    dispatch(setContractQueryParameters(newQueryParameters))
  }

  const handleNavigateToDetailPage = (contract: any) => {
    const url = StringFormat(PathConstant.CONTRACT_DETAIL_FORMAT, contract.id)
    navigate(url)
  }

  const handleSortChange = ({
    nextOrderBy,
    sortBy,
    newColumns,
  }: SortChangePayload) => {
    setHeadCells(newColumns)
    const newQueryParameters = {
      ...contractQueryParameters,
      orderBy: nextOrderBy,
      sortBy,
    }
    dispatch(setContractQueryParameters(newQueryParameters))
  }

  const handleCloseModalDelete = () => {
    setModalDeleteContract({
      isOpen: false,
      contractId: '',
      contractNumber: '',
    })
  }

  const handleOpenModalDelete = (contract: any) => {
    setModalDeleteContract({
      isOpen: true,
      contractId: contract.id,
      contractNumber: contract.code,
    })
  }

  const handleDeleteContract = () => {
    dispatch(
      deleteContract({
        contractId: modalDeleteContract.contractId,
        contractNumber: modalDeleteContract.contractNumber,
      })
    )
      .unwrap()
      .then(() => {
        getListContractsApi(contractQueryParameters)
      })
  }

  return (
    <Fragment>
      {modalDeleteContract.isOpen && (
        <ModalDeleteRecords
          open
          titleMessage={i18Contract('TXT_DELETE_CONTRACT')}
          onClose={handleCloseModalDelete}
          onSubmit={handleDeleteContract}
          subMessage={i18('MSG_CONFIRM_DELETE_DESCRIPTION', {
            labelName: !modalDeleteContract.contractNumber
              ? `This Contract`
              : `${i18('LB_CONTRACT_NUMBER')}: ${
                  modalDeleteContract.contractNumber
                }`,
          })}
        />
      )}
      <CommonTable
        useOpenNewTab
        rootClassName={classes.rootTableContractList}
        rowClassName={classes.rowClassName}
        linkFormat={PathConstant.CONTRACT_DETAIL_FORMAT}
        loading={isListFetching}
        columns={headCells}
        rows={rows}
        onSortChange={handleSortChange}
        onRowClick={handleNavigateToDetailPage}
        onDeleteClick={handleOpenModalDelete}
        pagination={{
          totalElements: total,
          pageSize: params.pageSize as number,
          pageNum: params.pageNum as number,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
        }}
      />
    </Fragment>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootTableContractList: {
    marginTop: theme.spacing(4),
  },
  rowClassName: {
    '& .first-item': {
      minWidth: '300px',
      display: 'inline-block',
    },
    '& td:nth-child(3) .row-item-text': {
      minWidth: '140px',
      display: 'inline-block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    '& td:nth-child(4) .row-item-text': {
      width: '140px',
      display: 'inline-block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    '& td:nth-child(5) .row-item-text': {
      width: '140px',
      display: 'inline-block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  },
}))

export default TableContractList

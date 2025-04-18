import StatusItem from '@/components/common/StatusItem'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import CommonTable from '@/components/table/CommonTable'
import { LangConstant, PathConstant } from '@/const'
import { AppDispatch } from '@/store'
import { TableHeaderColumn } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import i18next from 'i18next'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import StringFormat from 'string-format'
import {
  CriteriaState,
  criteriaSelector,
  deleteCriteriaGroup,
  getCriteriaList,
  setCriteriaQueryString,
} from '../../reducer/criteria'
import { criteriaType } from '../../utils'

const headCellsCriteria: TableHeaderColumn[] = [
  {
    id: 'name',
    align: 'left',
    label: i18next.t('mbo:LB_CRITERIA_GROUP'),
    checked: false,
  },
  {
    id: 'status',
    align: 'left',
    label: i18next.t('mbo:LB_CRITERIA_TYPE'),
    checked: false,
  },
  {
    id: 'positionApplied',
    align: 'left',
    label: i18next.t('mbo:LB_POSITION_APPLIED'),
    checked: false,
  },
  {
    id: 'delete',
    align: 'left',
    label: i18next.t('common:LB_ACTION'),
  },
]

const TableCriteria = () => {
  const classes = useStyles()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)

  const {
    isListFetching,
    criteriaList,
    totalElements,
    criteriaQueryString,
  }: CriteriaState = useSelector(criteriaSelector)

  const [modalDeleteCriteriaGroup, setModalDeleteCriteriaGroup] = useState({
    isOpen: false,
    criteriaGroupId: '',
    criteriaGroupName: '',
  })

  const handleNavigateToDetailPage = (criteria: any) => {
    const url = StringFormat(
      PathConstant.MBO_CRITERIA_DETAIL_FORMAT,
      criteria.id
    )
    navigate(url)
  }
  const handlePageChange = (newPage: number) => {
    dispatch(
      setCriteriaQueryString({
        ...criteriaQueryString,
        pageNum: newPage,
      })
    )
  }

  const handleConfirmationModalDelete = (criteria: any) => {
    setModalDeleteCriteriaGroup({
      isOpen: true,
      criteriaGroupId: criteria.id,
      criteriaGroupName: criteria.name,
    })
  }

  const handlePageSizeChange = (newPageSize: number) => {
    dispatch(
      setCriteriaQueryString({
        ...criteriaQueryString,
        pageNum: 1,
        pageSize: newPageSize,
      })
    )
  }

  const handleDeleteCriteriaGroup = () => {
    dispatch(
      deleteCriteriaGroup({
        criteriaGroupId: modalDeleteCriteriaGroup.criteriaGroupId,
        alertName: `${i18Mbo('LB_CRITERIA_GROUP')}: ${
          modalDeleteCriteriaGroup.criteriaGroupName
        }`,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(getCriteriaList(criteriaQueryString))
      })
  }

  const handleCloseConfirmationModal = () => {
    setModalDeleteCriteriaGroup({
      isOpen: false,
      criteriaGroupId: '',
      criteriaGroupName: '',
    })
  }

  useEffect(() => {
    dispatch(getCriteriaList(criteriaQueryString))
  }, [criteriaQueryString])

  return (
    <Box className={classes.rootTableCriteriaList}>
      <CommonTable
        useOpenNewTab
        loading={isListFetching}
        linkFormat={PathConstant.MBO_CRITERIA_DETAIL_FORMAT}
        columns={headCellsCriteria}
        rows={criteriaList.map(item => ({
          ...item,
          status: <StatusItem typeStatus={{ ...criteriaType(item.type) }} />,
        }))}
        onDeleteClick={handleConfirmationModalDelete}
        onRowClick={handleNavigateToDetailPage}
        pagination={{
          totalElements,
          pageSize: criteriaQueryString.pageSize as number,
          pageNum: criteriaQueryString.pageNum as number,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
        }}
      />
      {modalDeleteCriteriaGroup.isOpen && (
        <ModalDeleteRecords
          open
          titleMessage={i18Mbo('TXT_DELETE_CRITERIA_GROUP')}
          onClose={handleCloseConfirmationModal}
          onSubmit={handleDeleteCriteriaGroup}
          subMessage={i18('MSG_CONFIRM_DELETE_DESCRIPTION', {
            labelName: `${i18Mbo('LB_CRITERIA_GROUP')}: ${
              modalDeleteCriteriaGroup.criteriaGroupName
            }`,
          })}
        />
      )}
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootTableCriteriaList: {
    marginTop: theme.spacing(4),
  },
}))
export default TableCriteria

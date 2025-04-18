import CardForm from '@/components/Form/CardForm'
import CommonButton from '@/components/buttons/CommonButton'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import CommonTable from '@/components/table/CommonTable'
import { LangConstant, PathConstant } from '@/const'
import { LIMIT_DEFAULT, PAGE_CURRENT_DEFAULT } from '@/const/table.const'
import { projectSelector } from '@/modules/project/reducer/project'
import { getShareEffortList } from '@/modules/project/reducer/thunk'
import { ProjectService } from '@/modules/project/services'
import { ProjectState, ShareEffortListItem } from '@/modules/project/types'
import { alertSuccess, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { TableHeaderColumn } from '@/types'
import { formatNumberToCurrencyBigInt } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import StringFormat from 'string-format'
import ModalAddShareEffort from './ModalAddShareEffort'
import ModalDetailShareEffort from './ModalDetailShareEffort'

export const initStaffEffort: ShareEffortListItem = {
  staffCode: '',
  staffName: '',
  staffEmail: '',
  branch: '',
  division: '',
  totalShareEffort: 0,
  projectShareId: 0,
}

const ShareEffort = () => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const params = useParams()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)
  const { t: i18Contract } = useTranslation(LangConstant.NS_CONTRACT)

  const {
    shareEffortList,
    totalShareBMMOfProject,
    permissionResourceAllocation,
  }: ProjectState = useSelector(projectSelector)

  const [openModalAddShareEffort, setOpenModalAddShareEffort] = useState(false)
  const [openModalDetailShareEffort, setOpenModalDetailShareEffort] =
    useState(false)
  const [openModalDelete, setOpenModalDelete] = useState(false)
  const [loading, setLoading] = useState(true)
  const [shareEffortSelected, setShareEffortSelected] =
    useState<ShareEffortListItem>(initStaffEffort)
  const [limit, setLimit] = useState(LIMIT_DEFAULT)
  const [page, setPage] = useState(PAGE_CURRENT_DEFAULT)

  const columns: TableHeaderColumn[] = [
    {
      id: 'code',
      label: i18('LB_STAFF_CODE'),
    },
    {
      id: 'staffName',
      label: i18('LB_STAFF_NAME'),
    },
    {
      id: 'staffEmail',
      label: i18('LB_EMAIL'),
    },
    {
      id: 'branch',
      label: i18('LB_BRANCH'),
    },
    {
      id: 'division',
      label: i18('LB_DIVISION'),
    },
    {
      id: 'totalShareBillableManMonth',
      label: `${i18Project('TXT_TOTAL_SHARE_BMM')}`,
      align: 'center',
    },
    {
      id: 'delete',
      label: i18('LB_ACTION'),
      align: 'center',
    },
  ]

  const createShareEffortList = (shareEffort: ShareEffortListItem) => {
    return {
      id: shareEffort.staffId,
      code: shareEffort.staffCode,
      staffCode: shareEffort.staffCode,
      staffName: shareEffort.staffName,
      staffEmail: shareEffort.staffEmail,
      branch: shareEffort.branch,
      division: shareEffort.division,
      projectShareId: shareEffort.projectShareId,
      totalShareBillableManMonth: formatNumberToCurrencyBigInt(
        shareEffort.totalShareEffort
      ),
      useDeleteIcon: !!permissionResourceAllocation.updateShareEffort,
    }
  }

  const shareEffortListRendered = useMemo(() => {
    return [
      ...shareEffortList
        .map(createShareEffortList)
        .slice((page - 1) * limit, page * limit),
      {
        id: '*',
        staffCode: '',
        staffName: '',
        staffEmail: '',
        branch: '',
        projectShareId: '',
        division: (
          <Box component="b" style={{ marginLeft: '-120px' }}>
            {i18Project('TXT_TOTAL_SHARE_BMM_OF_PROJECT')}
          </Box>
        ),
        totalShareBillableManMonth: (
          <Box component="b">
            {formatNumberToCurrencyBigInt(totalShareBMMOfProject)}
          </Box>
        ),
        action: '',
        seeDetails: false,
      },
    ]
  }, [shareEffortList, totalShareBMMOfProject, page, limit])

  const openModalDeleteShareEffort = (shareEffort: ShareEffortListItem) => {
    setShareEffortSelected(shareEffort)
    setOpenModalDelete(true)
  }

  const closeModalDeleteShareEffort = () => {
    setOpenModalDelete(false)
    setShareEffortSelected(initStaffEffort)
  }

  const openModalUpdateShareEffort = (shareEffort: ShareEffortListItem) => {
    setShareEffortSelected(shareEffort)
    setOpenModalDetailShareEffort(true)
  }

  const dispatchGetShareEffortList = () => {
    setLoading(true)
    dispatch(
      getShareEffortList({
        projectId: params.projectId as string,
      })
    )
      .unwrap()
      .then((res: AxiosResponse) => {})
      .finally(() => {
        setLoading(false)
      })
  }

  const deleteShareEffort = () => {
    const payload = {
      projectId: params.projectId as string,
      shareEffortId: shareEffortSelected.projectShareId,
    }
    dispatch(updateLoading(true))
    ProjectService.deleteShareEffort(payload)
      .then(() => {
        dispatchGetShareEffortList()
        dispatch(
          alertSuccess({
            message: `${i18('LB_STAFF')} ${i18('MSG_DELETE_SUCCESS', {
              labelName: shareEffortSelected.staffName,
            })}`,
          })
        )
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  const closeModalDetailShareEffort = () => {
    setOpenModalDetailShareEffort(false)
    setShareEffortSelected(initStaffEffort)
  }

  const onPageChange = (newPage: number) => {
    setPage(newPage)
  }

  const onPageSizeChange = (newPageSize: number) => {
    setLimit(newPageSize)
    setPage(1)
  }

  const onCodeClick = (shareEffort: ShareEffortListItem) => {
    const url = StringFormat(
      PathConstant.STAFF_DETAIL_FORMAT,
      shareEffort.id as string
    )
    window.open(url)
  }

  useEffect(() => {
    dispatchGetShareEffortList()
  }, [])

  return (
    <Fragment>
      <CardForm title={i18Project('TXT_SHARE_EFFORT_LIST')}>
        <Box className={classes.headerActions}>
          {!!permissionResourceAllocation.updateShareEffort && (
            <CommonButton
              lowercase
              onClick={() => setOpenModalAddShareEffort(true)}
            >
              {i18Project('LB_ADD_SHARE_EFFORT')}
            </CommonButton>
          )}
        </Box>
        <CommonTable
          useClickCode
          loading={loading}
          rootClassName={classes.table}
          columns={columns}
          rows={
            shareEffortListRendered.length !== 1 ? shareEffortListRendered : []
          }
          onRowClick={(shareEffort: ShareEffortListItem) =>
            openModalUpdateShareEffort(shareEffort)
          }
          onCodeClick={onCodeClick}
          onDeleteClick={openModalDeleteShareEffort}
          pagination={{
            pageNum: page,
            pageSize: limit,
            totalElements: shareEffortList.length,
            onPageChange,
            onPageSizeChange,
          }}
        />
      </CardForm>
      {openModalAddShareEffort && (
        <ModalAddShareEffort
          onClose={() => setOpenModalAddShareEffort(false)}
          onSubmit={dispatchGetShareEffortList}
        />
      )}
      {openModalDetailShareEffort && (
        <ModalDetailShareEffort
          shareEffort={shareEffortSelected}
          onClose={closeModalDetailShareEffort}
          onEdit={dispatchGetShareEffortList}
        />
      )}
      {openModalDelete && (
        <ModalDeleteRecords
          open
          titleMessage={i18Contract('TXT_DELETE_STAFF')}
          subMessage={StringFormat(
            i18Contract('MSG_CONFIRM_STAFF_DELETE'),
            shareEffortSelected.staffName
          )}
          onClose={closeModalDeleteShareEffort}
          onSubmit={deleteShareEffort}
        />
      )}
    </Fragment>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  headerActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(2),
  },
  flex8: {
    display: 'flex',
    gap: 8,
  },
  editIcon: {
    color: theme.color.black.secondary,
    cursor: 'pointer',
  },
  table: {
    '& tbody td': {
      verticalAlign: 'middle',
    },
  },
}))

export default ShareEffort

import StatusItem from '@/components/common/StatusItem'
import CardForm from '@/components/Form/CardForm'
import CommonTable from '@/components/table/CommonTable'
import { LangConstant, PathConstant, TableConstant } from '@/const'
import { IProject } from '@/modules/customer/types'
import { AuthState, selectAuth } from '@/reducer/auth'
import { TableHeaderColumn } from '@/types'
import { formatCurrency } from '@/utils'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import StringFormat from 'string-format'

export function createData(item: any) {
  return {
    id: item.id,
    code: item.code,
    name: item.name,
    type: item.type?.name,
    technologies: item.technologies,
    startDate: item.startDate,
    endDate: item.endDate,
    totalCurrentRevenue: item.totalCurrentRevenue
      ? formatCurrency(item.totalCurrentRevenue)
      : '',
    status: <StatusItem typeStatus={{ ...item.status }} />,
  }
}

interface IProps {
  projects: IProject[]
}

const CustomerProjectInformation = ({ projects }: IProps) => {
  const { t: i18 } = useTranslation()
  const { t: i18Customer } = useTranslation(LangConstant.NS_CUSTOMER)
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)
  const { permissions }: AuthState = useSelector(selectAuth)
  const { useProjectDetail } = permissions

  const columns: TableHeaderColumn[] = [
    {
      id: 'code',
      align: 'left',
      label: i18Project('LB_PROJECT_CODE'),
    },
    {
      id: 'name',
      align: 'left',
      label: i18Project('LB_PROJECT_NAME'),
    },
    {
      id: 'type',
      align: 'left',
      label: i18Project('LB_PROJECT_TYPE'),
    },
    {
      id: 'technologies',
      align: 'left',
      label: i18('LB_TECHNOLOGY'),
    },
    {
      id: 'startDate',
      align: 'left',
      label: i18Project('LB_PROJECT_START_DATE'),
    },
    {
      id: 'endDate',
      align: 'left',
      label: i18Project('LB_PROJECT_END_DATE'),
    },
    {
      id: 'totalCurrentCost',
      align: 'left',
      label: i18('LB_TOTAL_CURRENT_COST'),
    },
    {
      id: 'status',
      align: 'left',
      label: i18('LB_STATUS'),
    },
  ]

  const [page, setPage] = useState(TableConstant.PAGE_CURRENT_DEFAULT)
  const [pageLimit, setPageLimit] = useState(TableConstant.LIMIT_DEFAULT)

  const projectsPaginate = useMemo(() => {
    if (!projects || !projects.length) return []
    return [...projects]
      .slice((page - 1) * pageLimit, page * pageLimit)
      .map((project: IProject) => createData(project))
  }, [projects, pageLimit, page])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = (newPageSize: number) => {
    setPageLimit(newPageSize)
    setPage(1)
  }

  const handleRedirectToProjectDetail = (project: any) => {
    if (useProjectDetail) {
      const url = StringFormat(PathConstant.PROJECT_DETAIL_FORMAT, project.id)
      window.open(window.location.origin + url, '_blank')
    }
  }

  return (
    <CardForm title={i18Customer('TXT_PROJECT_INFORMATION')}>
      <CommonTable
        useOpenNewTab
        linkFormat={PathConstant.PROJECT_DETAIL_FORMAT}
        columns={columns}
        rows={projectsPaginate}
        onRowClick={
          useProjectDetail ? handleRedirectToProjectDetail : undefined
        }
        pagination={{
          totalElements: projects.length,
          pageSize: pageLimit,
          pageNum: page,
          onPageChange: handlePageChange,
          onPageSizeChange: handleRowsPerPageChange,
        }}
      />
    </CardForm>
  )
}

export default CustomerProjectInformation

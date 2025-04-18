import StatusItem from '@/components/common/StatusItem'
import CardForm from '@/components/Form/CardForm'
import CommonTable from '@/components/table/CommonTable'
import { LangConstant, PathConstant, TableConstant } from '@/const'
import { PROJECT_STATUS } from '@/const/app.const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { TableHeaderColumn } from '@/types'
import { formatCurrencyThreeCommas, formatDate } from '@/utils'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import StringFormat from 'string-format'
import { ITechnology } from '../../types'

const createData = (prj: any) => {
  return {
    id: prj.id,
    code: prj.code,
    name: prj.name,
    type: prj.type?.name,
    technologies: prj.technologies
      .map((tech: ITechnology) => tech.name)
      .join(', '),
    startDate: formatDate(prj.startDate),
    endDate: formatDate(prj.endDate),
    totalCurrentCost: prj.totalCurrentRevenue
      ? formatCurrencyThreeCommas(prj.totalCurrentRevenue)
      : '',
    status: <StatusItem typeStatus={{ ...PROJECT_STATUS[prj.status.id] }} />,
  }
}

interface PartnerProjectInformationProps {
  listProjects: any[]
}

const PartnerProjectInformation = ({
  listProjects,
}: PartnerProjectInformationProps) => {
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

  const rows = useMemo(() => {
    return [...listProjects]
      .slice((page - 1) * pageLimit, page * pageLimit)
      .map(prj => createData(prj))
  }, [listProjects, pageLimit, page])

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
        rows={rows}
        onRowClick={handleRedirectToProjectDetail}
        pagination={{
          totalElements: listProjects.length,
          pageSize: pageLimit,
          pageNum: page,
          onPageChange: handlePageChange,
          onPageSizeChange: handleRowsPerPageChange,
        }}
      />
    </CardForm>
  )
}

export default PartnerProjectInformation

import CommonTable from '@/components/table/CommonTable'
import { PathConstant } from '@/const'
import { TableHeaderColumn } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import StringFormat from 'string-format'

interface TableContractListProps {
  headCells: TableHeaderColumn[]
  rows: any
  setPageSize: (value: number) => void
  setPageNum: (value: number) => void
  pageNum: number
  pageSize: number
}

const TableContractRelated = ({
  headCells,
  rows,
  setPageSize,
  setPageNum,
  pageNum,
  pageSize,
}: TableContractListProps) => {
  const classes = useStyles()

  const handlePageChange = (newPage: number) => {
    setPageNum(newPage)
  }

  const handleRowsPerPageChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setPageNum(1)
  }

  const handleNavigateToDetailPage = (contract: any) => {
    const url = StringFormat(PathConstant.CONTRACT_DETAIL_FORMAT, contract.id)
    window.open(url)
  }

  return (
    <Box className={classes.rootTableContractList}>
      <CommonTable
        useOpenNewTab
        columns={headCells}
        rows={rows}
        linkFormat={PathConstant.CONTRACT_DETAIL_FORMAT}
        rowClassName={classes.rowClassName}
        onRowClick={handleNavigateToDetailPage}
        pagination={{
          totalElements: rows.length,
          pageSize,
          pageNum,
          onPageChange: handlePageChange,
          onPageSizeChange: handleRowsPerPageChange,
        }}
      />
    </Box>
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
  },
}))

export default TableContractRelated

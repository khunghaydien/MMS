import CommonTable from '@/components/table/CommonTable'
import { TableHeaderColumn } from '@/types'

interface IProps {
  headCell: TableHeaderColumn[]
  rows: any[]
  loadingStep: boolean
}

const CriteriaTableCycle = ({
  headCell = [],
  rows = [],
  loadingStep,
}: IProps) => {
  return (
    <CommonTable
      columns={headCell}
      rows={rows}
      loading={loadingStep}
      minWidth={400}
    />
  )
}

export default CriteriaTableCycle

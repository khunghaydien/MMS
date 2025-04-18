import CommonTable, { CommonTableProps } from './CommonTable'

const CommonTableCustomFirstCol = (props: CommonTableProps) => {
  const { rows, columns = [] } = props
  return (
    <CommonTable
      {...props}
      columns={!!rows.length ? columns : columns.slice(1, columns.length)}
    />
  )
}

export default CommonTableCustomFirstCol

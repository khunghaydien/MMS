import Modal from '@/components/common/Modal'
import InputCheckbox from '@/components/inputs/InputCheckbox'
import { IExportListToExcelBody, TableHeaderColumn } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ModalExportToExcelTableProps {
  onClose: () => void
  onSubmit: (payload: IExportListToExcelBody) => void
  listColumn: TableHeaderColumn[]
  listIdsChecked: string[]
}

const ModalExportToExcelTable = ({
  listColumn,
  onClose,
  onSubmit,
  listIdsChecked,
}: ModalExportToExcelTableProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()

  const [listColumnApply, setListColumnApply] = useState(listColumn)

  const listCheckedFiltered = useMemo(() => {
    return listColumnApply.filter((item: TableHeaderColumn) => item.checked)
  }, [listColumnApply])

  const isCheckAll = useMemo(() => {
    return listCheckedFiltered.length === listColumnApply.length
  }, [listColumnApply, listCheckedFiltered])

  const handleCheckItem = (index: number) => {
    const newListColumnApply = [...listColumnApply]
    newListColumnApply[index].checked = !newListColumnApply[index].checked
    setListColumnApply(newListColumnApply)
  }

  const handleCheckAll = () => {
    const newListColumnApply = [...listColumnApply].map(
      (item: TableHeaderColumn) => ({
        ...item,
        checked: !isCheckAll,
      })
    )
    setListColumnApply(newListColumnApply)
  }

  const handleClose = () => {
    onClose()
  }

  const handleSubmit = () => {
    onSubmit({
      ids: listIdsChecked,
      fieldNames: listCheckedFiltered.map((item: TableHeaderColumn) => item.id),
    })
    handleClose()
  }

  return (
    <Modal
      open
      labelSubmit="Export"
      title={i18('TXT_EXPORT_TO_EXCEL')}
      onClose={handleClose}
      onSubmit={handleSubmit}
      submitDisabled={!listCheckedFiltered.length}
    >
      <Box className={classes.listColumn}>
        <InputCheckbox
          checked={isCheckAll}
          indeterminate={
            !!listCheckedFiltered.length &&
            listCheckedFiltered.length < listColumnApply.length
          }
          label="All"
          onClick={handleCheckAll}
        />
        {listColumnApply.map((option: TableHeaderColumn, index: number) => (
          <InputCheckbox
            key={option.id}
            className={classes.checkboxItem}
            checked={option.checked}
            label={option.label}
            onClick={() => handleCheckItem(index)}
          />
        ))}
      </Box>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  listColumn: {
    display: 'flex',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
  },
  checkboxItem: {
    width: 'max-content',
  },
}))

export default ModalExportToExcelTable

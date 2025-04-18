import InputErrorMessage from '@/components/common/InputErrorMessage'
import ConditionalRender from '@/components/ConditionalRender'
import InputDropdown from '@/components/inputs/InputDropdown'
import LoadingSkeleton from '@/components/loading/LoadingSkeleton'
import TableNoData from '@/components/table/TableNoData'
import { LangConstant } from '@/const'
import { OptionItem } from '@/types'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RowEvaluationCriteria, TaskEvaluationDetails } from '../models'

interface TableEvaluationCriteriaProps {
  rows: RowEvaluationCriteria[]
  loading?: boolean
  setTableEvaluationCriteria?: Dispatch<SetStateAction<any>>
  currentTaskEvaluationDetails?: TaskEvaluationDetails[]
  setLevelValues: Dispatch<SetStateAction<string[]>>
  levelValues: string[]
  required?: boolean
  errorMessage?: string
  error?: boolean
  disabled?: boolean
}

const TableEvaluationCriteria = ({
  rows,
  loading = false,
  setTableEvaluationCriteria,
  currentTaskEvaluationDetails,
  setLevelValues,
  levelValues,
  required = false,
  error = false,
  errorMessage = '',
  disabled,
}: TableEvaluationCriteriaProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)

  const [dataRows, setDataRows] = useState<RowEvaluationCriteria[]>([])

  const mediumLevel = useMemo(() => {
    let _mediumLevel = 0
    rows.forEach(item => {
      const foundLevel = item.levelListOptions.find(level => {
        return levelValues.includes(level?.value?.toString() || '')
      })
      if (!!foundLevel) {
        _mediumLevel =
          _mediumLevel + (Number(foundLevel?.label) * Number(item.weight)) / 100
      }
    })
    return Number(_mediumLevel).toFixed(2)
  }, [levelValues, rows])

  const handleLevelChange = (value: string, index: number) => {
    const newLevelValues = [...levelValues]
    newLevelValues[index] = value
    setLevelValues(newLevelValues)
  }

  const getMeaning = (levelListOptions: OptionItem[], k: string) => {
    return (
      levelListOptions.find((item: OptionItem) => item.value == k)?.note || '--'
    )
  }

  useEffect(() => {
    if (JSON.stringify(rows) !== JSON.stringify(dataRows)) {
      setDataRows(rows)
    }
  }, [rows, loading])

  useEffect(() => {
    !!setTableEvaluationCriteria && setTableEvaluationCriteria(levelValues)
  }, [levelValues, currentTaskEvaluationDetails])

  return (
    <Box className={classes.rootTable}>
      <TableContainer className={classes.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{i18Mbo('LB_EVALUATION_CRITERIA')}</TableCell>
              <TableCell>{i18Mbo('LB_WEIGHT')}</TableCell>

              <TableCell>
                {i18('LB_SCORE')}
                {!!required && (
                  <Box className={classes.mark} component="span">
                    *
                  </Box>
                )}
              </TableCell>
              <TableCell>{i18Mbo('LB_MEANING')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && (
              <>
                {!dataRows.length ? (
                  <TableNoData />
                ) : (
                  dataRows.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell width={'180px'}>{row.name}</TableCell>
                      <TableCell>{row.weight}%</TableCell>
                      <TableCell>
                        <InputDropdown
                          isDisable={disabled}
                          placeholder={i18Mbo('PLH_DIFFICULTY')}
                          width={110}
                          isShowClearIcon={false}
                          value={levelValues[index] || ''}
                          listOptions={row.levelListOptions}
                          onChange={(value: string) =>
                            handleLevelChange(value, index)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Box width={'300px'}>
                          {getMeaning(row.levelListOptions, levelValues[index])}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
                {!!dataRows.length && !loading && (
                  <TableRow>
                    <TableCell>
                      <b>{i18('LB_SCORE')}</b>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <b>{mediumLevel}</b>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <ConditionalRender conditional={error}>
        <InputErrorMessage
          className={classes.errorMessage}
          content={errorMessage || ''}
        />
      </ConditionalRender>
      {loading && <LoadingSkeleton />}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootTable: {
    maxWidth: '100%',
    marginBottom: '10px',
    background: '#FFFFFF',

    borderRadius: '4px',
    // padding: theme.spacing(0.5, 0.5, 0, 0.5),
    position: 'relative',
    margin: '2px',
    '& table': {
      boxShadow: '0px 0px 0px 1px #E0E0E0',
      borderRadius: '4px',
    },
  },
  tableContainer: {
    boxShadow: '0px 0px 0px 1px #e0e0e0',
  },
  wrapLoading: {
    display: 'flex',
    height: '300px',
  },
  mark: {
    color: theme.color.error.secondary,
    marginLeft: theme.spacing(0.5),
  },
  errorMessage: {
    marginTop: theme.spacing(1),
  },
}))

export default TableEvaluationCriteria

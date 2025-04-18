import { LangConstant } from '@/const'
import { projectSelector } from '@/modules/project/reducer/project'
import { TableHeaderColumn } from '@/types'
import { cleanObject, formatAnyToDate, getTextEllipsis } from '@/utils'
import { Difference, Edit } from '@mui/icons-material'
import {
  Box,
  Checkbox,
  TableBody,
  TableCell,
  TableRow,
  Theme,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { isEmpty } from 'lodash'
import {
  Dispatch,
  Fragment,
  ReactElement,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import StringFormat from 'string-format'
import ConditionalRender from '../ConditionalRender'
import InputDateFns from '../Datepicker/InputDateFns'
import CommonButton from '../buttons/CommonButton'
import NoData from '../common/NoData'
import CopyIcon from '../icons/CopyIcon'
import DeleteIcon from '../icons/DeleteIcon'
import InputCurrency from '../inputs/InputCurrency'

interface CommonTableBodyProps {
  rows: any
  rowClassName?: string
  linkFormat?: string
  useCheckbox?: boolean
  loading?: boolean
  useOpenNewTab?: boolean
  listChecked?: string[]
  LastRow?: ReactElement | ReactNode
  columns: TableHeaderColumn[]
  listFieldAllowRowClick?: string[]
  isUpdateRow?: boolean
  onCheckItem?: (row: any) => void
  onRowClick?: (row: any) => void
  onDeleteClick?: (row: any) => void
  onCopyClick?: (row: any) => void
  onUpdateRow?: (row: any) => void
  onApproveRequestOT?: (row: any) => void
  onRejectRequestOT?: (row: any) => void
  onUpdateRequestOT?: (row: any) => void
}

const CustomTableBody = ({
  rows,
  rowClassName = '',
  linkFormat = '/{0}',
  useCheckbox = false,
  loading = false,
  useOpenNewTab = false,
  listChecked = [],
  LastRow,
  columns,
  listFieldAllowRowClick,
  isUpdateRow,
  onCheckItem,
  onRowClick,
  onDeleteClick,
  onCopyClick,
  onUpdateRow,
  onApproveRequestOT,
  onRejectRequestOT,
  onUpdateRequestOT,
}: CommonTableBodyProps) => {
  const classes = useStyles()
  const handleCheckboxChange = (row: any) => {
    !!onCheckItem && onCheckItem(row)
  }

  const handleRowClick = (row: any) => {
    ;(typeof row.seeDetails === 'undefined' ? true : row.seeDetails) &&
      !!onRowClick &&
      onRowClick(row)
  }

  const handleLinkClick = (e: any) => {
    e.preventDefault()
  }

  const handleDeleteClick = (row: any) => {
    !!onDeleteClick && onDeleteClick(row)
  }

  const handleCopyClick = (row: any) => {
    !!onCopyClick && onCopyClick(row)
  }
  const handleUpdateRow = (row: any) => {
    const newRow = {
      ...row,
      projectHeadcount: formatValue(row.projectHeadcount),
      assignEndDate: formatAnyToDate(row.assignEndDate),
      assignStartDate: formatAnyToDate(row.assignStartDate),
    }
    !!onUpdateRow && onUpdateRow(newRow)
  }

  const handleClickRow = (row: any, column: TableHeaderColumn) => {
    if (
      isEmpty(listFieldAllowRowClick) ||
      (!isEmpty(listFieldAllowRowClick) &&
        listFieldAllowRowClick?.includes(column.id))
    ) {
      handleRowClick(row)
    }
  }
  const formatValue = (value: string) => {
    if (typeof value === 'string' && value.includes('%'))
      return value?.split('%')[0]
    else return value
  }
  const handleApproveRequestOT = (row: any) => {
    !!onApproveRequestOT && onApproveRequestOT(row)
  }
  const handleRejectRequestOT = (row: any) => {
    !!onRejectRequestOT && onRejectRequestOT(row)
  }
  const handleUpdateRequestOT = (row: any) => {
    !!onUpdateRequestOT && onUpdateRequestOT(row)
  }
  const commonTableCell = (
    row: any,
    column: TableHeaderColumn,
    isHighlight: boolean,
    isWeekend: boolean,
    isTotal: boolean
  ) => {
    return (
      <TableCell
        align={column.align}
        className={clsx(
          !isEmpty(listFieldAllowRowClick) &&
            listFieldAllowRowClick?.includes(column.id)
            ? classes.columnBoxWithPointer
            : classes.columnBox,
          isWeekend ? classes.backgroundWeekend : '',
          isTotal ? classes.colorTotal : ''
        )}
        key={column.id}
        onClick={() => handleClickRow(row, column)}
        sx={cleanObject({
          background: isHighlight ? row['background'] : '',
        })}
      >
        {useOpenNewTab && (
          <a
            className={classes.link}
            href={StringFormat(linkFormat, row.id)}
            onClick={handleLinkClick}
          />
        )}
        <Box
          sx={cleanObject({
            color: isHighlight && '#d32f2f',
            fontWeight: isHighlight && 'bold',
          })}
          title={
            typeof row[column.id] === 'string' ||
            typeof row[column.id] === 'number'
              ? row[column.id]
              : ''
          }
          className={clsx(
            classes.column,
            (column.id === 'id' || column.id === 'code') && 'active first-item',
            (column.id === 'requestStatus' || column.id === 'effectStatus') &&
              'bold',
            ((column.id === 'requestStatus' && row[column.id] === 'Approved') ||
              (column.id === 'effectStatus' &&
                row[column.id] === 'In Effect')) &&
              classes.colorSuccess,
            ((column.id === 'requestStatus' && row[column.id] === 'Rejected') ||
              (column.id === 'effectStatus' &&
                row[column.id] === 'Terminated')) &&
              classes.colorError,
            ((column.id === 'requestStatus' &&
              row[column.id] === 'Await Decision') ||
              (column.id === 'effectStatus' &&
                row[column.id] === 'Not Start')) &&
              classes.colorInherit,
            'row-item-text'
          )}
        >
          <ConditionalRender
            conditional={typeof row[column.id] === 'object'}
            fallback={getTextEllipsis(row[column.id], column.ellipsisNumber)}
          >
            {row[column.id]?.key === null && row[column.id]?.ref === null
              ? row[column.id]
              : JSON.stringify(row[column.id])}
          </ConditionalRender>
        </Box>
      </TableCell>
    )
  }

  const CopyTableCell = (row: any) => {
    return (
      <TableCell>
        <CopyIcon content={row.copyContent} />
      </TableCell>
    )
  }

  const editableTableCell = (
    tmpRow: any,
    setTmpRow: Dispatch<SetStateAction<any>>,
    column: TableHeaderColumn,
    isHighlight: boolean,
    isRowEditing: boolean,
    setIsError: Dispatch<SetStateAction<boolean>>
  ) => {
    const { generalInfo } = useSelector(projectSelector)
    const { startDate, endDate } = generalInfo
    const [startDateError, setStartDateError] = useState(false)
    const [endDateError, setEndDateError] = useState(false)
    const { t: i18nCommon } = useTranslation(LangConstant.NS_COMMON)
    const { t: i18nProject } = useTranslation(LangConstant.NS_PROJECT)
    const [isNullValue, setIsNullValue] = useState(false)
    const assignEndDate = useMemo(() => {
      return formatAnyToDate(tmpRow.assignEndDate)
    }, [tmpRow])

    const assignStartDate = useMemo(() => {
      return formatAnyToDate(tmpRow.assignStartDate)
    }, [tmpRow])

    const compareStartDateWithEndDate = useMemo(() => {
      if (!tmpRow.assignStartDate || !tmpRow.assignEndDate) return false
      return tmpRow.assignStartDate > tmpRow.assignEndDate
    }, [tmpRow.assignStartDate, tmpRow.assignEndDate])

    const startDateErrorMessage = useMemo(() => {
      return !assignStartDate
        ? i18nCommon('MSG_INPUT_DATE_REQUIRE', {
            name: i18nProject('LB_ASSIGN_START_DATE') || '',
          }) || ''
        : ''
    }, [startDateError, tmpRow.assignStartDate])

    const onChangeEditableTableCell = (
      value: any,
      field: string,
      tmpRow: any
    ) => {
      if (!value) {
        setIsNullValue(true)
      } else setIsNullValue(false)
      const newTmpRow = {
        ...tmpRow,
        [field]: field === 'projectHeadcount' ? `${value}%` : value,
      }
      setTmpRow(newTmpRow)
    }

    useEffect(() => {
      if (startDateError || endDateError || isNullValue) setIsError(true)
      else setIsError(false)
    }, [startDateError, endDateError, isNullValue])

    const compareDate = new Date('2024-1-1')

    const minStartDate = useMemo(() => {
      if (startDate)
        return new Date(Math.max(startDate?.getTime(), compareDate.getTime()))
    }, [startDate, compareDate])

    const minEndDate = useMemo(() => {
      if (startDate && assignStartDate)
        return new Date(
          Math.max(
            startDate?.getTime(),
            compareDate.getTime(),
            assignStartDate.getTime()
          )
        )
      else return compareDate
    }, [startDate, assignStartDate, compareDate])

    return (
      <TableCell
        align={column.align}
        className={classes.columnBoxWithPointer}
        key={column.id}
        sx={cleanObject({
          background: isHighlight ? tmpRow['background'] : '',
        })}
      >
        <ConditionalRender
          conditional={!isRowEditing}
          key={column.id + 'table-cell'}
          fallback={
            <>
              <ConditionalRender
                key={column.id + 'effort'}
                conditional={column.type === 'effort'}
              >
                <Box className={classes.maxWidth100}>
                  <InputCurrency
                    suffix="%"
                    maxLength={5}
                    placeholder={'E.g: 80%'}
                    value={formatValue(tmpRow[column.id])}
                    onChange={(value: any) =>
                      onChangeEditableTableCell(value, column.id, tmpRow)
                    }
                    errorMessage={
                      i18nCommon('MSG_INPUT_DATE_REQUIRE', {
                        name: i18nProject('LB_PROJECT_STAFF_HEADCOUNT') || '',
                      }) || ''
                    }
                    error={
                      !formatValue(tmpRow[column.id]) &&
                      Boolean(!formatValue(tmpRow[column.id]))
                    }
                  />
                </Box>
              </ConditionalRender>
              <ConditionalRender
                key={column.id + 'startDate'}
                conditional={column.type === 'startDate'}
              >
                <InputDateFns
                  required
                  isShowClearIcon
                  defaultCalendarMonth={startDate}
                  minDate={minStartDate}
                  maxDate={assignEndDate}
                  value={formatAnyToDate(tmpRow[column.id])}
                  onChange={(value: Date | null) =>
                    onChangeEditableTableCell(value, column.id, tmpRow)
                  }
                  error={
                    (!assignStartDate && Boolean(!assignStartDate)) ||
                    startDateError
                  }
                  errorMessage={startDateErrorMessage}
                  onError={(error: string | null) => setStartDateError(!!error)}
                />
              </ConditionalRender>
              <ConditionalRender
                key={column.id + 'endDate'}
                conditional={column.type === 'endDate'}
              >
                <InputDateFns
                  required
                  isShowClearIcon
                  defaultCalendarMonth={endDate}
                  minDate={minEndDate}
                  maxDate={endDate}
                  value={formatAnyToDate(tmpRow[column.id])}
                  onChange={(value: Date | null) =>
                    onChangeEditableTableCell(value, column.id, tmpRow)
                  }
                  error={
                    (!assignEndDate && Boolean(!assignEndDate)) || endDateError
                  }
                  errorMessage={
                    endDateError
                      ? compareStartDateWithEndDate
                        ? (i18nProject(
                            'MSG_INVALID_ASSIGN_START_DATE_RANGE'
                          ) as string)
                        : (i18nProject('MSG_ASSIGN_END_DATE_INVALID') as string)
                      : !assignEndDate
                      ? i18nCommon('MSG_INPUT_DATE_REQUIRE', {
                          name: i18nProject('LB_ASSIGN_END_DATE') || '',
                        }) || ''
                      : ''
                  }
                  onError={(error: string | null) => setEndDateError(!!error)}
                />
              </ConditionalRender>
            </>
          }
        >
          {useOpenNewTab && (
            <a
              className={classes.link}
              href={StringFormat(linkFormat, tmpRow.id)}
              onClick={handleLinkClick}
            />
          )}
          <Box
            sx={cleanObject({
              color: isHighlight && '#d32f2f',
              fontWeight: isHighlight && 'bold',
            })}
            title={
              typeof tmpRow[column.id] === 'string' ||
              typeof tmpRow[column.id] === 'number'
                ? tmpRow[column.id]
                : ''
            }
            className={clsx(
              classes.column,
              (column.id === 'id' || column.id === 'code') &&
                'active first-item',
              'row-item-text'
            )}
          >
            <ConditionalRender
              conditional={typeof tmpRow[column.id] === 'object'}
              fallback={getTextEllipsis(
                tmpRow[column.id],
                column.ellipsisNumber
              )}
            >
              {tmpRow[column.id]?.key === null &&
              tmpRow[column.id]?.ref === null
                ? tmpRow[column.id]
                : JSON.stringify(tmpRow[column.id])}
            </ConditionalRender>
          </Box>
        </ConditionalRender>
      </TableCell>
    )
  }

  const buttonAction = (
    column: TableHeaderColumn,
    row: any,
    isRowEditing: boolean,
    handleCopyClick: (row: any) => void,
    handleDeleteClick: (row: any) => void,
    handleUpdateRow: (row: any) => void,
    setIsRowEditing: Dispatch<SetStateAction<boolean>>,
    handleClear: () => void,
    isError: boolean
  ) => {
    return (
      <ConditionalRender
        key={column.id + 'button'}
        conditional={!isRowEditing}
        fallback={
          <TableCell key={column.id} className={classes.nowrap}>
            <CommonButton
              disabled={isError}
              height={40}
              className={classes.button}
              onClick={() => {
                !isError && handleUpdateRow(row)
              }}
            >
              Update
            </CommonButton>
            <CommonButton
              height={40}
              color="error"
              onClick={() => handleClear()}
            >
              Cancel
            </CommonButton>
          </TableCell>
        }
      >
        <ConditionalRender
          key={column.id + 'request'}
          conditional={!!row['isRequestOT']}
          fallback={
            <TableCell key={column.id} className={classes.nowrap}>
              <Box className={classes.flexGrap}>
                {!!row['useCopyRowIcon'] && (
                  <Difference
                    className={classes.duplicateIcon}
                    onClick={() => handleCopyClick(row)}
                  />
                )}
                {!!row['useDeleteIcon'] &&
                  !!row['isUpdateStaff'] &&
                  (!!row['isCanUpdateEndDate'] ||
                    !!row['isCanUpdateStartDate']) && (
                    <Box className={classes.flexGrap}>
                      {!!row['isCanUpdateStartDate'] && (
                        <DeleteIcon onClick={() => handleDeleteClick(row)} />
                      )}
                      {!!row['isCanUpdateEndDate'] && (
                        <Edit
                          className={classes.editIcon}
                          onClick={() => setIsRowEditing(prev => !prev)}
                        />
                      )}
                    </Box>
                  )}
              </Box>
            </TableCell>
          }
        >
          <TableCell key={column.id} className={classes.nowrap}>
            {!!row['useApprove'] && (
              <CommonButton
                className={classes.buttonRequest}
                color="success"
                onClick={() => handleApproveRequestOT(row)}
              >
                Approve
              </CommonButton>
            )}
            {!!row['useReject'] && (
              <CommonButton
                className={clsx(classes.ml5, classes.buttonRequest)}
                color="error"
                onClick={() => handleRejectRequestOT(row)}
              >
                Reject
              </CommonButton>
            )}
            {!!row['useUpdate'] && (
              <CommonButton
                className={classes.buttonRequest}
                onClick={() => handleUpdateRequestOT(row)}
              >
                Update
              </CommonButton>
            )}
          </TableCell>
        </ConditionalRender>
      </ConditionalRender>
    )
  }
  return (
    <TableBody
      className={clsx(classes.rootCommonTableBody, loading && 'loading')}
    >
      <ConditionalRender conditional={!loading && !rows.length}>
        <TableRow>
          <TableCell colSpan={100}>
            <NoData />
          </TableCell>
        </TableRow>
      </ConditionalRender>
      <ConditionalRender conditional={!loading && !!rows.length}>
        {rows.map((row: any, index: number) => {
          const isTotal = row.isTotal
          const [isRowEditing, setIsRowEditing] = useState<boolean>(false)
          const [isError, setIsError] = useState(false)
          const [tmpRow, setTmpRow] = useState(row)
          const isChange = useMemo(() => {
            return JSON.stringify(tmpRow) != JSON.stringify(row)
          }, [tmpRow])
          const handleClear = () => {
            setTmpRow(row)
            setIsRowEditing(false)
          }
          useEffect(() => {
            if (isChange) {
              setIsRowEditing(true)
            }
          }, [isChange])
          return (
            <TableRow
              key={index}
              className={clsx(
                classes.row,
                !!onRowClick &&
                  isEmpty(listFieldAllowRowClick) &&
                  (typeof tmpRow.seeDetails === 'undefined'
                    ? true
                    : tmpRow.seeDetails) &&
                  'useOnClick',
                rowClassName,
                tmpRow.isError ? classes.rowError : '',
                tmpRow.isTotal ? classes.rowTotal : ''
              )}
            >
              {useCheckbox && (
                <TableCell padding="checkbox">
                  {tmpRow && tmpRow.isActiveCheckbox === true ? (
                    <Checkbox
                      checked={listChecked.includes(tmpRow.id)}
                      onChange={() => handleCheckboxChange(tmpRow)}
                    />
                  ) : (
                    ''
                  )}
                </TableCell>
              )}
              {columns.map((column: TableHeaderColumn, index: number) => {
                const isHighlight =
                  !!column.isHighlight &&
                  !!tmpRow['background'] &&
                  typeof tmpRow['background'] === 'string' &&
                  tmpRow[column.id]?.props?.children?.props?.children !== 0
                const isWeekend = !!column.isWeekend
                const isEditableCell = useMemo(() => {
                  if (column.type === 'startDate' || column.type === 'effort') {
                    if (
                      tmpRow['isCanUpdateStartDate'] &&
                      tmpRow['isUpdateStaff']
                    )
                      return column.editable && isUpdateRow
                    else return false
                  } else if (column.type === 'endDate') {
                    if (tmpRow['isCanUpdateEndDate'] && tmpRow['isUpdateStaff'])
                      return column.editable && isUpdateRow
                    else return false
                  } else return column.editable && isUpdateRow
                }, [column.editable, isUpdateRow, column.type, tmpRow])

                const isCommonCell = useMemo(() => {
                  return (
                    column.id !== 'delete' &&
                    column.id !== 'copy' &&
                    !isEditableCell
                  )
                }, [column.id, isEditableCell])
                return (
                  <Fragment key={index}>
                    {column.id === 'delete' &&
                      buttonAction(
                        column,
                        tmpRow,
                        isRowEditing,
                        handleCopyClick,
                        handleDeleteClick,
                        handleUpdateRow,
                        setIsRowEditing,
                        handleClear,
                        isError
                      )}
                    {column.id === 'copy' && CopyTableCell(tmpRow)}
                    {isEditableCell &&
                      editableTableCell(
                        tmpRow,
                        setTmpRow,
                        column,
                        isHighlight,
                        isRowEditing,
                        setIsError
                      )}
                    {isCommonCell &&
                      commonTableCell(
                        tmpRow,
                        column,
                        isHighlight,
                        isWeekend,
                        isTotal
                      )}
                  </Fragment>
                )
              })}
            </TableRow>
          )
        })}
        {!!LastRow && LastRow}
      </ConditionalRender>
    </TableBody>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  maxWidth100: {
    maxWidth: '100px',
  },
  colorTotal: {
    color: '#fff !important',
  },
  nowrap: {
    whiteSpace: 'nowrap',
  },
  rowTotal: {
    background: '#17469F',
    '& td': {
      background: '#17469F',
    },
  },
  backgroundWeekend: {
    background: '#D6DBE4',
  },
  icon: {
    color: theme.color.black.secondary,
    marginRight: '20px',
    cursor: 'pointer',
  },
  button: {
    marginRight: '20px !important',
  },
  rootCommonTableBody: {},
  columnBoxWithPointer: {
    position: 'relative',
    cursor: 'pointer',
  },
  columnBox: {
    position: 'relative',
  },
  column: {
    '&.active': {
      color: theme.color.blue.primary,
    },
  },
  row: {
    '&.useOnClick': {
      cursor: 'pointer',
      '&:hover': {
        background: theme.color.grey.tertiary,
      },
    },
  },
  link: {
    position: 'absolute',
    display: 'inline-block',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  rowLoading: {
    position: 'relative',
    '& td': {
      borderBottom: 'unset',
    },
  },
  rowError: {
    backgroundColor: theme.color.error.tertiary,

    '&:hover': {
      backgroundColor: `${theme.color.error.tertiary} !important`,
    },
  },
  ml5: {
    marginLeft: '5px !important',
  },
  buttonRequest: {
    fontSize: '12px !important',
  },
  colorSuccess: {
    color: '#58B984',
  },
  colorError: {
    color: theme.color.error.secondary,
  },
  colorInherit: {
    color: '#17469F',
  },
  colorInProgress: {
    color: theme.color.yellow.primary,
  },
  editIcon: {
    color: theme.color.black.secondary,
    cursor: 'pointer',
  },
  duplicateIcon: {
    color: theme.color.black.secondary,
    cursor: 'pointer',
  },
  flexGrap: {
    display: 'flex',
    gap: '10px',
  },
}))

export default CustomTableBody

import InputCurrency from '@/components/inputs/InputCurrency'
import SelectDivisionSingle from '@/components/select/SelectDivisionSingle'
import { MODULE_PROJECT_CONST } from '@/const/app.const'
import { NS_PROJECT } from '@/const/lang.const'
import { projectSelector } from '@/modules/project/reducer/project'
import { OptionItem } from '@/types'
import { getFormatNumberDecimal } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { Dispatch, SetStateAction, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { ProjectBillableManMonth } from '../../project-create/ProjectCreate'

interface TableHeadcountDetail {
  rows: ProjectBillableManMonth[]
  onBillableEffortChange: (value: string, monthYear: string) => void
  onShareEffortChange: (value: string, monthYear: string) => void
  disabled: boolean
  editable: boolean
  division: OptionItem
  onDivisionChange: (value: OptionItem) => void
  divisionError: boolean
  setDivisionError: Dispatch<SetStateAction<boolean>>
}

const TableHeadcountDetail = ({
  rows = [],
  onBillableEffortChange,
  disabled,
  editable,
  onShareEffortChange,
  division,
  onDivisionChange,
  divisionError,
}: TableHeadcountDetail) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const { generalInfo } = useSelector(projectSelector)

  const useMark = useMemo(() => {
    return rows.some(row => !!+row.shareEffort)
  }, [rows])

  return (
    <Box className={classes.containerTable}>
      <Box className={classes.headerLeft}>
        <Box className={classes.headerCell}>{i18('LB_MONTH')}</Box>
        <Box className={classes.headerCell}>{`${i18Project(
          'TXT_BILLABLE_EFFORT'
        )} (MM)`}</Box>
        <Box className={classes.headerCell}>{`${i18Project(
          'TXT_ASSIGN_EFFORT'
        )} (MM)`}</Box>
        <Box className={classes.headerCell}>{`${i18Project(
          'LB_ACTUAL_EFFORT'
        )} (MM)`}</Box>
        <Box className={classes.headerCell}>
          <Box>
            {`${i18Project('TXT_SHARE_EFFORT')} (MM)`}
            {editable && useMark && (
              <Box className={classes.mark} component="span">
                *
              </Box>
            )}
          </Box>
          <Box
            sx={{
              display: !editable ? 'none' : 'block',
            }}
          >
            <SelectDivisionSingle
              error={divisionError}
              errorMessage={i18('MSG_SELECT_REQUIRE', {
                name: i18('LB_DIVISION'),
              })}
              isShowClearIcon
              paddingRight={16}
              ignoreOptionById={generalInfo.divisionId}
              width={240}
              moduleConstant={MODULE_PROJECT_CONST}
              placeholder={i18Project('PLH_SELECT_DIVISION') || ''}
              value={division.id}
              onChange={(value: OptionItem) => {
                onDivisionChange(value)
              }}
            />
          </Box>
          {!editable && (
            <Box>{division.label || <Box component="i">None</Box>}</Box>
          )}
        </Box>
      </Box>
      <Box className={clsx(classes.contentRight, 'scrollbar')}>
        {rows.map((row: ProjectBillableManMonth, index) => (
          <Box className={classes.contentColumn} key={row.month}>
            <Box className={classes.monthCol}>{row.month}</Box>
            {+row.month.split('/')[1] > 2023 && editable ? (
              <Box className={classes.rootInput}>
                <InputCurrency
                  className={classes.rootInputCurrency}
                  disabled={disabled}
                  value={row.billableEffort}
                  onChange={(value?: string) =>
                    onBillableEffortChange(value || '', row.month)
                  }
                  maxLength={5}
                />
              </Box>
            ) : (
              <Box className={classes.valueCol}>{row.billableEffort}</Box>
            )}
            <Box className={classes.valueCol}>
              {getFormatNumberDecimal(row.assignEffort as number)}
            </Box>
            <Box className={classes.valueCol}>
              {getFormatNumberDecimal(row.actualEffort as number)}
            </Box>
            {+row.month.split('/')[1] > 2023 && editable ? (
              <Box className={classes.rootInputShareEffort}>
                <InputCurrency
                  className={classes.rootInputCurrency}
                  disabled={disabled}
                  value={row.shareEffort}
                  onChange={(value?: string) =>
                    onShareEffortChange(value || '', row.month)
                  }
                  maxLength={5}
                />
              </Box>
            ) : (
              <Box className={classes.valueColShareEffort}>
                {row.shareEffort}
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootInput: {
    display: 'flex',
    justifyContent: 'center',
    borderBottom: `1px solid ${theme.color.grey.secondary}`,
    padding: theme.spacing(0.5, 2),
    height: '50px',
    '& input': {
      textAlign: 'center',
    },
  },
  containerTable: {
    border: `1px solid ${theme.color.grey.secondary}`,
    borderRadius: '4px',
    display: 'flex',
    fontSize: 14,
  },
  headerLeft: {
    width: '270px',
  },
  headerCell: {
    background: theme.color.grey.tertiary,
    padding: theme.spacing(2),
    fontWeight: 500,
    borderRight: `1px solid ${theme.color.grey.secondary}`,
    borderBottom: `1px solid ${theme.color.grey.secondary}`,
    '&:last-child': {
      borderBottom: 0,
    },
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  contentRight: {
    display: 'flex',
    width: 'calc(100% - 160px)',
    overflowX: 'auto',
  },
  contentColumn: {
    flex: 1,
  },
  monthCol: {
    background: theme.color.grey.tertiary,
    padding: theme.spacing(2),
    textAlign: 'center',
    borderBottom: `1px solid ${theme.color.grey.secondary}`,
  },
  valueCol: {
    padding: theme.spacing(2),
    textAlign: 'center',
    borderBottom: `1px solid ${theme.color.grey.secondary}`,
    '&:last-child': {
      borderBottom: 0,
    },
  },
  valueColShareEffort: {
    height: '74px',
    textAlign: 'center',
    lineHeight: '74px',
  },
  rootInputCurrency: {
    maxWidth: '100px',
  },
  rootInputShareEffort: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(0.5, 2),
    height: '97px',
    '& input': {
      textAlign: 'center',
    },
  },
  mark: {
    color: theme.color.error.secondary,
    marginLeft: theme.spacing(0.5),
  },
}))

export default TableHeadcountDetail

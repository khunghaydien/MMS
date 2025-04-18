import CardFormSeeMore from '@/components/Form/CardFormSeeMore'
import InputCurrency from '@/components/inputs/InputCurrency'
import SelectDivisionSingle from '@/components/select/SelectDivisionSingle'
import { MODULE_PROJECT_CONST } from '@/const/app.const'
import { NS_PROJECT } from '@/const/lang.const'
import { OptionItem } from '@/types'
import { formatNumber } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ProjectBillableManMonth } from './ProjectCreate'

interface CreateBillableManMonthProps {
  dataBillableManMonth: ProjectBillableManMonth[]
  onCellChange: (payload: {
    value: string
    index: number
    field: string
  }) => void
  onDivisionChange: (value: OptionItem[]) => void
  divisions: OptionItem[]
  generalDivisionId: string
}

const CreateBillableManMonth = ({
  dataBillableManMonth,
  onCellChange,
  onDivisionChange,
  divisions,
  generalDivisionId,
}: CreateBillableManMonthProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const totalBillableEffort = useMemo(() => {
    let total = 0
    dataBillableManMonth.forEach(billableManMonthItem => {
      total += +billableManMonthItem.billableEffort
    })
    return total
  }, [dataBillableManMonth])

  return (
    <CardFormSeeMore title={i18Project('TXT_BILLABLE_MAN_MONTH')} hideSeeMore>
      <Box className={classes.body}>
        <Box
          className={clsx(
            classes.containerTable,
            dataBillableManMonth.length >= 9 && 'widthContainerTable'
          )}
        >
          <Box className={classes.headerLeft}>
            <Box className={classes.headerCell}>{i18('LB_MONTH')}</Box>
            <Box className={classes.headerCell}>
              {i18Project('TXT_BILLABLE_EFFORT')} (MM)
            </Box>
            <Box className={classes.headerCell}>
              <Box className={classes.shareEffortHeaderLabel}>
                {i18Project('TXT_SHARE_EFFORT')} (MM)
              </Box>
              <SelectDivisionSingle
                ignoreOptionById={generalDivisionId}
                isShowClearIcon
                required
                width={240}
                moduleConstant={MODULE_PROJECT_CONST}
                placeholder={i18Project('PLH_SELECT_DIVISION') || ''}
                value={divisions[0]?.id}
                onChange={(value: OptionItem) => {
                  onDivisionChange(value?.id ? [value] : [])
                }}
              />
            </Box>
          </Box>
          <Box className={clsx(classes.contentRight, 'scrollbar')}>
            {dataBillableManMonth.map((billableManMonthItem, index) => (
              <Box
                key={billableManMonthItem.month}
                className={classes.contentColumn}
              >
                <Box className={classes.monthCol}>
                  {billableManMonthItem.month}
                </Box>
                <Box className={classes.rootInput}>
                  <InputCurrency
                    className={classes.rootInputCurrency}
                    value={billableManMonthItem.billableEffort}
                    onChange={(value?: string) =>
                      onCellChange({
                        value: value || '',
                        index,
                        field: 'billableEffort',
                      })
                    }
                    maxLength={5}
                  />
                </Box>
                <Box className={classes.rootInputShareEffort}>
                  <InputCurrency
                    disabled={!divisions[0]?.id}
                    className={classes.rootInputCurrency}
                    value={billableManMonthItem.shareEffort}
                    onChange={(value?: string) =>
                      onCellChange({
                        value: value || '',
                        index,
                        field: 'shareEffort',
                      })
                    }
                    maxLength={5}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        <Box className={classes.RootTotalHeadcount}>
          <Box className={clsx(classes.totalItem, 'billable')}>
            <Box className={classes.totalLabel}>
              {i18Project('TXT_TOTAL_BILLABLE_EFFORT')}
            </Box>
            <Box className={clsx(classes.totalValue, 'billable')}>
              {formatNumber(totalBillableEffort)}
            </Box>
          </Box>
        </Box>
      </Box>
    </CardFormSeeMore>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  body: {
    display: 'flex',
    gap: theme.spacing(3),
  },
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
    width: 'calc(100% - 320px)',
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
  rootInputCurrency: {
    maxWidth: '100px',
  },
  RootTotalHeadcount: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    background: '#f3f6fa',
    borderRadius: '4px',
    padding: theme.spacing(2),
    height: 'max-content',
    width: '320px',
  },
  totalItem: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(4),
    alignItems: 'center',
    borderBottom: '4px solid',
    paddingBottom: theme.spacing(2),
    '&.billable': {
      borderColor: theme.color.blue.primary,
    },
    '&.assignEffort': {
      borderColor: theme.color.green.primary,
    },
    '&.error': {
      borderColor: `${theme.color.error.primary} !important`,
    },
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 600,
  },
  totalValue: {
    fontWeight: 700,
    fontSize: 18,
    '&.billable': {
      color: theme.color.blue.primary,
    },
    '&.assignEffort': {
      color: theme.color.green.primary,
    },
    '&.error': {
      color: `${theme.color.error.primary} !important`,
    },
  },
  shareEffortHeaderLabel: {
    marginBottom: theme.spacing(1),
  },
  rootInputShareEffort: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100px',
    padding: theme.spacing(0.5, 2),
    '& input': {
      textAlign: 'center',
    },
  },
}))

export default CreateBillableManMonth

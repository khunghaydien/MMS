import NoData from '@/components/common/NoData'
import CardForm from '@/components/Form/CardForm'
import { LangConstant } from '@/const'
import { formatDate, formatNumberToCurrency } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { REVENUE } from '../../const'
import { IContractState, contractSelector } from '../../reducer/contract'

const ProjectContractGeneralInformation = ({
  orderType,
}: {
  orderType: string | number
}) => {
  const classes = useStyles()
  const { t: i18Contract } = useTranslation(LangConstant.NS_CONTRACT)
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)
  const { projectInfo }: IContractState = useSelector(contractSelector)

  const actualKey = useMemo(() => {
    return orderType == REVENUE ? 'totalActualRevenue' : 'totalActualCost'
  }, [orderType])

  const keyItemGeneralInformation = useMemo(() => {
    return [
      {
        key: i18Project('LB_PROJECT_NAME'),
        value: 'name',
      },
      {
        key: i18Project('LB_PROJECT_CODE'),
        value: 'code',
      },
      {
        key: i18Project('LB_PROJECT_START_DATE'),
        value: 'startDate',
      },
      {
        key: i18Project('LB_PROJECT_END_DATE'),
        value: 'endDate',
      },
      {
        key: i18Project('TOTAL_EXPECTED_REVENUE'),

        value: 'totalExpectedRevenue',
      },
      {
        key: i18Project(
          orderType == REVENUE ? 'TOTAL_ACTUAL_REVENUE' : 'TOTAL_ACTUAL_COST'
        ),
        value: actualKey,
      },
    ]
  }, [orderType, actualKey])

  const convertDataDetail = (value: any) => {
    return {
      id: value?.id || '',
      code: value?.code || '',
      name: value?.name || '',
      startDate: formatDate(value?.startDate) || null,
      endDate: formatDate(value?.endDate) || null,
      [actualKey]: formatNumberToCurrency(value?.[actualKey]) + ' VND',
    }
  }

  const dataDetailFormat: { [key: string]: any } = useMemo(
    () => convertDataDetail(projectInfo),
    [projectInfo, actualKey]
  )

  return (
    <Box className={classes.rootContractGeneralInformation}>
      <CardForm title={i18Contract('TXT_PROJECT_INFORMATION') as string}>
        <Box className={classes.rootStaffInformation}>
          {!!Object.keys(projectInfo).length ? (
            <Box className="extra-information">
              {keyItemGeneralInformation.map(
                (item: any) =>
                  !!dataDetailFormat[item.value as string] && (
                    <Box className="extra-item" key={item.key}>
                      <Box className="label">{item.key}:</Box>
                      <Box className="value">
                        {dataDetailFormat[item.value as string] || ''}
                      </Box>
                    </Box>
                  )
              )}
            </Box>
          ) : (
            <NoData />
          )}
        </Box>
      </CardForm>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootContractGeneralInformation: {
    marginTop: theme.spacing(3),
  },
  rootStaffInformation: {
    width: '100%',
    minHeight: '10px',
    '& .extra-information-title': {
      fontSize: '16px',
      lineHeight: '10px 0 20px 0',
      color: '#333333',
      fontWeight: 700,
      padding: '20px 0',
    },
    '& .wrap-button-edit': {
      display: 'flex',
      justifyContent: 'end',
      marginBottom: '20px',
    },
    '& .extra-information': {
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap',
      '& .extra-item': {
        display: 'flex',
        width: '30%',
        gap: '10px',
        alignItems: 'center',
        minWidth: '300px',
        wordBreak: 'break-word',
        '& .label': {
          fontSize: '14px',
          lineHeight: '20px',
          color: '#333333',
          fontWeight: 700,
          width: '240px',
        },
        '& .value': {
          width: 'calc(100% - 130px)',
        },
      },
    },
    '& .status-margin': {
      marginLeft: theme.spacing(-1),
    },
  },
  listFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    maxWidth: '600px',
  },
  buttonIcon: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    cursor: 'pointer',
    transitionDuration: '100ms',
    '&:hover': {
      backgroundColor: `${theme.color.blue.primary}20`,
    },

    '& svg': {
      fontSize: 25,
      color: theme.color.black.secondary,
    },
    '& svg:hover': {
      color: theme.color.blue.primary,
    },
    '&.disable': {
      pointerEvents: 'none',
    },
    '&.active': {
      backgroundColor: `${theme.color.blue.primary}20`,
      '& svg': {
        color: theme.color.blue.primary,
      },
    },
    '&.cancel': {
      '& svg:hover': {
        color: theme.color.error.primary,
      },
    },
  },
}))

export default ProjectContractGeneralInformation

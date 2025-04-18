import StatusItem from '@/components/common/StatusItem'
import { CONTRACT_STATUS } from '@/const/app.const'
import { NS_CONTRACT } from '@/const/lang.const'
import { commonSelector, CommonState } from '@/reducer/common'
import { IColor, OptionItem } from '@/types'
import { formatCurrencyThreeCommas } from '@/utils'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'
import i18next from 'i18next'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import {
  CONTRACT_GROUP_TYPE,
  CONTRACT_TYPE,
  DUE_DATE_METHOD_TYPE,
  ORDER,
  REVENUE,
} from '../../const'

interface IProps {
  contractGeneralInformation: any
  codeCurrency: string
}

interface IStatus {
  color: IColor
  label: string
}

const GeneralInformationContractDetail = ({
  contractGeneralInformation,
  codeCurrency,
}: IProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Contract } = useTranslation(NS_CONTRACT)

  const { listBranches }: CommonState = useSelector(commonSelector)

  const keyItemGeneralInformation = useMemo(() => {
    return [
      {
        key: i18('LB_BRANCH'),
        value: 'branchId',
      },
      {
        key: i18('LB_CONTRACT_GROUP'),
        value: 'group',
      },
      {
        key: i18Contract('LB_ORDER_TYPE'),
        value: 'orderType',
      },
      {
        key: i18Contract(
          +contractGeneralInformation.group === ORDER ? 'LB_TEMPLATE' : 'LB_NDA'
        ),
        value: 'selectContractGroup',
      },
      {
        key: i18('LB_CONTRACT_TYPE'),
        value: 'type',
      },
      {
        key: i18('LB_CONTACT_PERSON'),
        value: 'contactPerson',
      },
      {
        key: i18Contract('LB_BUYER'),
        value: 'buyerId',
      },
      {
        key: i18Contract('LB_SELLER'),

        value: 'sellerId',
      },
      {
        key: i18Contract('LB_PROJECT_ABBREVIATION_NAME'),
        value: 'projectAbbreviationName',
      },
      {
        key: i18('LB_EXPECTED_VALUE'),
        value: 'value',
      },
      {
        key: i18('LB_CURRENCY'),
        value: 'currency',
      },
      {
        key: i18('LB_RATE'),
        value: 'rate',
      },
      {
        key: i18('LB_STATUS'),
        value: 'status',
      },
      {
        key: i18('LB_DESCRIPTION'),
        value: 'description',
      },
      {
        key: i18Contract('LB_PAYMENT_METHOD'),
        value: 'paymentMethod',
      },
      {
        key: i18Contract('LB_DUE_DATE_PAYMENT'),
        value: 'dueDatePayment',
      },
    ]
  }, [])

  const convertDataDetail = (value: any) => {
    return {
      branchId: listBranches.find(
        (branch: OptionItem) => branch.id === value.branchId
      )?.label,
      contactPerson: value.contactPerson?.label,
      description: value.description,
      dueDatePayment: value.dueDatePayment
        ? formatCurrencyThreeCommas(value.dueDatePayment)
        : '',
      group: CONTRACT_GROUP_TYPE[value.group],
      projectAbbreviationName: value.projectAbbreviationName,
      selectContractGroup: value.selectContractGroup?.label,
      sellerId: value.sellerId?.label,
      buyerId: value.buyerId?.label,
      status: value.status,
      type: CONTRACT_TYPE.find((type: OptionItem) => type.id === value.type)
        ?.label,
      value: !!+value.value ? formatCurrencyThreeCommas(value.value) : '',
      currency: value.group == ORDER ? codeCurrency : '',
      rate:
        !!+value.rate && value.group == ORDER
          ? formatCurrencyThreeCommas(value.rate)
          : '',
      orderType:
        value.orderType == REVENUE
          ? i18next.t('contract:LB_REVENUE')
          : i18next.t('contract:LB_COST'),
      paymentMethod:
        DUE_DATE_METHOD_TYPE.find(
          (option: OptionItem) => option.id === value.paymentMethod
        )?.label || '',
    }
  }

  const dataDetailFormat: { [key: string]: any } = useMemo(
    () => convertDataDetail(contractGeneralInformation),
    [contractGeneralInformation]
  )

  const convertStatus = (status: any): IStatus => {
    if (CONTRACT_STATUS[status]) {
      return {
        color: CONTRACT_STATUS[status].color,
        label: CONTRACT_STATUS[status].label,
      }
    }
    return {
      color: 'red',
      label: '',
    }
  }

  const status = useMemo(
    () => convertStatus(contractGeneralInformation.status),
    [contractGeneralInformation]
  )

  return (
    <Box className={classes.rootStaffInformation}>
      {!!Object.keys(contractGeneralInformation).length && (
        <Box className="extra-information">
          {keyItemGeneralInformation.map((item: any) =>
            item.value === 'status' ? (
              <Box className="extra-item" key={item.key}>
                <Box className="label">{item.key}:</Box>
                <Box className="value status-margin">
                  <StatusItem
                    typeStatus={{ color: status.color, label: status.label }}
                  />
                </Box>
              </Box>
            ) : (
              !!dataDetailFormat[item.value as string] && (
                <Box className="extra-item" key={item.key}>
                  <Box className="label">{item.key}:</Box>
                  <Box className="value">
                    {dataDetailFormat[item.value as string] || ''}
                  </Box>
                </Box>
              )
            )
          )}
        </Box>
      )}
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
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
}))
export default GeneralInformationContractDetail

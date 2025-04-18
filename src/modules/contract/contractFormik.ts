import { LangConstant } from '@/const'
import { CONTRACT_STATUS, CONTRACT_STATUS_TYPE } from '@/const/app.const'
import {
  abbreviationRegex,
  contractNumberRegex,
  engJapRegex,
} from '@/utils/yup'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { EXTERNAL, INTERNAL, ORDER } from './const'
import { ContractStaffInformationRequest } from './models'

const contractStatusDraft: number =
  CONTRACT_STATUS[CONTRACT_STATUS_TYPE.DRAFT].type

export const initContractGeneralInformation = {
  source: EXTERNAL,
  contractNumber: '',
  group: '',
  type: '',
  selectContractGroup: null,
  branchId: '',
  startDate: null,
  endDate: null,
  signDate: null,
  contactPerson: null,
  buyerId: null,
  sellerId: null,
  value: '',
  dueDatePayment: '',
  projectAbbreviationName: '',
  description: '',
  status: '',
  modifiedStatusDate: null,
  orderType: '',
  relatedOrders: [],
  currencyId: '',
  rate: '',
  paymentMethod: '',
  installments: [],
}

export const initStaffForm: ContractStaffInformationRequest = {
  id: '',
  staffId: '',
  staffName: '',
  positionName: '',
  skillIds: [],
  levelName: '',
  rate: '',
  unitOfTime: '',
  note: '',
  sourceStaff: INTERNAL,
  startDate: null,
  endDate: null,
  currencyId: '',
  price: '',
}

export default function useContractFormik() {
  const { t: i18 } = useTranslation()
  const { t: i18Contract } = useTranslation(LangConstant.NS_CONTRACT)

  const getMessageSelectRequire = (name: string) =>
    i18('MSG_SELECT_REQUIRE', { name })

  const getMessageDateRequire = (name: string) =>
    i18('MSG_INPUT_DATE_REQUIRE', { name })

  const contractGeneralInformationValidation = Yup.object({
    contractNumber: Yup.string()
      .trim()
      .when(['source', 'status'], {
        is: (source: string, status: string | number) =>
          +source === EXTERNAL && +status !== contractStatusDraft,
        then: Yup.string()
          .trim()
          .required(
            i18('MSG_INPUT_REQUIRE', {
              name: i18('LB_CONTRACT_NUMBER'),
            }) as string
          )
          .matches(
            contractNumberRegex,
            i18('MSG_INPUT_NAME_INVALID', {
              name: i18('LB_CONTRACT_NUMBER'),
            }) as string
          ),
      }),
    group: Yup.string().when('status', {
      is: (status: string | number) => +status !== contractStatusDraft,
      then: Yup.string().required(
        getMessageSelectRequire(i18('LB_CONTRACT_GROUP'))
      ),
    }),
    branchId: Yup.string().when('status', {
      is: (status: string | number) => +status !== contractStatusDraft,
      then: Yup.string().required(getMessageSelectRequire(i18('LB_BRANCH'))),
    }),
    signDate: Yup.number()
      .nullable()
      .when('status', {
        is: (status: string | number) => +status !== contractStatusDraft,
        then: Yup.number()
          .nullable()
          .required(
            getMessageDateRequire(i18Contract('LB_CONTRACT_SIGN_DATE'))
          ),
      }),
    buyerId: Yup.object()
      .nullable()
      .when('status', {
        is: (status: string | number) => +status !== contractStatusDraft,
        then: Yup.object()
          .nullable()
          .objectEmpty(getMessageSelectRequire(i18Contract('LB_BUYER'))),
      }),
    sellerId: Yup.object()
      .nullable()
      .when('status', {
        is: (status: string | number) => +status !== contractStatusDraft,
        then: Yup.object()
          .nullable()
          .objectEmpty(getMessageSelectRequire(i18Contract('LB_SELLER'))),
      }),
    projectAbbreviationName: Yup.string()
      .trim()
      .when(['group', 'status'], {
        is: (group: string | number, status: string | number) =>
          group &&
          group.toString() === ORDER.toString() &&
          +status !== contractStatusDraft,
        then: Yup.string()
          .trim()
          .matches(
            abbreviationRegex,
            i18('MSG_INPUT_NAME_INVALID', {
              name: i18Contract('LB_PROJECT_ABBREVIATION_NAME'),
            }) as string
          )
          .required(
            i18('MSG_INPUT_REQUIRE', {
              name: i18Contract('LB_PROJECT_ABBREVIATION_NAME'),
            }) as string
          ),
        otherwise: Yup.string()
          .trim()
          .matches(
            abbreviationRegex,
            i18('MSG_INPUT_NAME_INVALID', {
              name: i18Contract('LB_PROJECT_ABBREVIATION_NAME'),
            }) as string
          ),
      }),
    status: Yup.string().required(getMessageSelectRequire(i18('LB_STATUS'))),
    currencyId: Yup.string()
      .trim()
      .when(['group', 'status'], {
        is: (group: string | number, status: string | number) =>
          group &&
          group.toString() === ORDER.toString() &&
          +status !== contractStatusDraft,
        then: Yup.string().required(''),
      }),
    rate: Yup.string()
      .trim()
      .when(['group', 'status'], {
        is: (group: string | number, status: string | number) =>
          group &&
          group.toString() === ORDER.toString() &&
          +status !== contractStatusDraft,
        then: Yup.string()
          .required(
            i18('MSG_INPUT_REQUIRE', {
              name: i18('LB_RATE'),
            }) as string
          )
          .maxRateValidation(
            i18('MSG_INVALID_INPUT_MAX', {
              name: i18('LB_RATE'),
            }) as string
          ),
      }),
    installments: Yup.array()
      .of(
        Yup.object().shape({
          date: Yup.number().nullable(),
          percentage: Yup.string().nullable(),
        })
      )
      .when('status', {
        is: (status: string | number) => +status !== contractStatusDraft,
        then: Yup.array().of(
          Yup.object().shape({
            date: Yup.number()
              .nullable()
              .required(getMessageDateRequire(i18('LB_DATE'))),
            percentage: Yup.string().nullable(),
          })
        ),
      }),
  })

  const staffFormValidation = Yup.object({
    staffName: Yup.string()
      .required(getMessageSelectRequire(i18('LB_STAFF_NAME')))
      .staffNameValidation(
        i18('MSG_INPUT_NAME_INVALID', {
          name: i18('LB_STAFF_NAME'),
        })
      ),
    unitOfTime: Yup.string().required(
      getMessageSelectRequire(i18('LB_UNIT_OF_TIME'))
    ),
    positionName: Yup.string()
      .required(
        i18('MSG_INPUT_REQUIRE', {
          name: i18Contract('LB_STAFF_POSITION'),
        }) as string
      )
      .matches(
        engJapRegex,
        i18('MSG_INPUT_NAME_INVALID', {
          name: i18Contract('LB_STAFF_POSITION'),
        }) as string
      ),
    levelName: Yup.string()
      .required(
        i18('MSG_INPUT_REQUIRE', {
          name: i18Contract('LB_STAFF_LEVEL'),
        }) as string
      )
      .matches(
        engJapRegex,
        i18('MSG_INPUT_NAME_INVALID', {
          name: i18Contract('LB_STAFF_LEVEL'),
        }) as string
      ),
    skillIds: Yup.array()
      .min(1, getMessageSelectRequire(i18Contract('LB_SERVICE_SKILLSET')))
      .max(
        10,
        i18('MSG_SELECT_MAX_ITEM', {
          name: i18Contract('LB_SERVICE_SKILLSET'),
        }) as string
      ),
  })

  return {
    contractGeneralInformationValidation,
    staffFormValidation,
  }
}

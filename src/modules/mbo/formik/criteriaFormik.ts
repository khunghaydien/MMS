import { criteriaNameRegex } from '@/utils/yup'
import i18next from 'i18next'
import * as Yup from 'yup'
import { CriteriaRequest, ICriteriaGroupInformation } from '../models'

export const initialCriteriaGroupInformation: ICriteriaGroupInformation = {
  name: '',
  type: '',
  positionApplied: [],
  description: '',
}

export const initCriteriaRequestItem: CriteriaRequest = {
  id: 1,
  name: '',
  description: '',
  criteriaDetail: [
    {
      id: 1,
      score: '1',
      content: '',
    },
  ],
}

export const initCriteriaRequests: CriteriaRequest[] = [
  { ...initCriteriaRequestItem },
]

export const initialCriteria: any = {
  ...initialCriteriaGroupInformation,
  criteria: initCriteriaRequests,
}

export const criteriaGroupValidation = Yup.object({
  name: Yup.string()
    .trim()
    .required(
      i18next.t('common:MSG_INPUT_REQUIRE', {
        name: i18next.t('mbo:LB_CRITERIA_GROUP'),
      }) as string
    )
    .matches(
      criteriaNameRegex,
      i18next.t('common:MSG_INPUT_NAME_INVALID', {
        name: i18next.t('mbo:LB_CRITERIA_GROUP'),
      }) as string
    ),
  type: Yup.string().required(
    i18next.t('common:MSG_SELECT_REQUIRE', {
      name: i18next.t('mbo:LB_CRITERIA_TYPE'),
    }) as string
  ),
  positionApplied: Yup.array().min(
    1,
    i18next.t('common:MSG_SELECT_REQUIRE', {
      name: i18next.t('mbo:LB_POSITION_APPLIED'),
    }) as string
  ),
})

export const criteriaRequestItemValidation = Yup.object({
  name: Yup.string()
    .trim()
    .required(
      i18next.t('common:MSG_INPUT_REQUIRE', {
        name: i18next.t('mbo:LB_CRITERIA_NAME'),
      }) as string
    )
    .matches(
      criteriaNameRegex,
      i18next.t('common:MSG_INPUT_NAME_INVALID', {
        name: i18next.t('mbo:LB_CRITERIA_NAME'),
      }) as string
    ),
  criteriaDetail: Yup.array().of(
    Yup.object().shape({
      content: Yup.string()
        .trim()
        .required(
          i18next.t('common:MSG_INPUT_REQUIRE', {
            name: i18next.t('mbo:LB_CRITERIA_CONTENT'),
          }) as string
        )
        .matches(
          criteriaNameRegex,
          i18next.t('common:MSG_INPUT_NAME_INVALID', {
            name: i18next.t('mbo:LB_CRITERIA_CONTENT'),
          }) as string
        ),
    })
  ),
})

export const criteriaListValidation = Yup.object({
  criteria: Yup.array().of(
    Yup.object().shape({
      name: Yup.string()
        .trim()
        .required(
          i18next.t('common:MSG_INPUT_REQUIRE', {
            name: i18next.t('mbo:LB_CRITERIA_NAME'),
          }) as string
        )
        .matches(
          criteriaNameRegex,
          i18next.t('common:MSG_INPUT_NAME_INVALID', {
            name: i18next.t('mbo:LB_CRITERIA_NAME'),
          }) as string
        ),
      criteriaDetail: Yup.array().of(
        Yup.object().shape({
          content: Yup.string()
            .trim()
            .required(
              i18next.t('common:MSG_INPUT_REQUIRE', {
                name: i18next.t('mbo:LB_CRITERIA_CONTENT'),
              }) as string
            )
            .matches(
              criteriaNameRegex,
              i18next.t('common:MSG_INPUT_NAME_INVALID', {
                name: i18next.t('mbo:LB_CRITERIA_CONTENT'),
              }) as string
            ),
        })
      ),
    })
  ),
})

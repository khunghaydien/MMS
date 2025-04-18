import i18next from 'i18next'
import * as Yup from 'yup'
import { IPayloadCreateCycle, IPayloadUpdateAppraisees } from '../models'

export const initCreateCycle: IPayloadCreateCycle = {
  evaluationCycleTemplateId: '',
  appraisees: [],
  appraiser: '',
  reviewer: '',
}

export const initUpdateAppraisees: IPayloadUpdateAppraisees = {
  appraisees: [],
}

export const updateAppraiseesValidation = Yup.object({
  appraisees: Yup.array().min(
    1,
    i18next.t('mbo:MSG_ADD_STAFF_CYCLE') as string
  ),
})

export const cycleValidation = Yup.object({
  evaluationCycleTemplateId: Yup.string()
    .trim()
    .required(
      i18next.t('common:MSG_SELECT_REQUIRE', {
        name: i18next.t('mbo:LB_CYCLE_TEMPLATE'),
      }) as string
    ),
  appraiser: Yup.string()
    .trim()
    .required(
      i18next.t('common:MSG_INPUT_REQUIRE', {
        name: i18next.t('mbo:LB_APPRAISER'),
      }) as string
    ),
  reviewer: Yup.string()
    .trim()
    .required(
      i18next.t('common:MSG_INPUT_REQUIRE', {
        name: i18next.t('mbo:LB_REVIEWER'),
      }) as string
    ),
  appraisees: Yup.array().min(
    1,
    i18next.t('mbo:MSG_ADD_STAFF_CYCLE') as string
  ),
})

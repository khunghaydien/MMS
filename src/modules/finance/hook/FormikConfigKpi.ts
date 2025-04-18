import { LangConstant } from '@/const'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'

export default function formikConfig() {
  const { t: i18nCommon } = useTranslation(LangConstant.NS_COMMON)
  const { t: i18nFinance } = useTranslation(LangConstant.NS_FINANCE)
  const getMessageSelectRequire = (name: string) =>
    i18nCommon('MSG_SELECT_REQUIRE', { name })

  const modalConfigKpiValidation = yup.object({
    moduleId: yup
      .string()
      .nullable(true)
      .required(getMessageSelectRequire(i18nFinance('LB_MODULE') || '')),
    year: yup
      .number()
      .min(1900, getMessageSelectRequire(i18nCommon('LB_YEAR') || ''))
      .transform(value =>
        isNaN(value) || value === null || value === undefined ? 0 : value
      )
      .required(getMessageSelectRequire(i18nCommon('LB_YEAR') || '')),
    configuration: yup
      .array()
      .min(1, getMessageSelectRequire(i18nCommon('LB_BRANCH') || ''))
      .of(
        yup.object().shape({
          branchId: yup
            .string()
            .required(getMessageSelectRequire(i18nCommon('LB_BRANCH') || '')),
          expectedKPI: yup
            .string()
            .min(
              5,
              i18nCommon('MSG_INVALID_INPUT_MIN', {
                name: i18nFinance('LB_EXPECTED_KPI'),
                count: 4,
              }) as string
            )
            .max(
              20,
              i18nCommon('MSG_INVALID_INPUT_MAX', {
                name: i18nFinance('LB_EXPECTED_KPI'),
              }) as string
            )
            .required(
              i18nCommon('MSG_INPUT_REQUIRE', {
                name: i18nFinance('LB_EXPECTED_KPI'),
              }) || ''
            ),
          division: yup.array().of(
            yup.object().shape({
              divisionId: yup
                .string()
                .required(i18nCommon('LB_DIVISION') || ''),
              expectedKPI: yup
                .string()
                .min(
                  5,
                  i18nCommon('MSG_INVALID_INPUT_MIN', {
                    name: i18nFinance('LB_EXPECTED_KPI'),
                    count: 4,
                  }) as string
                )
                .max(
                  20,
                  i18nCommon('MSG_INVALID_INPUT_MAX', {
                    name: i18nFinance('LB_EXPECTED_KPI'),
                  }) as string
                )
                .required(
                  i18nCommon('MSG_INPUT_REQUIRE', {
                    name: i18nFinance('LB_EXPECTED_KPI'),
                  }) || ''
                ),
            })
          ),
        })
      ),
  })
  return {
    modalConfigKpiValidation,
  }
}

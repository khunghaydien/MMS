import { LangConstant } from '@/const'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

export const useShareEffortValidation = () => {
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)

  const addShareEffortValidation = Yup.object().shape({
    staffEffortList: Yup.array().of(
      Yup.object().shape({
        divisionId: Yup.string().required(
          i18('MSG_SELECT_REQUIRE', { name: i18('LB_DIVISION') }) as string
        ),
        staff: Yup.object().objectEmpty(
          i18('MSG_SELECT_REQUIRE', { name: i18('LB_STAFF') }) as string
        ),
        shareMonthList: Yup.array().of(
          Yup.object().shape({
            shareMonth: Yup.date()
              .nullable()
              .required(
                i18('MSG_INPUT_DATE_REQUIRE', {
                  name: i18Project('LB_SHARE_MONTH'),
                }) as string
              ),
            shareBillableManMonth: Yup.number().required(
              i18('MSG_INPUT_REQUIRE', {
                name: i18Project('LB_SHARE_BMM'),
              }) as string
            ),
          })
        ),
      })
    ),
  })

  const shareMonthFeature = Yup.object().shape({
    shareMonthList: Yup.array().of(
      Yup.object().shape({
        fullDate: Yup.date()
          .nullable()
          .required(
            i18('MSG_INPUT_DATE_REQUIRE', {
              name: i18Project('LB_SHARE_MONTH'),
            }) as string
          ),
        shareBMM: Yup.number().required(
          i18('MSG_INPUT_REQUIRE', {
            name: i18Project('LB_SHARE_BMM'),
          }) as string
        ),
      })
    ),
  })

  return { addShareEffortValidation, shareMonthFeature }
}

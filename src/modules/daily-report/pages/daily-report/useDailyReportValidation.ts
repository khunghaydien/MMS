import { LangConstant } from '@/const'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { WORK_TYPE_VALUE } from '../../const'

const useDailyReportValidation = () => {
  const { t: i18 } = useTranslation()
  const { t: i18DailyReport } = useTranslation(LangConstant.NS_DAILY_REPORT)
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)

  const addDailyReportValidation = Yup.object({
    reportDate: Yup.date()
      .nullable()
      .min(
        new Date('2024-01-01'),
        'You can not create daily report before 2024'
      )
      .required(
        i18('MSG_INPUT_DATE_REQUIRE', {
          name: i18DailyReport('LB_REPORT_DATE'),
        }) as string
      ),
    listForm: Yup.array().of(
      Yup.object({
        workType: Yup.string().required(
          i18('MSG_SELECT_REQUIRE', {
            name: i18DailyReport('LB_WORKING_TYPE'),
          }) as string
        ),
        workingHours: Yup.string().when(['isWorking', 'workType'], {
          is: (isWorking: boolean, workType: string | number) =>
            !!isWorking && +workType !== +WORK_TYPE_VALUE.DAY_OFF_FULL_DAY,
          then: Yup.string()
            .required(
              i18('MSG_INPUT_REQUIRE', {
                name: i18DailyReport('LB_WORKING_HOURS'),
              }) as string
            )
            .test(
              'hours',
              'Working Hours cannot be more than 24 hours of all projects combined',
              (val: any) => +val <= 24
            )
            .test(
              'hours',
              'Working Hours cannot be equal to 0 hours of all projects combined',
              (val: any) => +val > 0
            ),
        }),
        projectId: Yup.string().when('workType', {
          is: (workType: string | number) =>
            +workType === +WORK_TYPE_VALUE.PROJECT_REPORT,
          then: Yup.string().required(
            i18('MSG_SELECT_REQUIRE', {
              name: i18Project('LB_PROJECT'),
            }) as string
          ),
        }),
        otFrom: Yup.string().when('useRequestOT', {
          is: (useRequestOT: boolean) => !!useRequestOT,
          then: Yup.string().required(
            i18('MSG_SELECT_REQUIRE', {
              name: i18DailyReport('LB_OT_FROM'),
            }) as string
          ),
        }),
        otTo: Yup.string().when('useRequestOT', {
          is: (useRequestOT: boolean) => !!useRequestOT,
          then: Yup.string().required(
            i18('MSG_SELECT_REQUIRE', {
              name: i18DailyReport('LB_TO'),
            }) as string
          ),
        }),
      })
    ),
  })
  return {
    addDailyReportValidation,
  }
}

export default useDailyReportValidation

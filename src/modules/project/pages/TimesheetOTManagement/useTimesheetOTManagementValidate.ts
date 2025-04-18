import { LangConstant } from '@/const'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

const useTimesheetOTManagementValidate = () => {
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)
  const { t: i18DailyReport } = useTranslation(LangConstant.NS_DAILY_REPORT)

  const otReportProjectsValidation = Yup.object({
    reportDate: Yup.date()
      .nullable()
      .required(
        i18('MSG_INPUT_DATE_REQUIRE', {
          name: i18DailyReport('TXT_OT_REPORT'),
        }) as string
      ),
    projectReports: Yup.array().of(
      Yup.object().shape({
        projectId: Yup.string().required(
          i18('MSG_SELECT_REQUIRE', {
            name: i18('LB_PROJECT'),
          }) as string
        ),
        otDates: Yup.array().of(
          Yup.object().shape({
            otDate: Yup.date()
              .nullable()
              .required(
                i18('MSG_INPUT_DATE_REQUIRE', {
                  name: i18Project('LB_OT_DATE'),
                }) as string
              ),
            otRequestId: Yup.number()
              .nullable()
              .required('You can not report OT for this day'),
            from: Yup.string().required(
              i18('MSG_INPUT_REQUIRE', {
                name: i18('LB_FROM'),
              }) as string
            ),
            to: Yup.string().required(
              i18('MSG_INPUT_REQUIRE', {
                name: i18('LB_TO'),
              }) as string
            ),
          })
        ),
      })
    ),
  })
  const otReportValidation = Yup.object({
    projectId: Yup.string().required(
      i18('MSG_SELECT_REQUIRE', {
        name: i18('LB_PROJECT'),
      }) as string
    ),
    otDate: Yup.date()
      .nullable()
      .required(
        i18('MSG_INPUT_DATE_REQUIRE', {
          name: i18Project('LB_OT_DATE'),
        }) as string
      ),
    otRequestId: Yup.number()
      .nullable()
      .required('You can not report OT for this day'),
    from: Yup.string().required(
      i18('MSG_INPUT_REQUIRE', {
        name: i18('LB_FROM'),
      }) as string
    ),
    to: Yup.string().required(
      i18('MSG_INPUT_REQUIRE', {
        name: i18('LB_TO'),
      }) as string
    ),
  })

  return { otReportProjectsValidation, otReportValidation }
}

export default useTimesheetOTManagementValidate

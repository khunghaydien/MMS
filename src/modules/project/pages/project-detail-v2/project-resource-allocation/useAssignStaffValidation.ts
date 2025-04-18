import { LangConstant } from '@/const'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

export const useAssignStaffValidation = () => {
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)

  const assignNewStaffValidation = Yup.object().shape({
    assignStaffList: Yup.array().of(
      Yup.object().shape({
        staff: Yup.object().objectEmpty(
          i18('MSG_SELECT_REQUIRE', { name: i18('LB_STAFF') }) as string
        ),
        role: Yup.string().required(
          i18('MSG_INPUT_REQUIRE', { name: i18Project('LB_ROLE') }) as string
        ),
        assignStartDate: Yup.date()
          .nullable()
          .required(
            i18('MSG_INPUT_DATE_REQUIRE', {
              name: i18Project('LB_ASSIGN_START_DATE'),
            }) as string
          ),
        assignEndDate: Yup.date()
          .nullable()
          .required(
            i18('MSG_INPUT_DATE_REQUIRE', {
              name: i18Project('LB_ASSIGN_END_DATE'),
            }) as string
          ),
        assignEffort: Yup.number().required(
          i18('MSG_INPUT_REQUIRE', {
            name: i18Project('TXT_ASSIGN_EFFORT'),
          }) as string
        ),
      })
    ),
  })

  const assignmentValidation = Yup.object().shape({
    role: Yup.string().required(
      i18('MSG_INPUT_REQUIRE', { name: i18Project('LB_ROLE') }) as string
    ),
    startDate: Yup.date()
      .nullable()
      .required(
        i18('MSG_INPUT_DATE_REQUIRE', {
          name: i18Project('LB_ASSIGN_START_DATE'),
        }) as string
      ),
    endDate: Yup.date()
      .nullable()
      .required(
        i18('MSG_INPUT_DATE_REQUIRE', {
          name: i18Project('LB_ASSIGN_END_DATE'),
        }) as string
      ),
    headcount: Yup.number().required(
      i18('MSG_INPUT_REQUIRE', {
        name: i18Project('TXT_ASSIGN_EFFORT'),
      }) as string
    ),
  })

  const duplicateAssignmentListValidation = Yup.object().shape({
    duplicateAssignmentList: Yup.array().of(
      Yup.object().shape({
        role: Yup.string().required(
          i18('MSG_INPUT_REQUIRE', { name: i18Project('LB_ROLE') }) as string
        ),
        assignStartDate: Yup.date()
          .nullable()
          .required(
            i18('MSG_INPUT_DATE_REQUIRE', {
              name: i18Project('LB_ASSIGN_START_DATE'),
            }) as string
          ),
        assignEndDate: Yup.date()
          .nullable()
          .required(
            i18('MSG_INPUT_DATE_REQUIRE', {
              name: i18Project('LB_ASSIGN_END_DATE'),
            }) as string
          ),
        assignEffort: Yup.number().required(
          i18('MSG_INPUT_REQUIRE', {
            name: i18Project('TXT_ASSIGN_EFFORT'),
          }) as string
        ),
      })
    ),
  })

  return {
    assignNewStaffValidation,
    assignmentValidation,
    duplicateAssignmentListValidation,
  }
}

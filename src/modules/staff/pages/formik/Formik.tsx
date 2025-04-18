import { LangConstant } from '@/const'
import Yup from '@/utils/yup'
import { useTranslation } from 'react-i18next'
import StringFormat from 'string-format'
import * as yup from 'yup'
import {
  JOB_TYPE_FREELANCER,
  JOB_TYPE_INTERN,
  JOB_TYPE_OFFICICAL,
  JOB_TYPE_PROBATION,
  status,
} from '../../const'

export default function formikConfig() {
  const { t: i18nCommon } = useTranslation(LangConstant.NS_COMMON)
  const { t: i18nStaff } = useTranslation(LangConstant.NS_STAFF)

  const getMessageSelectRequire = (name: string) =>
    i18nCommon('MSG_SELECT_REQUIRE', { name })

  const generalSchemaValidation = yup.object({
    staffName: yup
      .string()
      .textRequired(
        i18nCommon('MSG_INPUT_REQUIRE', {
          name: i18nCommon('LB_STAFF_NAME'),
        })
      )
      .staffNameValidation(
        i18nCommon('MSG_INPUT_NAME_INVALID', {
          name: i18nCommon('LB_STAFF_NAME'),
        })
      ),
    gender: yup
      .string()
      .required(getMessageSelectRequire(i18nStaff('LB_GENDER'))),
    birthday: yup
      .date()
      .nullable()
      .required(
        i18nCommon('MSG_INPUT_DATE_REQUIRE', {
          name: i18nStaff('LB_DATE_OF_BIRTH'),
        }) || ''
      ),
    email: yup
      .string()
      .textRequired(
        i18nCommon('MSG_INPUT_REQUIRE', {
          name: i18nCommon('LB_EMAIL'),
        })
      )
      .emailValidation(
        StringFormat(
          i18nCommon('MSG_HAS_INVALID_EMAIL'),
          i18nCommon('LB_EMAIL') || ''
        )
      )
      .specialCharacters(
        StringFormat(
          i18nCommon('MSG_HAS_CONTAIN_UNAUTHORIZED_CHARACTER__EMAIL'),
          i18nCommon('LB_EMAIL') || ''
        )
      ),
    phoneNumber: yup
      .string()
      .min(
        5,
        i18nCommon('MSG_INVALID_INPUT_MIN', {
          name: i18nCommon('LB_PHONE_NUMBER'),
          count: 4,
        }) as string
      )
      .max(
        15,
        i18nCommon('MSG_INVALID_INPUT_MAX', {
          name: i18nCommon('LB_PHONE_NUMBER'),
        }) as string
      ),
    directManager: yup
      .object()
      .nullable()
      .objectEmpty(getMessageSelectRequire(i18nStaff('LB_DIRECT_MANAGER'))),
    branchId: yup
      .string()
      .required(getMessageSelectRequire(i18nStaff('LB_BRANCH'))),
    divisionId: yup
      .string()
      .required(getMessageSelectRequire(i18nStaff('LB_DIVISION'))),
    position: yup
      .string()
      .required(getMessageSelectRequire(i18nCommon('LB_POSITION'))),
    jobType: yup
      .string()
      .required(getMessageSelectRequire(i18nStaff('LB_JOB_TYPE'))),
    jobChangeRequest: yup.lazy(value =>
      value
        ? yup.object().shape({
            jobType: yup.mixed().when('isChangeJobType', {
              is: true,
              then: yup
                .string()
                .required(getMessageSelectRequire(i18nStaff('LB_JOB_TYPE'))),
            }),
            onboardDate: yup.mixed().when('jobType', {
              is: (jobType: string) =>
                jobType && jobType === JOB_TYPE_PROBATION,
              then: yup
                .date()
                .nullable()
                .required(
                  i18nCommon('MSG_INPUT_DATE_REQUIRE', {
                    name: i18nStaff('LB_ONBOARD_DATE'),
                  }) || ''
                ),
            }),
            jobStartDate: yup.mixed().when('jobType', {
              is: (jobType: string) =>
                jobType &&
                (jobType === JOB_TYPE_INTERN || jobType === JOB_TYPE_OFFICICAL),
              then: yup
                .date()
                .nullable()
                .required(
                  i18nCommon('MSG_INPUT_DATE_REQUIRE', {
                    name: i18nStaff('LB_START_DATE'),
                  }) || ''
                ),
            }),
            jobEndDate: yup.mixed().when('jobType', {
              is: (jobType: string) =>
                jobType &&
                (jobType === JOB_TYPE_INTERN || jobType === JOB_TYPE_PROBATION),
              then: yup
                .date()
                .nullable()
                .required(
                  i18nCommon('MSG_INPUT_DATE_REQUIRE', {
                    name: i18nStaff('LB_END_DATE'),
                  }) || ''
                ),
            }),
            freelancerPeriods: yup.mixed().when('jobType', {
              is: (jobType: string) =>
                jobType && jobType === JOB_TYPE_FREELANCER,
              then: yup.array().of(
                yup.object().shape({
                  startDate: yup
                    .date()
                    .nullable()
                    .required(
                      i18nCommon('MSG_INPUT_DATE_REQUIRE', {
                        name: i18nStaff('LB_START_DATE'),
                      }) || ''
                    ),
                  endDate: yup
                    .date()
                    .nullable()
                    .required(
                      i18nCommon('MSG_INPUT_DATE_REQUIRE', {
                        name: i18nStaff('LB_END_DATE'),
                      }) || ''
                    ),
                })
              ),
            }),
          })
        : yup.object().default({})
    ),
    onboardDate: yup.mixed().when('jobType', {
      is: (jobType: string) => jobType && jobType === JOB_TYPE_PROBATION,
      then: yup
        .date()
        .nullable()
        .required(
          i18nCommon('MSG_INPUT_DATE_REQUIRE', {
            name: i18nStaff('LB_ONBOARD_DATE'),
          }) || ''
        ),
    }),
    jobStartDate: yup.mixed().when('jobType', {
      is: (jobType: string) =>
        jobType &&
        (jobType === JOB_TYPE_INTERN || jobType === JOB_TYPE_OFFICICAL),
      then: yup
        .date()
        .nullable()
        .required(
          i18nCommon('MSG_INPUT_DATE_REQUIRE', {
            name: i18nStaff('LB_START_DATE'),
          }) || ''
        ),
    }),
    jobEndDate: yup.mixed().when('jobType', {
      is: (jobType: string) =>
        jobType &&
        (jobType === JOB_TYPE_INTERN || jobType === JOB_TYPE_PROBATION),
      then: yup
        .date()
        .nullable()
        .required(
          i18nCommon('MSG_INPUT_DATE_REQUIRE', {
            name: i18nStaff('LB_END_DATE'),
          }) || ''
        ),
    }),
    freelancerPeriods: yup.mixed().when('jobType', {
      is: (jobType: string) => jobType && jobType === JOB_TYPE_FREELANCER,
      then: yup.array().of(
        yup.object().shape({
          startDate: yup
            .date()
            .nullable()
            .required(
              i18nCommon('MSG_INPUT_DATE_REQUIRE', {
                name: i18nStaff('LB_START_DATE'),
              }) || ''
            ),
          endDate: yup
            .date()
            .nullable()
            .required(
              i18nCommon('MSG_INPUT_DATE_REQUIRE', {
                name: i18nStaff('LB_END_DATE'),
              }) || ''
            ),
        })
      ),
    }),
    // lastWorkingDate: yup.mixed().when(['status.status.id', 'jobType'], {
    //   is: (stt: number | string, jobType: string) =>
    //     stt && stt == status[1].value && jobType === JOB_TYPE_OFFICICAL,
    //   then: yup.mixed().test(
    //     'is-number-or-date',
    //     i18nCommon('MSG_INPUT_DATE_REQUIRE', {
    //       name: i18nStaff('LB_LAST_WORKING_DATE'),
    //     }) || '',
    //     (value: Date | number): any => !!value
    //   ),
    // }),
    // status: yup.mixed().when('jobType', {
    //   is: (jobType: string) => jobType && jobType === JOB_TYPE_OFFICICAL,
    //   then: yup.object({
    //     status: Yup.object({
    //       id: Yup.string()
    //         .nullable()
    //         .required(getMessageSelectRequire(i18nStaff('LB_STATUS'))),
    //     }),
    //     startDate: yup.mixed().when('status.id', {
    //       is: (stt: number | string) =>
    //         stt && (stt == status[3].value || stt == status[2].value),
    //       then: yup.mixed().test(
    //         'is-number-or-date',
    //         i18nCommon('MSG_INPUT_DATE_REQUIRE', {
    //           name: i18nStaff('LB_FROM'),
    //         }) || '',
    //         (value: Date | number): any => !!value
    //       ),
    //     }),
    //     endDate: yup.mixed().when('status.id', {
    //       is: (stt: number | string) => stt && stt == status[3].value,
    //       then: yup.mixed().test(
    //         'is-number-or-date',
    //         i18nCommon('MSG_INPUT_DATE_REQUIRE', {
    //           name: i18nStaff('LB_FROM'),
    //         }) || '',
    //         (value: Date | number): any => !!value
    //       ),
    //     }),
    //     note: yup.mixed().when('status.id', {
    //       is: (stt: number | string) => stt && stt == status[3].value,
    //       then: yup
    //         .mixed()
    //         .test(
    //           'is-string',
    //           getMessageSelectRequire(i18nStaff('LB_LEAVE_REASON')) || '',
    //           (value: Date | number | string): any => !!value
    //         ),
    //     }),
    //   }),
    // }),
  })
  const changeStatusSchemaValidation = yup.object({
    endDate: yup
      .mixed()
      .nullable()
      .required(
        i18nCommon('MSG_INPUT_DATE_REQUIRE', {
          name: i18nStaff('LB_TO'),
        }) || ''
      ),
    leaveReason: yup.mixed().when('changeStatusTo', {
      is: (stt: number | string) => stt && stt == status[3].value,
      then: yup.mixed().test(
        'is-string',
        i18nCommon('MSG_INPUT_REQUIRE', {
          name: i18nStaff('LB_LEAVE_REASON'),
        }) || '',
        (value: Date | number | string): any => !!value
      ),
    }),
    changeStatusTo: Yup.string()
      .nullable()
      .required(
        i18nCommon('MSG_INPUT_DATE_REQUIRE', {
          name: i18nStaff('LB_CHANGE_STATUS_TO'),
        }) || ''
      ),
    estimateTo: yup.mixed().when('changeStatusTo', {
      is: (stt: number | string) =>
        stt && (stt == status[2].value || stt == status[3].value),
      then: yup.mixed().test(
        'is-number-or-date',
        i18nCommon('MSG_INPUT_DATE_REQUIRE', {
          name: i18nStaff('LB_TO_ESTIMATE'),
        }) || '',
        (value: Date | number): any => !!value
      ),
    }),
  })
  const hrOutsourcingValidation = yup.object({
    staffName: yup
      .string()
      .textRequired(
        i18nCommon('MSG_INPUT_REQUIRE', {
          name: i18nCommon('LB_STAFF_NAME'),
        })
      )
      .staffNameValidation(
        i18nCommon('MSG_INPUT_NAME_INVALID', {
          name: i18nCommon('LB_STAFF_NAME'),
        })
      ),
    gender: yup
      .string()
      .required(getMessageSelectRequire(i18nStaff('LB_GENDER'))),
    email: yup
      .string()
      .emailValidation(
        StringFormat(
          i18nCommon('MSG_HAS_INVALID_EMAIL'),
          i18nCommon('LB_EMAIL') || ''
        )
      )
      .specialCharacters(
        StringFormat(
          i18nCommon('MSG_HAS_CONTAIN_UNAUTHORIZED_CHARACTER__EMAIL'),
          i18nCommon('LB_EMAIL') || ''
        )
      ),
    position: yup
      .string()
      .required(getMessageSelectRequire(i18nCommon('LB_POSITION'))),
    onboardDate: yup
      .date()
      .nullable()
      .required(
        i18nCommon('MSG_INPUT_DATE_REQUIRE', {
          name: i18nStaff('LB_ONBOARD_DATE'),
        }) || ''
      ),
    contractExpiredDate: yup
      .date()
      .nullable()
      .required(
        i18nCommon('MSG_INPUT_DATE_REQUIRE', {
          name: i18nStaff('LB_CONTRACT_EXPIRED_DATE'),
        }) || ''
      ),
    status: yup
      .string()
      .required(getMessageSelectRequire(i18nStaff('LB_STATUS'))),
    branchId: yup
      .string()
      .required(getMessageSelectRequire(i18nStaff('LB_BRANCH'))),
    customer: yup
      .object()
      .nullable()
      .objectEmpty(getMessageSelectRequire(i18nStaff('LB_CUSTOMER'))),
    partner: yup
      .object()
      .nullable()
      .objectEmpty(getMessageSelectRequire(i18nStaff('LB_PARTNER'))),
  })

  const modalAddSkillSetValidation = yup.object({
    skillGroup: yup.object().shape({
      id: yup.string().required(
        i18nCommon('MSG_SELECT_REQUIRE', {
          name: i18nStaff('LB_SKILL_GROUP'),
        }) || ''
      ),
    }),
    skillName: yup.object().shape({
      id: yup.string().required(
        i18nCommon('MSG_SELECT_REQUIRE', {
          name: i18nStaff('LB_SKILL_NAME'),
        }) || ''
      ),
    }),
    yearsOfExperience: yup
      .string()
      .textRequired(
        i18nCommon('MSG_INPUT_REQUIRE', {
          name: i18nStaff('LB_YEAR_OF_EXPERIENCE'),
        })
      )
      .max(
        8,
        i18nCommon('MSG_INVALID_INPUT_MAX', {
          name: i18nStaff('LB_YEAR_OF_EXPERIENCE'),
        }) as string
      ),
    level: yup.object().shape({
      id: yup.string().required(
        i18nCommon('MSG_SELECT_REQUIRE', {
          name: i18nCommon('LB_LEVEL'),
        }) || ''
      ),
    }),
  })
  return {
    hrOutsourcingValidation,
    generalSchemaValidation,
    modalAddSkillSetValidation,
    changeStatusSchemaValidation,
  }
}

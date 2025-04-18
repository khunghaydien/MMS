import { NS_PROJECT } from '@/const/lang.const'
import { SURVEY_TYPE_POINT_VALUES } from '@/modules/project/const'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { BonusAndPenaltyQuestionItem } from './KPIBonusAndPenalty/ModalBonusAndPenaltyEvaluation'

const useKPIValidation = (props?: any) => {
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const _nameCustomerComplaintProject: any =
    props?.nameCustomerComplaintProject || []
  const _nameSurveyProject: any = props?.nameSurveyProject || []

  const addNewMilestoneValidation = Yup.object().shape({
    name: Yup.string().required(
      i18('MSG_INPUT_REQUIRE', {
        name: i18Project('TXT_MILESTONE'),
      }) as string
    ),
    addedDate: Yup.date()
      .nullable()
      .required(
        i18('MSG_INPUT_DATE_REQUIRE', {
          name: i18Project('TXT_ADDED_DATE'),
        }) as string
      ),
    commitmentDeliveryDate: Yup.date()
      .nullable()
      .required(
        i18('MSG_INPUT_DATE_REQUIRE', {
          name: i18Project('TXT_COMMITMENT_DELIVERY_DATE'),
        }) as string
      ),
    actualDeliveryDate: Yup.mixed().when('deliver', {
      is: (deliver: number) => deliver === 2,
      then: Yup.date()
        .nullable()
        .required(
          i18('MSG_INPUT_DATE_REQUIRE', {
            name: i18Project('TXT_ACTUAL_DELIVERY_DATE'),
          }) as string
        ),
    }),
    milestoneDecision: Yup.string().when('deliver', {
      is: (deliver: number) => deliver === 2,
      then: Yup.string().required(
        i18('MSG_SELECT_REQUIRE', {
          name: i18Project('TXT_DELIVERY_DECISION'),
        }) as string
      ),
    }),
  })
  const deliverMilestoneValidation = Yup.object().shape({
    actualDeliveryDate: Yup.date()
      .nullable()
      .required(
        i18('MSG_INPUT_DATE_REQUIRE', {
          name: i18Project('TXT_ACTUAL_DELIVERY_DATE'),
        }) as string
      ),
    milestoneDecision: Yup.string().required(
      i18('MSG_SELECT_REQUIRE', {
        name: i18Project('TXT_DELIVERY_DECISION'),
      }) as string
    ),
  })
  const addNewReviewValidation = Yup.object().shape({
    week: Yup.number()
      .min(
        1,
        i18('MSG_SELECT_REQUIRE', {
          name: i18('TXT_WEEK'),
        }) as string
      )
      .required(
        i18('MSG_SELECT_REQUIRE', {
          name: i18('TXT_WEEK'),
        }) as string
      ),
    planning: Yup.number()
      .min(0)
      .max(
        100,
        i18('MSG_LESS_THAN_OR_EQUAL_100', {
          labelName: i18Project('TXT_PLANNING'),
        }) as string
      ),
    monitoring: Yup.number()
      .min(0)
      .max(
        100,
        i18('MSG_LESS_THAN_OR_EQUAL_100', {
          labelName: i18Project('TXT_MONITORING'),
        }) as string
      ),
    closing: Yup.number()
      .min(0)
      .max(
        100,
        i18('MSG_LESS_THAN_OR_EQUAL_100', {
          labelName: i18Project('TXT_CLOSING'),
        }) as string
      ),
  })

  const surveyFormValidation = Yup.object().shape({
    name: Yup.string()
      .required(
        i18('MSG_INPUT_REQUIRE', {
          name: i18Project('TXT_SURVEY_NAME'),
        }) as string
      )
      .test(
        'unique-name',
        i18('MSG_FIELD_DUPLICATE', {
          labelName: i18Project('TXT_SURVEY_NAME'),
        }) as string,
        function (value: string | undefined) {
          const _value = value?.trim() || ''
          const isUniqueWithApi = !!_nameSurveyProject.find(
            (item: any) => item.name === _value && item.id !== this.parent.id
          )
          return !isUniqueWithApi
        }
      ),
    closedDate: Yup.date()
      .nullable()
      .required(
        i18('MSG_INPUT_DATE_REQUIRE', {
          name: i18('TXT_CLOSED_DATE'),
        }) as string
      ),
    morRepresentative: Yup.object().objectEmpty(
      i18('MSG_SELECT_REQUIRE', {
        name: i18Project('TXT_MOR_REPRESENTATIVE'),
      }) as string
    ),
    customerRepresentative: Yup.string().required(
      i18('MSG_INPUT_REQUIRE', {
        name: i18Project('TXT_CUSTOMER_REPRESENTATIVE'),
      }) as string
    ),
    language: Yup.string().required(
      i18('MSG_SELECT_REQUIRE', {
        name: i18('LB_LANGUAGE'),
      }) as string
    ),
  })

  const questionsValidation = Yup.array().of(
    Yup.object().shape({
      answer: Yup.string().when('questionType', {
        is: (questionType: number) =>
          questionType === SURVEY_TYPE_POINT_VALUES.DROPDOWN,
        then: Yup.string().required(
          i18('MSG_SELECT_REQUIRE', {
            name: i18Project('TXT_SATISFACTION'),
          }) as string
        ),
      }),
    })
  )

  const evaluateProjectBaseValidation = Yup.object().shape({
    evaluatorName: Yup.string().required(
      i18('MSG_INPUT_REQUIRE', {
        name: i18Project('TXT_EVALUATOR_NAME'),
      }) as string
    ),
    sections: Yup.array().of(
      Yup.object().shape({
        questions: questionsValidation,
      })
    ),
  })

  const evaluateProjectLaboValidation = Yup.object().shape({
    evaluatorName: Yup.string().required(
      i18('MSG_INPUT_REQUIRE', {
        name: i18Project('TXT_EVALUATOR_NAME'),
      }) as string
    ),
    overallEvaluation: Yup.object().shape({
      general: Yup.object().shape({
        questions: questionsValidation,
      }),
    }),
    memberEvaluation: Yup.array().of(
      Yup.object().shape({
        member: Yup.object().objectEmpty(
          i18('MSG_SELECT_REQUIRE', {
            name: i18Project('TXT_MEMBER'),
          }) as string
        ),
        sections: Yup.array().of(
          Yup.object().shape({
            questions: questionsValidation,
          })
        ),
      })
    ),
  })

  const objectComplaint = {
    complaintName: Yup.string().when('complaint', {
      is: (complaint: boolean) => complaint,
      then: Yup.string()
        .required(
          i18('MSG_INPUT_REQUIRE', {
            name: i18Project('TXT_COMPLAINT_NAME'),
          }) as string
        )
        .test(
          'unique-name',
          i18('MSG_FIELD_DUPLICATE', {
            labelName: i18Project('TXT_COMPLAINT'),
          }) as string,
          function (value: string | undefined) {
            const _value = value?.trim() || ''
            const isUniqueWithApi = !!_nameCustomerComplaintProject.find(
              (item: any) => item.name === _value && item.id !== this.parent.id
            )

            const complaintList: BonusAndPenaltyQuestionItem[] =
              this.options.context?.questionList || []
            const isUniqueWithComplaintList = !!complaintList.find(
              complaint =>
                complaint.complaintName === _value &&
                complaint.id !== this.parent.id
            )
            return !isUniqueWithApi && !isUniqueWithComplaintList
          }
        ),
    }),
    complaintDate: Yup.date()
      .nullable()
      .when('complaint', {
        is: (complaint: boolean) => complaint,
        then: Yup.date()
          .nullable()
          .required(
            i18('MSG_INPUT_DATE_REQUIRE', {
              name: i18Project('TXT_COMPLAINT_DATE'),
            }) as string
          ),
      }),
    personInCharge: Yup.object().when('complaint', {
      is: (complaint: boolean) => complaint,
      then: Yup.object().objectEmpty(
        i18('MSG_SELECT_REQUIRE', {
          name: i18Project('TXT_PERSON_IN_CHARGE'),
        }) as string
      ),
    }),
    resolveDeadline: Yup.date()
      .nullable()
      .when('complaint', {
        is: (complaint: boolean) => complaint,
        then: Yup.date()
          .nullable()
          .required(
            i18('MSG_INPUT_DATE_REQUIRE', {
              name: i18Project('TXT_RESOLVE_DEADLINE'),
            }) as string
          ),
      }),
    rootCause: Yup.string().when('complaint', {
      is: (complaint: boolean) => complaint,
      then: Yup.string().required(
        i18('MSG_INPUT_REQUIRE', {
          name: i18Project('TXT_ROOT_CAUSE'),
        }) as string
      ),
    }),
    complaintLevel: Yup.string().when('complaint', {
      is: (complaint: boolean) => complaint,
      then: Yup.string().required(
        i18('MSG_INPUT_REQUIRE', {
          name: i18Project('TXT_COMPLAINT_LEVEL'),
        }) as string
      ),
    }),
  }

  const addComplaintValidation = Yup.object().shape(objectComplaint)

  const formBonusPenaltyValidation = Yup.object().shape({
    bonusPenalty: Yup.string().required(
      i18('MSG_SELECT_REQUIRE', {
        name: i18Project('TXT_BONUS_PENALTY'),
      }) as string
    ),
    questionId: Yup.string().required(
      i18('MSG_SELECT_REQUIRE', {
        name: i18Project('TXT_TYPE'),
      }) as string
    ),
    ...objectComplaint,
  })

  const bonusAndPenaltyValidation = Yup.object().shape({
    evaluationMonth: Yup.date()
      .nullable()
      .required(
        i18('MSG_INPUT_DATE_REQUIRE', {
          name: i18Project('TXT_EVALUATION_MONTH'),
        }) as string
      ),
    questionList: Yup.array().of(formBonusPenaltyValidation),
  })

  return {
    addNewMilestoneValidation,
    deliverMilestoneValidation,
    addNewReviewValidation,
    addComplaintValidation,
    surveyFormValidation,
    evaluateProjectBaseValidation,
    evaluateProjectLaboValidation,
    bonusAndPenaltyValidation,
    formBonusPenaltyValidation,
  } as any
}

export default useKPIValidation

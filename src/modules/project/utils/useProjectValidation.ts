import { NS_PROJECT } from '@/const/lang.const'
import { groupMailRegex, projectNameGenerateLinkRegex } from '@/utils/yup'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

const useProjectValidation = () => {
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const projectGeneralValidation = {
    name: Yup.string()
      .textRequired(
        i18('MSG_INPUT_REQUIRE', { name: i18Project('LB_PROJECT_NAME') })
      )
      .projectNameValidation(
        i18('MSG_INPUT_NAME_INVALID', { name: i18Project('LB_PROJECT_NAME') })
      ),
    branchId: Yup.string().required(
      i18('MSG_SELECT_REQUIRE', {
        name: i18Project('LB_RESPONSIBLE_BRANCH'),
      }) as string
    ),
    divisions: Yup.array()
      .min(
        1,
        i18('MSG_SELECT_REQUIRE', {
          name: i18Project('LB_PARTICIPATE_DIVISION'),
        }) as string
      )
      .max(
        10,
        i18('MSG_SELECT_MAX_ITEM', {
          name: i18Project('LB_PARTICIPATE_DIVISION'),
        }) as string
      ),
    startDate: Yup.date()
      .nullable()
      .required(
        i18('MSG_SELECT_REQUIRE', {
          name: i18Project('LB_PROJECT_START_DATE'),
        }) as string
      ),
    endDate: Yup.date()
      .nullable()
      .required(
        i18('MSG_SELECT_REQUIRE', {
          name: i18Project('LB_PROJECT_END_DATE'),
        }) as string
      ),
    projectRank: Yup.string().required(
      i18('MSG_SELECT_REQUIRE', {
        name: i18Project('LB_PROJECT_RANK'),
      }) as string
    ),
    billableMM: Yup.string()
      .nullable()
      .required(
        i18('MSG_INPUT_REQUIRE', {
          name: i18Project('LB_BILLABLE_MM'),
        }) as string
      ),
    projectType: Yup.string().required(
      i18('MSG_SELECT_REQUIRE', {
        name: i18Project('LB_PROJECT_TYPE'),
      }) as string
    ),
    productType: Yup.string().required(
      i18('MSG_SELECT_REQUIRE', {
        name: i18Project('LB_PRODUCT_TYPE'),
      }) as string
    ),
    customer: Yup.object()
      .nullable()
      .objectEmpty(
        i18('MSG_SELECT_REQUIRE', {
          name: i18('LB_CUSTOMER'),
        }) as string
      ),
    partners: Yup.array().max(10, 'Outsource cannot select more than 10 items'),
    projectManager: Yup.object()
      .nullable()
      .objectEmpty(
        i18('MSG_SELECT_REQUIRE', {
          name: i18('LB_PROJECT_MANAGER'),
        }) as string
      ),
    subProjectManagers: Yup.array().max(
      5,
      i18('MSG_SELECT_MAX_ITEM_5', {
        name: i18Project('LB_PROJECT_SUB_MANAGER'),
      }) as string
    ),
    status: Yup.string().required(
      i18('MSG_SELECT_REQUIRE', {
        name: i18Project('LB_PROJECT_STATUS'),
      }) as string
    ),
    technologies: Yup.array().max(
      10,
      i18('MSG_SELECT_MAX_ITEM', {
        name: i18('LB_TECHNOLOGY'),
      }) as string
    ),
    businessDomain: Yup.string()
      .nullable()
      .required(
        i18('MSG_INPUT_REQUIRE', {
          name: i18Project('LB_BUSINESS_DOMAIN'),
        }) as string
      ),
  }

  const createProjectGeneralValidation = Yup.object().shape({
    ...projectGeneralValidation,
    generateGroupMail: Yup.object().shape({
      name: Yup.string()
        .nullable()
        .matches(
          groupMailRegex,
          i18Project('MSG_GROUP_MAIL_INVALID', { name: 'Group mail' }) as string
        ),
    }),
    generateJira: Yup.object().shape({
      name: Yup.string()
        .nullable()
        .matches(
          projectNameGenerateLinkRegex,
          i18Project('MSG_JIRA_INVALID') as string
        ),
    }),
    generateBitbucket: Yup.object().shape({
      name: Yup.string()
        .nullable()
        .matches(
          projectNameGenerateLinkRegex,
          i18Project('MSG_BITBUCKET_INVALID') as string
        ),
    }),
  })

  const updateProjectBasicValidation = Yup.object().shape({
    ...projectGeneralValidation,
  })

  const projectToolsInformationValidation = Yup.object({
    groupMail: Yup.string()
      .nullable()
      .matches(
        groupMailRegex,
        i18Project('MSG_GROUP_MAIL_INVALID', {
          name: i18Project('LB_GROUP_MAIL_ADDRESS'),
        }) as string
      ),
    jiraLink: Yup.string()
      .nullable()
      .matches(
        projectNameGenerateLinkRegex,
        i18Project('MSG_JIRA_INVALID') as string
      ),
    gitLink: Yup.string()
      .nullable()
      .matches(
        projectNameGenerateLinkRegex,
        i18Project('MSG_BITBUCKET_INVALID') as string
      ),
  })

  const modalRequestOT = Yup.object({
    startDate: Yup.date()
      .nullable()
      .required(
        i18('MSG_INPUT_DATE_REQUIRE', {
          name: i18Project('LB_ASSIGN_START_DATE') || '',
        }) || ''
      ),
    requestName: Yup.string().required(
      i18Project('MSG_REQUEST_NAME') as string
    ),
    endDate: Yup.date()
      .nullable()
      .required(
        i18('MSG_INPUT_DATE_REQUIRE', {
          name: i18Project('LB_ASSIGN_END_DATE') || '',
        }) || ''
      ),
    hours: Yup.number().required(i18Project('MSG_HOURS_REQUIRE') as string),
    members: Yup.array().min(
      1,
      i18('MSG_SELECT_REQUIRE', {
        name: i18Project('LB_MEMBER'),
      }) as string
    ),
    divisionDirector: Yup.object()
      .nullable()
      .objectEmpty(
        i18('MSG_SELECT_REQUIRE', {
          name: i18Project('LB_DIVISION_DIRECTOR'),
        }) as string
      ),
    projectId: Yup.number().required(i18Project('MSG_PROJECT') as string),
  })

  return {
    createProjectGeneralValidation,
    updateProjectBasicValidation,
    projectToolsInformationValidation,
    modalRequestOT,
  }
}

export default useProjectValidation

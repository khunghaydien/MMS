import { LangConstant } from '@/const'
import { NOTIFICATIONS_TYPE } from '@/const/app.const'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

type Props = {
  sourceType: number
  isReading: boolean
  statusApplication: any
  reportDate: string
  approvedByName: string
  staffName: string
  reviewerName?: string
  cycleName?: string
  projectName?: string
  projectStartDate?: string
  projectManager?: string
  divisionDirector?: string
  tools?: any
  otDate?: string
  rejectReason?: string
  staffCode?: string
  currentJobType?: string
  jobEndDate?: string
}

const NotificationMessage = ({
  sourceType,
  isReading,
  statusApplication,
  reportDate,
  approvedByName,
  staffName,
  reviewerName,
  cycleName,
  projectName,
  projectManager,
  divisionDirector,
  projectStartDate,
  tools,
  otDate,
  rejectReason,
  staffCode,
  jobEndDate,
  currentJobType,
}: Props) => {
  const classes = useStyles()
  const { t: i18nCommon } = useTranslation(LangConstant.NS_COMMON)
  const { t: i18nDailyReport } = useTranslation(LangConstant.NS_DAILY_REPORT)
  const { t: i18nMMO } = useTranslation(LangConstant.NS_MBO)
  const { t: i18nProject } = useTranslation(LangConstant.NS_PROJECT)
  const { t: i18nStaff } = useTranslation(LangConstant.NS_STAFF)
  const renderDaylyMessage = (
    value: string | number,
    reportDate: string,
    nameApprover?: string,
    nameRequester?: string
  ) => {
    switch (value) {
      case 1:
        return i18nCommon('MSG_REPORT_UPDATE_CONFIRM', {
          name: nameRequester,
          day: reportDate,
        })
      case 2:
        return i18nCommon('MSG_REPORT_APPROVED', {
          name: nameApprover,
          day: reportDate,
        })
      case 3:
        return i18nCommon('MSG_REPORT_DECLINED', {
          name: nameApprover,
          day: reportDate,
        })
      default:
        return ''
    }
  }

  const renderProjectToolsMessage = (projectName: any, tools: any) => {
    let text = i18nProject('MSG_PROJECT_TOOLS', {
      projectName: projectName,
    })
    let toolNames: any = {
      1: 'Group Mail',
      2: 'Project on Jira',
      3: 'Project on Git',
    }
    if (tools && tools.length) {
      let result = tools
        ?.map((obj: any) => {
          let key = Object.keys(obj)[0] // Get key
          let value = obj[key] // Get the value corresponding to the key
          let status = value ? 'Success' : 'Fail' // Convert boolean value to Success/Fail

          return `<br>- <b>${status}</b> to generate ${toolNames[key]}` // Create text string
        })
        .join('')
      text += result
    }
    return text
  }
  const getMessage = (sourceType: number) => {
    switch (sourceType) {
      case NOTIFICATIONS_TYPE.DAILY_REPORT:
        return {
          title: i18nDailyReport('TXT_REQUEST_DAILY_REPORT_UPDATE'),
          body: renderDaylyMessage(
            statusApplication,
            reportDate,
            approvedByName,
            staffName
          ),
        }
      case NOTIFICATIONS_TYPE.MMO
        .APPRAISER_1_ABOUT_APPRAISEE_COMPLETE_EVALUATION:
        return {
          title: i18nMMO('TXT_APPRAISEE_COMPLETE_EVALUATION'),
          body: i18nMMO('MSG_APPRAISER_1_ABOUT_APPRAISEE_COMPLETE_EVALUATION', {
            appraisee: staffName,
          }),
        }
      case NOTIFICATIONS_TYPE.MMO
        .APPRAISER_2_ABOUT_APPRAISER_1_COMPLETE_EVALUATION:
        return {
          title: i18nMMO('TXT_APPRAISER_1_COMPLETE_EVALUATION'),
          body: i18nMMO(
            'MSG_APPRAISER_2_ABOUT_APPRAISER_1_COMPLETE_EVALUATION',
            {
              appraisee: staffName,
            }
          ),
        }
      case NOTIFICATIONS_TYPE.MMO
        .REVIEWER_ABOUT_APPRAISER_2_COMPLETE_EVALUATION:
        return {
          title: i18nMMO('TXT_APPRAISER_2_COMPLETE_EVALUATION'),
          body: i18nMMO('MSG_REVIEWER_ABOUT_APPRAISER_2_COMPLETE_EVALUATION', {
            appraisee: staffName,
          }),
        }
      case NOTIFICATIONS_TYPE.MMO.FINAL_SCORE:
        return {
          title: i18nMMO('TXT_FINAL_SCORE'),
          body: i18nMMO('MSG_FINAL_SCORE_NOTIFICATION', {
            appraisee: staffName,
          }),
        }
      case NOTIFICATIONS_TYPE.MMO.REVIEWER_REJECT_SCORE:
        return {
          title: i18nMMO('TXT_REJECT_SCORE'),
          body: i18nMMO('MSG_REJECT_SCORE', {
            reviewer: reviewerName,
            appraisee: staffName,
          }),
        }
      case NOTIFICATIONS_TYPE.MMO.UPCOMMING_EVALUATION_PERIOD:
        return {
          title: i18nMMO('TXT_UPCOMMING_EVALUATION'),
          body: i18nMMO('MSG_UPCOMMING_EVALUATION', {
            cycleName: cycleName,
          }),
        }
      case NOTIFICATIONS_TYPE.PROJECT.REQUEST_OT_CREATED:
        return {
          title: i18nProject('TXT_CREATE_FORM_OT'),
          body: i18nProject('MSG_REQUEST_FORM_OT', {
            projectName: projectName,
            projectManager: projectManager,
          }),
        }
      case NOTIFICATIONS_TYPE.PROJECT.REQUEST_OT_APPROVED:
        return {
          title: i18nProject('TXT_APPROVED_FORM_OT'),
          body: i18nProject('MSG_APPROVED_FORM_OT', {
            divisionDirector: divisionDirector,
          }),
        }
      case NOTIFICATIONS_TYPE.PROJECT.REQUEST_OT_REJECTED:
        return {
          title: i18nProject('TXT_REJECTED_FORM_OT'),
          body: i18nProject('MSG_REJECTED_FORM_OT', {
            divisionDirector: divisionDirector,
            rejectReason: rejectReason,
          }),
        }
      case NOTIFICATIONS_TYPE.PROJECT.GROUP_MAIL_GENERATED:
        return {
          title: i18nProject('TXT_GROUP_MAIL_GENERATED'),
          body: i18nProject('MSG_GROUP_MAIL_GENERATED', {
            projectName: projectName,
          }),
        }
      case NOTIFICATIONS_TYPE.PROJECT.GROUP_MAIL_UNSUCCESSFULLY:
        return {
          title: i18nProject('TXT_GROUP_MAIL_UNSUCCESSFULLY'),
          body: i18nProject('MSG_GROUP_MAIL_UNSUCCESSFULLY', {
            projectName: projectName,
          }),
        }
      case NOTIFICATIONS_TYPE.PROJECT.JIRA_GENERATED.PROJECT_NAME:
        return {
          title: i18nProject('TXT_JIRA_GENERATED'),
          body: i18nProject('MSG_JIRA_GENERATED_PROJECT_NAME', {
            projectName: projectName,
          }),
        }
      case NOTIFICATIONS_TYPE.PROJECT.JIRA_GENERATED.PROJECT_KEY:
        return {
          title: i18nProject('TXT_JIRA_GENERATED'),
          body: i18nProject('MSG_JIRA_GENERATED_PROJECT_KEY', {
            projectName: projectName,
          }),
        }
      case NOTIFICATIONS_TYPE.PROJECT.JIRA_UNSUCCESSFULLY:
        return {
          title: i18nProject('TXT_JIRA_UNSUCCESSFULLY'),
          body: i18nProject('MSG_JIRA_UNSUCCESSFULLY', {
            projectName: projectName,
          }),
        }
      case NOTIFICATIONS_TYPE.PROJECT.BITBUCKET_GENERATED.PROJECT_NAME:
        return {
          title: i18nProject('TXT_BITBUCKET_GENERATED'),
          body: i18nProject('MSG_BITBUCKET_GENERATED_PROJECT_NAME', {
            projectName: projectName,
          }),
        }
      case NOTIFICATIONS_TYPE.PROJECT.BITBUCKET_GENERATED.PROJECT_KEY:
        return {
          title: i18nProject('TXT_BITBUCKET_GENERATED'),
          body: i18nProject('MSG_BITBUCKET_GENERATED_PROJECT_KEY', {
            projectName: projectName,
          }),
        }
      case NOTIFICATIONS_TYPE.PROJECT.BITBUCKET_UNSUCCESSFULLY:
        return {
          title: i18nProject('TXT_BITBUCKET_UNSUCCESSFULLY'),
          body: i18nProject('MSG_BITBUCKET_UNSUCCESSFULLY', {
            projectName: projectName,
          }),
        }
      case NOTIFICATIONS_TYPE.PROJECT.BITBUCKET_UPDATED:
        return {
          title: i18nProject('TXT_BITBUCKET_UPDATED'),
          body: i18nProject('MSG_BITBUCKET_UPDATED', {
            projectName: projectName,
          }),
        }
      case NOTIFICATIONS_TYPE.PROJECT.JIRA_UPDATED:
        return {
          title: i18nProject('TXT_JIRA_UPDATED'),
          body: i18nProject('MSG_JIRA_UPDATED', {
            projectName: projectName,
          }),
        }
      case NOTIFICATIONS_TYPE.PROJECT.GROUP_MAIL_UPDATED:
        return {
          title: i18nProject('TXT_GROUP_MAIL_UPDATED'),
          body: i18nProject('MSG_GROUP_MAIL_UPDATED', {
            projectName: projectName,
          }),
        }
      case NOTIFICATIONS_TYPE.PROJECT.GENERATING_PROJECT_TOOLS_COMPLETED:
        return {
          title: i18nProject('TXT_PROJECT_TOOLS_RESPONSE'),
          body: renderProjectToolsMessage(projectName, tools),
        }
      case NOTIFICATIONS_TYPE.PROJECT.MEMBER.ADD_NEW:
        return {
          title: i18nProject('TXT_PROJECT_ADD_NEW_MEMBER'),
          body: i18nProject('MSG_PROJECT_ADD_NEW_MEMBER', {
            projectName: projectName,
          }),
        }
      case NOTIFICATIONS_TYPE.PROJECT.MEMBER.REMOVE:
        return {
          title: i18nProject('TXT_PROJECT_REMOVE_MEMBER'),
          body: i18nProject('MSG_PROJECT_REMOVE_MEMBER', {
            projectName: projectName,
          }),
        }
      case NOTIFICATIONS_TYPE.PROJECT.MEMBER.ADD_NEW_SALE:
        return {
          title: i18nProject('TXT_PROJECT_ADD_NEW_SALE_MEMBER'),
          body: i18nProject('MSG_PROJECT_ADD_NEW_SALE_MEMBER', {
            projectName: projectName,
          }),
        }
      case NOTIFICATIONS_TYPE.PROJECT.MANAGER.ADD_NEW:
        return {
          title: i18nProject('TXT_PROJECT_ADD_NEW_MANAGER'),
          body: i18nProject('MSG_PROJECT_ADD_NEW_MANAGER', {
            projectName: projectName,
          }),
        }
      case NOTIFICATIONS_TYPE.PROJECT.MANAGER.ADD_NEW_SUB:
        return {
          title: i18nProject('TXT_PROJECT_ADD_NEW_SUB_MANAGER'),
          body: i18nProject('MSG_PROJECT_ADD_NEW_SUB_MANAGER', {
            projectName: projectName,
          }),
        }
      case NOTIFICATIONS_TYPE.PROJECT.CHANGES_THE_START_AND_DATE:
        return {
          title: i18nProject('TXT_PROJECT_UPDATE_TIME'),
          body: i18nProject('MSG_PROJECT_UPDATE_TIME', {
            projectName: projectName,
          }),
        }
      case NOTIFICATIONS_TYPE.PROJECT.CHANGES_STATUS_CANCELLED:
        return {
          title: i18nProject('TXT_PROJECT_CHANGES_STATUS_CANCELLED'),
          body: i18nProject('MSG_PROJECT_CHANGES_STATUS_CANCELLED', {
            projectName: projectName,
          }),
        }
      case NOTIFICATIONS_TYPE.PROJECT.CHANGES_STATUS_COMPLETED:
        return {
          title: i18nProject('TXT_PROJECT_CHANGES_STATUS_COMPLETED'),
          body: i18nProject('MSG_PROJECT_CHANGES_STATUS_COMPLETED', {
            projectName: projectName,
          }),
        }
      case NOTIFICATIONS_TYPE.PROJECT.PROJECT_CREATE_1:
        return {
          title: i18nProject('TXT_PROJECT_CREATE_1'),
          body: i18nProject('MSG_PROJECT_CREATE_1', {
            projectName: projectName,
            projectStartDate: projectStartDate,
          }),
        }
      case NOTIFICATIONS_TYPE.PROJECT.PROJECT_CREATE_2:
        return {
          title: i18nProject('TXT_PROJECT_CREATE_2'),
          body: i18nProject('MSG_PROJECT_CREATE_2', {
            projectName: projectName,
            projectStartDate: projectStartDate,
          }),
        }
      case NOTIFICATIONS_TYPE.PROJECT.PROJECT_CREATE_3:
        return {
          title: i18nProject('TXT_PROJECT_CREATE_3'),
          body: i18nProject('MSG_PROJECT_CREATE_3', {
            projectName: projectName,
            projectStartDate: projectStartDate,
          }),
        }
      case NOTIFICATIONS_TYPE.PROJECT.PROJECT_CREATE_4:
        return {
          title: i18nProject('TXT_PROJECT_CREATE_4'),
          body: i18nProject('MSG_PROJECT_CREATE_4', {
            projectName: projectName,
            projectStartDate: projectStartDate,
          }),
        }

      case NOTIFICATIONS_TYPE.PROJECT.OT_REPORT.REPORT_OT_CREATED:
        return {
          title: i18nProject('TXT_PROJECT_REPORT_OT_CREATED'),
          body: i18nProject('MSG_PROJECT_REPORT_OT_CREATED', {
            staffName: staffName,
            otDate: otDate,
            projectName: projectName,
          }),
        }
      case NOTIFICATIONS_TYPE.PROJECT.OT_REPORT.REPORT_OT_APPROVED:
        return {
          title: i18nProject('TXT_PROJECT_REPORT_OT_APPROVED'),
          body: i18nProject('MSG_PROJECT_REPORT_OT_APPROVED', {
            dmName: divisionDirector,
            staffName: staffName,
            otDate: otDate,
            projectName: projectName,
          }),
        }
      case NOTIFICATIONS_TYPE.PROJECT.OT_REPORT.REPORT_OT_REJECTED_DD:
        return {
          title: i18nProject('TXT_PROJECT_REPORT_OT_REJECTED_DD'),
          body: i18nProject('MSG_PROJECT_REPORT_OT_REJECTED_DD', {
            dmName: divisionDirector,
            rejectReason: rejectReason,
            staffName: staffName,
            otDate: otDate,
            projectName: projectName,
          }),
        }
      case NOTIFICATIONS_TYPE.PROJECT.OT_REPORT.REPORT_OT_REJECTED_PM:
        return {
          title: i18nProject('TXT_PROJECT_REPORT_OT_REJECTED_PM'),
          body: i18nProject('MSG_PROJECT_REPORT_OT_REJECTED_PM', {
            dmName: projectManager,
            rejectReason: rejectReason,
            staffName: staffName,
            otDate: otDate,
            projectName: projectName,
          }),
        }
      case NOTIFICATIONS_TYPE.PROJECT.OT_REPORT.REPORT_OT_CONFIRMED:
        return {
          title: i18nProject('TXT_PROJECT_REPORT_OT_CONFIRMED'),
          body: i18nProject('MSG_PROJECT_REPORT_OT_CONFIRMED', {
            pmName: projectManager,
            staffName: staffName,
            otDate: otDate,
            projectName: projectName,
          }),
        }
      case NOTIFICATIONS_TYPE.PROJECT.OT_REPORT.REPORT_OT_EDITED:
        return {
          title: i18nProject('TXT_PROJECT_REPORT_OT_EDITED'),
          body: i18nProject('MSG_PROJECT_REPORT_OT_EDITED', {
            staffName: staffName,
            otDate: otDate,
            projectName: projectName,
          }),
        }
      case NOTIFICATIONS_TYPE.STAFF.INACTIVE: {
        return {
          title: i18nStaff('TXT_STAFF_NOTIFICATION_BEFORE_INACTIVE'),
          body: i18nStaff('MSG_STAFF_NOTIFICATION_BEFORE_INACTIVE', {
            staffCode: staffCode,
            staffName: staffName,
            currentJobType: currentJobType,
            jobEndDate: jobEndDate,
          }),
        }
      }
      default:
        return
    }
  }

  return (
    <Box>
      <Box className={clsx(classes.boldText, 'notifyItem-title')}>
        {!isReading && <span className={classes.dotStatus}>New</span>}
        {getMessage(sourceType)?.title}
      </Box>
      <Box
        className="notifyItem-content"
        dangerouslySetInnerHTML={{
          __html: getMessage(sourceType)?.body || '',
        }}
      ></Box>
    </Box>
  )
}
export default NotificationMessage
const useStyles = makeStyles((theme: Theme) => ({
  notifyItem: {
    '& .notifyItem-title': {
      width: 'calc(100% - 25px)',
    },
  },
  boldText: {
    fontWeight: '700',
  },
  dotStatus: {
    background: '#f5c516',
    borderRadius: '5px',
    fontSize: '12px',
    padding: '3px',
    marginRight: '5px',
    position: 'relative',
    top: '-3px',
  },
}))

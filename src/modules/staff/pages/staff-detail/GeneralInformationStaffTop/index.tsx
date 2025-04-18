import CommonButton from '@/components/buttons/CommonButton'
import { IGeneralInformationStaffState } from '@/modules/staff/types'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'
import clsx from 'clsx'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

interface IProps {
  generalInfoStaff: IGeneralInformationStaffState
  onShowModalExportSkillSets: () => void
  isDetailPage: boolean
  useSkillSet: boolean
}
const GeneralInformationStaffTop = ({
  generalInfoStaff,
  onShowModalExportSkillSets,
  isDetailPage = false,
  useSkillSet = false,
}: IProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  return (
    <Box className={classes.rootStaffInformation}>
      {!!generalInfoStaff.code && (
        <Box className="main-information">
          <Box className="main-item">
            <Box className="label label-name">Staff Code</Box>
            <Box className="value value-name">{generalInfoStaff.code}</Box>
          </Box>
          <Box className="main-item">
            <Box className="label label-name">{i18('LB_STAFF_NAME')}</Box>
            <Box className="value value-name">{generalInfoStaff.staffName}</Box>
          </Box>
          {!!generalInfoStaff.birthday && (
            <Box className="main-item">
              <Box className="label label-name">Birthday</Box>
              <Box className="value value-name">
                {moment(generalInfoStaff.birthday).format('DD/MM/YYYY')}
              </Box>
            </Box>
          )}
          <Box className="main-item">
            <Box className="label label-name">{i18('LB_EMAIL')}</Box>
            <Box className="value value-name">{generalInfoStaff.email}</Box>
          </Box>
          <Box className="main-item">
            <Box className="label label-name">{i18('LB_POSITION')}</Box>
            <Box className="value value-name">
              {generalInfoStaff.positionName}
            </Box>
          </Box>
        </Box>
      )}
      {generalInfoStaff?.branch?.label === 'HR Outsourcing'
        ? null
        : isDetailPage &&
          useSkillSet && (
            <Box className={clsx(classes.rootBtnExport)}>
              <CommonButton
                width={160}
                height={40}
                onClick={onShowModalExportSkillSets}
                className={classes.mb24}
              >
                Export SkillSet
              </CommonButton>
            </Box>
          )}
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootStaffInformation: {
    width: '100%',
    minHeight: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(3),
    '& .main-information': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(1),
      '& .main-item': {
        display: 'flex',
        fontSize: 14,
        '& .label': {
          minWidth: '120px',
          fontSize: 14,
          lineHeight: '20px',
          color: theme.color.black.secondary,
        },
        '& .value-name': {
          fontWeight: 700,
          maxWidth: '1000px',
        },
      },
    },
  },
  rootBtnExport: {
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '20px',
  },
  mb24: {
    marginBottom: `${theme.spacing(3)} !important`,
  },
}))
export default GeneralInformationStaffTop

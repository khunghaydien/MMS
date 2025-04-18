import StatusItem from '@/components/common/StatusItem'
import {
  genders,
  JOB_TYPE_FREELANCER,
  JOB_TYPE_OFFICICAL,
  JOB_TYPE_PROBATION,
  keyItemGeneralInformationHROutsource,
  keyItemGeneralInformationStaff,
  keyItemGeneralInformationStaffProbation,
  keyItemGeneralInformationStafIntern,
  keyItemGeneralInformationStafOfficial,
  STAFF_STATUS,
} from '@/modules/staff/const'
import { IGeneralInformationStaffState } from '@/modules/staff/types'
import {
  commonSelector,
  CommonState,
  getGrades,
  getLeaderGrades,
} from '@/reducer/common'
import { AppDispatch } from '@/store'
import { IColor } from '@/types'
import { formatDate } from '@/utils'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
interface IProps {
  dataDetail: IGeneralInformationStaffState
  isHrOs?: boolean
}
interface IStatus {
  color: IColor
  label: string
}
const GeneralInformationStaffDetail = ({ dataDetail, isHrOs }: IProps) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { listGrades, listLeaderGrades }: CommonState =
    useSelector(commonSelector)

  const getDataGender = (genderId: string) => {
    let gender = genders.find((item: any) => item.id == genderId)
    if (gender) {
      return gender?.label || ''
    }
    return ''
  }

  const dataDetailFormat: { [key: string]: any } = useMemo(() => {
    return {
      gender: getDataGender(dataDetail.gender),
      directManager: dataDetail.directManager?.label,
      branchName: dataDetail.branch?.label,
      divisionName: dataDetail.division?.label,
      onboardDate: formatDate(dataDetail.onboardDate as any),
      jobType: dataDetail.jobTypeName,
      lastWorkingDate: dataDetail.lastWorkingDate
        ? formatDate(dataDetail.lastWorkingDate)
        : '',
      createdBy: dataDetail.createdBy?.name,
      contractExpiredDate: formatDate(dataDetail.contractExpiredDate as any),
      customer: dataDetail.customer?.name,
      partner: dataDetail.partner?.name,
      phoneNumber: dataDetail?.phoneNumber,
      jobStartDate: dataDetail?.jobStartDate
        ? formatDate(dataDetail?.jobStartDate)
        : '',
      jobEndDate:
        dataDetail?.jobEndDate && dataDetail.jobType !== JOB_TYPE_OFFICICAL
          ? formatDate(dataDetail?.jobEndDate)
          : '',
      freelancerPeriods: dataDetail.freelancerPeriods,
    }
  }, [dataDetail, listGrades, listLeaderGrades])

  const convertStaffStatus = (status: any): IStatus => {
    if (STAFF_STATUS[status]) {
      return {
        color: STAFF_STATUS[status].color,
        label: STAFF_STATUS[status].label,
      }
    }
    return {
      color: 'red',
      label: '',
    }
  }

  const status = useMemo(
    () =>
      isHrOs
        ? convertStaffStatus(dataDetail?.status?.id)
        : convertStaffStatus(dataDetail?.status?.status?.id),
    [dataDetail.status]
  )

  const items = useMemo(() => {
    if (!isHrOs) {
      if (dataDetail.jobType === JOB_TYPE_PROBATION)
        return keyItemGeneralInformationStaff.concat(
          keyItemGeneralInformationStaffProbation
        )
      else if (dataDetail.jobType === JOB_TYPE_FREELANCER) {
        return keyItemGeneralInformationStaff
      } else if (dataDetail.jobType === JOB_TYPE_OFFICICAL) {
        return keyItemGeneralInformationStaff.concat(
          keyItemGeneralInformationStafOfficial
        )
      } else {
        return keyItemGeneralInformationStaff.concat(
          keyItemGeneralInformationStafIntern
        )
      }
    } else return keyItemGeneralInformationHROutsource
  }, [isHrOs, keyItemGeneralInformationStaff, dataDetail])

  useEffect(() => {
    if (dataDetail.position) {
      dispatch(getGrades({ positionId: dataDetail.position }))
    }
  }, [dataDetail.position])

  useEffect(() => {
    if (dataDetail.position && dataDetail.gradeId) {
      dispatch(
        getLeaderGrades({
          positionId: dataDetail.position,
          gradeId: dataDetail.gradeId,
        })
      )
    }
  }, [dataDetail.position, dataDetail.gradeId])

  return (
    <Box className={classes.rootStaffInformation}>
      {!!dataDetail.code && (
        <Box className="extra-information">
          {items.map((item: any) =>
            item.value === 'status' ? (
              <Box className="extra-item" key={item.key}>
                <Box className="label">{item.key} </Box>
                <Box className="value status-margin">
                  <StatusItem typeStatus={status} />
                </Box>
              </Box>
            ) : (
              <Box className="extra-item" key={item.key}>
                <Box className="label">{item.key}</Box>
                <Box className="value">
                  {dataDetailFormat[item.value as string] || ''}
                </Box>
              </Box>
            )
          )}
          {dataDetail.jobType === JOB_TYPE_FREELANCER && (
            <Box
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              {dataDetail?.freelancerPeriods?.map(
                ({ startDate, endDate }, index: number) => (
                  <Box className="extra-information" key={index}>
                    {index === 0 ? (
                      <Box className="extra-item">
                        <Box className="label">Job Type</Box>
                        <Box className="value">{dataDetail.jobTypeName}</Box>
                      </Box>
                    ) : (
                      <Box className="extra-item"></Box>
                    )}
                    <Box className="extra-item">
                      <Box className="label">{`Start Date #${index + 1}`}</Box>
                      <Box className="value">
                        {startDate ? formatDate(startDate) : ''}
                      </Box>
                    </Box>
                    <Box className="extra-item">
                      <Box className="label">{`End Date #${index + 1}`}</Box>
                      <Box className="value">
                        {endDate ? formatDate(endDate) : ''}
                      </Box>
                    </Box>
                  </Box>
                )
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootStaffInformation: {
    width: '100%',
    minHeight: '10px',
    '& .extra-information-title': {
      lineHeight: '10px 0 20px 0',
      color: '#333333',
      fontWeight: 700,
      padding: '20px 0',
    },
    '& .wrap-button-edit': {
      display: 'flex',
      justifyContent: 'end',
      marginBottom: '20px',
    },
    '& .extra-information': {
      display: 'flex',
      gap: theme.spacing(3),
      flexWrap: 'wrap',
      '& .extra-item': {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '23%',
        minWidth: '230px',
        wordBreak: 'break-word',
        '& .label': {
          lineHeight: '20px',
          color: theme.color.black.secondary,
          width: '130px',
          fontSize: '14px',
        },
        '& .value': {
          width: 'calc(100% - 130px)',
          fontWeight: 700,
          fontSize: '14px',
        },
      },
    },
    '& .status-margin': {
      marginLeft: theme.spacing(-1),
    },
  },
}))
export default GeneralInformationStaffDetail

import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import FormLayout from '@/components/Form/FormLayout'
import InputDropdown from '@/components/inputs/InputDropdown'
import { LangConstant } from '@/const'
import {
  JOB_TYPE_FREELANCER,
  JOB_TYPE_INTERN,
  JOB_TYPE_OFFICICAL,
  JOB_TYPE_PROBATION,
  jobType,
} from '@/modules/staff/const'
import { staffSelector } from '@/modules/staff/reducer/staff'
import { StaffState } from '@/modules/staff/types'
import { OptionItem } from '@/types'
import IconChangeJobTypeGray from '@/ui/images/change-job-type-gray.png'
import IconChangeJobType from '@/ui/images/change-job-type.png'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { addDays, subDays } from 'date-fns'
import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
type IJobType = {
  values: any
  touched: any
  errors: any
  formik?: any
  isViewDetail?: boolean
  jobChangeRequest: boolean
  handleAddWorkingPeriod: (jobChangeRequest: boolean) => void
  handleFreelancerWorkingPeriodChange: (
    value: Date | null,
    keyName: string,
    index: number,
    jobChangeRequest: boolean
  ) => void
  handleInputDropdownChange: (
    value: string,
    option?: OptionItem,
    keyName?: string,
    jobChangeRequest?: boolean
  ) => void
  handleDateChange: (
    dateSelected: Date,
    keyName: string,
    jobChangeRequest?: boolean
  ) => void
  disabled: boolean
  handleChangeJobType?: () => void
  handleMinus?: (
    jobType: string,
    jobChangeRequest?: boolean,
    index?: number
  ) => void
}
function JobType({
  values,
  touched,
  errors,
  formik,
  isViewDetail,
  disabled,
  handleAddWorkingPeriod,
  handleFreelancerWorkingPeriodChange,
  handleInputDropdownChange,
  handleDateChange,
  handleChangeJobType = () => {},
  handleMinus = () => {},
  jobChangeRequest,
}: IJobType) {
  const { t: i18Staff } = useTranslation(LangConstant.NS_STAFF)
  const classes = useStyles()
  const { generalInfoStaff }: StaffState = useSelector(staffSelector)
  const minDate = useMemo(() => {
    if (
      values?.jobType === JOB_TYPE_FREELANCER ||
      formik?.values?.jobType === JOB_TYPE_FREELANCER ||
      formik?.values?.jobType === JOB_TYPE_OFFICICAL ||
      !formik
    ) {
      return null
    } else return addDays(formik?.values?.jobEndDate, 1)
  }, [formik, values, isViewDetail])

  return (
    <>
      {(values?.jobType === JOB_TYPE_INTERN ||
        values?.jobType === JOB_TYPE_PROBATION ||
        values?.jobType === JOB_TYPE_OFFICICAL ||
        !values?.jobType) && (
        <>
          <FormLayout gap={24} top={24}>
            <InputDropdown
              keyName={'jobType'}
              required
              label={i18Staff('LB_JOB_TYPE') || ''}
              placeholder={i18Staff('PLH_SELECT_JOB_TYPE') || ''}
              listOptions={jobType}
              ignoreOptionById={
                jobChangeRequest ? generalInfoStaff.jobType : ''
              }
              error={touched?.jobType && Boolean(errors?.jobType)}
              errorMessage={errors?.jobType}
              isDisable={isViewDetail && !jobChangeRequest}
              value={values?.jobType}
              onChange={(
                value: string,
                option?: OptionItem | undefined,
                keyName?: string | undefined
              ) => {
                handleInputDropdownChange(
                  value,
                  option,
                  keyName,
                  jobChangeRequest
                )
              }}
            />
            {!values?.jobType && (
              <>
                <div style={{ width: '100%' }}></div>
                <div style={{ width: '100%' }}></div>
              </>
            )}
            {values?.jobType === JOB_TYPE_OFFICICAL && (
              <>
                <InputDatepicker
                  label={i18Staff('LB_FROM')}
                  keyName={'jobStartDate'}
                  inputFormat="DD/MM/YYYY"
                  required
                  minDate={minDate}
                  value={values?.jobStartDate}
                  error={touched?.jobStartDate && Boolean(errors?.jobStartDate)}
                  errorMessage={errors?.jobStartDate}
                  width={'100%'}
                  onChange={(dateSelected: Date, keyName: string) =>
                    handleDateChange(dateSelected, keyName, jobChangeRequest)
                  }
                />
                {jobChangeRequest && (
                  <div
                    className={clsx(classes.minus, classes.minusDefault)}
                    onClick={() => {
                      handleMinus(values?.jobType)
                    }}
                  >
                    -
                  </div>
                )}
              </>
            )}
            {(values?.jobType === JOB_TYPE_INTERN ||
              values?.jobType === JOB_TYPE_PROBATION) && (
              <>
                {values?.jobType === JOB_TYPE_PROBATION ? (
                  <InputDatepicker
                    label={i18Staff('LB_ONBOARD_DATE') || ''}
                    keyName={'onboardDate'}
                    inputFormat="DD/MM/YYYY"
                    required
                    minDate={minDate}
                    maxDate={subDays(values.jobEndDate, 1)}
                    value={values?.onboardDate}
                    error={touched?.onboardDate && Boolean(errors?.onboardDate)}
                    errorMessage={errors?.onboardDate}
                    width={'100%'}
                    onChange={(dateSelected: Date, keyName: string) =>
                      handleDateChange(dateSelected, keyName, jobChangeRequest)
                    }
                  />
                ) : (
                  <InputDatepicker
                    label={i18Staff('LB_FROM')}
                    keyName={'jobStartDate'}
                    inputFormat="DD/MM/YYYY"
                    required
                    minDate={minDate}
                    value={values?.jobStartDate}
                    maxDate={subDays(values?.jobEndDate, 1)}
                    error={
                      touched?.jobStartDate && Boolean(errors?.jobStartDate)
                    }
                    errorMessage={errors?.jobStartDate}
                    width={'100%'}
                    onChange={(dateSelected: Date, keyName: string) =>
                      handleDateChange(dateSelected, keyName, jobChangeRequest)
                    }
                  />
                )}
                <InputDatepicker
                  label={i18Staff('LB_TO') || ''}
                  keyName={'jobEndDate'}
                  inputFormat="DD/MM/YYYY"
                  required
                  minDate={
                    values?.jobType === JOB_TYPE_PROBATION
                      ? addDays(values?.onboardDate, 1)
                      : addDays(values?.jobStartDate, 1)
                  }
                  value={values?.jobEndDate}
                  error={touched?.jobEndDate && Boolean(errors?.jobEndDate)}
                  errorMessage={errors?.jobEndDate}
                  width={'100%'}
                  onChange={(dateSelected: Date, keyName: string) =>
                    handleDateChange(dateSelected, keyName, jobChangeRequest)
                  }
                />
                {jobChangeRequest && (
                  <div
                    className={clsx(classes.minus, classes.minusDefault)}
                    onClick={() => {
                      handleMinus(values?.jobType)
                    }}
                  >
                    -
                  </div>
                )}
              </>
            )}
          </FormLayout>
          {!jobChangeRequest && isViewDetail && (
            <div style={{ width: '100%' }}>
              <div
                onClick={handleChangeJobType}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '24px',
                }}
              >
                <img
                  src={disabled ? IconChangeJobTypeGray : IconChangeJobType}
                  className={classes.iconChange}
                />
                <div
                  className={`${
                    disabled ? classes.textDisabled : classes.textBlue
                  }`}
                >
                  Change Job Type
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {values?.jobType === JOB_TYPE_FREELANCER && (
        <>
          {values?.freelancerPeriods?.map(
            (
              freelancerWorkingPeriod: {
                startDate: Date | null
                endDate: Date | null
              },
              index: number
            ) => (
              <Fragment key={index}>
                <FormLayout key={index} gap={24} top={24}>
                  {index === 0 ? (
                    <InputDropdown
                      keyName={'jobType'}
                      required
                      label={i18Staff('LB_JOB_TYPE') || ''}
                      placeholder={i18Staff('PLH_SELECT_JOB_TYPE') || ''}
                      listOptions={jobType}
                      isDisable={isViewDetail && !jobChangeRequest}
                      ignoreOptionById={
                        jobChangeRequest ? generalInfoStaff.jobType : ''
                      }
                      error={touched?.jobType && Boolean(errors?.jobType)}
                      errorMessage={errors?.jobType}
                      value={values?.jobType}
                      onChange={(
                        value: string,
                        option?: OptionItem | undefined,
                        keyName?: string | undefined
                      ) =>
                        handleInputDropdownChange(
                          value,
                          option,
                          keyName,
                          jobChangeRequest
                        )
                      }
                    />
                  ) : (
                    <div style={{ width: '100%' }}></div>
                  )}
                  <InputDatepicker
                    label={i18Staff('LB_FROM') || ''}
                    keyName={'startDate'}
                    inputFormat="DD/MM/YYYY"
                    required
                    minDate={
                      index > 0
                        ? addDays(
                            values?.freelancerPeriods?.[index - 1]?.endDate,
                            1
                          )
                        : null
                    }
                    maxDate={
                      freelancerWorkingPeriod?.endDate
                        ? subDays(freelancerWorkingPeriod?.endDate, 1)
                        : null
                    }
                    value={freelancerWorkingPeriod?.startDate}
                    error={
                      touched?.freelancerPeriods?.[index]?.startDate &&
                      Boolean(errors?.freelancerPeriods?.[index]?.startDate)
                    }
                    errorMessage={errors?.freelancerPeriods?.[index]?.startDate}
                    width={'100%'}
                    onChange={(value: any, keyName: string) =>
                      handleFreelancerWorkingPeriodChange(
                        value,
                        keyName,
                        index,
                        jobChangeRequest
                      )
                    }
                  />
                  <InputDatepicker
                    label={i18Staff('LB_TO') || ''}
                    keyName={'endDate'}
                    inputFormat="DD/MM/YYYY"
                    required
                    maxDate={subDays(
                      values?.freelancerPeriods?.[index + 1]?.startDate,
                      1
                    )}
                    minDate={
                      freelancerWorkingPeriod?.startDate
                        ? addDays(freelancerWorkingPeriod?.startDate, 1)
                        : null
                    }
                    value={freelancerWorkingPeriod?.endDate}
                    error={
                      touched?.freelancerPeriods?.[index]?.endDate &&
                      Boolean(errors?.freelancerPeriods?.[index]?.endDate)
                    }
                    errorMessage={errors?.freelancerPeriods?.[index]?.endDate}
                    width={'100%'}
                    onChange={(value: any, keyName: string) =>
                      handleFreelancerWorkingPeriodChange(
                        value,
                        keyName,
                        index,
                        jobChangeRequest
                      )
                    }
                  />
                  <div
                    className={clsx(
                      classes.minus,
                      `${
                        !jobChangeRequest &&
                        isViewDetail &&
                        values.freelancerPeriods.length === 1
                          ? classes.minusDisabled
                          : classes.minusDefault
                      }`
                    )}
                    onClick={() => {
                      !(
                        !jobChangeRequest &&
                        isViewDetail &&
                        values.freelancerPeriods.length === 1
                      ) && handleMinus(values?.jobType, jobChangeRequest, index)
                    }}
                  >
                    -
                  </div>
                </FormLayout>
                {index === values?.freelancerPeriods?.length - 1 && (
                  <FormLayout gap={24} top={24}>
                    <div style={{ width: '100%' }}>
                      {!jobChangeRequest && isViewDetail && (
                        <div
                          onClick={handleChangeJobType}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <img
                            src={
                              disabled
                                ? IconChangeJobTypeGray
                                : IconChangeJobType
                            }
                            className={classes.iconChange}
                          />
                          <div
                            className={`${
                              disabled ? classes.textDisabled : classes.textBlue
                            }`}
                          >
                            Change Job Type
                          </div>
                        </div>
                      )}
                    </div>
                    <div
                      className={clsx(
                        classes.workingAddChange,
                        `${!disabled ? classes.textBlue : classes.textDisabled}`
                      )}
                      onClick={() => {
                        !disabled && handleAddWorkingPeriod(jobChangeRequest)
                      }}
                    >
                      <div
                        className={clsx(
                          classes.iconAdd,
                          `${
                            !disabled
                              ? classes.iconDefault
                              : classes.iconDisabled
                          }`
                        )}
                      >
                        +
                      </div>
                      <span>Add Working Period</span>
                    </div>
                    <div style={{ width: '100%' }}></div>
                  </FormLayout>
                )}
              </Fragment>
            )
          )}
        </>
      )}
    </>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  formWrapper: {
    maxWidth: '100%',
  },
  iconChange: {
    width: '14px',
    height: '14px',
  },
  iconAdd: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '14px',
    height: '14px',
    borderRadius: '100%',
    color: 'white',
  },
  iconDefault: {
    background: 'rgba(23, 70, 159, 1)',
  },
  iconDisabled: {
    background: 'rgba(23, 70, 159, 0.3)',
  },
  workingAddChange: {
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    width: '100%',
  },
  textBlue: {
    color: 'rgba(23, 70, 159, 1)',
  },
  textDisabled: {
    color: 'rgba(23, 70, 159, 0.3)',
  },
  minus: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '16px',
    height: '16px',
    borderRadius: '100%',
    padding: '4px',
    lineHeight: '4px',
    marginTop: '36px',
    cursor: 'pointer',
  },
  minusDefault: {
    border: '1px solid rgba(234, 66, 36, 1)',
    color: 'rgba(234, 66, 36, 1)',
  },
  minusDisabled: {
    border: '1px solid rgba(23, 70, 159, 0.3)',
    color: 'rgba(23, 70, 159, 0.3)',
  },
}))
export default JobType

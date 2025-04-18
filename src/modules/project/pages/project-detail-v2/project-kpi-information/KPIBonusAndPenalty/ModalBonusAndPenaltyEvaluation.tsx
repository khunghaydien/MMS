import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import FormItem from '@/components/Form/FormItem/FormItem'
import FormLayout from '@/components/Form/FormLayout'
import ButtonAddPlus from '@/components/buttons/ButtonAddPlus'
import Modal from '@/components/common/Modal'
import DeleteIcon from '@/components/icons/DeleteIcon'
import { LangConstant } from '@/const'
import { NS_PROJECT } from '@/const/lang.const'
import { projectSelector } from '@/modules/project/reducer/project'
import { ProjectService } from '@/modules/project/services'
import { getMasterQuestionProject } from '@/reducer/common'
import { alertSuccess, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { formatDate, scrollToFirstErrorMessage, uuid } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosResponse } from 'axios'
import { useFormik } from 'formik'
import moment from 'moment'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import useKPIValidation from '../useKPIValidation'
import FormBonusPenaltyItem from './FormBonusPenaltyItem'
import { getColorPoint } from './KPIBonusAndPenalty'

export interface BonusAndPenaltyQuestionItem {
  id: string | number
  complaint: boolean
  complaintDate: Date | null
  complaintLevel: string
  complaintName: string
  correctiveAction: string
  description: string
  evaluateQuestionId: number | null
  note?: string
  personInCharge: any
  picRole: string
  point: string
  preventiveAction: string
  questionId: number | string
  resolveDate?: Date | null
  resolveDeadline: Date | null
  rootCause: string
  bonusPenalty?: string | number
}

interface ModalBonusAndPenaltyEvaluationProps {
  onClose: () => void
  updateSuccess: () => void
  evaluateSuccess: () => void
  evaluateMonthMMYYYY: string
  mode: 'evaluate' | 'edit'
  setMode: Dispatch<SetStateAction<'evaluate' | 'edit'>>
}

const initValues: {
  evaluationMonth: Date | null
  questionList: BonusAndPenaltyQuestionItem[]
} = {
  evaluationMonth: null,
  questionList: [
    {
      id: 1,
      complaint: false,
      complaintDate: null,
      complaintLevel: '',
      complaintName: '',
      correctiveAction: '',
      description: '',
      evaluateQuestionId: null,
      note: '',
      personInCharge: {},
      picRole: '',
      point: '',
      preventiveAction: '',
      questionId: '',
      resolveDate: null,
      resolveDeadline: null,
      rootCause: '',
      bonusPenalty: '',
    },
  ],
}

const ModalBonusAndPenaltyEvaluation = ({
  onClose,
  updateSuccess,
  evaluateSuccess,
  evaluateMonthMMYYYY,
  mode,
  setMode,
}: ModalBonusAndPenaltyEvaluationProps) => {
  const classes = useStyles()
  const params = useParams()
  const randomId = uuid()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)
  const { t: i18Common } = useTranslation(LangConstant.NS_COMMON)
  const { generalInfo, nameCustomerComplaintProject } =
    useSelector(projectSelector)

  const { bonusAndPenaltyValidation } = useKPIValidation({
    nameCustomerComplaintProject,
  })

  const {
    values,
    errors,
    touched,
    setFieldValue,
    setErrors,
    setTouched,
    handleSubmit,
  } = useFormik({
    initialValues: { ...initValues },
    validationSchema: bonusAndPenaltyValidation,
    onSubmit: () => {
      if (mode === 'evaluate') {
        createEvaluateProject()
      } else if (mode === 'edit') {
        updateEvaluateProject()
      }
    },
  })

  const [evaluateId, setEvaluateId] = useState(0)

  const totalPoint = useMemo(() => {
    let total = 0
    values.questionList.forEach(question => {
      total += +question.point
    })
    return total
  }, [values.questionList])

  const questionIds = useMemo(() => {
    return (
      (values.questionList?.map(item => item.questionId)?.filter(id => !!id) as
        | number[]
        | string[]) || []
    )
  }, [values.questionList])

  const payload = useMemo(() => {
    return {
      projectId: params.projectId as string,
      evaluateId,
      requestBody: {
        evaluationMonth: values.evaluationMonth?.getTime() as number,
        totalPoint,
        question: values.questionList.map(question => ({
          complaint: question.complaint,
          complaintDate: question.complaintDate?.getTime() || null,
          complaintLevel: question.complaintLevel,
          complaintName: question.complaintName,
          correctiveAction: question.correctiveAction,
          description: question.description,
          evaluateQuestionId: question.evaluateQuestionId || null,
          note: question.note,
          personInCharge: question.personInCharge?.id || null,
          picRole: question.picRole,
          point: question.point,
          preventiveAction: question.preventiveAction,
          questionId: question.questionId,
          resolveDate: question.resolveDate?.getTime() || null,
          resolveDeadline: question.resolveDeadline?.getTime() || null,
          rootCause: question.rootCause,
        })),
      },
    }
  }, [params, values])

  const createEvaluateProject = () => {
    dispatch(updateLoading(true))
    ProjectService.createEvaluateProject(payload)
      .then(() => {
        dispatch(
          alertSuccess({
            message: i18Project('MSG_CREATE_EVALUATE_PROJECT_SUCCESS', {
              date: formatDate(values.evaluationMonth as Date, 'MM/YYYY'),
            }),
          })
        )
        onClose()
        evaluateSuccess()
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  const updateEvaluateProject = () => {
    dispatch(updateLoading(true))
    ProjectService.updateEvaluateProject(payload)
      .then(() => {
        dispatch(
          alertSuccess({
            message: `${i18Project('TXT_EVALUATION_MONTH')}: ${i18(
              'MSG_UPDATE_SUCCESS',
              {
                labelName: moment(values.evaluationMonth).format('MM/YYYY'),
              }
            )}`,
          })
        )
        onClose()
        updateSuccess()
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  const onEvaluationMonthChange = (value: Date | null) => {
    setFieldValue('evaluationMonth', value)
    getDetail(value)
  }

  const getDetail = (date: Date | null) => {
    dispatch(updateLoading(true))
    const payload = {
      projectId: params.projectId as string,
      month: (date?.getMonth() as number) + 1,
      year: date?.getFullYear() as number,
    }
    ProjectService.getDetailEvaluationMonth(payload)
      .then(({ data }: AxiosResponse) => {
        if (data?.evaluateQuestion?.length) {
          fillDetail(data.evaluateQuestion)
          setEvaluateId(data.id)
          setMode('edit')
        } else {
          setMode('evaluate')
          setTouched({})
          setErrors({})
        }
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  const onDeleteQuestion = (index: number) => {
    const newQuestionList = [...values.questionList]
    newQuestionList.splice(index, 1)
    setFieldValue('questionList', newQuestionList)
  }

  const changeFormBonusPenaltyItem = (payload: {
    field: string
    value: any
    index: number
  }) => {
    const { field, value, index } = payload
    setFieldValue(`questionList[${index}].${field}`, value)
  }

  const addNewBonusPenalty = () => {
    const newQuestionItem = {
      ...initValues.questionList[0],
      id: randomId,
      personInCharge: {},
    }
    setFieldValue('questionList', [...values.questionList, newQuestionItem])
  }

  const fillDetail = (evaluateQuestion: any) => {
    const questionList = evaluateQuestion.map((item: any) => ({
      id: item.id,
      complaint: item.complaint,
      complaintDate: item.complaintDate ? new Date(item.complaintDate) : null,
      complaintLevel: item.complaintLevel || '',
      complaintName: item.complaintName,
      correctiveAction: item.correctiveAction,
      description: item.description,
      evaluateQuestionId: item.id,
      note: item.note || '',
      personInCharge: item.personInCharge
        ? {
            ...item.personInCharge,
            id: +item.personInCharge.id,
            value: +item.personInCharge.id,
            label: `${item.personInCharge.code} - ${item.personInCharge.name}`,
          }
        : {},
      picRole: item.picRole,
      point: item.point,
      preventiveAction: item.preventiveAction,
      questionId: item.question.id,
      resolveDate: item.resolveDate ? new Date(item.resolveDate) : null,
      resolveDeadline: item.resolveDeadline
        ? new Date(item.resolveDeadline)
        : null,
      rootCause: item.rootCause,
      bonusPenalty: item.questionType.id,
    }))
    setFieldValue('questionList', questionList)
  }

  const onSubmit = () => {
    handleSubmit()
    setTimeout(() => {
      scrollToFirstErrorMessage()
    })
  }

  useEffect(() => {
    dispatch(getMasterQuestionProject())
  }, [])

  useEffect(() => {
    if (evaluateMonthMMYYYY && mode === 'edit') {
      const month = evaluateMonthMMYYYY.split('/')[0]
      const year = evaluateMonthMMYYYY.split('/')[1]
      const evaluationMonthDate = new Date(`${month}/01/${year}`)
      setFieldValue('evaluationMonth', evaluationMonthDate)
      getDetail(evaluationMonthDate)
    }
  }, [evaluateMonthMMYYYY])

  return (
    <Modal
      open
      width={1100}
      title={i18Project('TXT_BONUS_AND_PENALTY_EVALUATION')}
      onClose={onClose}
      onSubmit={onSubmit}
    >
      <Box className={classes.body}>
        <Box className={classes.evaluationMonthAndPoint}>
          <InputDatepicker
            readOnly
            required
            width={160}
            minDate={generalInfo.startDate}
            maxDate={generalInfo.endDate}
            isShowClearIcon={false}
            placeholder={i18Common('PLH_SELECT_MONTH') as string}
            inputFormat="MM/YYYY"
            openTo="month"
            views={['year', 'month']}
            label={i18Project('TXT_EVALUATION_MONTH')}
            error={!!errors.evaluationMonth && touched.evaluationMonth}
            errorMessage={errors.evaluationMonth}
            value={values.evaluationMonth}
            onChange={onEvaluationMonthChange}
          />
          <FormItem label={i18Project('TXT_TOTAL_POINT')}>
            <Box
              className={classes.pointValue}
              sx={{
                color: getColorPoint(totalPoint),
              }}
            >
              {totalPoint.toFixed(2)}
            </Box>
          </FormItem>
        </Box>
        <Box className={classes.questions}>
          {values.questionList.map((question, index) => (
            <Box className={classes.boxQuestionItem} key={question.id}>
              <Box className={classes.questionIndex}>{`${i18Project(
                'TXT_BONUS_PENALTY'
              )} #${index + 1}`}</Box>
              {values.questionList.length > 1 && (
                <Box className={classes.boxDeleteIcon}>
                  <DeleteIcon onClick={() => onDeleteQuestion(index)} />
                </Box>
              )}
              <FormBonusPenaltyItem
                evaluationMonth={values.evaluationMonth}
                questionIds={questionIds}
                bonusAndPenaltyItem={question}
                errors={errors.questionList?.[index]}
                touched={touched.questionList?.[index]}
                onChange={(field: string, value: any) =>
                  changeFormBonusPenaltyItem({
                    index,
                    value,
                    field,
                  })
                }
              />
            </Box>
          ))}
        </Box>
        <FormLayout top={16}>
          <ButtonAddPlus
            disabled={
              !!values.questionList[values.questionList.length - 1]
                ?.complaint &&
              !values.questionList[values.questionList.length - 1]
                ?.personInCharge?.id
            }
            label={i18Project('TXT_ADD_NEW_BONUS_PENALTY')}
            onClick={addNewBonusPenalty}
          />
        </FormLayout>
      </Box>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  body: {},
  evaluationMonthAndPoint: {
    display: 'flex',
    gap: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  pointValue: {
    background: theme.color.grey.secondary,
    width: 'max-content',
    padding: theme.spacing(1.1, 3),
    borderRadius: '4px',
    fontWeight: 700,
  },
  questions: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  boxQuestionItem: {
    position: 'relative',
    border: `1px solid ${theme.color.grey.secondary}`,
    padding: theme.spacing(3, 2, 2, 2),
    borderRadius: '4px',
  },
  questionIndex: {
    color: theme.color.blue.primary,
    fontWeight: 700,
    position: 'absolute',
    top: '-10px',
    left: '8px',
    background: '#fff',
    padding: theme.spacing(0, 1),
  },
  boxDeleteIcon: {
    position: 'absolute',
    right: '5px',
    top: theme.spacing(1),
  },
}))

export default ModalBonusAndPenaltyEvaluation

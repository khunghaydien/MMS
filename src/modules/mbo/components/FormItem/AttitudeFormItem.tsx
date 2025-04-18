import CardForm from '@/components/Form/CardForm'
import { LangConstant } from '@/const'
import { OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RowEvaluationCriteria, TypeOfWork } from '../../models'
import FormEvaluationComments from '../FormEvaluationComments'
import SelectEmployees from '../SelectEmployees'
import TableEvaluationCriteria from '../TableEvaluationCriteria'
const ATTITUDE_TYPE = 3
interface AttitudeFormItem {
  defaultAppraiser?: string | number | undefined
  task: any
  errors: any
  touched: any
  appraisersList: OptionItem[]
  typeOfWorkList: TypeOfWork[]
  setFieldValue: (keyName: string, value: any) => void
  isAddEvaluation: boolean
}

const AttitudeFormItem = ({
  defaultAppraiser,
  task,
  errors,
  touched,
  setFieldValue,
  appraisersList,
  typeOfWorkList,
  isAddEvaluation,
}: AttitudeFormItem) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)

  const [evaluationCriteriaRows, setEvaluationCriteriaRows] = useState<
    RowEvaluationCriteria[]
  >([])

  const formEvaluationCommentsRef = useRef<any>(null)

  const typeOfWork = typeOfWorkList.find(
    (item: TypeOfWork) => item.type.id == ATTITUDE_TYPE
  )

  useEffect(() => {
    if (isAddEvaluation) {
      setFieldValue(`appraiserId`, defaultAppraiser)
    }
  }, [defaultAppraiser])

  const levelValues = useMemo(() => {
    return typeOfWork?.criteria?.map(
      (_: any, index: number) =>
        task.taskEvaluationDetails?.[index]?.criteriaDetailId?.toString() || ''
    )
  }, [typeOfWork, task.taskEvaluationDetails])

  const everyComment = useMemo(() => {
    return typeOfWork?.criteria?.map((item: any, index: number) => ({
      id: item.id.toString(),
      value: item.id.toString(),
      label: item.name,
      note: task.taskEvaluationDetails?.[index]?.comment || '',
    }))
  }, [typeOfWork, task.taskEvaluationDetails])

  const commentError = useMemo(() => {
    if (task.commentType === '1') {
      return !!errors?.comment && touched?.comment
    } else {
      return (
        !!errors?.taskEvaluationDetails?.some(
          (taskEvalError: any) => !!taskEvalError?.comment
        ) && touched?.comment
      )
    }
  }, [task, errors, touched])

  const commentErrorMessage = useMemo(() => {
    if (task.commentType === '1') {
      return errors?.comment
    } else {
      const err = errors?.taskEvaluationDetails?.find(
        (taskEvalError: any) => !!taskEvalError?.comment
      )
      return err?.comment
    }
  }, [task, errors])

  const handleLevelValuesChange = (value: any) => {
    const _taskEvaluationDetails = task.taskEvaluationDetails?.map(
      (item: any, index: number) => ({
        criteriaDetailId: value[index],
        comment: item.comment,
      })
    )
    setFieldValue(`taskEvaluationDetails`, _taskEvaluationDetails)
  }

  const handleEveryCommentChange = (newEveryComments: OptionItem[]) => {
    const _taskEvaluationDetails = task.taskEvaluationDetails?.map(
      (item: any, index: number) => ({
        criteriaDetailId: item.criteriaDetailId,
        comment: newEveryComments[index].note,
        commentType: item.commentType,
      })
    )
    setFieldValue(`taskEvaluationDetails`, _taskEvaluationDetails)
  }

  const fillCriteriaByWorkType = () => {
    setFieldValue('criteriaGroupId', typeOfWork?.id || '')
    const evaluationCriteriaRows =
      typeOfWork?.criteria?.map((item: any) => ({
        id: item.id,
        name: item.name,
        weight: item.weight,
        levelListOptions: item.criteriaDetail.map((item: any) => ({
          id: item.id.toString(),
          value: item.id.toString(),
          label: item.score.toString(),
          note: item.content,
        })),
      })) || []
    setEvaluationCriteriaRows(evaluationCriteriaRows)
  }

  useEffect(() => {
    fillCriteriaByWorkType()
  }, [])

  useEffect(() => {
    if (!task.taskEvaluationDetails?.length) {
      setFieldValue(
        `taskEvaluationDetails`,
        typeOfWork?.criteria.map(() => ({ criteriaDetailId: '', comment: '' }))
      )
    }
  }, [task.taskEvaluationDetails, typeOfWork])

  return (
    <CardForm title={i18Mbo('LB_ATTITUDE_EVALUATION')}>
      <Box className={classes.evaluationForm}>
        <SelectEmployees
          value={task.appraiserId}
          error={errors.appraiserId}
          appraisers={appraisersList}
          touched={touched.appraiserId}
          setFieldValue={value => setFieldValue(`appraiserId`, value)}
          projectId={task.projectId}
        />
        <Box className={classes.tableEvaluation}>
          <TableEvaluationCriteria
            currentTaskEvaluationDetails={[]}
            rows={evaluationCriteriaRows}
            setLevelValues={handleLevelValuesChange}
            levelValues={levelValues || []}
            error={
              !!errors?.taskEvaluationDetails &&
              Array.isArray(errors?.taskEvaluationDetails) &&
              errors?.taskEvaluationDetails?.filter(
                (item: any) => !!item?.criteriaDetailId
              )?.length > 0 &&
              touched?.taskEvaluationDetails
            }
            required={true}
            errorMessage={
              i18('MSG_SELECT_REQUIRE', {
                name: i18('LB_SCORE'),
              }) || ''
            }
          />
        </Box>
        <Box className={classes.tableEvaluation}>
          <FormEvaluationComments
            error={commentError}
            errorMessage={commentErrorMessage}
            onChangeType={(type: string) => setFieldValue('commentType', type)}
            isDetail={false}
            ref={formEvaluationCommentsRef}
            generalComment={task.comment}
            everyComments={everyComment || []}
            onGeneralCommentChange={(value: string) =>
              setFieldValue('comment', value)
            }
            onEveryCommentsChange={handleEveryCommentChange}
          />
        </Box>
      </Box>
    </CardForm>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  evaluationForm: {
    display: 'grid',
    gap: theme.spacing(3),
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
  },
  tableEvaluation: {
    gridColumn: 'span 5',
  },
}))
export default AttitudeFormItem

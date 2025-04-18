import CardForm from '@/components/Form/CardForm'
import { LangConstant } from '@/const'
import { getStaffAssignEvaluationCycle } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { IEmployee, OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AxiosRequestConfig } from 'axios'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import CycleListAppraisees from '../../components/CycleListAppraisees'
import CycleListEmployee from '../../components/CycleListEmployee'
import { CycleState, cycleSelector, setPayloadCycle } from '../../reducer/cycle'

interface IProps {
  cycleSelectAppraiseesRequire?: boolean
  cycleCycleAppraiseesList?: IEmployee[]
  formikErrors?: any
  formikTouched?: any
}

const CycleSelectAppraisees = ({
  cycleSelectAppraiseesRequire = true,
  cycleCycleAppraiseesList = [],
  formikErrors = () => {},
  formikTouched = () => {},
}: IProps) => {
  const classes = useStyles()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)

  const [listAppraisees, setListAppraisees] = useState<IEmployee[]>([])
  const [listEmployees, setListEmployees] = useState<IEmployee[]>([])
  const [listEmployeesAll, setListEmployeesAll] = useState<IEmployee[]>([])
  const [loading, setLoading] = useState(false)
  const { payloadCycle }: CycleState = useSelector(cycleSelector)
  const [queries, setQueries] = useState({
    name: '',
    positionId: '',
  })

  const convertIEmployee = (value: OptionItem) => ({
    id: value.id,
    name: value?.name,
    position: value?.positionName || '...',
    employeeId: value?.code,
    email: value?.email,
  })

  useEffect(() => {
    if (payloadCycle.evaluationCycleTemplateId) {
      setLoading(true)
      dispatch(
        getStaffAssignEvaluationCycle({
          templateId: payloadCycle.evaluationCycleTemplateId,
          ...queries,
        })
      )
        .unwrap()
        .then((res: AxiosRequestConfig) => {
          setListEmployeesAll(res?.data.map(convertIEmployee))
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [queries, payloadCycle.evaluationCycleTemplateId])

  useEffect(() => {
    const listEmployeesIgnore = listAppraisees.map(item => item.id)
    const _listEmployees = listEmployeesAll.filter(
      (item: any) => !listEmployeesIgnore.includes(item.id)
    )
    setListEmployees(_listEmployees)
  }, [listEmployeesAll])

  useEffect(() => {
    const setData = () => {
      if (cycleCycleAppraiseesList.length) {
        setListAppraisees(cycleCycleAppraiseesList)
      } else {
        setListAppraisees([])
      }
      setListEmployees([])
      dispatch(
        setPayloadCycle({
          ...payloadCycle,
          appraisees: [],
        })
      )
    }
    setData()
  }, [payloadCycle.evaluationCycleTemplateId])

  useEffect(() => {
    dispatch(
      setPayloadCycle({
        ...payloadCycle,
        appraisees: listAppraisees.map(item => item.id),
      })
    )
  }, [listAppraisees])

  useEffect(() => {
    const dispatchPayloadCycle = () => {
      dispatch(
        setPayloadCycle({
          ...payloadCycle,
          evaluationCycleTemplateId: params.cycleId,
        })
      )
    }

    dispatchPayloadCycle()
  }, [])

  return (
    <CardForm title={i18Mbo('LB_APPRAISEES')}>
      <Box className={classes.rootAppraisees}>
        <CycleListEmployee
          setListAppraisees={setListAppraisees}
          setListEmployees={setListEmployees}
          setQueries={setQueries}
          queries={queries}
          listAppraisees={listAppraisees}
          listEmployees={listEmployees}
          loading={loading}
        />
        <CycleListAppraisees
          setListAppraisees={setListAppraisees}
          listAppraisees={listAppraisees}
          setListEmployees={setListEmployees}
          listEmployees={listEmployees}
          required={cycleSelectAppraiseesRequire}
          error={!!formikErrors.appraisees && !!formikTouched.appraisees}
          errorMessage={formikErrors.appraisees}
        />
      </Box>
    </CardForm>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootAppraisees: {
    display: 'flex',
  },
}))

export default CycleSelectAppraisees

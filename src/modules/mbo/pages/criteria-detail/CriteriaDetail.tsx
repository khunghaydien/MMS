import CommonButton from '@/components/buttons/CommonButton'
import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import DialogBox from '@/components/modal/DialogBox'
import { LangConstant, PathConstant } from '@/const'
import { useCallbackPrompt } from '@/hooks/useCallbackPrompt'
import { AppDispatch } from '@/store'
import { OptionItem } from '@/types'
import { scrollToFirstErrorMessage } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { MAX_LENGTH_OPEN_DATA } from '../../const'
import {
  criteriaGroupValidation,
  criteriaListValidation,
  initCriteriaRequests,
  initialCriteriaGroupInformation,
} from '../../formik/criteriaFormik'
import {
  CriteriaRequest,
  ICriteriaGroupDataForm,
  ICriteriaGroupInformation,
} from '../../models'
import {
  createCriteriaGroup as createCriteriaGroupAction,
  getCriteriaGroupDetail,
} from '../../reducer/criteria'
import CriteriaGroupInformation from './CriteriaGroupInformation'
import CriteriaHashTag from './CriteriaHashTag'

interface CriteriaDetailProps {
  isDetailPage: boolean
}

const CriteriaDetail = ({ isDetailPage }: CriteriaDetailProps) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const params = useParams()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)

  const [isLoading, setIsLoading] = useState(false)
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [criteriaGroupDraft, setCriteriaGroupDraft] = useState(
    initialCriteriaGroupInformation
  )
  const [criteriaListDraft, setCriteriaListDraft] = useState({
    criteria: initCriteriaRequests,
  })
  const [countSubmit, setCountSubmit] = useState(0)
  const [indexListOpenData, setIndexListOpenData] = useState<number[]>([])
  const [getDetailCounter, setGetDetailCounter] = useState(0)

  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(showDialog)

  const criteriaGroupFormik = useFormik({
    initialValues: initialCriteriaGroupInformation,
    validationSchema: criteriaGroupValidation,
    onSubmit: () => {},
  })

  const criteriaListFormik = useFormik({
    initialValues: { criteria: initCriteriaRequests },
    validationSchema: criteriaListValidation,
    onSubmit: values => {
      if (!isDetailPage && !Object.keys(criteriaGroupFormik.errors).length) {
        createCriteriaGroup({ ...criteriaGroupFormik.values, ...values })
      }
    },
  })

  const formHasChanged = useMemo(() => {
    const formikValues = { ...criteriaGroupFormik.values }
    const _criteriaGroupDraft = { ...criteriaGroupDraft }
    delete formikValues.isAllPosition
    delete _criteriaGroupDraft.isAllPosition
    return (
      JSON.stringify(formikValues) !== JSON.stringify(_criteriaGroupDraft) ||
      JSON.stringify(
        criteriaListFormik.values.criteria?.map((item, index) => ({
          ...item,
          id: index,
        }))
      ) !==
        JSON.stringify(
          criteriaListDraft.criteria?.map((item, index) => ({
            ...item,
            id: index,
          }))
        )
    )
  }, [
    criteriaGroupFormik.values,
    criteriaGroupDraft,
    criteriaListFormik.values,
    criteriaListDraft,
  ])

  const createCriteriaGroup = (valuesForm: ICriteriaGroupDataForm) => {
    const isAllPosition = valuesForm.positionApplied[0].id === '*'
    const positionApplied = isAllPosition
      ? []
      : valuesForm.positionApplied.map((ps: any) => ps.id)
    const requestBody: ICriteriaGroupDataForm = {
      ...valuesForm,
      positionApplied,
      isAllPosition,
    }
    dispatch(createCriteriaGroupAction(requestBody))
      .unwrap()
      .then(() => {
        handleNavigateToListPage()
        if (typeof confirmNavigation === 'function') {
          confirmNavigation()
        }
      })
  }

  const handleSubmit = () => {
    setCountSubmit(countSubmit + 1)
    criteriaGroupFormik.handleSubmit()
    criteriaListFormik.handleSubmit()
    setTimeout(() => {
      scrollToFirstErrorMessage()
    })
  }

  const fillCriteriaGroupDetail = (
    criteriaGroup: ICriteriaGroupDataForm,
    isOnlyCriteriaList: boolean
  ) => {
    const criteriaGroupInformation: ICriteriaGroupInformation = {
      name: criteriaGroup?.name,
      type: criteriaGroup?.type?.id,
      description: criteriaGroup?.description || '',
      positionApplied: criteriaGroup?.positionApplied?.map(
        (ps: OptionItem) => ({
          id: ps.id,
          value: ps.id,
          label: ps.name,
        })
      ) || [
        {
          id: '*',
          value: '*',
          label: i18('LB_ALL_POSITION'),
        },
      ],
      isAllPosition: criteriaGroup?.isAllPosition,
    }
    if (!isOnlyCriteriaList) {
      setCriteriaGroupDraft(criteriaGroupInformation)
      criteriaGroupFormik.setValues(criteriaGroupInformation)
      criteriaGroupFormik.setTouched({})
    }
    setCriteriaListDraft({
      criteria: criteriaGroup?.criteria,
    })
    criteriaListFormik.setValues({
      criteria: criteriaGroup?.criteria,
    })
    criteriaListFormik.setTouched({})
    if (isDetailPage && !getDetailCounter) {
      setIndexListOpenData(
        criteriaGroup?.criteria?.length < MAX_LENGTH_OPEN_DATA
          ? criteriaGroup?.criteria?.map((_: any, index: number) => index)
          : []
      )
      setGetDetailCounter(counter => counter + 1)
    }
    setIsLoading(false)
  }

  const getCriteriaGroupDetailFromServices = async (
    blockLoading?: boolean | undefined
  ) => {
    if (!blockLoading) setIsLoading(true)
    dispatch(getCriteriaGroupDetail(params.criteriaGroupId))
      .unwrap()
      .then(res => {
        fillCriteriaGroupDetail(res, !!blockLoading)
      })
      .catch(field => {
        if (field === 'criteriaGroupId') {
          handleNavigateToListPage()
        }
        setIsLoading(false)
      })
  }

  const handleNavigateToListPage = () => {
    navigate(PathConstant.MBO_CRITERIA_LIST)
  }

  const handleSetCriteriaListDraft = (
    newCriteriaListDraft: CriteriaRequest[]
  ) => {
    setCriteriaListDraft({ criteria: newCriteriaListDraft })
  }

  const handleSetCriteriaGroupDraft = (payload: {
    name: string
    type: string
    positionApplied: any
    description: string
  }) => {
    setCriteriaGroupDraft(payload)
  }

  useEffect(() => {
    if (isDetailPage) {
      getCriteriaGroupDetailFromServices()
    }
  }, [])

  useEffect(() => {
    setShowDialog(formHasChanged)
  }, [formHasChanged])

  return (
    <Fragment>
      <DialogBox
        // @ts-ignore
        showDialog={showPrompt}
        confirmNavigation={confirmNavigation}
        cancelNavigation={cancelNavigation}
      />
      <CommonScreenLayout
        useBackPage
        backLabel={i18Mbo('TXT_BACK_TO_CRITERIA_LIST')}
        onBack={handleNavigateToListPage}
      >
        <CriteriaGroupInformation
          criteriaGroup={criteriaGroupFormik}
          criteriaGroupDraft={criteriaGroupDraft}
          isLoading={isLoading}
          isDetailPage={isDetailPage}
          onSetCriteriaGroupDraft={handleSetCriteriaGroupDraft}
          confirmNavigation={confirmNavigation}
        />
        <CriteriaHashTag
          indexListOpenData={indexListOpenData}
          setIndexListOpenData={setIndexListOpenData}
          countSubmit={countSubmit}
          isLoading={isLoading}
          isDetailPage={isDetailPage}
          criteriaList={criteriaListFormik}
          criteriaListDraft={criteriaListDraft}
          onSetCriteriaListDraft={handleSetCriteriaListDraft}
          onReGetCriteriaGroup={getCriteriaGroupDetailFromServices}
        />
        {!isDetailPage && (
          <Box className={classes.footerActions}>
            <CommonButton onClick={handleSubmit}>
              {i18('LB_SUBMIT')}
            </CommonButton>
          </Box>
        )}
      </CommonScreenLayout>
    </Fragment>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  footerActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(3),
  },
}))

export default CriteriaDetail

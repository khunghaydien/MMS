import CardForm from '@/components/Form/CardForm'
import ButtonAddPlus from '@/components/buttons/ButtonAddPlus'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import { LangConstant } from '@/const'
import { CHANGE_TIME_DELAY } from '@/const/app.const'
import { alertSuccess } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { uuid } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import {
  Dispatch,
  Fragment,
  SetStateAction,
  memo,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import CriteriaRequestItem from '../../components/CriteriaRequestItem'
import { MAX_CRITERIA_REQUESTS } from '../../const'
import {
  initCriteriaRequestItem,
  initCriteriaRequests,
} from '../../formik/criteriaFormik'
import { CriteriaRequest } from '../../models'
import { deleteHashCriteria } from '../../reducer/criteria'

interface CriteriaHashTagProps {
  isDetailPage: boolean
  isLoading: boolean
  criteriaList: any
  countSubmit: number
  criteriaListDraft: { criteria: typeof initCriteriaRequests }
  onSetCriteriaListDraft: (criteriaListDraft: CriteriaRequest[]) => void
  onReGetCriteriaGroup: (blockLoading?: boolean | undefined) => void
  indexListOpenData: number[]
  setIndexListOpenData: Dispatch<SetStateAction<number[]>>
}

const CriteriaHashTag = ({
  isDetailPage,
  criteriaList,
  criteriaListDraft,
  isLoading,
  onSetCriteriaListDraft,
  onReGetCriteriaGroup,
  countSubmit,
  indexListOpenData,
  setIndexListOpenData,
}: CriteriaHashTagProps) => {
  const classes = useStyles()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(LangConstant.NS_MBO)

  const { values, setFieldValue, setTouched, setErrors } = criteriaList

  const changeTimeout = useRef<NodeJS.Timeout | null>(null)

  const [buttonAddDisabled, setButtonAddDisabled] = useState(false)
  const [isOpenModalDeleteCriteria, setIsOpenModalDeleteCriteria] =
    useState(false)
  const [criteriaNameSelected, setCriteriaNameSelected] = useState('')
  const [criteriaIndexSelected, setCriteriaIndexSelected] = useState(0)
  const [hashCriteriaIdSelected, setHashCriteriaIdSelected] = useState(0)

  const handleAddNewCriteria = () => {
    const ids = values.criteria.map(
      (criteriaRequest: CriteriaRequest) => criteriaRequest.id
    )
    const id = Math.max(...ids) + uuid()
    const newCriteriaRequest = {
      ...initCriteriaRequestItem,
      id,
      draft: true,
    }
    setFieldValue('criteria', [...values.criteria, newCriteriaRequest])
  }

  const handleCriteriaRequestChange = (
    newCriteriaRequest: CriteriaRequest,
    index: number
  ) => {
    const newCriteriaRequests = [...values.criteria]
    newCriteriaRequests[index] = newCriteriaRequest
    setFieldValue('criteria', newCriteriaRequests)
  }

  const handleTriggerChange = () => {
    if (changeTimeout.current) {
      clearTimeout(changeTimeout.current)
    }
    setButtonAddDisabled(true)
    changeTimeout.current = setTimeout(() => {
      setButtonAddDisabled(false)
    }, CHANGE_TIME_DELAY + 1)
  }

  const deleteCriteriaByIndex = (index: number) => {
    const newCriteriaRequests = [...values.criteria]
    newCriteriaRequests.splice(index, 1)
    setFieldValue('criteria', newCriteriaRequests)
    setTouched({})
    setErrors({})
    dispatch(
      alertSuccess({
        message: i18('MSG_DELETE_SUCCESS', {
          labelName: `${i18Mbo('LB_CRITERIA')} #${index + 1}${
            values.criteria[index].name
              ? `: ${values.criteria[index].name}`
              : ''
          }`,
        }),
      })
    )
  }

  const handleDeleteIconClick = (
    criteriaRequestItem: CriteriaRequest,
    index: number
  ) => {
    const useModal =
      !!criteriaRequestItem.name ||
      !!criteriaRequestItem.description ||
      !!criteriaRequestItem.criteriaDetail.some(
        criteriaDetailRequest => !!criteriaDetailRequest.content
      )
    if (useModal) {
      setIsOpenModalDeleteCriteria(true)
      setCriteriaNameSelected(criteriaRequestItem.name)
      setCriteriaIndexSelected(index)
      setHashCriteriaIdSelected(criteriaRequestItem.id)
    } else {
      deleteCriteriaByIndex(index)
    }
  }

  const handleDeleteCriteria = () => {
    const indexById = criteriaListDraft.criteria.findIndex(
      (criteriaRequest: CriteriaRequest) =>
        criteriaRequest.id === hashCriteriaIdSelected
    )
    if (isDetailPage && indexById !== -1) {
      dispatch(
        deleteHashCriteria({
          alertName: `${i18Mbo('LB_CRITERIA')} #${
            indexById + 1
          }: ${criteriaNameSelected}`,
          criteriaGroupId: params.criteriaGroupId,
          hashCriteriaId: hashCriteriaIdSelected,
        })
      )
        .unwrap()
        .then(() => {
          deleteCriteriaByIndex(criteriaIndexSelected)
          const newCriteriaListDraft = [...criteriaListDraft.criteria]
          newCriteriaListDraft.splice(criteriaIndexSelected, 1)
          onSetCriteriaListDraft(newCriteriaListDraft)
        })
    } else {
      deleteCriteriaByIndex(criteriaIndexSelected)
    }
  }

  const handleSetCriteriaListDraft = (criteriaListDraft: CriteriaRequest[]) => {
    onSetCriteriaListDraft(criteriaListDraft)
  }

  return (
    <Fragment>
      {isOpenModalDeleteCriteria && (
        <ModalDeleteRecords
          open
          titleMessage={i18Mbo('TXT_DELETE_CRITERIA')}
          subMessage={i18('MSG_CONFIRM_DELETE_DESCRIPTION', {
            labelName: `${i18Mbo('LB_CRITERIA')} #${
              criteriaIndexSelected + 1
            }: ${criteriaNameSelected}`,
          })}
          onClose={() => setIsOpenModalDeleteCriteria(false)}
          onSubmit={handleDeleteCriteria}
        />
      )}
      <CardForm
        title={i18Mbo('TXT_CONFIG_SELECTION_CRITERIA')}
        isLoading={isLoading}
      >
        <Box className={classes.criteriaList}>
          {values.criteria.map(
            (criteriaRequest: CriteriaRequest, index: number) => (
              <CriteriaRequestItem
                openData={indexListOpenData.includes(index)}
                countSubmit={countSubmit}
                criteriaListDraft={criteriaListDraft}
                criteriaRequestDraft={
                  !!criteriaListDraft.criteria &&
                  criteriaListDraft.criteria.length
                    ? criteriaListDraft.criteria[index]
                    : {}
                }
                criteriaRequestItemCounter={values.criteria.length}
                key={criteriaRequest.id}
                index={index}
                criteriaRequest={criteriaRequest}
                onCriteriaRequestChange={handleCriteriaRequestChange}
                onFlagChange={handleTriggerChange}
                onDeleteIconClick={handleDeleteIconClick}
                onSetCriteriaListDraft={handleSetCriteriaListDraft}
                onReGetCriteriaGroup={onReGetCriteriaGroup}
                indexListOpenData={indexListOpenData}
                setIndexListOpenData={setIndexListOpenData}
              />
            )
          )}
        </Box>
        {((values.criteria.length < MAX_CRITERIA_REQUESTS &&
          !values.criteria[values.criteria.length - 1].draft &&
          isDetailPage) ||
          (!isDetailPage &&
            values.criteria.length < MAX_CRITERIA_REQUESTS)) && (
          <ButtonAddPlus
            disabled={buttonAddDisabled}
            className={classes.buttonAddPlusParent}
            label={i18Mbo('LB_ADD_A_NEW_CRITERIA')}
            onClick={handleAddNewCriteria}
          />
        )}
      </CardForm>
    </Fragment>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  criteriaList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  buttonAddPlusParent: {
    marginTop: `${theme.spacing(3)} !important`,
  },
}))

export default memo(CriteriaHashTag)

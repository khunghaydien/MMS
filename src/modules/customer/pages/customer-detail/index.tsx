import CommonButton from '@/components/buttons/CommonButton'
import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import DialogBox from '@/components/modal/DialogBox'
import ModalConfirm from '@/components/modal/ModalConfirm'
import { LangConstant, PathConstant } from '@/const'
import { useCallbackPrompt } from '@/hooks/useCallbackPrompt'
import { AuthState, selectAuth } from '@/reducer/auth'
import { AppDispatch } from '@/store'
import { scrollToFirstErrorMessage } from '@/utils'
import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getContractsByCustomerId,
  setListContractState,
} from '../../reducer/customer'
import CustomerContactInformation from './CustomerContactInformation'
import CustomerContractInformation from './CustomerContractInformation'
import CustomerGeneralInformation from './CustomerGeneralInformation'
import CustomerProjectInformation from './CustomerProjectInformation'
import useFetchCustomerDetail from './hooks/useFetchCustomerDetail'

const CustomerDetail = () => {
  const {
    contracts,
    projects,
    getCustomerDetailFromApi,
    customerFormik,
    isViewDetail,
    customerTemp,
    customer,
    contractsTemp,
    isShowModalConfirm,
    showDialog,
    setIsShowModalConfirm,
    setShowDialog,
    updateCustomerInfo,
  } = useFetchCustomerDetail()
  const { t: i18nCustomer } = useTranslation(LangConstant.NS_CUSTOMER)
  const { t: i18 } = useTranslation()

  const navigate = useNavigate()
  const params = useParams()
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()

  const { permissions }: AuthState = useSelector(selectAuth)
  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(showDialog)

  useEffect(() => {
    const customerId = params.customerId || ''
    if (customerId) {
      getCustomerDetailFromApi(customerId)
      dispatch(getContractsByCustomerId(customerId))
    }

    return () => {
      //reset list contract in redux store
      dispatch(setListContractState([]))
    }
  }, [])

  const isChangeData = useMemo(() => {
    return (
      JSON.stringify(customerFormik.values) != JSON.stringify(customerTemp) ||
      JSON.stringify(contracts) != JSON.stringify(contractsTemp)
    )
  }, [customerFormik.values, customerTemp, contracts, contractsTemp])

  const isButtonSubmitDisabled = useMemo(() => {
    if (!isViewDetail) return false
    return !isChangeData
  }, [isViewDetail, isChangeData])

  const handleBackPage = () => {
    navigate(PathConstant.CUSTOMER_LIST)
  }

  const handleClickSubmit = () => {
    setTimeout(() => {
      scrollToFirstErrorMessage()
    })
  }

  const handleUpdateCustomer = () => {
    updateCustomerInfo()
  }

  useEffect(() => {
    customerFormik.setValues(customer as any)
  }, [customer])

  useEffect(() => {
    setShowDialog(isChangeData)
  }, [isChangeData])

  return (
    <CommonScreenLayout
      useBackPage
      backLabel={i18nCustomer('LB_BACK_TO_CUSTOMER_LIST')}
      onBack={handleBackPage}
    >
      <DialogBox
        // @ts-ignore
        showDialog={showPrompt}
        confirmNavigation={confirmNavigation}
        cancelNavigation={cancelNavigation}
      />
      <form onSubmit={customerFormik.handleSubmit}>
        <Box className={classes.formWrapper}>
          <CustomerGeneralInformation
            customerFormik={customerFormik}
            isDetailPage={isViewDetail}
          />
          <CustomerContactInformation customerFormik={customerFormik} />
          {isViewDetail && (
            <CustomerContractInformation contracts={contracts} />
          )}
          {isViewDetail && <CustomerProjectInformation projects={projects} />}
          {!!permissions.useCustomerUpdate && (
            <Box className={clsx(classes.mt24, classes.customerDetailFlex)}>
              <CommonButton
                type="submit"
                height={40}
                width={96}
                disabled={isButtonSubmitDisabled}
                onClick={handleClickSubmit}
              >
                {i18(isViewDetail ? 'LB_UPDATE' : 'LB_SUBMIT')}
              </CommonButton>
            </Box>
          )}
        </Box>
      </form>
      <ModalConfirm
        title={i18('TXT_UPDATE_INFORMATION')}
        description={`Do you wish to update Customer ${customer.id}?`}
        open={isShowModalConfirm}
        onClose={() => setIsShowModalConfirm(false)}
        onSubmit={handleUpdateCustomer}
      />
    </CommonScreenLayout>
  )
}

const useStyles = makeStyles(() => ({
  formWrapper: {
    paddingBottom: 80,
  },
  mt24: {
    marginTop: 24,
  },
  customerDetailFlex: {
    display: 'flex',
    justifyContent: 'end',
  },
}))

export default CustomerDetail

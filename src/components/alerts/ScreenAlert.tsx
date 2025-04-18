import { AppConstant } from '@/const'
import { ScreenState, selectScreen, updateAlert } from '@/reducer/screen'
import { Fragment, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CommonAlert from './CommonAlert'

const ScreenAlert = () => {
  const dispatch = useDispatch()
  const showAlertTimeout = useRef<NodeJS.Timeout | null>(null)
  const { isShowAlert, alertInfo }: ScreenState = useSelector(selectScreen)

  const handleCloseAlert = () => {
    if (showAlertTimeout) {
      clearTimeout(showAlertTimeout.current as NodeJS.Timeout)
      showAlertTimeout.current = null
    }
    dispatch(updateAlert({ isShowAlert: false }))
  }

  useEffect(() => {
    if (isShowAlert) {
      if (showAlertTimeout.current) {
        clearTimeout(showAlertTimeout.current as NodeJS.Timeout)
        showAlertTimeout.current = null
      }
      showAlertTimeout.current = setTimeout(() => {
        handleCloseAlert()
      }, AppConstant.SNACK_BAR_DURATION)
    }
  }, [isShowAlert])

  return !!isShowAlert ? (
    <CommonAlert
      {...alertInfo}
      showAlertTimeout={showAlertTimeout}
      isAutoClose
      isShow={isShowAlert}
      onClose={handleCloseAlert}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    />
  ) : (
    <Fragment />
  )
}

export default ScreenAlert

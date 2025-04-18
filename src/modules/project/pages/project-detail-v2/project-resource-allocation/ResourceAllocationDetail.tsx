import CardFormSeeMore from '@/components/Form/CardFormSeeMore'
import CommonButton from '@/components/buttons/CommonButton'
import { LangConstant } from '@/const'
import ModalRequestOT from '@/modules/project/components/ModalRequestOT'
import { projectSelector } from '@/modules/project/reducer/project'
import { ProjectState } from '@/modules/project/types'
import { AuthState, selectAuth } from '@/reducer/auth'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import AllocationDetails from './AllocationDetails'
import BillableManMonth from './BillableManMonth'

const ResourceAllocationDetail = () => {
  const classes = useStyles()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)

  const { generalInfo, generalInfoFormik, viewHeadcountInfo }: ProjectState =
    useSelector(projectSelector)
  const { staff, role }: AuthState = useSelector(selectAuth)

  const [isRequestOT, setIsRequestOT] = useState<boolean>(false)
  const [openModalRequestOT, setOpenModalRequestOT] = useState<boolean>(false)

  const isDivisionDirector = useMemo(() => {
    const rolesDivisionDirector = ['Division Director']
    return role.some((roleItem: any) =>
      rolesDivisionDirector.includes(roleItem?.name)
    )
  }, [staff])

  useEffect(() => {
    if (generalInfo.projectManager.id?.toString()) {
      const isHasRightToCreateRequestOT =
        staff?.id.toString() === generalInfo.projectManager.id?.toString() ||
        isDivisionDirector
      setIsRequestOT(isHasRightToCreateRequestOT)
    }
  }, [generalInfo.projectManager, staff, isDivisionDirector])

  return (
    <Box className={classes.RootProjectResourceAllocationDetail}>
      {openModalRequestOT && (
        <ModalRequestOT
          open
          onCloseModal={() => setOpenModalRequestOT(false)}
          disabled={false}
          projectId={generalInfoFormik.id}
          startDate={generalInfoFormik.startDate}
          endDate={generalInfoFormik.endDate}
        />
      )}
      {isRequestOT && (
        <Box className={classes.requestOTBox}>
          <CommonButton onClick={() => setOpenModalRequestOT(prev => !prev)}>
            {i18Project('LB_REQUEST_OT')}
          </CommonButton>
        </Box>
      )}
      {!!viewHeadcountInfo && (
        <CardFormSeeMore
          hideSeeMore
          title={i18Project('TXT_BILLABLE_MAN_MONTH')}
        >
          <BillableManMonth />
        </CardFormSeeMore>
      )}
      <AllocationDetails />
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootProjectResourceAllocationDetail: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  tabBox: {
    display: 'flex',
    justifyContent: 'center',
  },
  tab: {
    width: 'max-content !important',
  },
  requestOTBox: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(2),
  },
}))

export default ResourceAllocationDetail

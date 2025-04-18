import DeleteIcon from '@/components/icons/DeleteIcon'
import { NS_MBO } from '@/const/lang.const'
import {
  AppRegistration,
  BorderColor,
  CheckBox,
  DisabledByDefault,
  ExitToApp,
  History,
  SaveAs,
} from '@mui/icons-material'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

interface ButtonHeaderActionsProps {
  disabledConfig?: {
    isSaveDisabled?: boolean
  }
  configs: {
    useButtonEdit?: boolean
    useButtonDelete?: boolean
    useButtonClear?: boolean
    useButtonRevert?: boolean
    useButtonReject?: boolean
    useButtonApprove?: boolean
    useButtonEvaluate?: boolean
    useButtonSave?: boolean
    useButtonCancel?: boolean
  }
  callback: {
    onClickSave?: () => void
    onClickEdit?: () => void
    onClickDelete?: () => void
    onClickClear?: () => void
    onClickRevert?: () => void
    onClickApprove?: () => void
    onClickEvaluate?: () => void
    onClickCancel?: () => void
    onClickReject?: () => void
  }
}

const ButtonHeaderActions = ({
  configs,
  callback,
  disabledConfig,
}: ButtonHeaderActionsProps) => {
  const { t: i18 } = useTranslation()
  const { t: i18Mbo } = useTranslation(NS_MBO)
  const classes = useStyles()

  const useButtonEdit = !!configs.useButtonEdit
  const useButtonDelete = !!configs.useButtonDelete
  const useButtonClear = !!configs.useButtonClear
  const useButtonRevert = !!configs.useButtonRevert
  const useButtonReject = !!configs.useButtonReject
  const useButtonApprove = !!configs.useButtonApprove
  const useButtonEvaluate = !!configs.useButtonEvaluate
  const useButtonSave = !!configs.useButtonSave
  const useButtonCancel = !!configs.useButtonCancel
  const isSaveDisabled = !!disabledConfig?.isSaveDisabled

  return (
    <Box className={classes.RootButtonHeaderActions}>
      {useButtonSave && (
        <Box
          className={clsx(classes.button, isSaveDisabled && 'disabled')}
          onClick={() =>
            !!callback.onClickSave && !isSaveDisabled && callback.onClickSave()
          }
        >
          <SaveAs />
          <Box className="label">{i18('LB_SAVE')}</Box>
        </Box>
      )}
      {useButtonApprove && (
        <Box
          className={classes.button}
          onClick={() => !!callback.onClickApprove && callback.onClickApprove()}
        >
          <CheckBox />
          <Box className="label">{i18Mbo('TXT_APPROVE')}</Box>
        </Box>
      )}
      {useButtonReject && (
        <Box
          className={classes.button}
          onClick={() => !!callback.onClickReject && callback.onClickReject()}
        >
          <DisabledByDefault />
          <Box className="label">{i18('LB_REJECT')}</Box>
        </Box>
      )}
      {useButtonEdit && (
        <Box
          className={classes.button}
          onClick={() => !!callback.onClickEdit && callback.onClickEdit()}
        >
          <BorderColor />
          <Box className="label">{i18('LB_EDIT')}</Box>
        </Box>
      )}
      {useButtonEvaluate && (
        <Box
          className={classes.button}
          onClick={() =>
            !!callback.onClickEvaluate && callback.onClickEvaluate()
          }
        >
          <AppRegistration />
          <Box className="label">{i18Mbo('LB_EVALUATE')}</Box>
        </Box>
      )}
      {useButtonDelete && (
        <Box
          className={classes.button}
          onClick={() => !!callback.onClickDelete && callback?.onClickDelete()}
        >
          <DeleteIcon />
          <Box className="label">{i18('LB_DELETE')}</Box>
        </Box>
      )}
      {useButtonClear && (
        <Box
          className={classes.button}
          onClick={() => !!callback.onClickClear && callback.onClickClear()}
        >
          <DisabledByDefault />
          <Box className="label">{i18('LB_CLEAR')}</Box>
        </Box>
      )}
      {useButtonRevert && (
        <Box
          className={classes.button}
          onClick={() => !!callback.onClickRevert && callback.onClickRevert()}
        >
          <History />
          <Box className="label">{i18('LB_REVERT')}</Box>
        </Box>
      )}
      {useButtonCancel && (
        <Box
          className={classes.button}
          onClick={() => !!callback.onClickCancel && callback.onClickCancel()}
        >
          <ExitToApp />
          <Box className="label">{i18('LB_CANCEL')}</Box>
        </Box>
      )}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  RootButtonHeaderActions: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  button: {
    cursor: 'pointer',
    padding: theme.spacing(0.5, 1),
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
    fontWeight: 700,
    color: theme.color.black.secondary,
    borderRadius: '50px',
    border: `1px solid ${theme.color.grey.secondary}`,
    '& .label': {
      fontSize: 15,
    },
    '& svg': {
      fontSize: 20,
    },
    '&:hover': {
      background: theme.color.blue.primary,
      borderColor: theme.color.blue.primary,
      '& *': {
        color: '#FFFFFF !important',
      },
    },
    '&.disabled': {
      cursor: 'not-allowed',
      background: theme.color.grey.secondary,
      borderColor: theme.color.grey.secondary,

      '&:hover': {
        background: theme.color.grey.secondary,
        borderColor: theme.color.grey.secondary,
        '& *': {
          color: `${theme.color.black.secondary} !important`,
        },
      },
    },
  },
}))

export default ButtonHeaderActions

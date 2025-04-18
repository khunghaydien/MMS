import { ErrorOutlineOutlined } from '@mui/icons-material'
import { Tooltip, TooltipProps, tooltipClasses } from '@mui/material'
import { styled } from '@mui/styles'
import Typography from './Typography'

const TooltipWithWarningIcon = (props: any) => {
  const CustomWidthTooltip = styled(({ className }: TooltipProps) => (
    <Tooltip
      classes={{ popper: className }}
      leaveDelay={200}
      title={
        <Typography styleProps={{ color: 'white' }}>{props.content}</Typography>
      }
    >
      {props.RootContainer ? (
        props.RootContainer
      ) : (
        <ErrorOutlineOutlined className="icon__waring" color="error" />
      )}
    </Tooltip>
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 350,
    },
  })

  return <CustomWidthTooltip {...props} />
}

export default TooltipWithWarningIcon

import { Box, TableBody, TableCell, TableRow } from '@mui/material'
import { ReactElement } from 'react'
import LoadingSkeleton from '../loading/LoadingSkeleton'

interface TableBodyLoadingProps {
  height?: string | number
  loading?: boolean
  children: ReactElement
}

const TaleBodyLoading = ({
  loading,
  children,
  height,
}: TableBodyLoadingProps) => {
  return loading ? (
    <TableBody>
      <TableRow>
        <TableCell colSpan={100}>
          <Box
            sx={{
              margin: -2,
              height,
            }}
          >
            <LoadingSkeleton height={height} />
          </Box>
        </TableCell>
      </TableRow>
    </TableBody>
  ) : (
    children
  )
}

export default TaleBodyLoading

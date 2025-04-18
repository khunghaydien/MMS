import ButtonTransition from '@/components/buttons/ButtonTransition'
import NoData from '@/components/common/NoData'
import InputSearch from '@/components/inputs/InputSearch'
import TableBodyLoading from '@/components/table/TableBodyLoading'
import { LangConstant } from '@/const'
import { INPUT_TIME_DELAY } from '@/const/app.const'
import { OptionItem } from '@/types'
import { cleanObject } from '@/utils'
import {
  Box,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import _ from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
interface IListStaffSideBar {
  staffSelected: OptionItem | undefined | null
  onSelectStaff: (staff: OptionItem | null) => void
  onChange: (page: any) => void
  loading: boolean
  loadingScroll: boolean
  loadingDailyReport: boolean
  listStaffs: OptionItem[]
  params: any
}

const ListStaffSideBar = ({
  staffSelected,
  onSelectStaff,
  loading,
  loadingDailyReport,
  listStaffs,
  onChange,
  params,
  loadingScroll,
}: IListStaffSideBar) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18nDailyReport } = useTranslation(LangConstant.NS_DAILY_REPORT)

  const [valueSearch, setValueSearch] = useState(params.keyword)
  const [openStaffList, setOpenStaffList] = useState(false)

  const debounceFn = useCallback(
    _.debounce(handleDebounceFn, INPUT_TIME_DELAY),
    [params]
  )

  function handleDebounceFn(keyword: string) {
    onChange({ ...params, keyword })
  }

  const handleSearchChange = (newValueSearch: string) => {
    setValueSearch(newValueSearch)
    debounceFn(newValueSearch.trim())
  }

  const handleSelectStaff = useCallback(
    (item: any) => {
      if (!loadingDailyReport) {
        onSelectStaff(staffSelected?.id === item.id ? null : item)
      }
    },
    [loadingDailyReport, staffSelected]
  )

  const [isBottom, setIsBottom] = useState(false)

  useEffect(() => {
    function handleScroll() {
      const container = document.getElementById('id-table-staff') // replace with the actual ID or use another method to get the container element
      if (container) {
        const scrollTop = container.scrollTop
        const scrollHeight = container.scrollHeight
        const clientHeight = container.clientHeight

        // Check if you are at the bottom of the container (adjust the 100 to your needs)
        setIsBottom(scrollTop + clientHeight >= scrollHeight - 100)
      }
    }

    const container = document.getElementById('id-table-staff')
    if (container) {
      container.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  useEffect(() => {
    // Fetch more data when reaching the bottom
    if (isBottom && !loadingScroll) {
      onChange({ ...params, page: params.page + 1 })
      // Call your API here to fetch more data and update the state
      // Example: fetchDataAndUpdateState();
    }
  }, [isBottom])
  return (
    <Box className={classes.rootListStaffBar}>
      <Box className={classes.warperStaffBar}>
        <ButtonTransition
          top={100}
          right="calc(100% - 1px)"
          timeout={200}
          direction="left"
          toggleButton={openStaffList}
          setToggleButton={setOpenStaffList}
          label={i18nDailyReport('LB_STAFF_LIST')}
        />
        <Collapse in={openStaffList} orientation="horizontal" timeout={200}>
          <Box className={classes.containerStaffBar}>
            <Box className={clsx(classes.listStaffSideBarZoomIn)}>
              <Box className={classes.headerStaffSideBar}>
                <Box className={'title-staff'}>
                  {i18nDailyReport('LB_STAFF_LIST')}
                </Box>
              </Box>
              <Box className={classes.staffListWrap}>
                <Box className={'search-staff'}>
                  <InputSearch
                    width={'100%'}
                    value={valueSearch}
                    placeholder={`${i18('LB_STAFF_CODE')}, ${i18(
                      'LB_STAFF_CODE'
                    )}`}
                    label={i18nDailyReport('LB_SEARCH_STAFF')}
                    onChange={handleSearchChange}
                  />
                </Box>
                <Box
                  id={'id-table-staff'}
                  className={clsx(classes.staffList, 'scrollbar')}
                >
                  <Table
                    sx={cleanObject({
                      minWidth: '100%',
                      height: loading ? '100%' : null,
                    })}
                    aria-labelledby="tableTitle"
                    size={'medium'}
                    stickyHeader
                    aria-label="sticky table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell align={'left'}>
                          {i18('LB_STAFF_CODE')}
                        </TableCell>
                        <TableCell align={'left'}>
                          {i18('LB_STAFF_NAME')}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBodyLoading loading={loading} height="100%">
                      <TableBody>
                        {listStaffs.map(item => (
                          <TableRow
                            className={clsx(
                              classes.row,
                              !loadingDailyReport && classes.cursorPointer,
                              loadingDailyReport && classes.cursorNotAlow,
                              staffSelected?.id === item.id &&
                                classes.activeStaff
                            )}
                            key={item.id}
                            onClick={() => handleSelectStaff(item)}
                          >
                            <TableCell
                              align={'left'}
                              className={clsx(
                                'active-text',
                                classes.breakWord,
                                classes.splitText,
                                staffSelected?.id != item.id &&
                                  classes.firstItem
                              )}
                            >
                              <Box className={classes.itemStaff}>
                                {item.code}
                              </Box>
                            </TableCell>
                            <TableCell align={'left'}>
                              <Box
                                className={clsx(
                                  classes.breakWord,
                                  classes.splitText,
                                  classes.boldText,
                                  'active-text'
                                )}
                                title={item.label}
                              >
                                <Box className={classes.itemStaff}>
                                  {item.label}
                                </Box>
                              </Box>
                              <Box
                                className={clsx(
                                  classes.breakWord,
                                  classes.splitText,
                                  'active-text',
                                  classes.itemStaff
                                )}
                                title={item.description}
                              >
                                {item.description}
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                        {!listStaffs?.length && !loading && (
                          <tr>
                            <td colSpan={100}>
                              <Box style={{ height: '200px', width: '340px' }}>
                                <NoData />
                              </Box>
                            </td>
                          </tr>
                        )}
                        {loadingScroll && (
                          <div className={classes.stage}>
                            <span>Loading</span>
                            <div className={classes.dotElastic}></div>
                          </div>
                        )}
                      </TableBody>
                    </TableBodyLoading>
                  </Table>
                </Box>
              </Box>
            </Box>
          </Box>
        </Collapse>
      </Box>
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootListStaffBar: {
    position: 'sticky',
    top: 0,
    right: 0,
  },
  stage: {
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    marginLeft: '20px',
  },
  dotElastic: {
    marginLeft: '20px',
    position: 'relative',
    width: '8px',
    height: '8px',
    borderRadius: '5px',
    backgroundColor: '#555',
    color: '#555',
    animation: '$dotElastic 1s infinite linear',
    '&::before, &::after': {
      content: '""',
      display: 'inline-block',
      position: 'absolute',
      top: 0,
    },
    '&::before': {
      left: '-15px',
      width: '8px',
      height: '8px',
      borderRadius: '5px',
      backgroundColor: '#555',
      color: '#555',
      animation: '$dotElasticBefore 1s infinite linear',
    },
    '&::after': {
      left: '15px',
      width: '8px',
      height: '8px',
      borderRadius: '5px',
      backgroundColor: '#555',
      color: '#555',
      animation: '$dotElasticAfter 1s infinite linear',
    },
  },
  '@keyframes dotElasticBefore': {
    '0%': {
      transform: 'scale(1, 1)',
    },
    '25%': {
      transform: 'scale(1, 1.5)',
    },
    '50%': {
      transform: 'scale(1, 0.67)',
    },
    '75%': {
      transform: 'scale(1, 1)',
    },
    '100%': {
      transform: 'scale(1, 1)',
    },
  },
  '@keyframes dotElastic': {
    '0%, 25%': {
      transform: 'scale(1, 1)',
    },
    '50%': {
      transform: 'scale(1, 1.5)',
    },
    '75%': {
      transform: 'scale(1, 1)',
    },
    '100%': {
      transform: 'scale(1, 1)',
    },
  },
  '@keyframes dotElasticAfter': {
    '0%, 25%': {
      transform: 'scale(1, 1)',
    },
    '50%': {
      transform: 'scale(1, 0.67)',
    },
    '75%': {
      transform: 'scale(1, 1.5)',
    },
    '100%': {
      transform: 'scale(1, 1)',
    },
  },
  warperStaffBar: {
    position: 'relative',
  },
  containerStaffBar: {
    height: '100%',
  },
  listStaffSideBarZoomIn: {
    width: '328px',
    height: 'calc(100vh - 71px)',
    background: '#ffffff',
    boxShadow:
      'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px',
    overflow: 'hidden',
  },
  listStaffSideBarZoomOut: {
    padding: '33px',
    '& .title-staff': {
      fontSize: '18px',
      fontWeight: '700',
      flex: 1,
      textAlign: 'center',
    },
    transition: '500ms',
    overflow: 'hidden',
    width: '40px',
  },
  cursorPointer: {
    cursor: 'pointer',
  },
  cursorNotAlow: {
    cursor: 'not-allowed',
  },
  activeStaff: {
    background: '#205DCE',
    '& .active-text': {
      color: '#ffffff',
    },
    '&:hover': {
      background: `${theme.color.blue.primary} !important`,
    },
  },
  firstItem: {
    color: '#205DCE !important',
  },
  itemStaff: {
    maxWidth: '150px',
    minWidth: '100px',
    wordBreak: 'break-word',
  },
  headerStaffSideBar: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    boxShadow: 'rgb(17 17 26 / 10%) 0px 1px 0px',
    '& .title-staff': {
      fontSize: '18px',
      fontWeight: '700',
      flex: 1,
      textAlign: 'center',
    },
  },
  staffListWrap: {
    '& .search-staff': {
      padding: '20px 20px 0 20px',
    },
  },
  staffList: {
    overflow: 'auto',
    height: 'calc(100vh - 220px)',
    '&.scrollbar': {
      '&::-webkit-scrollbar': {
        width: '4px',
        height: '8px',
      },
    },
  },
  breakWord: {
    wordBreak: 'break-word',
  },
  splitText: {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    overflow: 'hidden !important',
    textOverflow: 'ellipsis',
  },

  boldText: {
    fontWeight: '700',
  },
  iconLoading: {
    position: 'absolute',
    top: '50%',
    left: '40%',
    fontWeight: 'bold',
    '& .iconCircle': {
      color: '#205DCE',
    },
  },
  itemCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    '&:hover': {
      background: theme.color.grey.secondary,
    },
  },
}))
export default ListStaffSideBar

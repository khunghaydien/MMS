import { MAX_ELLIPSIS } from '@/const/app.const'
import { ErrorResponse, FileItem, OptionItem } from '@/types'
import i18next from 'i18next'
import { isEmpty, pickBy } from 'lodash'
import moment from 'moment'
import QueryString from 'query-string'

export const changeLang = (langCode: string) => {
  i18next.changeLanguage(langCode)
  document.documentElement.lang = langCode
}

export function uuid() {
  let temp_url = URL.createObjectURL(new Blob())
  let uuid = temp_url.toString()
  URL.revokeObjectURL(temp_url)
  return uuid.substr(uuid.lastIndexOf('/') + 1) // remove prefix (e.g. blob:null/, blob:www.test.com/, ...)
}

export function formatDate(date: Date | number | undefined, format?: string) {
  if (!date) return ''
  let _format = i18next.t('common:LB_DATE_FORMAT')
  if (format) _format = format
  return moment(new Date(date)).format(_format)
}
export const formatAnyToDate = (value: any) => {
  if (value && typeof value === 'string') {
    const [day, month, year] = value.split('/').map(Number)
    const parsedDate = new Date(year, month - 1, day)
    return parsedDate
  } else if (value && typeof value === 'number') {
    return new Date(value)
  } else return value
}

export const urlWebsiteRegex =
  /^[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z0-9]{1,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/gm

export const phoneRegex = /^[0-9.]{1,999}$/g
export const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const specialCharacters = /^([a-zA-Z\-0-9\@\-\_\.]+)$/

export function checkUrlValid(url: string) {
  return urlWebsiteRegex.test(url)
}

export const getErrorFromApi = (field: string, errors: ErrorResponse[]) => {
  const fieldError = errors.find(
    (error: ErrorResponse) => error.field === field
  )
  if (fieldError?.field) {
    return {
      error: !!fieldError.field,
      message: fieldError.message,
    }
  } else {
    return {
      error: false,
      message: '',
    }
  }
}

export const isCurrentYearOver = (compareDate: Date) => {
  const currentDate = new Date()
  return currentDate.getFullYear() > compareDate.getFullYear()
}

export const cleanObject = (obj: any) => {
  if (typeof obj !== 'object') return obj
  Object.keys(obj).forEach(
    key => typeof obj[key] === 'string' && obj[key].trim()
  )
  return pickBy(obj, item => {
    switch (true) {
      case typeof item === 'string':
        return !isEmpty(item)
      case item === null || item === undefined:
        return false
      default:
        return true
    }
  })
}

export const getTextEllipsis = (
  text: any,
  maxEllipsis?: number | undefined
) => {
  const _maxEllipsis = maxEllipsis || MAX_ELLIPSIS
  let _text = text?.toString() || ''
  const indexBreakLine = _text.indexOf('\n')
  if (indexBreakLine > -1) {
    _text = `${text?.slice(0, indexBreakLine)}`
  }
  if (_text?.length < _maxEllipsis && indexBreakLine > -1) {
    return `${_text}...`
  } else if (_text?.length < _maxEllipsis && indexBreakLine === -1) {
    return _text
  }
  if (_text.length === _maxEllipsis) return _text
  return `${_text?.slice(0, _maxEllipsis)}...`
}

export function sortAtoZChartArray(options: OptionItem[]) {
  if (!options || (options && options.length === 0)) {
    return []
  }
  return options.sort((a, b) =>
    a.label && b.label ? a.label.localeCompare(b.label) : 1
  )
}

export const scrollToFirstErrorMessage = () => {
  const firstErrorMessage = document.querySelector(
    '.error-message-scroll'
  ) as HTMLElement
  if (firstErrorMessage) {
    firstErrorMessage.scrollIntoView({
      behavior: 'smooth',
    })
  }
}

export const scrollToTop = () => {
  setTimeout(() => {
    const mainLayoutEl = document.getElementById('main__layout')
    mainLayoutEl?.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  })
}

export const filterFollowKeyword = (
  listOption: OptionItem[],
  keyword: string
) => {
  return listOption.filter((option: OptionItem) => {
    return !!String(option.label)
      .toLocaleLowerCase()
      .match(keyword.trim().toLocaleLowerCase())
  })
}

export const formatToOptionItem = (
  list: any[],
  option?: {
    keyValue?: string
    keyLabel?: string
  }
): OptionItem[] => {
  let result: OptionItem[] = []
  const keyValue = option?.keyValue || 'id'
  const keyLabel = option?.keyLabel || 'name'
  result = list.map((item: any) => ({
    ...item,
    id: item.id ? item.id.toString() : item[keyValue].toString(),
    label: item[keyLabel],
    value: item[keyValue].toString(),
  }))
  return result
}

export const formatPersonData = (data: any) => {
  return {
    description: data.email,
    id: data.id,
    label: data.name,
    value: data.id,
  }
}

export const replaceChars = (value: string, options: any) => {
  let result = ''
  for (let each of value) {
    for (const keyReplace in options) {
      const _val = options[keyReplace]
      if (each == keyReplace) {
        each = _val
      }
    }
    result += each
  }
  return result
}

export const formatNumberToCurrency = (num: number | string) => {
  const _num = Number(num)
  return new Intl.NumberFormat().format(_num)
}

export const formatCurrency = (value: number) => {
  const temp = value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  const vndLabelValue = temp.replace('$', ' VND ').split(' ')
  const flagMinus = vndLabelValue[0]
  const suffix = vndLabelValue[1]
  const val = vndLabelValue[2]

  return [
    val.split('.')[1] === '00'
      ? `${flagMinus}${val.split('.')[0]}`
      : `${flagMinus}${val}`,
    suffix,
  ].join(' ')
}

export const formatNumberToCurrencyBigInt = (num: number | string) => {
  const arrNumbers = String(num).split('.')
  const naturalPart: any = BigInt(arrNumbers[0])
  const result = new Intl.NumberFormat().format(naturalPart)
  return !arrNumbers[1] || arrNumbers[1] === '00'
    ? result
    : `${result}.${arrNumbers[1]}`
}

export const checkValidateFormik = async (formik: any) => {
  await formik.validateForm().then((errors: any) => {
    const possibleErrors = Object.keys(errors)
    if (possibleErrors.length === 0) {
      formik.validateForm()
      formik.setTouched({})
    }
    if (possibleErrors) {
      formik.setTouched({ ...formik.touched, ...formik.errors })
    }
  })
  const possibleErrors = !!Object.keys(formik.errors).length
  setTimeout(() => {
    scrollToFirstErrorMessage()
  })
  return possibleErrors
}

export const base64ToArrayBuffer = (base64: string) => {
  const binaryString = window.atob(base64)
  const binaryLen = binaryString.length
  const bytes = new Uint8Array(binaryLen)
  for (let i = 0; i < binaryLen; i++) {
    let ascii = binaryString.charCodeAt(i)
    bytes[i] = ascii
  }
  return bytes
}

export const getDateFromDayOfYear = (year: number, day: number) => {
  if (isNaN(year) || isNaN(day) || !year) {
    return null
  } else {
    return new Date(Date.UTC(year, 0, day))
  }
}

export const getArrayMinMax = (min: number, max: number) => {
  if (min > max) return []
  const result: string[] = []
  for (let i = min; i <= max; i++) {
    result.push(i.toString())
  }
  return result
}

export const getIframeLink = (previewImage: string) => {
  return `https://docs.google.com/viewerng/viewer?url=${encodeURIComponent(
    previewImage
  )}&embedded=true`
}

export const allowedYears = (initYear?: number, endYear?: number): string[] => {
  const currentYear = endYear || new Date().getFullYear()
  const result: string[] = []
  for (let i = initYear || currentYear - 1; i <= currentYear; i++) {
    result.push(String(i))
  }
  return result
}
export const getAbbreviations = (str: string) => {
  let _str = str || ''
  let names = _str.split(' ')
  let initials = names[0].substring(0, 1).toUpperCase()

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase()
  }
  return initials
}

export const convertTimestampToDate = (timestamp: number | null) => {
  if (timestamp) {
    return new Date(timestamp)
  }
  return null
}
const padZero = (str?: string, len?: number | string) => {
  len = len || 2
  let zeros = new Array(len).join('0')
  return (zeros + str).slice(-len)
}

export const invertColor = (hex: string, bw?: boolean) => {
  //This has a bw option that will decide whether to invert to black or white; so you'll get more contrast which is generally better for the human eye.
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1)
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.')
  }

  let r = parseInt(hex.slice(0, 2), 16)
  let g = parseInt(hex.slice(2, 4), 16)
  let b = parseInt(hex.slice(4, 6), 16)
  if (!bw) {
    // https://stackoverflow.com/a/3943023/112731
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF'
  }
  // invert color components
  r = 255 - r
  g = 255 - g
  b = 255 - b
  // pad each with zeros and return
  return (
    '#' +
    padZero(r.toString(16)) +
    padZero(g.toString(16)) +
    padZero(b.toString(16))
  )
}

export const formatNumberDecimal = (value: number, fixed: number) => {
  let num = Number(value)
  return Number(num.toFixed(fixed) || 0)
}

export const formatNumber = (value: string | number) => {
  const formattedNumber = Number(value).toFixed(2)
  return new Intl.NumberFormat('en-US').format(Number(formattedNumber))
}

export const convertKeyArrayToString = (
  listData: Array<any>,
  keyName = 'name'
) => {
  let result = ''
  if (listData && listData.length > 0) {
    listData.forEach((item: any, index: number) => {
      if (index === 0) {
        result = result.concat('', item[keyName])
      } else {
        result = result.concat(', ', item[keyName])
      }
    })
  }
  return result
}

export const removeItemObjectEmpty = (obj: any) => {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([__, v]) => v != null && v != '' && v != undefined
    )
  )
}

export const queryStringParam = (params: any) => {
  return QueryString.stringify(removeItemObjectEmpty(params))
}

export const downloadFileFromByteArr = ({
  fileName,
  fileContent,
}: {
  fileName: string
  fileContent: string
}) => {
  const byte = base64ToArrayBuffer(fileContent)
  const blob = new Blob([byte], { type: 'application/pdf' })
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.download = fileName
  link.click()
}

export const formatFilesResponse = (file: any): FileItem => {
  const FileObject = new File([''], file.filename, {
    type: file.type,
    lastModified: file.uploadDate,
  })
  return {
    FileObject,
    id: file.id,
    url: file.url,
  }
}

export const formatCurrencyThreeCommas = (
  value: string | number | any
): string => {
  if (!value) return ''
  const _value = value.toString()
  if (_value.includes('.')) {
    const [first, second] = _value.split('.')
    const reversedFirst = first.split('').reverse().join('')
    const chunks = reversedFirst.match(/.{1,3}/g)
    const format = chunks
      ? chunks.join(',').split('').reverse().join('') +
        `.${second}`.replace('.00', '')
      : first
    if (format[format.length - 1] === '0' && format.includes('.')) {
      return format.slice(0, format.length - 1)
    } else {
      return format
    }
  } else {
    const reversedStr = _value.split('').reverse().join('')
    const chunks = reversedStr.match(/.{1,3}/g)
    const formattedStr = chunks
      ? chunks.join(',').split('').reverse().join('')
      : _value
    return formattedStr
  }
}

export const removeVietnameseTones = (str: string | number | any): string => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
  str = str.replace(/đ/g, 'd')
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A')
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E')
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I')
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O')
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U')
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y')
  str = str.replace(/Đ/g, 'D')
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '') // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, '') // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, ' ')
  str = str.trim()
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ' '
  )
  return str
}
export const removeVietnameseTonesOnly = (
  str: string | number | any
): string => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
  str = str.replace(/đ/g, 'd')
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A')
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E')
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I')
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O')
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U')
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y')
  str = str.replace(/Đ/g, 'D')
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '') // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, '') // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/[!#$%^&*]/g, '')
  return str
}

export const replaceWithBr = (value: string) => {
  return value.replace(/\n/g, '<br />')
}

export const getObjectDiffKeys = (obj1: any, obj2: any): any => {
  const differentFields = []
  for (let prop in obj1) {
    if (JSON.stringify(obj1[prop]) !== JSON.stringify(obj2[prop])) {
      differentFields.push(prop)
    }
  }
  return differentFields
}

export const countingDays = (startDate: number, endDate: number) => {
  if (!startDate || !endDate) return '0'
  const oneDay = 24 * 60 * 60 * 1000
  return Math.round((endDate - startDate) / oneDay)
}

export const dateRange = (startDate: Date, endDate: Date) => {
  const dates = []
  const start = new Date(startDate)
  const end = new Date(endDate)

  let currentDate = new Date(start.getFullYear(), start.getMonth(), 1)

  while (currentDate <= end) {
    const month = currentDate.getMonth()
    const year = currentDate.getFullYear()
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate()
    const displayMonth = month + 1 < 10 ? '0' + (month + 1) : month + 1
    dates.push([lastDayOfMonth, displayMonth, year].join('/'))
    currentDate.setMonth(currentDate.getMonth() + 1)
  }

  return dates
}

export const countDateFromDateToEndDate = (startDate: Date, endDate: Date) => {
  const oneDay = 24 * 60 * 60 * 1000
  const isLastDayOfMonth =
    endDate.getDate() ===
    new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate()
  let daysDifference = Math.abs(
    (startDate.getTime() - endDate.getTime()) / oneDay
  )
  if (!isLastDayOfMonth) {
    daysDifference +=
      new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate() -
      endDate.getDate()
  }
  return Math.round(daysDifference)
}

export const workDaysCalculate = (startDate: Date, endDate: Date) => {
  let iWeeks,
    iDateDiff,
    iAdjust = 0
  if (endDate < startDate) return -1 // error code if dates transposed
  let iWeekday1 = startDate.getDay() // day of week
  let iWeekday2 = endDate.getDay()
  iWeekday1 = iWeekday1 == 0 ? 7 : iWeekday1 // change Sunday from 0 to 7
  iWeekday2 = iWeekday2 == 0 ? 7 : iWeekday2
  if (iWeekday1 > 5 && iWeekday2 > 5) iAdjust = 1 // adjustment if both days on weekend
  iWeekday1 = iWeekday1 > 5 ? 5 : iWeekday1 // only count weekdays
  iWeekday2 = iWeekday2 > 5 ? 5 : iWeekday2

  // calculate differnece in weeks (1000mS * 60sec * 60min * 24hrs * 7 days = 604800000)
  iWeeks = Math.floor((endDate.getTime() - startDate.getTime()) / 604800000)

  if (iWeekday1 <= iWeekday2) {
    iDateDiff = iWeeks * 5 + (iWeekday2 - iWeekday1)
  } else {
    iDateDiff = (iWeeks + 1) * 5 - (iWeekday1 - iWeekday2)
  }

  iDateDiff -= iAdjust // take into account both days on weekend

  return iDateDiff + 1 // add 1 because dates are inclusive
}

export const removeTime = (date: Date) => {
  return new Date(date.toDateString())
}

export const parseJwt = (token: string) => {
  let base64Url = token.split('.')[1] || ''
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  let jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )

  return JSON.parse(jsonPayload || '""')
}

export const getFormatNumberDecimal = (value: string | number) => {
  const r = formatNumber(value).toString()
  if (r === '0') {
    return r
  }
  if (r.split('.')[1]?.length === 1) {
    return `${r}0`
  }
  return r
}

export const onOpenDatepicker = () => {
  setTimeout(() => {
    const dialog = document.querySelector('[role="dialog"]') as HTMLDivElement
    if (dialog) {
      const dialogChildren = dialog.querySelectorAll('*')
      dialogChildren.forEach(child => {
        child.setAttribute('outside-root', '*')
      })
    }
  })
}

export const formatMonthFromSingleNumber = (
  month: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
): string | number => {
  if (month === 10 || month === 11 || month === 12) return month
  return `0${month}`
}

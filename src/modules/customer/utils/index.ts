import { IStatusConstant, OptionItem } from '@/types'

export function convertStatusInSelectOption(
  listStatus: IStatusConstant[],
  hideDraft?: boolean | undefined
): OptionItem[] {
  const result: OptionItem[] = []
  const _listStatus = !!hideDraft ? listStatus.slice(1) : listStatus
  return _listStatus.map((item: IStatusConstant) => ({
    id: item.type,
    label: item.label,
    value: item.type,
  }))
}

export function convertToOptionItem(
  list: any,
  uniqueKey?: string
): OptionItem[] | OptionItem {
  const _uniqueKey: string = uniqueKey ? uniqueKey : 'id'
  if (!Array.isArray(list)) {
    return {
      ...list,
      id: list[_uniqueKey],
      label: list.name || list.label,
      value: list[_uniqueKey],
    }
  } else {
    return list.map((item: any) => ({
      ...item,
      id: item[_uniqueKey],
      label: item.name || item.label,
      value: item[_uniqueKey],
    }))
  }
}

export const getListCodeContractError = (errors: any, contracts: any[]) => {
  const codes: any = []
  errors?.forEach((error: any) => {
    if (error.field.includes('code')) {
      const arrayString = error.field.split('.')?.[0].split(']')
      const index = arrayString?.[0][arrayString?.[0]?.length - 1]
      codes.push(contracts?.[index]?.code || '')
    }
  })
  return codes
}

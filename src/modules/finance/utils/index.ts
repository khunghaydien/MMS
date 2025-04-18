export const renderSeries = (
  data: (
    | { month: number; value: number; key: string }[]
    | { month: number; value: number; key: string }[]
    | { month: number; value: number; key: string }[]
    | { month: number; value: number; key: string }[]
  )[]
) => {
  let newArr: any = []
  let colors = ['#2CB0ED', '#FADB61', '#0B68A2', '#F86868']
  let newData = Object.values(data)
  if (data && Object.keys(data).length !== 0) {
    for (let i = 0; i < newData.length; i++) {
      for (let j = 0; j < newData[i].length; j++) {
        let keyName = newData[i][j].key.split('|')
        let newObjectData: any = {
          name: keyName[1],
          data: newData[i][j].value,
        }
        newArr.push(newObjectData)
      }
    }
    let result: any = Object.values(
      newArr.reduce(
        (
          acc: {
            [x: string]: {
              data: any[]
            }
          },
          { name, data }: any
        ) => {
          acc[name] = acc[name] || { name, data: [] }
          acc[name].data.push(data)
          return acc
        },
        {}
      )
    )
    for (let i = 0; i < newArr.length; i++) {
      if (
        result.length === newArr.length &&
        !result[i]?.hasOwnProperty('negativeColor')
      ) {
        result[i].color = colors[i]
        result[i].negativeColor = colors[i]
      }
    }
    return result
  }
}

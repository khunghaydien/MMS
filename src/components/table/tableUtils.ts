export const setFirstTextEllipsis = (tableContainerEl: Element) => {
  let widthMaximum = 0
  const rowsEl = (tableContainerEl.querySelectorAll('tbody tr') ||
    []) as NodeListOf<Element>
  const headFirstTHEl = tableContainerEl.querySelector(
    'thead tr th'
  ) as HTMLElement
  Array.from(rowsEl).forEach((row: Element) => {
    const firstColEl = row.querySelector('.row-item-text') as HTMLElement
    if (firstColEl?.style) {
      firstColEl.style.width = 'max-content'
      const widthFirstColEl = firstColEl.offsetWidth
      if (widthFirstColEl > widthMaximum) {
        widthMaximum = widthFirstColEl
      }
    }
  })
  if (widthMaximum > 200 && !!headFirstTHEl?.style) {
    headFirstTHEl.style.width = widthMaximum + 1 + 'px'
  }
}

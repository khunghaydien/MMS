import { RefObject, useEffect } from 'react'

export const useOutsideClick = (
  refs: Array<RefObject<HTMLElement> | undefined>,
  callbackFunction?: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      const hasOutsideBreakpoint =
        event.target === document.getElementsByTagName('html')[0] &&
        event.clientX >= document.documentElement.offsetWidth
      if (hasOutsideBreakpoint || !callbackFunction) return
      let containedToAnyRefs = false
      for (const rf of refs) {
        if (rf && rf.current && rf.current.contains(event.target)) {
          containedToAnyRefs = true
          break
        }
      }
      if (!containedToAnyRefs) {
        callbackFunction()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [refs, callbackFunction])
}

export const useClickOutside2 = (
  ref: React.MutableRefObject<null | HTMLDivElement>,
  handler: Function
) => {
  useEffect(() => {
    const listener = (event: any) => {
      setTimeout(() => {
        if (
          !ref.current ||
          ref.current.contains(event.target) ||
          !!event.target.getAttribute('outside-root')
        ) {
          return
        }
        handler(event)
      })
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

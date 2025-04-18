import { Fragment, ReactNode } from 'react'

export default function ConditionalRender(props: {
  conditional: boolean
  children: ReactNode
  fallback?: any
}) {
  const { conditional, fallback = <Fragment />, children } = props
  return conditional ? children : fallback
}

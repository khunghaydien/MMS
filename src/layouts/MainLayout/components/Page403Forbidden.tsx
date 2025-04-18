import i18next from 'i18next'
import PageError from './PageError'

const Page403Forbidden = () => {
  return (
    <PageError errorMessage={i18next.t('common:MSG_ERROR_403') as string} />
  )
}

export default Page403Forbidden

import i18next from 'i18next'
import PageError from './PageError'

const Page404Forbidden = () => {
  return (
    <PageError errorMessage={i18next.t('common:MSG_ERROR_404') as string} />
  )
}

export default Page404Forbidden

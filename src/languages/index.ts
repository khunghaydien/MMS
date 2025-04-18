import { LangConstant } from '@/const'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
// import viLang from './vi'
import enLang from './en'

i18next.use(initReactI18next).init(
  {
    interpolation: {
      escapeValue: false,
    },
    lng: LangConstant.DEFAULT_LANGUAGE,
    resources: {
      en: enLang,
      // vi: viLang,
    },
    defaultNS: LangConstant.DEFAULT_NAMESPACE,
  },
  err => {
    err && console.error(err)
  }
)

export const getLocale = (key: string) =>
  i18next.getFixedT(i18next.language)(key)

export default i18next

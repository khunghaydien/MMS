import * as Yup from 'yup'

declare module 'yup' {
  interface StringSchema extends Yup.StringSchema {
    customerNameValidation(value: string): StringSchema
  }

  interface StringSchema extends Yup.StringSchema {
    scaleValidation(value: string): StringSchema
  }

  interface ObjectSchema extends Yup.ObjectSchema {
    objectEmpty(value: string): ObjectSchema
  }

  interface StringSchema extends Yup.StringSchema {
    projectNameValidation(value: string): StringSchema
  }

  interface StringSchema extends Yup.StringSchema {
    maxRateValidation(value: string): StringSchema
  }

  interface StringSchema extends Yup.StringSchema {
    staffNameValidation(value: string): StringSchema
  }

  interface StringSchema extends Yup.StringSchema {
    emailValidation(value: string): StringSchema
  }
  interface StringSchema extends Yup.StringSchema {
    specialCharacters(value: string): StringSchema
  }

  interface StringSchema extends Yup.StringSchema {
    textRequired(value: string): StringSchema
  }
}

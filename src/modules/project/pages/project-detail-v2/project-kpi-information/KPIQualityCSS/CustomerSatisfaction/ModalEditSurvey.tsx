import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import FormItem from '@/components/Form/FormItem/FormItem'
import Modal from '@/components/common/Modal'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputRadioList from '@/components/inputs/InputRadioList'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import { NS_PROJECT } from '@/const/lang.const'
import {
  PROJECT_QUALITY_LANGUAGES,
  SURVEY_TYPE_VALUES,
} from '@/modules/project/const'
import { projectSelector } from '@/modules/project/reducer/project'
import { ProjectService } from '@/modules/project/services'
import { alertSuccess, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { EventInput, OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
import moment from 'moment'
import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import useKPIValidation from '../../useKPIValidation'
import SelectMORRepresentative from './SelectMORRepresentative'

interface ModalEditSurveyProps {
  onClose: () => void
  optionCreateNewSurvey: number
  initSurvey: any
  onSuccessfullyUpdated: () => void
}

const ModalEditSurvey = ({
  onClose,
  optionCreateNewSurvey,
  initSurvey,
  onSuccessfullyUpdated,
}: ModalEditSurveyProps) => {
  const classes = useStyles()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(NS_PROJECT)

  const brseAvailableOptions = [
    {
      id: 'yes',
      value: 'yes',
      label: i18('LB_YES'),
    },
    {
      id: 'no',
      value: 'no',
      label: i18('LB_NO'),
    },
  ]

  const { nameSurveyProject } = useSelector(projectSelector)
  const { surveyFormValidation } = useKPIValidation({ nameSurveyProject })

  const form = useFormik({
    initialValues: {
      id: initSurvey.surveyId,
      name: initSurvey.surveyName,
      createdDate: new Date(initSurvey.createdAt),
      closedDate: new Date(initSurvey.closedDate),
      morRepresentative: {
        id: initSurvey.morRepresentative.id,
        value: initSurvey.morRepresentative.id,
        label: initSurvey.morRepresentative.name,
      },
      customerRepresentative: initSurvey.customerRepresentative,
      language: initSurvey.language,
      brseAvailable: initSurvey.brseAvailable ? 'yes' : 'no',
    },
    validationSchema: surveyFormValidation,
    onSubmit: () => {
      updateSurvey()
    },
  })
  const { values, errors, touched, setFieldValue, handleSubmit }: any = form

  const submitDisabled = useMemo(() => {
    return (
      JSON.stringify({
        name: values.name.trim(),
        morRepresentative: +values.morRepresentative?.id,
        customerRepresentative: values.customerRepresentative || '',
        language: +values.language,
        brseAvailable: values.brseAvailable,
        closedDate: moment(values.closedDate).format('DD/MM/YYYY'),
      }) ===
      JSON.stringify({
        name: initSurvey.surveyName.trim(),
        morRepresentative: +initSurvey.morRepresentative?.id,
        customerRepresentative: initSurvey.customerRepresentative || '',
        language: +initSurvey.language,
        brseAvailable: initSurvey.brseAvailable ? 'yes' : 'no',
        closedDate: moment(initSurvey.closedDate).format('DD/MM/YYYY'),
      })
    )
  }, [values, initSurvey])

  const updateSurvey = () => {
    const payload = {
      projectId: params.projectId as string,
      surveyId: values.id,
      requestBody: {
        name: values.name,
        createdDate: values.createdDate.getTime(),
        closedDate: values.closedDate.getTime(),
        morRepresentative: values.morRepresentative.id,
        customerRepresentative: values.customerRepresentative,
        language: values.language,
        brseAvailable: values.brseAvailable === 'yes',
        type: optionCreateNewSurvey,
      },
    }
    dispatch(updateLoading(true))
    ProjectService.updateSurvey(payload)
      .then(() => {
        dispatch(
          alertSuccess({
            message: i18('MSG_UPDATE_SUCCESS', {
              labelName: values.name,
            }),
          })
        )
        onSuccessfullyUpdated()
        onClose()
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  return (
    <Fragment>
      <Modal
        open
        cancelOutlined
        useButtonCancel
        useButtonDontSave
        numberEllipsis={100}
        width={845}
        submitDisabled={submitDisabled}
        labelSubmit={i18('LB_UPDATE') as string}
        title={
          optionCreateNewSurvey === SURVEY_TYPE_VALUES.PROJECT_BASE
            ? i18Project('TXT_MODAL_EDIT_PROJECT_BASE_LABO_HOST_TITLE')
            : i18Project('TXT_MODAL_EDIT_LABO_TASKBASE')
        }
        onClose={onClose}
        onDontSave={onClose}
        onSubmit={() => handleSubmit()}
      >
        <Box className={classes.modalBody}>
          <Box className={classes.listFields}>
            <InputTextLabel
              required
              label={i18Project('TXT_SURVEY_NAME')}
              placeholder={i18Project('PLH_SURVEY_NAME')}
              error={!!errors.name && !!touched.name}
              errorMessage={errors.name}
              value={values.name}
              onChange={(e: EventInput) =>
                setFieldValue('name', e.target.value)
              }
            />
            <InputDatepicker
              disabled
              width={160}
              label={i18('TXT_CREATED_DATE')}
              maxDate={values.closedDate}
              value={values.createdDate}
              onChange={(date: Date | null) =>
                setFieldValue('createdDate', date)
              }
            />
            <InputDatepicker
              required
              width={160}
              label={i18('TXT_CLOSED_DATE')}
              minDate={values.createdDate}
              error={!!errors.closedDate && touched.closedDate}
              errorMessage={errors.closedDate}
              value={values.closedDate}
              onChange={(date: Date | null) =>
                setFieldValue('closedDate', date)
              }
            />
          </Box>
          <Box className={classes.listFields}>
            <SelectMORRepresentative
              required
              width={370}
              value={values.morRepresentative}
              error={!!errors.morRepresentative && touched.morRepresentative}
              errorMessage={errors.morRepresentative as string}
              onChange={(staff: OptionItem) =>
                setFieldValue('morRepresentative', staff)
              }
            />
            <Box width={200}>
              <InputTextLabel
                required
                maxLength={50}
                label={i18Project('TXT_CUSTOMER_REPRESENTATIVE')}
                placeholder={i18('PLH_PERSON_NAME')}
                error={
                  !!errors.customerRepresentative &&
                  touched.customerRepresentative
                }
                errorMessage={errors.customerRepresentative}
                value={values.customerRepresentative}
                onChange={(e: EventInput) =>
                  setFieldValue('customerRepresentative', e.target.value)
                }
              />
            </Box>
            <InputDropdown
              required
              width={180}
              label={i18('LB_LANGUAGE')}
              placeholder={i18('PLH_SELECT_LANGUAGE')}
              listOptions={PROJECT_QUALITY_LANGUAGES}
              error={!!errors.language && touched.language}
              errorMessage={errors.language}
              value={values.language}
              onChange={value => setFieldValue('language', value)}
            />
          </Box>
          {optionCreateNewSurvey === SURVEY_TYPE_VALUES.PROJECT_BASE && (
            <FormItem
              required
              className={classes.boxRadio}
              label={i18Project('LB_SURVEY_APPLY_FOR_BRSE')}
            >
              <InputRadioList
                value={values.brseAvailable}
                listOptions={brseAvailableOptions}
                onChange={type => setFieldValue('brseAvailable', type)}
              />
            </FormItem>
          )}
        </Box>
      </Modal>
    </Fragment>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  modalBody: {
    display: 'flex',
    gap: theme.spacing(3),
    flexDirection: 'column',
  },
  listFields: {
    display: 'flex',
    gap: theme.spacing(3),
  },
  boxRadio: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing(2),
    '& .formContent': {
      width: 'unset',
    },
    '& .label': {
      marginBottom: 'unset',
    },
  },
}))

export default ModalEditSurvey

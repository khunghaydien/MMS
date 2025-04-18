import ButtonAddPlus from '@/components/buttons/ButtonAddPlus'
import InputErrorMessage from '@/components/common/InputErrorMessage'
import CardForm from '@/components/Form/CardForm'
import FormItem from '@/components/Form/FormItem/FormItem'
import DeleteIcon from '@/components/icons/DeleteIcon'
import InputCurrency from '@/components/inputs/InputCurrency'
import InputDropdown from '@/components/inputs/InputDropdown'
import InputTextLabel from '@/components/inputs/InputTextLabel'
import { LangConstant } from '@/const'
import { levels } from '@/modules/staff/const'
import { commonSelector, CommonState, getSkillSets } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { EventInput, OptionItem, SkillSet } from '@/types'
import { scrollToTop } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { SkillItem, SkillSetListItem } from './ModalExportSkillSets'

interface SkillSetListProps {
  useNote?: boolean
  skillSetList: SkillSetListItem[]
  flagSubmit: boolean
  onChange: (payload: {
    value: string
    skillGroupIndex: number
    skillSetLevelIndex: number
    key: string
    skillName?: string
  }) => void
  onAddNewSkill: (skillGroupIndex: number) => void
  onDeleteSkill: (payload: {
    skillGroupIndex: number
    skillSetLevelIndex: number
  }) => void
  onSkillGroupChange: (payload: {
    value: string
    skillGroupIndex: number
    skillGroupName: string
  }) => void
  onAddNewSkillSet: () => void
  onDeleteSkillGroup: (skillGroupIndex: number) => void
  readonly?: boolean
}

const SkillSetList = ({
  useNote = false,
  flagSubmit,
  skillSetList,
  onChange,
  onAddNewSkill,
  onDeleteSkill,
  onSkillGroupChange,
  onAddNewSkillSet,
  onDeleteSkillGroup,
  readonly = false,
}: SkillSetListProps) => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18 } = useTranslation(LangConstant.NS_COMMON)

  const { skillSets }: CommonState = useSelector(commonSelector)

  const [skillGroupIndex, setSkillGroupIndex] = useState(0)
  const [skillSetLevelIndex, setSkillSetLevelIndex] = useState(0)

  const handleSkillChange = (
    value: string,
    skillGroupIndex: number,
    skillSetLevelIndex: number,
    key: string,
    skillName: string
  ) => {
    onChange({ value, skillGroupIndex, skillSetLevelIndex, key, skillName })
  }

  const handleAddNewSkill = (skillGroupIndex: number) => {
    onAddNewSkill(skillGroupIndex)
  }

  const handleDeleteSkill = (
    skillGroupIndex: number,
    skillSetLevelIndex: number
  ) => {
    onDeleteSkill({ skillGroupIndex, skillSetLevelIndex })
  }

  const getSkillSetListOptions = (
    skillGroupId: string | number,
    skillSetLevels: SkillItem[],
    skillItemId: string
  ) => {
    const skillItemIdsIgnore: string[] = []
    skillSetLevels.forEach((item: SkillItem) => {
      if (item.id && item.id != skillItemId) {
        skillItemIdsIgnore.push(item.id)
      }
    })
    const skillSetBySkillGroupId = skillSets.find(
      item => item.id == skillGroupId
    )
    const skillSetListOptions: OptionItem[] = []
    skillSetBySkillGroupId?.skillSets.forEach(item => {
      if (!skillItemIdsIgnore.includes(item.skillSetId.toString())) {
        skillSetListOptions.push({
          id: item.skillSetId.toString(),
          label: item.name,
          value: item.skillSetId.toString(),
        })
      }
    })
    return skillSetListOptions?.length ? skillSetListOptions : []
  }

  const getSkillGroupListOptions = (skillGroup: SkillSetListItem) => {
    const groupIdsExist = skillSetList.map((item: SkillSetListItem) => item.id)
    const allSkillGroups = skillSets.map(item => ({
      id: item.id.toString(),
      label: item.name,
      value: item.id.toString(),
    }))
    let newGroupIdsExist: any
    const indexIgnoreGroupIdsExist = groupIdsExist.findIndex(
      index => index.toString() === skillGroup.id.toString()
    )
    if (indexIgnoreGroupIdsExist > -1) {
      newGroupIdsExist = structuredClone(groupIdsExist).filter(
        id => id.toString() !== skillGroup.id.toString()
      )
      return allSkillGroups.filter(
        item => !newGroupIdsExist.includes(item.id.toString())
      )
    }
    return []
  }

  const handleSkillGroupChange = useCallback(
    (value: string) => {
      const skillGroupById: SkillSet | undefined = skillSets.find(
        item => item.id.toString() === value
      )
      onSkillGroupChange({
        value,
        skillGroupName: skillGroupById?.name || '',
        skillGroupIndex,
      })
    },
    [onSkillGroupChange, skillGroupIndex]
  )

  const handleYearOfExperienceChange = useCallback(
    (value?: string) => {
      onChange({
        value: value || '',
        skillGroupIndex,
        skillSetLevelIndex,
        key: 'yearOfExperience',
      })
    },
    [onChange, skillGroupIndex, skillSetLevelIndex]
  )

  const handleLevelChange = useCallback(
    (value: string) => {
      onChange({ value, skillGroupIndex, skillSetLevelIndex, key: 'level' })
    },
    [onChange, skillGroupIndex, skillSetLevelIndex]
  )

  const handleNoteChange = useCallback(
    (e: EventInput) => {
      onChange({
        value: e.target.value,
        skillGroupIndex,
        skillSetLevelIndex,
        key: 'note',
      })
    },
    [onChange, skillGroupIndex, skillSetLevelIndex]
  )

  useEffect(() => {
    if (!skillSets.length) {
      dispatch(getSkillSets())
    }
  }, [])

  useEffect(() => {
    if (skillSets.length) {
      scrollToTop()
    }
  }, [skillSets])

  return (
    <CardForm title="Skillset List">
      <Box className={classes.rootSkillSetList}>
        {flagSubmit && !skillSetList.length && (
          <InputErrorMessage content={'SkillSet must be selected'} />
        )}
        {skillSetList.map(
          (skillGroup: SkillSetListItem, skillGroupIndex: number) => (
            <Box
              className={classes.skillSetItem}
              key={`${skillGroup.id} - ${skillGroup.code} - ${skillGroupIndex}`}
            >
              <Box className={clsx(classes.skillGroup, 'input-field')}>
                <FormItem label="Skill Group" required>
                  <Box onMouseOver={() => setSkillGroupIndex(skillGroupIndex)}>
                    <InputDropdown
                      isDisable={readonly}
                      error={flagSubmit && !skillGroup.id}
                      errorMessage="Skill Group must be selected"
                      placeholder="Select Skill Group"
                      width={300}
                      value={skillGroup.id}
                      listOptions={getSkillGroupListOptions(skillGroup)}
                      onChange={handleSkillGroupChange}
                      onOpen={() => setSkillGroupIndex(skillGroupIndex)}
                    />
                  </Box>
                </FormItem>
              </Box>
              <Box
                className={clsx(
                  classes.skillNameList,
                  !skillGroup.skillSetLevels.length && classes.center
                )}
              >
                {!readonly && (
                  <Box className={classes.deleteSkillGroup}>
                    <DeleteIcon
                      className={classes.pointer}
                      data-title="button"
                      onClick={() => onDeleteSkillGroup(skillGroupIndex)}
                    />
                  </Box>
                )}
                {!!skillGroup.skillSetLevels.length && (
                  <Box className={classes.head}>
                    <Box className={clsx(classes.title, 'bold')}>
                      Skill Name<span className={clsx(classes.mark)}> *</span>
                    </Box>
                    <Box className={clsx(classes.title, 'bold')}>
                      Year Of Experience
                      <span className={clsx(classes.mark)}> *</span>
                    </Box>
                    <Box className={clsx(classes.title, 'bold')}>
                      Level<span className={clsx(classes.mark)}> *</span>
                    </Box>
                  </Box>
                )}
                {flagSubmit &&
                  !!skillGroup.id &&
                  !skillGroup.skillSetLevels.length && (
                    <InputErrorMessage
                      className={classes.pd16}
                      content={'Skill Name must be selected'}
                    />
                  )}
                {skillGroup.skillSetLevels.map(
                  (skillItem: SkillItem, skillSetLevelIndex: number) => (
                    <Box key={skillSetLevelIndex} className={classes.skillItem}>
                      <Box className={classes.skillItemHeader}>
                        <Box className={classes.headerInput}>
                          <Box
                            className={clsx(classes.skillInfo, 'input-field')}
                            onMouseOver={() => {
                              setSkillGroupIndex(skillGroupIndex)
                              setSkillSetLevelIndex(skillSetLevelIndex)
                            }}
                          >
                            <InputDropdown
                              isDisable={readonly}
                              error={flagSubmit && !skillItem.id}
                              errorMessage="Skill Name must be selected"
                              placeholder="Select Skill Name"
                              width={'100%'}
                              value={skillItem.id}
                              onChange={(
                                value: string,
                                option: OptionItem | undefined
                              ) =>
                                handleSkillChange(
                                  value,
                                  skillGroupIndex,
                                  skillSetLevelIndex,
                                  'id',
                                  option?.label || ''
                                )
                              }
                              listOptions={getSkillSetListOptions(
                                skillGroup.id,
                                skillGroup.skillSetLevels,
                                skillItem.id
                              )}
                              onOpen={() => {
                                setSkillGroupIndex(skillGroupIndex)
                                setSkillSetLevelIndex(skillSetLevelIndex)
                              }}
                            />
                          </Box>
                          <Box
                            className={clsx(classes.skillInfo, 'input-field')}
                          >
                            <FormItem
                              error={flagSubmit && !skillItem.yearOfExperience}
                              errorMessage={'YoE required to have input'}
                            >
                              <InputCurrency
                                disabled={readonly}
                                suffix=""
                                error={
                                  flagSubmit && !skillItem.yearOfExperience
                                }
                                maxLength={2}
                                allowDecimals={false}
                                placeholder="E.g: 10"
                                value={skillItem.yearOfExperience}
                                onChange={handleYearOfExperienceChange}
                                onFocus={() => {
                                  setSkillGroupIndex(skillGroupIndex)
                                  setSkillSetLevelIndex(skillSetLevelIndex)
                                }}
                              />
                            </FormItem>
                          </Box>
                          <Box
                            className={clsx(classes.skillInfo, 'input-field')}
                          >
                            <InputDropdown
                              isDisable={readonly}
                              error={flagSubmit && !skillItem.level}
                              errorMessage="Level must be selected"
                              placeholder="Select Level"
                              value={skillItem.level}
                              listOptions={levels}
                              onChange={handleLevelChange}
                              onOpen={() => {
                                setSkillGroupIndex(skillGroupIndex)
                                setSkillSetLevelIndex(skillSetLevelIndex)
                              }}
                            />
                          </Box>
                        </Box>
                        {!!skillGroup.skillSetLevels.length && !readonly && (
                          <DeleteIcon
                            className={clsx(
                              classes.pointer,
                              classes.iconDeleteSkillItem
                            )}
                            onClick={() =>
                              handleDeleteSkill(
                                skillGroupIndex,
                                skillSetLevelIndex
                              )
                            }
                          />
                        )}
                      </Box>
                      {useNote && (
                        <Box
                          sx={{
                            marginTop: '-16px',
                          }}
                        >
                          <InputTextLabel
                            disabled={readonly}
                            value={skillItem.note}
                            placeholder={i18('PLH_NOTE')}
                            onChange={handleNoteChange}
                            onFocus={() => {
                              setSkillGroupIndex(skillGroupIndex)
                              setSkillSetLevelIndex(skillSetLevelIndex)
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                  )
                )}
                {!!skillGroup.id && !readonly && (
                  <Box className={classes.pd16}>
                    <ButtonAddPlus
                      label="Add New Skill"
                      onClick={() => handleAddNewSkill(skillGroupIndex)}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          )
        )}
      </Box>
      {!readonly && (
        <Box sx={{ marginTop: '16px' }}>
          <ButtonAddPlus label="Add New SkillSet" onClick={onAddNewSkillSet} />
        </Box>
      )}
    </CardForm>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootSkillSetList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  skillSetItem: {
    width: '100%',
    display: 'flex',
    backgroundColor: '#F8F8FF',
    border: `1px solid ${theme.color.grey.secondary}`,
  },
  skillGroup: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRight: `1px solid ${theme.color.grey.secondary}`,
    width: 333,
  },
  skillNameList: {
    position: 'relative',
    width: 'calc(100% - 200px)',
  },
  skillItem: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    // alignItems: 'flex-start',
  },
  skillInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '&:nth-child(1)': {
      width: 'calc(50% - 48px)',
    },
    '&:nth-child(2)': {
      width: '30%',
    },
    '&:nth-child(3)': {
      width: '20%',
      '& > div': {
        width: '100% !important',
      },
    },
  },
  skillName: {
    width: '100%',
    wordBreak: 'break-all',
  },
  head: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 2, 0.8, 2),
    width: 'calc(100% - 48px)',
  },
  title: {
    '&:nth-child(1)': {
      width: 'calc(50% - 48px)',
    },
    '&:nth-child(2)': {
      width: '30%',
    },
    '&:nth-child(3)': {
      width: '20%',
    },
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  pd16: {
    padding: theme.spacing(2),
  },
  deleteSkillGroup: {
    position: 'absolute',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
  mark: {
    color: theme.color.error.secondary,
  },
  pointer: {
    cursor: 'pointer',
  },
  iconDeleteSkillItem: {
    marginTop: '5px',
  },
  headerInput: {
    display: 'flex',
    alignItems: 'flex-start',
    width: 'calc(100% - 48px)',
    justifyContent: 'space-between',
  },
  skillItemHeader: {
    justifyContent: 'space-between',
    display: 'flex',
    width: '100%',
  },
}))

export default SkillSetList

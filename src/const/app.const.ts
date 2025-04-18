import { IStatusConstant, UploadAcceptFileTypes } from '@/types'

export const USER_LOCAL = 'user'
export const SNACK_BAR_DURATION = 15000
export const INPUT_TIME_DELAY = 300
export const CHANGE_TIME_DELAY = 100
export const FAKE_LOADING_TIME_DELAY = 250
export const SCREEN_TABLET = 1024
export const MAX_ELLIPSIS = 40
export const INPUT_TEXT_MAX_LENGTH = 250
export const INPUT_TEXTAREA_MAX_LENGTH = 500
export const INPUT_CURRENCY_MAX_LENGTH = 20
export const FILE_MAX_LENGTH = 25
export const INPUT_LEVEL_MAX_LENGTH = 50
export const ABBREVIATION_MAX_LENGTH = 50
export const FILE_MAX_SIZE = 5242880
export const ALL_BRANCHES = 'BRA-00'
export const YEAR_2016 = new Date('01/01/2016')
export const TYPE_WEBSITE_DEFAULT = 'MMS'
export const BRANCH_ID_ALL = 'BRA-000'
export const RESET_EMAIL_INTERNAL = 1000
export const DIVISION_DIRECTOR_ROLE = 'Division Director'
export const LIST_OF_LANGUAGES = JSON.parse(
  '[{"id":"aa","label":"Afar (AA)","value":"aa"},{"id":"ab","label":"Abkhazian (AB)","value":"ab"},{"id":"af","label":"Afrikaans (AF)","value":"af"},{"id":"ak","label":"Akan (AK)","value":"ak"},{"id":"als","label":"Alemannic (ALS)","value":"als"},{"id":"am","label":"Amharic (AM)","value":"am"},{"id":"an","label":"Aragonese (AN)","value":"an"},{"id":"ang","label":"Angal (ANG)","value":"ang"},{"id":"ang","label":"Anglo-Saxon / Old English (ANG)","value":"ang"},{"id":"ar","label":"Arabic (AR)","value":"ar"},{"id":"arc","label":"Aramaic (ARC)","value":"arc"},{"id":"arz","label":"Egyptian Arabic (ARZ)","value":"arz"},{"id":"as","label":"Assamese (AS)","value":"as"},{"id":"ast","label":"Asturian (AST)","value":"ast"},{"id":"av","label":"Avar (AV)","value":"av"},{"id":"awa","label":"Awadhi (AWA)","value":"awa"},{"id":"ay","label":"Aymara (AY)","value":"ay"},{"id":"az","label":"Azerbaijani (AZ)","value":"az"},{"id":"ba","label":"Bashkir (BA)","value":"ba"},{"id":"bar","label":"Bavarian (BAR)","value":"bar"},{"id":"bat-smg","label":"Samogitian (BAT-SMG)","value":"bat-smg"},{"id":"bcl","label":"Bikol (BCL)","value":"bcl"},{"id":"be","label":"Belarusian (BE)","value":"be"},{"id":"be-x-old","label":"Belarusian (Taraškievica) (BE-X-OLD)","value":"be-x-old"},{"id":"bg","label":"Bulgarian (BG)","value":"bg"},{"id":"bh","label":"Bihari (BH)","value":"bh"},{"id":"bi","label":"Bislama (BI)","value":"bi"},{"id":"bm","label":"Bambara (BM)","value":"bm"},{"id":"bn","label":"Bengali (BN)","value":"bn"},{"id":"bo","label":"Tibetan (BO)","value":"bo"},{"id":"bpy","label":"Bishnupriya Manipuri (BPY)","value":"bpy"},{"id":"br","label":"Breton (BR)","value":"br"},{"id":"brx","label":"Boro (BRX)","value":"brx"},{"id":"bs","label":"Bosnian (BS)","value":"bs"},{"id":"bug","label":"Buginese (BUG)","value":"bug"},{"id":"bxr","label":"Buriat (Russia) (BXR)","value":"bxr"},{"id":"ca","label":"Catalan (CA)","value":"ca"},{"id":"cdo","label":"Min Dong Chinese (CDO)","value":"cdo"},{"id":"ce","label":"Chechen (CE)","value":"ce"},{"id":"ceb","label":"Cebuano (CEB)","value":"ceb"},{"id":"ch","label":"Chamorro (CH)","value":"ch"},{"id":"cho","label":"Choctaw (CHO)","value":"cho"},{"id":"chr","label":"Cherokee (CHR)","value":"chr"},{"id":"chy","label":"Cheyenne (CHY)","value":"chy"},{"id":"ckb","label":"Kurdish (Sorani) (CKB)","value":"ckb"},{"id":"co","label":"Corsican (CO)","value":"co"},{"id":"cr","label":"Cree (CR)","value":"cr"},{"id":"crn","label":"Montenegrin (CRN)","value":"crn"},{"id":"cs","label":"Czech (CS)","value":"cs"},{"id":"csb","label":"Kashubian (CSB)","value":"csb"},{"id":"cu","label":"Old Church Slavonic / Old Bulgarian (CU)","value":"cu"},{"id":"cv","label":"Chuvash (CV)","value":"cv"},{"id":"cy","label":"Welsh (CY)","value":"cy"},{"id":"da","label":"Danish (DA)","value":"da"},{"id":"de","label":"German (DE)","value":"de"},{"id":"diq","label":"Dimli (DIQ)","value":"diq"},{"id":"dsb","label":"Lower Sorbian (DSB)","value":"dsb"},{"id":"dv","label":"Divehi (DV)","value":"dv"},{"id":"dz","label":"Dzongkha (DZ)","value":"dz"},{"id":"ee","label":"Ewe (EE)","value":"ee"},{"id":"el","label":"Greek (EL)","value":"el"},{"id":"en","label":"English (EN)","value":"en"},{"id":"eo","label":"Esperanto (EO)","value":"eo"},{"id":"es","label":"Spanish (ES)","value":"es"},{"id":"et","label":"Estonian (ET)","value":"et"},{"id":"eu","label":"Basque (EU)","value":"eu"},{"id":"ext","label":"Extremaduran (EXT)","value":"ext"},{"id":"fa","label":"Persian (FA)","value":"fa"},{"id":"ff","label":"Peul (FF)","value":"ff"},{"id":"fi","label":"Finnish (FI)","value":"fi"},{"id":"fiu-vro","label":"Võro (FIU-VRO)","value":"fiu-vro"},{"id":"fj","label":"Fijian (FJ)","value":"fj"},{"id":"fo","label":"Faroese (FO)","value":"fo"},{"id":"fr","label":"French (FR)","value":"fr"},{"id":"frp","label":"Arpitan / Franco-Provençal (FRP)","value":"frp"},{"id":"fur","label":"Friulian (FUR)","value":"fur"},{"id":"fy","label":"West Frisian (FY)","value":"fy"},{"id":"ga","label":"Irish (GA)","value":"ga"},{"id":"gan","label":"Gan Chinese (GAN)","value":"gan"},{"id":"gbm","label":"Garhwali (GBM)","value":"gbm"},{"id":"gd","label":"Scottish Gaelic (GD)","value":"gd"},{"id":"gil","label":"Gilbertese (GIL)","value":"gil"},{"id":"gl","label":"Galician (GL)","value":"gl"},{"id":"gn","label":"Guarani (GN)","value":"gn"},{"id":"got","label":"Gothic (GOT)","value":"got"},{"id":"gu","label":"Gujarati (GU)","value":"gu"},{"id":"gv","label":"Manx (GV)","value":"gv"},{"id":"ha","label":"Hausa (HA)","value":"ha"},{"id":"hak","label":"Hakka Chinese (HAK)","value":"hak"},{"id":"haw","label":"Hawaiian (HAW)","value":"haw"},{"id":"he","label":"Hebrew (HE)","value":"he"},{"id":"hi","label":"Hindi (HI)","value":"hi"},{"id":"ho","label":"Hiri Motu (HO)","value":"ho"},{"id":"hr","label":"Croatian (HR)","value":"hr"},{"id":"ht","label":"Haitian (HT)","value":"ht"},{"id":"hu","label":"Hungarian (HU)","value":"hu"},{"id":"hy","label":"Armenian (HY)","value":"hy"},{"id":"hz","label":"Herero (HZ)","value":"hz"},{"id":"ia","label":"Interlingua (IA)","value":"ia"},{"id":"id","label":"Indonesian (ID)","value":"id"},{"id":"ie","label":"Interlingue (IE)","value":"ie"},{"id":"ig","label":"Igbo (IG)","value":"ig"},{"id":"ii","label":"Sichuan Yi (II)","value":"ii"},{"id":"ik","label":"Inupiak (IK)","value":"ik"},{"id":"ilo","label":"Ilokano (ILO)","value":"ilo"},{"id":"inh","label":"Ingush (INH)","value":"inh"},{"id":"io","label":"Ido (IO)","value":"io"},{"id":"is","label":"Icelandic (IS)","value":"is"},{"id":"it","label":"Italian (IT)","value":"it"},{"id":"iu","label":"Inuktitut (IU)","value":"iu"},{"id":"ja","label":"Japanese (JA)","value":"ja"},{"id":"jbo","label":"Lojban (JBO)","value":"jbo"},{"id":"jv","label":"Javanese (JV)","value":"jv"},{"id":"ka","label":"Georgian (KA)","value":"ka"},{"id":"kg","label":"Kongo (KG)","value":"kg"},{"id":"ki","label":"Kikuyu (KI)","value":"ki"},{"id":"kj","label":"Kuanyama (KJ)","value":"kj"},{"id":"kk","label":"Kazakh (KK)","value":"kk"},{"id":"kl","label":"Greenlandic (KL)","value":"kl"},{"id":"km","label":"Cambodian (KM)","value":"km"},{"id":"kn","label":"Kannada (KN)","value":"kn"},{"id":"khw","label":"Khowar (KHW)","value":"khw"},{"id":"ko","label":"Korean (KO)","value":"ko"},{"id":"kr","label":"Kanuri (KR)","value":"kr"},{"id":"ks","label":"Kashmiri (KS)","value":"ks"},{"id":"ksh","label":"Ripuarian (KSH)","value":"ksh"},{"id":"ku","label":"Kurdish (Kurmanji) (KU)","value":"ku"},{"id":"kv","label":"Komi (KV)","value":"kv"},{"id":"kw","label":"Cornish (KW)","value":"kw"},{"id":"ky","label":"Kirghiz (KY)","value":"ky"},{"id":"la","label":"Latin (LA)","value":"la"},{"id":"lad","label":"Ladino / Judeo-Spanish (LAD)","value":"lad"},{"id":"lan","label":"Lango (LAN)","value":"lan"},{"id":"lb","label":"Luxembourgish (LB)","value":"lb"},{"id":"lg","label":"Ganda (LG)","value":"lg"},{"id":"li","label":"Limburgian (LI)","value":"li"},{"id":"lij","label":"Ligurian (LIJ)","value":"lij"},{"id":"lmo","label":"Lombard (LMO)","value":"lmo"},{"id":"ln","label":"Lingala (LN)","value":"ln"},{"id":"lo","label":"Laotian (LO)","value":"lo"},{"id":"lzz","label":"Laz (LZZ)","value":"lzz"},{"id":"lt","label":"Lithuanian (LT)","value":"lt"},{"id":"lv","label":"Latvian (LV)","value":"lv"},{"id":"map-bms","label":"Banyumasan (MAP-BMS)","value":"map-bms"},{"id":"mg","label":"Malagasy (MG)","value":"mg"},{"id":"man","label":"Mandarin (MAN)","value":"man"},{"id":"mh","label":"Marshallese (MH)","value":"mh"},{"id":"mi","label":"Māori (MI)","value":"mi"},{"id":"min","label":"Minangkabau (MIN)","value":"min"},{"id":"mk","label":"Macedonian (MK)","value":"mk"},{"id":"ml","label":"Malayalam (ML)","value":"ml"},{"id":"mn","label":"Mongolian (MN)","value":"mn"},{"id":"mo","label":"Moldovan (MO)","value":"mo"},{"id":"mr","label":"Marathi (MR)","value":"mr"},{"id":"mrh","label":"Mara (MRH)","value":"mrh"},{"id":"ms","label":"Malay (MS)","value":"ms"},{"id":"mt","label":"Maltese (MT)","value":"mt"},{"id":"mus","label":"Creek / Muskogee (MUS)","value":"mus"},{"id":"mwl","label":"Mirandese (MWL)","value":"mwl"},{"id":"my","label":"Burmese (MY)","value":"my"},{"id":"na","label":"Nauruan (NA)","value":"na"},{"id":"nah","label":"Nahuatl (NAH)","value":"nah"},{"id":"nap","label":"Neapolitan (NAP)","value":"nap"},{"id":"nd","label":"North Ndebele (ND)","value":"nd"},{"id":"nds","label":"Low German / Low Saxon (NDS)","value":"nds"},{"id":"nds-nl","label":"Dutch Low Saxon (NDS-NL)","value":"nds-nl"},{"id":"ne","label":"Nepali (NE)","value":"ne"},{"id":"new","label":"Newar (NEW)","value":"new"},{"id":"ng","label":"Ndonga (NG)","value":"ng"},{"id":"nl","label":"Dutch (NL)","value":"nl"},{"id":"nn","label":"Norwegian Nynorsk (NN)","value":"nn"},{"id":"no","label":"Norwegian (NO)","value":"no"},{"id":"nr","label":"South Ndebele (NR)","value":"nr"},{"id":"nso","label":"Northern Sotho (NSO)","value":"nso"},{"id":"nrm","label":"Norman (NRM)","value":"nrm"},{"id":"nv","label":"Navajo (NV)","value":"nv"},{"id":"ny","label":"Chichewa (NY)","value":"ny"},{"id":"oc","label":"Occitan (OC)","value":"oc"},{"id":"oj","label":"Ojibwa (OJ)","value":"oj"},{"id":"om","label":"Oromo (OM)","value":"om"},{"id":"or","label":"Oriya (OR)","value":"or"},{"id":"os","label":"Ossetian / Ossetic (OS)","value":"os"},{"id":"pa","label":"Panjabi / Punjabi (PA)","value":"pa"},{"id":"pag","label":"Pangasinan (PAG)","value":"pag"},{"id":"pam","label":"Kapampangan (PAM)","value":"pam"},{"id":"pap","label":"Papiamentu (PAP)","value":"pap"},{"id":"pdc","label":"Pennsylvania German (PDC)","value":"pdc"},{"id":"pi","label":"Pali (PI)","value":"pi"},{"id":"pih","label":"Norfolk (PIH)","value":"pih"},{"id":"pl","label":"Polish (PL)","value":"pl"},{"id":"pms","label":"Piedmontese (PMS)","value":"pms"},{"id":"ps","label":"Pashto (PS)","value":"ps"},{"id":"pt","label":"Portuguese (PT)","value":"pt"},{"id":"qu","label":"Quechua (QU)","value":"qu"},{"id":"rm","label":"Raeto Romance (RM)","value":"rm"},{"id":"rmy","label":"Romani (RMY)","value":"rmy"},{"id":"rn","label":"Kirundi (RN)","value":"rn"},{"id":"ro","label":"Romanian (RO)","value":"ro"},{"id":"roa-rup","label":"Aromanian (ROA-RUP)","value":"roa-rup"},{"id":"ru","label":"Russian (RU)","value":"ru"},{"id":"rw","label":"Rwandi (RW)","value":"rw"},{"id":"sa","label":"Sanskrit (SA)","value":"sa"},{"id":"sc","label":"Sardinian (SC)","value":"sc"},{"id":"scn","label":"Sicilian (SCN)","value":"scn"},{"id":"sco","label":"Scots (SCO)","value":"sco"},{"id":"sd","label":"Sindhi (SD)","value":"sd"},{"id":"se","label":"Northern Sami (SE)","value":"se"},{"id":"sg","label":"Sango (SG)","value":"sg"},{"id":"sh","label":"Serbo-Croatian (SH)","value":"sh"},{"id":"si","label":"Sinhalese (SI)","value":"si"},{"id":"simple","label":"Simple English (SIMPLE)","value":"simple"},{"id":"sk","label":"Slovak (SK)","value":"sk"},{"id":"sl","label":"Slovenian (SL)","value":"sl"},{"id":"sm","label":"Samoan (SM)","value":"sm"},{"id":"sn","label":"Shona (SN)","value":"sn"},{"id":"so","label":"Somalia (SO)","value":"so"},{"id":"sq","label":"Albanian (SQ)","value":"sq"},{"id":"sr","label":"Serbian (SR)","value":"sr"},{"id":"ss","label":"Swati (SS)","value":"ss"},{"id":"st","label":"Southern Sotho (ST)","value":"st"},{"id":"su","label":"Sundanese (SU)","value":"su"},{"id":"sv","label":"Swedish (SV)","value":"sv"},{"id":"sw","label":"Swahili (SW)","value":"sw"},{"id":"ta","label":"Tamil (TA)","value":"ta"},{"id":"te","label":"Telugu (TE)","value":"te"},{"id":"tet","label":"Tetum (TET)","value":"tet"},{"id":"tg","label":"Tajik (TG)","value":"tg"},{"id":"th","label":"Thai (TH)","value":"th"},{"id":"ti","label":"Tigrinya (TI)","value":"ti"},{"id":"tk","label":"Turkmen (TK)","value":"tk"},{"id":"tl","label":"Tagalog (TL)","value":"tl"},{"id":"tlh","label":"Klingon (TLH)","value":"tlh"},{"id":"tn","label":"Tswana (TN)","value":"tn"},{"id":"to","label":"Tonga (TO)","value":"to"},{"id":"tpi","label":"Tok Pisin (TPI)","value":"tpi"},{"id":"tr","label":"Turkish (TR)","value":"tr"},{"id":"ts","label":"Tsonga (TS)","value":"ts"},{"id":"tt","label":"Tatar (TT)","value":"tt"},{"id":"tum","label":"Tumbuka (TUM)","value":"tum"},{"id":"tw","label":"Twi (TW)","value":"tw"},{"id":"ty","label":"Tahitian (TY)","value":"ty"},{"id":"udm","label":"Udmurt (UDM)","value":"udm"},{"id":"ug","label":"Uyghur (UG)","value":"ug"},{"id":"uk","label":"Ukrainian (UK)","value":"uk"},{"id":"ur","label":"Urdu (UR)","value":"ur"},{"id":"uz","label":"Uzbek (UZ)","value":"uz"},{"id":"uz_AF","label":"Uzbeki Afghanistan (UZ_AF)","value":"uz_AF"},{"id":"ve","label":"Venda (VE)","value":"ve"},{"id":"vi","label":"Vietnamese (VI)","value":"vi"},{"id":"vec","label":"Venetian (VEC)","value":"vec"},{"id":"vls","label":"West Flemish (VLS)","value":"vls"},{"id":"vo","label":"Volapük (VO)","value":"vo"},{"id":"wa","label":"Walloon (WA)","value":"wa"},{"id":"war","label":"Waray / Samar-Leyte Visayan (WAR)","value":"war"},{"id":"wo","label":"Wolof (WO)","value":"wo"},{"id":"xal","label":"Kalmyk (XAL)","value":"xal"},{"id":"xh","label":"Xhosa (XH)","value":"xh"},{"id":"xmf","label":"Megrelian (XMF)","value":"xmf"},{"id":"yi","label":"Yiddish (YI)","value":"yi"},{"id":"yo","label":"Yoruba (YO)","value":"yo"},{"id":"za","label":"Zhuang (ZA)","value":"za"},{"id":"zh","label":"Chinese (ZH)","value":"zh"},{"id":"zh-classical","label":"Classical Chinese (ZH-CLASSICAL)","value":"zh-classical"},{"id":"zh-min-nan","label":"Minnan (ZH-MIN-NAN)","value":"zh-min-nan"},{"id":"zh-yue","label":"Cantonese (ZH-YUE)","value":"zh-yue"},{"id":"zu","label":"Zulu (ZU)","value":"zu"}]'
)

export const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const CUSTOMER_STATUS_TYPE = {
  DRAFT: 1,
  IN_CONTACT: 2,
  CONFIRM_COLLABORATION: 3,
  SIGN_CONTRACT: 4,
  CONTRACT_EXPIRED: 5,
  END_COLLABORATION: 6,
  OTHER: 7,
}

export const CUSTOMER_STATUS: { [key: number]: IStatusConstant } = {
  [CUSTOMER_STATUS_TYPE.DRAFT]: {
    type: 1,
    label: 'Draft',
    color: 'grey',
  },
  [CUSTOMER_STATUS_TYPE.IN_CONTACT]: {
    type: 2,
    label: 'In Contact',
    color: 'orange',
  },
  [CUSTOMER_STATUS_TYPE.CONFIRM_COLLABORATION]: {
    type: 3,
    label: 'Confirm Collaboration',
    color: 'blue',
  },
  [CUSTOMER_STATUS_TYPE.SIGN_CONTRACT]: {
    type: 4,
    label: 'Sign Contract',
    color: 'green',
  },
  [CUSTOMER_STATUS_TYPE.CONTRACT_EXPIRED]: {
    type: 5,
    label: 'Contract Expired',
    color: 'red',
  },
  [CUSTOMER_STATUS_TYPE.END_COLLABORATION]: {
    type: 6,
    label: 'End Collaboration',
    color: 'grey',
  },
  [CUSTOMER_STATUS_TYPE.OTHER]: {
    type: 7,
    label: 'Other',
    color: 'grey',
  },
}

export const CONTRACT_STATUS_TYPE = {
  DRAFT: 1,
  NOTIFIED: 2,
  FILE_RECEIVED: 3,
  CONFIRM_FINAL_VERSION: 4,
  SENT_TO_CUSTOMER: 5,
  HARDCOPY_RECEIVED: 6,
}

export const CONTRACT_STATUS: { [key: number]: IStatusConstant } = {
  [CONTRACT_STATUS_TYPE.DRAFT]: {
    type: 1,
    label: 'Draft',
    color: 'grey',
  },
  [CONTRACT_STATUS_TYPE.NOTIFIED]: {
    type: 2,
    label: 'Notified',
    color: 'red',
  },
  [CONTRACT_STATUS_TYPE.FILE_RECEIVED]: {
    type: 3,
    label: 'File Received',
    color: 'orange',
  },
  [CONTRACT_STATUS_TYPE.CONFIRM_FINAL_VERSION]: {
    type: 4,
    label: 'Confirm Final Version',
    color: 'blue',
  },
  [CONTRACT_STATUS_TYPE.SENT_TO_CUSTOMER]: {
    type: 5,
    label: 'Sent To Customer',
    color: 'yellow',
  },
  [CONTRACT_STATUS_TYPE.HARDCOPY_RECEIVED]: {
    type: 6,
    label: 'Hardcopy Received',
    color: 'green',
  },
}

export const PROJECT_STATUS_TYPE = {
  NOT_STARTED: 1,
  PENDING: 2,
  IN_PROGRESS: 3,
  COMPLETED: 4,
  CANCELLED: 5,
}

export const PROJECT_STATUS: { [key: number]: IStatusConstant } = {
  [PROJECT_STATUS_TYPE.NOT_STARTED]: {
    type: 1,
    label: 'Not Started',
    color: 'grey',
  },
  [PROJECT_STATUS_TYPE.PENDING]: {
    type: 2,
    label: 'Pending',
    color: 'orange',
  },
  [PROJECT_STATUS_TYPE.IN_PROGRESS]: {
    type: 3,
    label: 'In Progress',
    color: 'blue',
  },
  [PROJECT_STATUS_TYPE.COMPLETED]: {
    type: 4,
    label: 'Completed',
    color: 'green',
  },
  [PROJECT_STATUS_TYPE.CANCELLED]: {
    type: 5,
    label: 'Cancelled',
    color: 'red',
  },
}

export const CURRENCY_CODE = {
  VND: 162,
  USD: 158,
  JPY: 76,
}

export const PROJECT_TYPE_ID = {
  LA_BO: 1,
  PJ: 2,
  OTHER: 3,
}

export const BRANCH_TYPE = {
  ALL_BRANCH: {
    id: 'BRA-000',
    name: 'All company Branches',
    note: 'Apply to CEO role only',
  },
  MA: {
    id: 'BRA-004',
    name: 'MA',
    note: 'MOR Asia',
  },
  MDN: {
    id: 'BRA-003',
    name: 'MDN',
    note: 'MOR Đà Nẵng',
  },
  MHN: {
    id: 'BRA-001',
    name: 'MHN',
    note: 'MOR Hà Nội',
  },
  MSG: {
    id: 'BRA-002',
    name: 'MSG',
    note: 'MOR Sài Gòn',
  },
}
export const ID_MODULE_SETTING = 6

export const UNIT_OF_TIME: {
  id: '1' | '2' | '3'
  label: string
  value: '1' | '2' | '3'
  note: string
}[] = [
  {
    id: '3',
    label: 'Man Month',
    value: '3',
    note: 'MM',
  },
  {
    id: '2',
    label: 'Man Day',
    value: '2',
    note: 'MD',
  },
  {
    id: '1',
    label: 'Hours',
    value: '1',
    note: 'H',
  },
]

export const ACCEPT_CONTRACT_UPLOAD = {
  'text/html': ['.doc', '.docx', '.pdf'],
}

export const ACCEPT_DEFAULT_UPLOAD = {
  'image/png': ['.png', '.jpg'],
  ...ACCEPT_CONTRACT_UPLOAD,
}

export const DEFAULT_MAX_FILES = 25
export const DEFAULT_FILE_MAX_SIZE = 5242880
export const DEFAULT_UPLOAD_ACCEPT_FILE_TYPES: UploadAcceptFileTypes = {
  'text/html': ['.doc', '.docx', '.pdf'],
}

export const MODULE_CUSTOMER_CONST = 1
export const MODULE_PROJECT_CONST = 2
export const MODULE_STAFF_CONST = 3
export const MODULE_FINANCE_CONST = 4
export const MODULE_CONTRACT_CONST = 5
export const MODULE_DAILY_REPORT_CONST = 6
export const MODULE_PROJECT_REQUEST_OT_CONST = 7

export const SUB_MODULE_STAFF_FILTER = 1
export const SUB_MODULE_STAFF_INTERNAL = 2
export const SUB_MODULE_STAFF_OUTSOURCE = 3

export const listMonths = [
  {
    id: 1,
    label: 'Jan',
    value: 1,
    name: 'Jan',
  },
  {
    id: 2,
    label: 'Feb',
    value: 2,
    name: 'Feb',
  },
  {
    id: 3,
    label: 'Mar',
    value: 3,
    name: 'Mar',
  },
  {
    id: 4,
    label: 'Apr',
    value: 4,
    name: 'Apr',
  },
  {
    id: 5,
    label: 'May',
    value: 5,
    name: 'May',
  },
  {
    id: 6,
    label: 'Jun',
    value: 6,
    name: 'Jun',
  },
  {
    id: 7,
    label: 'Jul',
    value: 7,
    name: 'Jul',
  },
  {
    id: 8,
    label: 'Aug',
    value: 8,
    name: 'Aug',
  },
  {
    id: 9,
    label: 'Sep',
    value: 9,
    name: 'Sep',
  },
  {
    id: 10,
    label: 'Oct',
    value: 10,
    name: 'Oct',
  },
  {
    id: 11,
    label: 'Nov',
    value: 11,
    name: 'Nov',
  },
  {
    id: 12,
    label: 'Dec',
    value: 12,
    name: 'Dec',
  },
]
export const NOTIFICATIONS_TYPE = {
  DAILY_REPORT: 1,
  MMO: {
    FINAL_SCORE: 2,
    APPRAISER_1_ABOUT_APPRAISEE_COMPLETE_EVALUATION: 3,
    APPRAISER_2_ABOUT_APPRAISER_1_COMPLETE_EVALUATION: 4,
    REVIEWER_ABOUT_APPRAISER_2_COMPLETE_EVALUATION: 5,
    REVIEWER_REJECT_ACHIEVEMENT: 6,
    REVIEWER_REJECT_SCORE: 7,
    UPCOMMING_EVALUATION_PERIOD: 8,
  },
  CONTRACT: {
    CONTRACT_NOTIFICATION: 'CONTRACT_NOTIFICATION',
  },
  PROJECT: {
    REQUEST_OT_CREATED: 9,
    REQUEST_OT_APPROVED: 10,
    REQUEST_OT_REJECTED: 11,
    BITBUCKET_GENERATED: {
      PROJECT_NAME: 12,
      PROJECT_KEY: 13,
    },
    BITBUCKET_UNSUCCESSFULLY: 14,
    JIRA_GENERATED: {
      PROJECT_NAME: 15,
      PROJECT_KEY: 16,
    },
    JIRA_UNSUCCESSFULLY: 17,
    GROUP_MAIL_GENERATED: 18,
    GROUP_MAIL_UNSUCCESSFULLY: 19,
    GROUP_MAIL_UPDATED: 20,
    JIRA_UPDATED: 21,
    BITBUCKET_UPDATED: 22,
    GENERATING_PROJECT_TOOLS_COMPLETED: 24,
    MEMBER: {
      ADD_NEW: 25,
      REMOVE: 26,
      ADD_NEW_SALE: 27,
    },
    MANAGER: {
      ADD_NEW: 28,
      ADD_NEW_SUB: 29,
    },
    CHANGES_THE_START_AND_DATE: 30,
    CHANGES_STATUS_CANCELLED: 31,
    CHANGES_STATUS_COMPLETED: 32,
    PROJECT_CREATE_1: 33,
    PROJECT_CREATE_2: 34,
    PROJECT_CREATE_3: 35,
    PROJECT_CREATE_4: 36,
    OT_REPORT: {
      REPORT_OT_CREATED: 37,
      REPORT_OT_APPROVED: 38,
      REPORT_OT_REJECTED_DD: 39,
      REPORT_OT_REJECTED_PM: 40,
      REPORT_OT_CONFIRMED: 41,
      REPORT_OT_EDITED: 42,
    },
  },
  STAFF: {
    INACTIVE: 43,
  },
}

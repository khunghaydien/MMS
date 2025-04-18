import { createTheme } from '@mui/material/styles'
import { ThemeOptions as ThemeOptionsOld } from '@mui/material/styles/createTheme'

export const themeColors = {
  color: {
    blue: {
      primary: '#205DCE',
      secondary: '#6F9AE8',
      tertiary: '#7FA8F2',
      fourth: '#60c6f3',
      fifth: '#0484CB',
      small: '#17469F0D',
      six: '#003aa912',
    },
    orange: {
      primary: '#FC9C56',
      secondary: '#E67A33',
      third: '#CD7B2E',
      four: '#CD4A00',
    },
    black: {
      primary: '#333333',
      secondary: '#666666',
      tertiary: '#999999',
      porcelain: '#F1F2F7',
    },
    white: '#FFFFFF',
    grey: {
      primary: '#C4C4C4',
      secondary: '#DCDCDC',
      tertiary: '#F8F8F8',
      fourth: '#BFBFBF',
      grayE: '#EEEEEE',
    },
    green: { primary: '#14AE5C', shamrock: '#03Ac13', emerald: '#028A0F' },
    yellow: {
      primary: '#FFCD3C',
      secondary: '#F1D261',
      adonisRose: '#EFBF4D',
      aesthetic: '#EFD033',
    },
    error: {
      primary: '#d32f2f',
      secondary: '#FF3C3C',
      tertiary: '#FFE5EE',
      fourth: '#D90D32',
    },
    violet: {
      primary: '#9747FF',
    },
    earthy: {
      primary: '#DC9961',
    },
  },
} as const

const themeOptions: ThemeOptionsOld = {
  ...themeColors,
  palette: {
    primary: {
      main: themeColors.color.blue.primary,
    },
  },
  typography: {
    fontSize: 14,
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {},
      },
    },
  },
}

type CustomTheme = {
  [Key in keyof typeof themeColors]: (typeof themeColors)[Key]
}
declare module '@mui/material/styles/createTheme' {
  interface Theme extends CustomTheme {}
  interface ThemeOptions extends CustomTheme {}
}

export const theme = createTheme({ ...themeColors, ...themeOptions })

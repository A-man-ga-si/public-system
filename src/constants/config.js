// Application theme related configs
export const defaultTitle = 'Rencanakan.id';
export const titleSuffix = ' | Yuk Mulai Hitung RAB';

// URLs Related Configs
export const apiDomain = process.env.VUE_APP_BASE_API_URL;
export const apiDomainTalentPool = process.env.VUE_APP_BASE_API_URL_TALENT_POOL;

export const apiUrl = `${apiDomain}/api`;
export const apiUrlTalentPool = `${apiDomainTalentPool}/api`;
export const adminRoot = '/app';
export const searchPath = `${adminRoot}/#`;
export const buyUrl = '#';
export const landingPageUrl = 'https://rencanakan.id';

// export const midtransModuleUrl = 'https://app.sandbox.midtrans.com/snap/snap.js'
// export const midtransClientKey = 'SB-Mid-client-woKoDnctT1WZG9R1'

export const midtransModuleUrl = process.env.NODE_ENV == 'development' ? 'https://app.sandbox.midtrans.com/snap/snap.js' : 'https://app.midtrans.com/snap/snap.js'
export const midtransClientKey = process.env.NODE_ENV == 'development' ? 'SB-Mid-client-woKoDnctT1WZG9R1' : 'Mid-client-1U2bmsvjj8eJIBEP'

// const midtransScriptEl = document.createElement('script');
//       midtransScriptEl.setAttribute('src', 'https://app.midtrans.com/snap/snap.js')
//       midtransScriptEl.setAttribute('data-client-key', 'Mid-client-1U2bmsvjj8eJIBEP')
//       document.head.appendChild(midtransScriptEl)

// Theme Related Configs
export const defaultMenuType = 'menu-default'; // 'menu-default', 'menu-sub-hidden', 'menu-hidden';
export const rounded = true;
export const subHiddenBreakpoint = 1440;
export const menuHiddenBreakpoint = 768;

export const defaultProfilePictureName = 'default-profile-picture.svg';
export const defaultCompanyPictureName = 'default-company-picture.png';
export const isAuthGuardActive = true;
export const themeRadiusStorageKey = 'theme_radius';
export const themeSelectedColorStorageKey = 'theme_selected_color';
export const defaultColor = 'light.blueolympic';
export const colors = [
  'bluenavy',
  'blueyale',
  'blueolympic',
  'greenmoss',
  'greenlime',
  'purplemonster',
  'orangecarrot',
  'redruby',
  'yellowgranola',
  'greysteel',
];

// Locale Related Configs
export const defaultLocale = 'id';
export const defaultDirection = 'ltr';
export const localeOptions = [
  { id: 'en', name: 'English', direction: 'ltr' },
  { id: 'id', name: 'Indonesian', direction: 'ltr' },
];

// Miscellaneous configs
export const availableErrorCodes = ['404', '403', '500'];
export const dateFormats = {
  longDateTime: "YYYY-MM-DD_HH:mm:ss",
  excelFile: "YYYY-MM-DD_HHmmss"
}

export const PAGINATION_DEFAULT_LIMIT = 15;

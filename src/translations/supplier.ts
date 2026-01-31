export type Language = 'en' | 'ja';

export const translations = {
  en: {
    asRegisteredCompany: 'As a registered company',
    companyDesc: 'A company registered with official documents.',
    asRegisteredIndividual: 'As a registered individual',
    individualDesc: 'An individual guide or freelancer.',
    otherBusinessType: 'Other',
    otherDesc: 'Other type of business or organization.',
    createSupplierAccount: 'Create supplier account',
    companyDetails: 'Company details',
    howManyEmployees: 'How many employees do you have?',
    individualDetails: 'Individual details',
    howManyActivitiesIndividual: 'How many activities do you operate?',
    businessInformation: 'Business information',
    companyNamePlaceholder: 'Company name',
    city: 'City',
    cityPlaceholder: 'Enter your city',
    accountCreation: 'Account creation',
    firstNamePlaceholder: 'First name',
    lastNamePlaceholder: 'Last name',
    emailPlaceholder: 'Email address',
    passwordPlaceholder: 'Password (min 8 characters)',
    previous: 'Previous',
    submitRegistration: 'Submit registration',
    next: 'Next'
  },
  ja: {
    asRegisteredCompany: '法人として登録',
    companyDesc: '正式な書類で登録された会社。',
    asRegisteredIndividual: '個人として登録',
    individualDesc: '個人ガイドまたはフリーランス。',
    otherBusinessType: 'その他',
    otherDesc: 'その他の事業形態または組織。',
    createSupplierAccount: 'サプライヤーアカウント作成',
    companyDetails: '会社情報',
    howManyEmployees: '従業員数は何人ですか？',
    individualDetails: '個人情報',
    howManyActivitiesIndividual: '提供している体験数は？',
    businessInformation: 'ビジネス情報',
    companyNamePlaceholder: '会社名',
    city: '都市',
    cityPlaceholder: '都市名を入力',
    accountCreation: 'アカウント作成',
    firstNamePlaceholder: '名',
    lastNamePlaceholder: '姓',
    emailPlaceholder: 'メールアドレス',
    passwordPlaceholder: 'パスワード（8文字以上）',
    previous: '戻る',
    submitRegistration: '登録を送信',
    next: '次へ'
  }
} as const;

export function getTranslation(language: Language, key: keyof typeof translations.en): string {
  const lang = translations[language] ? language : 'en';
  return translations[lang][key] || translations.en[key];
}

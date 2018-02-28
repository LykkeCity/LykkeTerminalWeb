new SmartBanner({
  daysHidden: 3,   // days to hide banner after close button is clicked (defaults to 15)
  daysReminder: 30, // days to hide banner after "VIEW" button is clicked (defaults to 90)
  appStoreLanguage: 'us', // language code for the App Store (defaults to user's browser language)
  title: 'Lykke Wallet',
  author: 'Lykke Corp',
  button: 'VIEW',
  store: {
    ios: 'On the App Store',
    android: 'In Google Play'
  },
  price: {
    ios: 'GET',
    android: 'GET'
  }
});
//hiển thị thông báo background
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js')

if ('serviceWorker' in navigator) {
  const firebaseConfigParams = new URLSearchParams(firebaseConfig).toString()
  navigator.serviceWorker
    .register(`./firebase-messaging-sw.js?${firebaseConfigParams}`)
    .then(function (registration) {
      console.log('Registration successful, scope is:', registration.scope)
    })
    .catch(function (err) {
      console.log('Service worker registration failed, error:', err)
    })
}

self.addEventListener('fetch', () => {
  const urlParams = new URLSearchParams(location.search)
  self.firebaseConfig = Object.fromEntries(urlParams)
})
const defaultConfig = {
  apiKey: true,
  projectId: true,
  messagingSenderId: true,
  appId: true,
}

self.addEventListener('notificationclick', event => {
  event.notification.close()
  const urlToOpen = 'http://192.168.4.9:9030/daily-report/main'
  event.waitUntil(clients.openWindow(urlToOpen))
})

firebase.initializeApp(self.firebaseConfig || defaultConfig)
if (firebase.messaging.isSupported()) {
  const messaging = firebase.messaging()
  const channel = new BroadcastChannel('notifications')
  messaging.onBackgroundMessage(function (payload) {
    channel.postMessage(payload)
  })
}

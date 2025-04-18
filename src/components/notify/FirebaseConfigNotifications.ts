import { ENVIRONMENT } from '@/const/api.const'
import { FirebaseApp, initializeApp } from 'firebase/app'
import {
  MessagePayload,
  Messaging,
  getMessaging,
  getToken,
  onMessage,
} from 'firebase/messaging'
import Cookies from 'js-cookie'

const isProduction = ENVIRONMENT === 'production'

const firebaseConfig = {
  apiKey: 'AIzaSyC7iGKPZz-EbsHvuNshTCWRf9aAS4qVTeM',
  authDomain: 'fir-testing-ed15e.firebaseapp.com',
  projectId: 'fir-testing-ed15e',
  storageBucket: 'fir-testing-ed15e.appspot.com',
  messagingSenderId: '566038515663',
  appId: '1:566038515663:web:cc02bd60b96ff41ac1ccba',
  measurementId: 'G-7S7DTN77GB',
}

let app: FirebaseApp | undefined = undefined
if (isProduction) {
  app = initializeApp(firebaseConfig)
}

let messaging: Messaging | undefined = undefined
if (isProduction && app) {
  messaging = getMessaging(app)
}

let requestPermission: Function | undefined = undefined
if (isProduction) {
  requestPermission = async () => {
    const permission = await Notification.requestPermission()
    if (permission === 'granted' && messaging) {
      const token = await getToken(messaging, {
        vapidKey:
          'BFbbShHHg0bZyUIbUcxJ_j150xXUauMyV3ybIfKHaVGOO3uMWpSWxzqHIyvD3qxm5bMcf1j0fyfrnEShal31DqU',
      })
      Cookies.set('deviceToken', token, { expires: 1 })
    } else if (permission === 'denied') {
      console.error('You denied for the notification')
    }
  }
}

let onMessageListener: Function | undefined = undefined
if (isProduction) {
  onMessageListener = () => {
    if (!messaging) return undefined
    return new Promise(resolve => {
      // @ts-ignore
      onMessage(messaging, (payload: MessagePayload) => {
        resolve(payload)
      })
    })
  }
}

export { messaging, onMessageListener, requestPermission }

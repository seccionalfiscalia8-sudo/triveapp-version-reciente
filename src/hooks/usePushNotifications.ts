import { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import * as Device from 'expo-device'
import {
  getPushNotificationToken,
  registerPushToken,
  loadNotificationPreferences,
  saveNotificationPreferences,
  setupNotificationListeners,
} from '../services/pushNotifications'

export interface NotificationPreferences {
  push: boolean
  email: boolean
  sms: boolean
}

// iOS + Android soportan push notifications (en dispositivos físicos)
const isPushAvailableOnPlatform = Platform.OS === 'ios' || Platform.OS === 'android'

export const usePushNotifications = (userId?: string) => {
  const [isDeviceSupported, setIsDeviceSupported] = useState(false)
  const [pushToken, setPushToken] = useState<string | null>(null)
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    push: true,
    email: true,
    sms: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Inicializar notificaciones push
  useEffect(() => {
    // Android no soporta push en Expo Go - solo iOS
    if (!isPushAvailableOnPlatform) {
      console.log('[DEBUG usePushNotifications] Platform no soporta push:', Platform.OS)
      setIsDeviceSupported(false)
      return
    }

    console.log('[DEBUG usePushNotifications] Inicializando push notifications...')
    console.log('[DEBUG usePushNotifications] Platform:', Platform.OS, '| Device.isDevice:', Device.isDevice)

    // Nota: En Android real, Device.isDevice a veces retorna false
    // Intentamos de todas formas porque es un dispositivo físico
    if (!Device.isDevice && Platform.OS !== 'android') {
      console.log('[DEBUG usePushNotifications] No es dispositivo físico (non-Android)')
      setIsDeviceSupported(false)
      return
    }

    if (Device.isDevice || Platform.OS === 'android') {
      setIsDeviceSupported(true)
    }

    // Cargar preferencias guardadas
    const initNotifications = async () => {
      try {
        setLoading(true)
        const savedPreferences = await loadNotificationPreferences()
        console.log('[DEBUG usePushNotifications] Preferencias cargadas:', savedPreferences)
        setPreferences(savedPreferences)

        // Si push está habilitado y hay userId, registrar token
        if (savedPreferences.push && userId) {
          console.log('[DEBUG usePushNotifications] userId:', userId)
          console.log('[DEBUG usePushNotifications] Obteniendo token push...')
          const token = await getPushNotificationToken()
          console.log('[DEBUG usePushNotifications] Token obtenido:', token)
          
          if (token) {
            setPushToken(token)
            console.log('[DEBUG usePushNotifications] Registrando token en BD para userId:', userId)
            await registerPushToken(userId, token)
            console.log('[DEBUG usePushNotifications] ✅ Token registrado exitosamente')
          } else {
            console.log('[DEBUG usePushNotifications] ⚠️ Token es null, no se registró')
          }
        } else {
          console.log('[DEBUG usePushNotifications] Skip - push disabled:', !savedPreferences.push, 'o sin userId:', !userId)
        }
      } catch (err: any) {
        setError(err.message || 'Error al configurar notificaciones')
        console.error('[DEBUG usePushNotifications] Error:', err)
      } finally {
        setLoading(false)
      }
    }

    initNotifications()

    // Configurar listeners de notificaciones
    const cleanupListeners = setupNotificationListeners()

    return () => {
      if (cleanupListeners) {
        cleanupListeners()
      }
    }
  }, [userId])

  // Actualizar preferencia de push
  const togglePushNotifications = async (enabled: boolean) => {
    try {
      const newPreferences = { ...preferences, push: enabled }
      setPreferences(newPreferences)
      await saveNotificationPreferences(newPreferences)

      // Si se habilita, obtener token
      if (enabled && userId && !pushToken) {
        const token = await getPushNotificationToken()
        if (token) {
          setPushToken(token)
          await registerPushToken(userId, token)
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error ao actualizar preferencia')
    }
  }

  // Actualizar preferencia de email
  const toggleEmailNotifications = async (enabled: boolean) => {
    try {
      const newPreferences = { ...preferences, email: enabled }
      setPreferences(newPreferences)
      await saveNotificationPreferences(newPreferences)

      if (userId) {
        // TODO: Guardar en base de datos si es necesario
      }
    } catch (err: any) {
      setError(err.message || 'Error ao actualizar preferencia')
    }
  }

  // Actualizar preferencia de SMS
  const toggleSmsNotifications = async (enabled: boolean) => {
    try {
      const newPreferences = { ...preferences, sms: enabled }
      setPreferences(newPreferences)
      await saveNotificationPreferences(newPreferences)

      if (userId) {
        // TODO: Guardar en base de datos si es necesario
      }
    } catch (err: any) {
      setError(err.message || 'Error ao actualizar preferencia')
    }
  }

  return {
    pushToken,
    preferences,
    isDeviceSupported,
    loading,
    error,
    togglePushNotifications,
    toggleEmailNotifications,
    toggleSmsNotifications,
  }
}

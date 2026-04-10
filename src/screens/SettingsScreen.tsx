import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../theme/theme'

export default function SettingsScreen() {
  const navigation = useNavigation()
  const [pushNotifications, setPushNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [biometric, setBiometric] = useState(false)

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Configuración</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Notificaciones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notificaciones</Text>
        
        <View style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <View style={styles.settingIcon}>
              <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Notificaciones Push</Text>
              <Text style={styles.settingDescription}>Alertas de viajes y reservas</Text>
            </View>
            <Switch 
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: COLORS.borderLight, true: COLORS.primary + '30' }}
              thumbColor={pushNotifications ? COLORS.primary : COLORS.textTertiary}
            />
          </View>
        </View>

        <View style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <View style={styles.settingIcon}>
              <Ionicons name="mail-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Correo Electrónico</Text>
              <Text style={styles.settingDescription}>Notificaciones por email</Text>
            </View>
            <Switch 
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: COLORS.borderLight, true: COLORS.primary + '30' }}
              thumbColor={emailNotifications ? COLORS.primary : COLORS.textTertiary}
            />
          </View>
        </View>

        <View style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <View style={styles.settingIcon}>
              <Ionicons name="phone-portrait-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Mensajes SMS</Text>
              <Text style={styles.settingDescription}>Alertas críticas por SMS</Text>
            </View>
            <Switch 
              value={smsNotifications}
              onValueChange={setSmsNotifications}
              trackColor={{ false: COLORS.borderLight, true: COLORS.primary + '30' }}
              thumbColor={smsNotifications ? COLORS.primary : COLORS.textTertiary}
            />
          </View>
        </View>
      </View>

      {/* Privacidad y Seguridad */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacidad y Seguridad</Text>
        
        <TouchableOpacity 
          style={styles.settingCard}
          activeOpacity={0.7}
        >
          <View style={styles.settingHeader}>
            <View style={styles.settingIcon}>
              <Ionicons name="finger-print-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Autenticación Biométrica</Text>
              <Text style={styles.settingDescription}>Huella o reconocimiento facial</Text>
            </View>
            <Switch 
              value={biometric}
              onValueChange={setBiometric}
              trackColor={{ false: COLORS.borderLight, true: COLORS.primary + '30' }}
              thumbColor={biometric ? COLORS.primary : COLORS.textTertiary}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingCard}
          onPress={() => Alert.alert('Cambiar Contraseña', 'Serás redirigido a verificar tu identidad')}
          activeOpacity={0.7}
        >
          <View style={styles.settingHeader}>
            <View style={styles.settingIcon}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Cambiar Contraseña</Text>
              <Text style={styles.settingDescription}>Actualiza tu contraseña de forma segura</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingCard}
          onPress={() => navigation.navigate('Privacy' as never)}
          activeOpacity={0.7}
        >
          <View style={styles.settingHeader}>
            <View style={styles.settingIcon}>
              <Ionicons name="eye-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Configuración de Privacidad</Text>
              <Text style={styles.settingDescription}>Controla quién ve tu perfil</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingCard}
          onPress={() => Alert.alert('Sesiones Activas', 'Gesiona los dispositivos conectados')}
          activeOpacity={0.7}
        >
          <View style={styles.settingHeader}>
            <View style={styles.settingIcon}>
              <Ionicons name="phone-landscape-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Sesiones Activas</Text>
              <Text style={styles.settingDescription}>Dispositivos conectados a tu cuenta</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Apariencia */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Apariencia</Text>
        
        <TouchableOpacity 
          style={styles.settingCard}
          activeOpacity={0.7}
        >
          <View style={styles.settingHeader}>
            <View style={styles.settingIcon}>
              <Ionicons name="moon-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Modo Oscuro</Text>
              <Text style={styles.settingDescription}>Ahorra batería en la noche</Text>
            </View>
            <Switch 
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: COLORS.borderLight, true: COLORS.primary + '30' }}
              thumbColor={darkMode ? COLORS.primary : COLORS.textTertiary}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingCard}
          onPress={() => Alert.alert('Idioma', 'Selecciona tu idioma preferido')}
          activeOpacity={0.7}
        >
          <View style={styles.settingHeader}>
            <View style={styles.settingIcon}>
              <Ionicons name="globe-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Idioma</Text>
              <Text style={styles.settingDescription}>Español (Colombia)</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Información */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información</Text>
        
        <TouchableOpacity 
          style={styles.settingCard}
          onPress={() => navigation.navigate('AboutTrive' as never)}
          activeOpacity={0.7}
        >
          <View style={styles.settingHeader}>
            <View style={styles.settingIcon}>
              <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Acerca de Trive</Text>
              <Text style={styles.settingDescription}>Versión 1.0.0</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingCard}
          onPress={() => navigation.navigate('TermsOfService' as never)}
          activeOpacity={0.7}
        >
          <View style={styles.settingHeader}>
            <View style={styles.settingIcon}>
              <Ionicons name="document-text-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Términos de Servicio</Text>
              <Text style={styles.settingDescription}>Políticas y condiciones de uso</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingCard}
          onPress={() => navigation.navigate('PrivacyPolicy' as never)}
          activeOpacity={0.7}
        >
          <View style={styles.settingHeader}>
            <View style={styles.settingIcon}>
              <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Política de Privacidad</Text>
              <Text style={styles.settingDescription}>Cómo usamos tus datos</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingCard}
          onPress={() => navigation.navigate('Support' as never)}
          activeOpacity={0.7}
        >
          <View style={styles.settingHeader}>
            <View style={styles.settingIcon}>
              <Ionicons name="help-circle-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Soporte y Ayuda</Text>
              <Text style={styles.settingDescription}>Comunícate con nosotros</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // Header
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  
  // Section
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.label,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  
  // Setting Card
  settingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.lg,
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
    gap: SPACING.xs,
  },
  settingLabel: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  settingDescription: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
})

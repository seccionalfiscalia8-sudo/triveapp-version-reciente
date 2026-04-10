import { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../theme/theme'

export default function PrivacyScreen() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const [isPublicProfile, setIsPublicProfile] = useState(false)
  const [shareLocation, setShareLocation] = useState(true)
  const [showRating, setShowRating] = useState(true)
  const [allowMessages, setAllowMessages] = useState(true)
  const [searchIndexing, setSearchIndexing] = useState(false)

  const handleDownloadData = () => {
    Alert.alert(
      'Descargar mis datos',
      'Se enviará un archivo con toda tu información personal a tu correo electrónico. Esto puede tomar hasta 48 horas.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Descargar',
          onPress: () => Alert.alert('Éxito', 'Se enviará un enlace de descarga a tu correo'),
        },
      ]
    )
  }

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar cuenta',
      '⚠️ Esta acción no se puede deshacer. Se eliminarán todos tus datos y ese cuenta no podrá ser recuperada.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Entendido, continuar',
          onPress: () => {
            Alert.alert(
              'Confirmar eliminación',
              'Por favor, ingresa tu contraseña para confirmar la eliminación de tu cuenta.',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', style: 'destructive' },
              ]
            )
          },
        },
      ]
    )
  }

  const handleBlockedUsers = () => {
    Alert.alert(
      'Usuarios bloqueados',
      'Aquí puedes ver y desbloquear usuarios.',
      [{ text: 'OK' }]
    )
  }

  return (
    <View style={[styles.safeContainer, { paddingTop: insets.top }]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Privacidad</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Perfil */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mi Perfil</Text>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <Ionicons name="person-outline" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Perfil Público</Text>
                <Text style={styles.cardDescription}>
                  {isPublicProfile ? 'Tu perfil es visible para todos' : 'Tu perfil solo es visible para contactos'}
                </Text>
              </View>
              <Switch
                value={isPublicProfile}
                onValueChange={setIsPublicProfile}
                trackColor={{ false: COLORS.borderLight, true: COLORS.primary + '50' }}
                thumbColor={isPublicProfile ? COLORS.primary : COLORS.textTertiary}
              />
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <Ionicons name="star-outline" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Mostrar Calificación</Text>
                <Text style={styles.cardDescription}>
                  {showRating ? 'Tu calificación es visible' : 'Tu calificación está oculta'}
                </Text>
              </View>
              <Switch
                value={showRating}
                onValueChange={setShowRating}
                trackColor={{ false: COLORS.borderLight, true: COLORS.primary + '50' }}
                thumbColor={showRating ? COLORS.primary : COLORS.textTertiary}
              />
            </View>
          </View>
        </View>

        {/* Ubicación */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ubicación</Text>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <Ionicons name="location-outline" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Compartir Ubicación en Viajes</Text>
                <Text style={styles.cardDescription}>
                  {shareLocation ? 'Los conductores ven tu ubicación' : 'Ubicación no compartida'}
                </Text>
              </View>
              <Switch
                value={shareLocation}
                onValueChange={setShareLocation}
                trackColor={{ false: COLORS.borderLight, true: COLORS.primary + '50' }}
                thumbColor={shareLocation ? COLORS.primary : COLORS.textTertiary}
              />
            </View>
          </View>
        </View>

        {/* Comunicación */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comunicación</Text>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <Ionicons name="chatbubble-outline" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Recibir Mensajes</Text>
                <Text style={styles.cardDescription}>
                  {allowMessages ? 'Puedes recibir mensajes de otros usuarios' : 'Mensajes desactivados'}
                </Text>
              </View>
              <Switch
                value={allowMessages}
                onValueChange={setAllowMessages}
                trackColor={{ false: COLORS.borderLight, true: COLORS.primary + '50' }}
                thumbColor={allowMessages ? COLORS.primary : COLORS.textTertiary}
              />
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <Ionicons name="search-outline" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Indexación en Búsqueda</Text>
                <Text style={styles.cardDescription}>
                  {searchIndexing ? 'Motores de búsqueda pueden indexar tu perfil' : 'Tu perfil no aparece en búsquedas'}
                </Text>
              </View>
              <Switch
                value={searchIndexing}
                onValueChange={setSearchIndexing}
                trackColor={{ false: COLORS.borderLight, true: COLORS.primary + '50' }}
                thumbColor={searchIndexing ? COLORS.primary : COLORS.textTertiary}
              />
            </View>
          </View>
        </View>

        {/* Usuarios Bloqueados */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seguridad</Text>

          <TouchableOpacity
            style={styles.card}
            onPress={handleBlockedUsers}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <Ionicons name="ban-outline" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Usuarios Bloqueados</Text>
                <Text style={styles.cardDescription}>Gestiona usuarios que has bloqueado</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Datos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tus Datos</Text>

          <TouchableOpacity
            style={styles.card}
            onPress={handleDownloadData}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <Ionicons name="download-outline" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Descargar mis Datos</Text>
                <Text style={styles.cardDescription}>Obtén una copia de tu información</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.dangerCard]}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, styles.dangerIcon]}>
                <Ionicons name="trash-outline" size={20} color={COLORS.error} />
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.cardLabel, styles.dangerLabel]}>Eliminar Cuenta</Text>
                <Text style={[styles.cardDescription, styles.dangerDescription]}>
                  Esta acción no se puede deshacer
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.error} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Info Footer */}
        <View style={styles.footer}>
          <Ionicons name="information-circle-outline" size={16} color={COLORS.textTertiary} />
          <Text style={styles.footerText}>
            Tu privacidad es importante. Puedes cambiar estas configuraciones en cualquier momento.
          </Text>
        </View>
      </ScrollView>
    </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    ...TYPOGRAPHY.h3,
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.label,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
    fontSize: 12,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  dangerCard: {
    backgroundColor: COLORS.error + '08',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dangerIcon: {
    backgroundColor: COLORS.error + '15',
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  dangerLabel: {
    color: COLORS.error,
  },
  cardDescription: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  dangerDescription: {
    color: COLORS.error,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  footerText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textTertiary,
    flex: 1,
    lineHeight: 20,
  },
})

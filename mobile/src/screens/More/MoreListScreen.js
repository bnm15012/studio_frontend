import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';

import { clearAuthState } from '../../state/authSlice';

const COLORS = {
  primary: '#6366f1',
  primaryLight: '#eef2ff',
  background: '#f9fafb',
  card: '#ffffff',
  text: '#111827',
  secondaryText: '#6b7280',
  success: '#10b981',
  successLight: '#ecfdf5',
  danger: '#ef4444',
  dangerLight: '#fef2f2',
  border: '#e5e7eb',
  amber: '#f59e0b',
  amberLight: '#fffbeb',
  sky: '#0ea5e9',
  skyLight: '#f0f9ff',
  violet: '#8b5cf6',
  violetLight: '#f5f3ff',
  rose: '#f43f5e',
  roseLight: '#fff1f2',
  teal: '#14b8a6',
  tealLight: '#f0fdfa',
  orange: '#f97316',
  orangeLight: '#fff7ed',
};

const MORE_ITEMS = [
  {
    key: 'Instructors',
    label: 'Instructors',
    description: 'Manage teaching staff',
    icon: 'school-outline',
    iconColor: COLORS.violet,
    iconBg: COLORS.violetLight,
    screen: 'Instructors',
  },
  {
    key: 'Activities',
    label: 'Activities',
    description: 'Classes and programs',
    icon: 'fitness-outline',
    iconColor: COLORS.success,
    iconBg: COLORS.successLight,
    screen: 'Activities',
  },
  {
    key: 'Expenses',
    label: 'Expenses',
    description: 'Track studio expenses',
    icon: 'receipt-outline',
    iconColor: COLORS.rose,
    iconBg: COLORS.roseLight,
    screen: 'Expenses',
  },
  {
    key: 'Enquiry',
    label: 'Enquiries',
    description: 'Leads and inquiries',
    icon: 'help-circle-outline',
    iconColor: COLORS.amber,
    iconBg: COLORS.amberLight,
    screen: 'Enquiry',
  },
  {
    key: 'Clients',
    label: 'Clients',
    description: 'Client management',
    icon: 'people-outline',
    iconColor: COLORS.sky,
    iconBg: COLORS.skyLight,
    screen: 'Clients',
  },
  {
    key: 'Attendance',
    label: 'Attendance',
    description: 'Track attendance records',
    icon: 'clipboard-outline',
    iconColor: COLORS.teal,
    iconBg: COLORS.tealLight,
    screen: 'Attendance',
  },
  {
    key: 'Reports',
    label: 'Reports',
    description: 'Business reports',
    icon: 'document-text-outline',
    iconColor: COLORS.primary,
    iconBg: COLORS.primaryLight,
    screen: 'Reports',
  },
  {
    key: 'Analysis',
    label: 'Analysis',
    description: 'Data & analytics',
    icon: 'bar-chart-outline',
    iconColor: COLORS.violet,
    iconBg: COLORS.violetLight,
    screen: 'Analysis',
  },
  {
    key: 'Communication',
    label: 'Communication',
    description: 'Messages and notifications',
    icon: 'megaphone-outline',
    iconColor: COLORS.orange,
    iconBg: COLORS.orangeLight,
    screen: 'Communication',
  },
  {
    key: 'Branches',
    label: 'Branches',
    description: 'Manage studio locations',
    icon: 'git-branch-outline',
    iconColor: COLORS.success,
    iconBg: COLORS.successLight,
    screen: 'Branches',
  },
  {
    key: 'Templates',
    label: 'Templates',
    description: 'Message & doc templates',
    icon: 'copy-outline',
    iconColor: COLORS.sky,
    iconBg: COLORS.skyLight,
    screen: 'Templates',
  },
  {
    key: 'Profile',
    label: 'Profile',
    description: 'Account & settings',
    icon: 'person-circle-outline',
    iconColor: COLORS.primary,
    iconBg: COLORS.primaryLight,
    screen: 'Profile',
  },
];

// Group items into sections for visual organization
const SECTIONS = [
  {
    title: 'People',
    items: ['Instructors', 'Clients', 'Attendance'],
  },
  {
    title: 'Programs',
    items: ['Activities', 'Enquiry'],
  },
  {
    title: 'Finance',
    items: ['Expenses'],
  },
  {
    title: 'Insights',
    items: ['Reports', 'Analysis'],
  },
  {
    title: 'Management',
    items: ['Communication', 'Branches', 'Templates'],
  },
  {
    title: 'Account',
    items: ['Profile'],
  },
];

function ListItem({ item, onPress }) {
  return (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => onPress(item.screen)}
      activeOpacity={0.7}
    >
      <View style={[styles.itemIconCircle, { backgroundColor: item.iconBg }]}>
        <Ionicons name={item.icon} size={20} color={item.iconColor} />
      </View>
      <View style={styles.itemTextGroup}>
        <Text style={styles.itemLabel}>{item.label}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
    </TouchableOpacity>
  );
}

export default function MoreListScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const studio = useSelector((state) => state.auth?.studio);
  const currentBranch = useSelector((state) => state.auth?.currentBranch);

  const handleNavigate = useCallback(
    (screen) => {
      navigation.navigate(screen);
    },
    [navigation]
  );

  const handleLogout = useCallback(() => {
    const doLogout = async () => {
      try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('userEmail');
      } catch (_) {
        // Silently ignore storage errors — still clear Redux state
      } finally {
        dispatch(clearAuthState());
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to sign out?')) {
        doLogout();
      }
    } else {
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign Out', style: 'destructive', onPress: doLogout },
        ],
        { cancelable: true }
      );
    }
  }, [dispatch]);

  // Build a lookup map for fast item access
  const itemMap = MORE_ITEMS.reduce((acc, item) => {
    acc[item.key] = item;
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── User Info Header ── */}
        <View style={styles.userHeader}>
          {studio?.logo ? (
            <Image source={{ uri: studio.logo }} style={styles.userAvatarImage} resizeMode="cover" />
          ) : (
            <View style={styles.userAvatarCircle}>
              <Text style={styles.userAvatarText}>
                {(user?.userName ?? 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.userName ?? 'User'}
            </Text>
            <Text style={styles.userRole} numberOfLines={1}>
              {user?.role ?? 'Member'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.profileShortcut}
            onPress={() => handleNavigate('Profile')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="settings-outline" size={20} color={COLORS.secondaryText} />
          </TouchableOpacity>
        </View>

        {/* ── Current Branch Banner ── */}
        {currentBranch?.name ?? currentBranch?.branchName ? (
          <View style={styles.branchBanner}>
            <Ionicons name="business-outline" size={15} color={COLORS.primary} />
            <Text style={styles.branchBannerText} numberOfLines={1}>
              {currentBranch.name ?? currentBranch.branchName}
            </Text>
            {studio?.studioName ? (
              <Text style={styles.branchBannerStudio} numberOfLines={1}>
                · {studio.studioName}
              </Text>
            ) : null}
          </View>
        ) : null}

        {/* ── Sections ── */}
        {SECTIONS.map((section) => {
          const sectionItems = section.items
            .map((key) => itemMap[key])
            .filter(Boolean);
          if (sectionItems.length === 0) return null;

          return (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionCard}>
                {sectionItems.map((item, index) => (
                  <React.Fragment key={item.key}>
                    <ListItem item={item} onPress={handleNavigate} />
                    {index < sectionItems.length - 1 && (
                      <View style={styles.itemSeparator} />
                    )}
                  </React.Fragment>
                ))}
              </View>
            </View>
          );
        })}

        {/* ── Logout Button ── */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App version footer */}
        <Text style={styles.versionText}>StudioManage v1.0.0</Text>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },

  // User header
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  userAvatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userAvatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userAvatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.card,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  userRole: {
    fontSize: 13,
    color: COLORS.secondaryText,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  profileShortcut: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Branch banner
  branchBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  branchBannerText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    flex: 1,
  },
  branchBannerStudio: {
    fontSize: 13,
    color: '#818cf8',
    flexShrink: 1,
  },

  // Sections
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  // List item
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  itemIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  itemTextGroup: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 1,
  },
  itemDescription: {
    fontSize: 12,
    color: COLORS.secondaryText,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 70,
  },

  // Logout
  logoutSection: {
    marginBottom: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.dangerLight,
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.danger,
  },

  // Footer
  versionText: {
    fontSize: 12,
    color: '#d1d5db',
    textAlign: 'center',
    marginBottom: 4,
  },
});

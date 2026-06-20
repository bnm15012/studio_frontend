import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import api from '../../utils/api';
import { ENDPOINTS } from '../../constants/api';

const COLORS = {
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  background: '#f9fafb',
  card: '#ffffff',
  text: '#111827',
  secondaryText: '#6b7280',
  success: '#10b981',
  danger: '#ef4444',
  border: '#e5e7eb',
  inputBg: '#f3f4f6',
};

// Step indicator component
function StepIndicator({ currentStep }) {
  return (
    <View style={styles.stepIndicatorContainer}>
      {[1, 2].map((step) => (
        <React.Fragment key={step}>
          <View
            style={[
              styles.stepCircle,
              currentStep >= step && styles.stepCircleActive,
              currentStep > step && styles.stepCircleCompleted,
            ]}
          >
            {currentStep > step ? (
              <Ionicons name="checkmark" size={14} color={COLORS.card} />
            ) : (
              <Text
                style={[
                  styles.stepNumber,
                  currentStep >= step && styles.stepNumberActive,
                ]}
              >
                {step}
              </Text>
            )}
          </View>
          {step < 2 && (
            <View
              style={[
                styles.stepConnector,
                currentStep > step && styles.stepConnectorActive,
              ]}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

export default function ForgotPasswordScreen({ navigation }) {
  // Step 1: email → get otpToken
  const [step, setStep] = useState(1);

  // Step 1 state
  const [email, setEmail] = useState('');
  const [step1Loading, setStep1Loading] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Step 2 state (stored from step 1 response)
  const [otpToken, setOtpToken] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step2Loading, setStep2Loading] = useState(false);
  const [step2Errors, setStep2Errors] = useState({});

  // ─── Step 1 handlers ───────────────────────────────────────────────────────

  const validateEmail = useCallback(() => {
    if (!email.trim()) {
      setEmailError('Email address is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  }, [email]);

  const handleSendOtp = useCallback(async () => {
    if (!validateEmail()) return;

    setStep1Loading(true);
    try {
      const response = await api.post(
        `${ENDPOINTS.RESET_PASSWORD}?email=${encodeURIComponent(email.trim())}`
      );
      const dataArr = response?.data?.data;
      if (!dataArr || dataArr.length === 0) {
        Alert.alert('Error', 'Unexpected response from server. Please try again.');
        return;
      }
      const token = dataArr[0]?.otpToken;
      if (!token) {
        Alert.alert('Error', 'Could not retrieve OTP token. Please try again.');
        return;
      }
      setOtpToken(token);
      setStep(2);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to send OTP. Please check your email and try again.';
      Alert.alert('Request Failed', message);
    } finally {
      setStep1Loading(false);
    }
  }, [email, validateEmail]);

  // ─── Step 2 handlers ───────────────────────────────────────────────────────

  const validateStep2 = useCallback(() => {
    const newErrors = {};
    if (!otp.trim()) {
      newErrors.otp = 'OTP is required';
    } else if (otp.trim().length < 4) {
      newErrors.otp = 'Please enter the complete OTP';
    }
    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setStep2Errors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [otp, newPassword, confirmPassword]);

  const handleVerifyOtp = useCallback(async () => {
    if (!validateStep2()) return;

    setStep2Loading(true);
    try {
      await api.post(ENDPOINTS.VERIFY_OTP, {
        otpToken,
        otp: otp.trim(),
        userEntry: {
          email: email.trim(),
          password: newPassword,
        },
      });

      Alert.alert(
        'Password Reset Successful',
        'Your password has been updated. Please sign in with your new password.',
        [
          {
            text: 'Sign In',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'OTP verification failed. Please check the OTP and try again.';
      Alert.alert('Verification Failed', message);
    } finally {
      setStep2Loading(false);
    }
  }, [otpToken, otp, email, newPassword, validateStep2, navigation]);

  const handleBackToStep1 = useCallback(() => {
    setStep(1);
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setStep2Errors({});
  }, []);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back to Login */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
            <Text style={styles.backButtonText}>Back to Login</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.headerContainer}>
            <View style={styles.headerIconCircle}>
              <Ionicons name="lock-closed-outline" size={32} color={COLORS.primary} />
            </View>
            <Text style={styles.headerTitle}>Reset Password</Text>
            <Text style={styles.headerSubtitle}>
              {step === 1
                ? "Enter your email address and we'll send you an OTP to reset your password."
                : 'Enter the OTP sent to your email along with your new password.'}
            </Text>
          </View>

          {/* Step Indicator */}
          <StepIndicator currentStep={step} />

          {/* Step Labels */}
          <View style={styles.stepLabelsRow}>
            <Text style={[styles.stepLabel, step === 1 && styles.stepLabelActive]}>
              Verify Email
            </Text>
            <Text style={[styles.stepLabel, step === 2 && styles.stepLabelActive]}>
              Reset Password
            </Text>
          </View>

          {/* ── Step 1 Card ── */}
          {step === 1 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Enter your email</Text>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Email Address</Text>
                <View style={[styles.inputWrapper, emailError && styles.inputWrapperError]}>
                  <Ionicons
                    name="mail-outline"
                    size={18}
                    color={emailError ? COLORS.danger : COLORS.secondaryText}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="your@email.com"
                    placeholderTextColor={COLORS.secondaryText}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (emailError) setEmailError('');
                    }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    returnKeyType="done"
                    onSubmitEditing={handleSendOtp}
                    editable={!step1Loading}
                  />
                </View>
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, step1Loading && styles.primaryButtonDisabled]}
                onPress={handleSendOtp}
                disabled={step1Loading}
                activeOpacity={0.85}
              >
                {step1Loading ? (
                  <ActivityIndicator color={COLORS.card} size="small" />
                ) : (
                  <>
                    <Text style={styles.primaryButtonText}>Send OTP</Text>
                    <Ionicons
                      name="send-outline"
                      size={16}
                      color={COLORS.card}
                      style={{ marginLeft: 6 }}
                    />
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* ── Step 2 Card ── */}
          {step === 2 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Set new password</Text>

              <View style={styles.emailBadge}>
                <Ionicons name="mail-outline" size={14} color={COLORS.primary} />
                <Text style={styles.emailBadgeText} numberOfLines={1}>
                  {email.trim()}
                </Text>
                <TouchableOpacity onPress={handleBackToStep1} hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}>
                  <Text style={styles.emailBadgeChange}>Change</Text>
                </TouchableOpacity>
              </View>

              {/* OTP Field */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>OTP Code</Text>
                <View style={[styles.inputWrapper, step2Errors.otp && styles.inputWrapperError]}>
                  <Ionicons
                    name="key-outline"
                    size={18}
                    color={step2Errors.otp ? COLORS.danger : COLORS.secondaryText}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter OTP"
                    placeholderTextColor={COLORS.secondaryText}
                    value={otp}
                    onChangeText={(text) => {
                      setOtp(text);
                      if (step2Errors.otp) setStep2Errors((e) => ({ ...e, otp: null }));
                    }}
                    keyboardType="number-pad"
                    returnKeyType="next"
                    editable={!step2Loading}
                    maxLength={8}
                  />
                </View>
                {step2Errors.otp ? <Text style={styles.errorText}>{step2Errors.otp}</Text> : null}
              </View>

              {/* New Password Field */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>New Password</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    step2Errors.newPassword && styles.inputWrapperError,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color={step2Errors.newPassword ? COLORS.danger : COLORS.secondaryText}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Min. 6 characters"
                    placeholderTextColor={COLORS.secondaryText}
                    value={newPassword}
                    onChangeText={(text) => {
                      setNewPassword(text);
                      if (step2Errors.newPassword)
                        setStep2Errors((e) => ({ ...e, newPassword: null }));
                    }}
                    secureTextEntry={!showNewPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    editable={!step2Loading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowNewPassword((v) => !v)}
                    style={styles.eyeButton}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons
                      name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color={COLORS.secondaryText}
                    />
                  </TouchableOpacity>
                </View>
                {step2Errors.newPassword ? (
                  <Text style={styles.errorText}>{step2Errors.newPassword}</Text>
                ) : null}
              </View>

              {/* Confirm Password Field */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    step2Errors.confirmPassword && styles.inputWrapperError,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color={step2Errors.confirmPassword ? COLORS.danger : COLORS.secondaryText}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Re-enter your password"
                    placeholderTextColor={COLORS.secondaryText}
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      if (step2Errors.confirmPassword)
                        setStep2Errors((e) => ({ ...e, confirmPassword: null }));
                    }}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={handleVerifyOtp}
                    editable={!step2Loading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword((v) => !v)}
                    style={styles.eyeButton}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color={COLORS.secondaryText}
                    />
                  </TouchableOpacity>
                </View>
                {step2Errors.confirmPassword ? (
                  <Text style={styles.errorText}>{step2Errors.confirmPassword}</Text>
                ) : null}
              </View>

              {/* Passwords match indicator */}
              {newPassword.length > 0 && confirmPassword.length > 0 && (
                <View style={styles.matchRow}>
                  <Ionicons
                    name={
                      newPassword === confirmPassword
                        ? 'checkmark-circle'
                        : 'alert-circle-outline'
                    }
                    size={16}
                    color={newPassword === confirmPassword ? COLORS.success : COLORS.danger}
                  />
                  <Text
                    style={[
                      styles.matchText,
                      {
                        color:
                          newPassword === confirmPassword ? COLORS.success : COLORS.danger,
                      },
                    ]}
                  >
                    {newPassword === confirmPassword
                      ? 'Passwords match'
                      : 'Passwords do not match'}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.primaryButton, step2Loading && styles.primaryButtonDisabled]}
                onPress={handleVerifyOtp}
                disabled={step2Loading}
                activeOpacity={0.85}
              >
                {step2Loading ? (
                  <ActivityIndicator color={COLORS.card} size="small" />
                ) : (
                  <>
                    <Text style={styles.primaryButtonText}>Reset Password</Text>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={16}
                      color={COLORS.card}
                      style={{ marginLeft: 6 }}
                    />
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleBackToStep1}
                disabled={step2Loading}
              >
                <Text style={styles.secondaryButtonText}>← Back to email entry</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.secondaryText,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  // Step Indicator
  stepIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.border,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stepCircleCompleted: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.secondaryText,
  },
  stepNumberActive: {
    color: COLORS.card,
  },
  stepConnector: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.border,
    marginHorizontal: 8,
    maxWidth: 80,
  },
  stepConnectorActive: {
    backgroundColor: COLORS.success,
  },
  stepLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  stepLabel: {
    fontSize: 12,
    color: COLORS.secondaryText,
    fontWeight: '500',
  },
  stepLabelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  // Card
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 20,
  },
  emailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef2ff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
    gap: 6,
  },
  emailBadgeText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '500',
  },
  emailBadgeChange: {
    fontSize: 12,
    color: COLORS.primaryDark,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  // Form fields
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    height: 50,
  },
  inputWrapperError: {
    borderColor: COLORS.danger,
    backgroundColor: '#fef2f2',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    height: '100%',
  },
  eyeButton: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.danger,
    marginTop: 4,
    marginLeft: 2,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 4,
  },
  matchText: {
    fontSize: 13,
    fontWeight: '500',
  },
  // Buttons
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 4,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    color: COLORS.secondaryText,
    fontWeight: '500',
  },
});

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from '../screens/Auth/LoginScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import StudentsScreen from '../screens/Students/StudentsScreen';
import StudentDetailScreen from '../screens/Students/StudentDetailScreen';
import InstructorsScreen from '../screens/Instructors/InstructorsScreen';
import ActivitiesScreen from '../screens/Activities/ActivitiesScreen';
import BookingsScreen from '../screens/Bookings/BookingsScreen';
import PaymentsScreen from '../screens/Payments/PaymentsScreen';
import ExpensesScreen from '../screens/Expenses/ExpensesScreen';
import EnquiryScreen from '../screens/Enquiry/EnquiryScreen';
import ClientsScreen from '../screens/Clients/ClientsScreen';
import AttendanceScreen from '../screens/Attendance/AttendanceScreen';
import ReportsScreen from '../screens/Reports/ReportsScreen';
import AnalysisScreen from '../screens/Analysis/AnalysisScreen';
import CommunicationScreen from '../screens/Communication/CommunicationScreen';
import BranchesScreen from '../screens/Branches/BranchesScreen';
import TemplatesScreen from '../screens/Templates/TemplatesScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const COLORS = {
  primary: '#6366f1',
  inactive: '#9ca3af',
  background: '#ffffff',
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarStyle: { backgroundColor: COLORS.background, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Dashboard: 'grid-outline',
            Students: 'people-outline',
            Bookings: 'calendar-outline',
            Payments: 'cash-outline',
            More: 'menu-outline',
          };
          return <Ionicons name={icons[route.name] || 'ellipse-outline'} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Students" component={StudentsScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="Payments" component={PaymentsScreen} />
      <Tab.Screen name="More" component={MoreNavigator} />
    </Tab.Navigator>
  );
}

const MoreStack = createNativeStackNavigator();
function MoreNavigator() {
  return (
    <MoreStack.Navigator screenOptions={({ navigation }) => ({
      headerShown: true,
      headerBackTitle: 'Back',
      headerTintColor: COLORS.primary,
      headerStyle: { backgroundColor: '#ffffff' },
      headerTitleStyle: { color: '#111827', fontWeight: '600' },
    })}>
      <MoreStack.Screen name="MoreList" component={MoreListScreen} options={{ headerShown: false }} />
      <MoreStack.Screen name="Instructors" component={InstructorsScreen} options={{ title: 'Instructors' }} />
      <MoreStack.Screen name="Activities" component={ActivitiesScreen} options={{ title: 'Activities' }} />
      <MoreStack.Screen name="Expenses" component={ExpensesScreen} options={{ title: 'Expenses' }} />
      <MoreStack.Screen name="Enquiry" component={EnquiryScreen} options={{ title: 'Enquiries' }} />
      <MoreStack.Screen name="Clients" component={ClientsScreen} options={{ title: 'Clients' }} />
      <MoreStack.Screen name="Attendance" component={AttendanceScreen} options={{ title: 'Attendance' }} />
      <MoreStack.Screen name="Reports" component={ReportsScreen} options={{ title: 'Reports' }} />
      <MoreStack.Screen name="Analysis" component={AnalysisScreen} options={{ title: 'Analysis' }} />
      <MoreStack.Screen name="Communication" component={CommunicationScreen} options={{ title: 'Communication' }} />
      <MoreStack.Screen name="Branches" component={BranchesScreen} options={{ title: 'Branches' }} />
      <MoreStack.Screen name="Templates" component={TemplatesScreen} options={{ title: 'Templates' }} />
      <MoreStack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </MoreStack.Navigator>
  );
}

import MoreListScreen from '../screens/More/MoreListScreen';

const rootScreenOptions = {
  headerShown: true,
  headerBackTitle: 'Back',
  headerTintColor: COLORS.primary,
  headerStyle: { backgroundColor: '#ffffff' },
  headerTitleStyle: { color: '#111827', fontWeight: '600' },
};

export default function AppNavigator() {
  const user = useSelector((state) => state.auth?.user);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="StudentDetail" component={StudentDetailScreen} />
            {/* Root-level screens so any tab (e.g. Dashboard) can navigate here
                without corrupting the More tab's own stack */}
            <Stack.Screen name="ExpensesRoot" component={ExpensesScreen} options={{ ...rootScreenOptions, title: 'Expenses' }} />
            <Stack.Screen name="InstructorsRoot" component={InstructorsScreen} options={{ ...rootScreenOptions, title: 'Instructors' }} />
            <Stack.Screen name="ActivitiesRoot" component={ActivitiesScreen} options={{ ...rootScreenOptions, title: 'Activities' }} />
            <Stack.Screen name="ReportsRoot" component={ReportsScreen} options={{ ...rootScreenOptions, title: 'Reports' }} />
            <Stack.Screen name="AnalysisRoot" component={AnalysisScreen} options={{ ...rootScreenOptions, title: 'Analysis' }} />
            <Stack.Screen name="CommunicationRoot" component={CommunicationScreen} options={{ ...rootScreenOptions, title: 'Communication' }} />
            <Stack.Screen name="BranchesRoot" component={BranchesScreen} options={{ ...rootScreenOptions, title: 'Branches' }} />
            <Stack.Screen name="TemplatesRoot" component={TemplatesScreen} options={{ ...rootScreenOptions, title: 'Templates' }} />
            <Stack.Screen name="ProfileRoot" component={ProfileScreen} options={{ ...rootScreenOptions, title: 'Profile' }} />
            <Stack.Screen name="EnquiryRoot" component={EnquiryScreen} options={{ ...rootScreenOptions, title: 'Enquiries' }} />
            <Stack.Screen name="ClientsRoot" component={ClientsScreen} options={{ ...rootScreenOptions, title: 'Clients' }} />
            <Stack.Screen name="AttendanceRoot" component={AttendanceScreen} options={{ ...rootScreenOptions, title: 'Attendance' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

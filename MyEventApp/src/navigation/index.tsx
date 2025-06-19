// src/navigation/index.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EventListScreen } from '../screens/EventListScreen';
import { EventDetailScreen } from '../screens/EventDetailScreen';
import { AuthScreen } from '../screens/AuthScreen';

// Define the type for your navigation stack parameters
// This provides type safety for route names and their expected parameters.
export type RootStackParamList = {
  Auth: undefined; // AuthScreen does not expect any parameters
  EventList: undefined; // EventListScreen does not expect any parameters
  EventDetail: { eventId: string }; // EventDetailScreen expects an eventId
};

// Create a Stack Navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * AppNavigator component defines the main navigation flow of the application.
 * It uses a stack navigator to manage screens, allowing transitions between them.
 * The screens are typically rendered based on authentication state (handled in App.tsx).
 */
export const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/*
        The Auth screen is for user login/registration.
        It's typically shown when the user is not authenticated.
      */}
      <Stack.Screen name="Auth" component={AuthScreen} />

      {/*
        The EventList screen displays all available events.
        It's the main entry point after successful authentication.
      */}
      <Stack.Screen name="EventList" component={EventListScreen} />

      {/*
        The EventDetail screen shows specific information about an event,
        including attendees and the option to join. It expects an 'eventId' parameter.
      */}
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
    </Stack.Navigator>
  );
};

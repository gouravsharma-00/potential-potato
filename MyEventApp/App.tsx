// App.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ApolloProvider } from '@apollo/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthScreen } from './src/screens/AuthScreen';
import { EventListScreen } from './src/screens/EventListScreen';
import { EventDetailScreen } from './src/screens/EventDetailScreen';
import { apolloClient } from './src/api/apollo';
import { useAuthStore } from './src/state/authStore';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  const { token } = useAuthStore();

  useEffect(() => {
    // You might want to refetch user data or validate token here
    // after the app loads or token changes.
    console.log('Auth token:', token);
  }, [token]);

  return (
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {token ? (
              <>
                <Stack.Screen name="EventList" component={EventListScreen} />
                <Stack.Screen name="EventDetail" component={EventDetailScreen} />
              </>
            ) : (
              <Stack.Screen name="Auth" component={AuthScreen} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </QueryClientProvider>
    </ApolloProvider>
  );
}
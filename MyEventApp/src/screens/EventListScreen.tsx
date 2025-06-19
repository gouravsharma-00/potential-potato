// src/screens/EventListScreen.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Button,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apolloClient } from '../api/apollo';
import { GET_EVENTS } from '../graphql/queries';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../state/authStore';

interface Event {
  id: string;
  name: string;
  location: string;
  startTime: string;
  attendees: Array<{ id: string; name: string }>;
}

export const EventListScreen = () => {
  const navigation = useNavigation();
  const logout = useAuthStore((state) => state.logout);

  const {
    data,
    isLoading,
    error,
    refetch: refetchEvents,
  } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await apolloClient.query({ query: GET_EVENTS });
      return response.data.events as Event[];
    },
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error: {error.message}</Text>
        <Button title="Retry" onPress={() => refetchEvents()} />
      </View>
    );
  }

  const renderEvent = ({ item }: { item: Event }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
    >
      <Text style={styles.eventName}>{item.name}</Text>
      <Text style={styles.eventLocation}>{item.location}</Text>
      <Text style={styles.eventTime}>
        {new Date(item.startTime).toLocaleString()}
      </Text>
      <Text>Attendees: {item.attendees.length}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={logout} />
      <Text style={styles.header}>Upcoming Events</Text>
      <FlatList
        data={data}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={isLoading}
        onRefresh={() => refetchEvents()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  listContent: {
    paddingBottom: 20,
  },
  eventCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  eventName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#007bff',
  },
  eventLocation: {
    fontSize: 16,
    color: '#555',
    marginBottom: 3,
  },
  eventTime: {
    fontSize: 14,
    color: '#777',
  },
});
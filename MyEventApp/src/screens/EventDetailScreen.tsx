// src/screens/EventDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apolloClient } from '../api/apollo';
import { GET_EVENT_DETAILS } from '../graphql/queries';
import { JOIN_EVENT } from '../graphql/mutations';
import { useSocket } from '../hooks/useSocket';
import { useAuthStore } from '../state/authStore';

interface RouteParams {
  eventId: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface EventDetail {
  id: string;
  name: string;
  location: string;
  startTime: string;
  attendees: User[];
}

export const EventDetailScreen = () => {
  const route = useRoute();
  const { eventId } = route.params as RouteParams;
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);

  const {
    data: eventData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['eventDetails', eventId],
    queryFn: async () => {
      const response = await apolloClient.query({
        query: GET_EVENT_DETAILS,
        variables: { eventId },
      });
      return response.data.event as EventDetail;
    },
  });

  const { attendees: socketAttendees } = useSocket(eventId);
  const [currentAttendees, setCurrentAttendees] = useState<User[]>([]);

  useEffect(() => {
    if (eventData) {
      setCurrentAttendees(eventData.attendees);
    }
  }, [eventData]);

  useEffect(() => {
    if (socketAttendees && socketAttendees.length > 0) {
      setCurrentAttendees(socketAttendees);
    }
  }, [socketAttendees]);

  const joinEventMutation = useMutation({
    mutationFn: async () => {
      const response = await apolloClient.mutate({
        mutation: JOIN_EVENT,
        variables: { eventId },
      });
      return response.data.joinEvent;
    },
    onSuccess: (data) => {
      // Optimistically update or re-fetch after successful join
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['eventDetails', eventId] });
      // The Socket.io will handle the real-time update, so no need to manually update state here based on mutation response for attendees.
      // But we can update the event data itself if needed.
      Alert.alert('Success', 'You have joined the event!');
    },
    onError: (err) => {
      console.error('Error joining event:', err);
      Alert.alert('Error', 'Failed to join event: ' + err.message);
    },
  });

  const isUserJoined = currentAttendees.some(
    (attendee) => attendee.id === currentUser?.id,
  );

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
        <Button title="Retry" onPress={() => refetch()} />
      </View>
    );
  }

  if (!eventData) {
    return (
      <View style={styles.center}>
        <Text>Event not found.</Text>
      </View>
    );
  }

  const renderAttendee = ({ item }: { item: User }) => (
    <View style={styles.attendeeItem}>
      <Text>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.eventName}>{eventData.name}</Text>
      <Text style={styles.eventLocation}>{eventData.location}</Text>
      <Text style={styles.eventTime}>
        {new Date(eventData.startTime).toLocaleString()}
      </Text>

      {!isUserJoined && (
        <Button
          title={joinEventMutation.isPending ? 'Joining...' : 'Join Event'}
          onPress={() => joinEventMutation.mutate()}
          disabled={joinEventMutation.isPending}
        />
      )}
      {isUserJoined && <Text style={styles.joinedText}>You have joined this event!</Text>}

      <Text style={styles.attendeesHeader}>Attendees ({currentAttendees.length})</Text>
      <FlatList
        data={currentAttendees}
        renderItem={renderAttendee}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No attendees yet.</Text>}
        style={styles.attendeesList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007bff',
  },
  eventLocation: {
    fontSize: 18,
    color: '#555',
    marginBottom: 5,
  },
  eventTime: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
  },
  attendeesHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
    color: '#333',
  },
  attendeesList: {
    flex: 1,
  },
  attendeeItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  joinedText: {
    marginTop: 10,
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
  },
});
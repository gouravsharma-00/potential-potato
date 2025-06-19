// src/graphql/mutations.ts
import { gql } from '@apollo/client';

export const JOIN_EVENT = gql`
  mutation JoinEvent($eventId: ID!) {
    joinEvent(eventId: $eventId) {
      id
      name
      attendees {
        id
        name
      }
    }
  }
`;
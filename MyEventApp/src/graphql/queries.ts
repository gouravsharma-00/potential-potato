// src/graphql/queries.ts
import { gql } from '@apollo/client';

export const GET_EVENTS = gql`
  query GetEvents {
    events {
      id
      name
      location
      startTime
      attendees {
        id
        name
        email
      }
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
      events {
        id
      }
    }
  }
`;

export const GET_EVENT_DETAILS = gql`
  query GetEventDetails($eventId: ID!) {
    event(id: $eventId) {
      id
      name
      location
      startTime
      attendees {
        id
        name
        email
      }
    }
  }
`;
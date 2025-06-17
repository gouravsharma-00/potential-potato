import { gql } from 'apollo-server-express'

export default gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Event {
    id: ID!
    title: String!
    date: String!
    attendees: [User!]!
  }

  type Query {
    events: [Event!]!
    me: User
  }

  type Mutation {
    joinEvent(eventId: ID!): Event!
  }
`;
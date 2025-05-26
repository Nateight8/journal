import { gql } from "@apollo/client";

const userOperations = {
  Queries: {
    me: gql`
      query Me {
        me {
          updatedAt
          name
          image
          id
          email
          createdAt
        }
      }
    `,
  },
  Mutations: {
    logout: gql`
      mutation Logout {
        logout {
          success
          message
        }
      }
    `,
  },
};

export interface Account {
  id: string;
  accountName: string;
  broker: string;
  accountSize: number;
}

export interface User {
  name: string;
  id: string;
  email: string;
  onboardingStep:
    | "account_setup"
    | "safety_net"
    | "trading_style"
    | "completed";
  accounts: Account[];
}

export interface MeResponse {
  me: User;
}

export default userOperations;

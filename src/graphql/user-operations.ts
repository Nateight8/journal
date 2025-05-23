import { gql } from "@apollo/client";

const userOperations = {
  Queries: {
    me: gql`
      query Me {
        me {
          name
          email
          onboardingStep
        }
      }
    `,
  },
  Mutations: {},
};

export interface User {
  name: string;
  id: string;
  email: string;
  onboardingStep:
    | "account_setup"
    | "safety_net"
    | "trading_style"
    | "completed";
}

export interface MeResponse {
  me: User;
}

export default userOperations;

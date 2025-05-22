import { gql } from "@apollo/client";

export const accountOperations = {
  Mutations: {
    setUpAccount: gql`
      mutation Mutation($input: AccountSetupInput!) {
        setupAccount(input: $input) {
          accountSize
          goal
        }
      }
    `,
  },
};

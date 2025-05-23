import { gql } from "@apollo/client";

export const accountOperations = {
  Queries: {
    tradingAccount: gql`
      query TradingAccount {
        tradingAccount @client {
          accountSize
          goal
          __typename
        }
      }
    `,
  },
  Mutations: {
    setUpAccount: gql`
      mutation SetUpAccount($input: AccountSetupInput!) {
        setupAccount(input: $input) {
          accountSize
          goal
          __typename
        }
      }
    `,

    safetyNet: gql`
      mutation CreateSafetyNet($input: CreateSafetyNetInput!) {
        createSafetyNet(input: $input) {
          success
          message
        }
      }
    `,

    tradingPlan: gql`
      mutation CreateTradingPlan($input: TradingPlanInput!) {
        createTradingPlan(input: $input) {
          success
          message
        }
      }
    `,
  },
};

/**
 * GraphQL documents for the public Countries API
 * (https://countries.trevorblades.com/graphql)
 *
 * Kept as plain strings (via graphql-request's `gql` no-op tag) so they
 * work directly with graphql-request inside our hybrid RTK Query
 * baseQuery — no codegen step required for this project's scope.
 */
import { gql } from "graphql-request";

export const COUNTRIES_GRAPHQL_ENDPOINT =
  "https://countries.trevorblades.com/graphql";

export const GET_CONTINENTS = gql`
  query GetContinents {
    continents {
      code
      name
    }
  }
`;

export const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      code
      name
      native
      capital
      currency
      emoji
      continent {
        code
        name
      }
      languages {
        code
        name
        native
        rtl
      }
    }
  }
`;

export const GET_COUNTRIES_BY_CONTINENT = gql`
  query GetCountriesByContinent($code: ID!) {
    continent(code: $code) {
      code
      name
      countries {
        code
        name
        native
        capital
        currency
        emoji
        continent {
          code
          name
        }
        languages {
          code
          name
          native
          rtl
        }
      }
    }
  }
`;

export const GET_COUNTRY = gql`
  query GetCountry($code: ID!) {
    country(code: $code) {
      code
      name
      native
      capital
      currency
      emoji
      phone
      continent {
        code
        name
      }
      languages {
        code
        name
        native
        rtl
      }
    }
  }
`;

export const GET_COUNTRY_DETAILS = gql`
  query GetCountryDetail($code: ID!) {
    country(code: $code) {
      code
      name
      native
      capital
      currency
      emoji
      phone
      continent {
        code
        name
      }
      languages {
        code
        name
        native
        rtl
      }
    }
  }
`;

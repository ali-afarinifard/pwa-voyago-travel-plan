import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { ClientError, GraphQLClient } from "graphql-request";
import { COUNTRIES_GRAPHQL_ENDPOINT } from "@/lib/graphql/queries";

/**
 * A REST request, executed via RTK Query's `fetchBaseQuery`.
 * `baseUrl` lets each endpoint target a different host (Open-Meteo,
 * Frankfurter, REST Countries, ...) without needing separate `createApi`
 * instances.
 */
export interface RestArgs {
  type: "rest";
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  baseUrl?: string;
}

/**
 * A GraphQL request, executed via `graphql-request`. Defaults to the
 * public Countries API but accepts an override so other GraphQL
 * endpoints could be added later without changing the base query.
 */
export interface GraphqlArgs {
  type: "graphql";
  document: string;
  variables?: Record<string, unknown>;
  endpoint?: string;
}

export type HybridArgs = RestArgs | GraphqlArgs;

/** Normalized error shape surfaced to RTK Query, regardless of source. */
export interface HybridError {
  status: number | string;
  message: string;
  source: "rest" | "graphql";
}

const restBaseQuery = fetchBaseQuery();

const graphqlClients = new Map<string, GraphQLClient>();
function getGraphqlClient(endpoint: string): GraphQLClient {
  let client = graphqlClients.get(endpoint);
  if (!client) {
    client = new GraphQLClient(endpoint);
    graphqlClients.set(endpoint, client);
  }
  return client;
}

function describeRestError(error: FetchBaseQueryError): string {
  if (typeof error.status === "number") {
    return `Request failed with status ${error.status}`;
  }
  if (error.status === "FETCH_ERROR") return "Network request failed";
  if (error.status === "TIMEOUT_ERROR") return "Request timed out";
  if (error.status === "PARSING_ERROR") return "Failed to parse response";
  return "Request failed";
}

/**
 * Hybrid baseQuery: a single RTK Query data layer that can serve both
 * REST and GraphQL sources, with unified caching, tags, and loading
 * states. Endpoints opt into a transport by returning `{ type: 'rest', ... }`
 * or `{ type: 'graphql', ... }` from their `query()` function.
 */
export const hybridBaseQuery: BaseQueryFn<HybridArgs, unknown, HybridError> = async (
  args,
  api,
  extraOptions,
) => {
  if (args.type === "graphql") {
    const endpoint = args.endpoint ?? COUNTRIES_GRAPHQL_ENDPOINT;
    try {
      const client = getGraphqlClient(endpoint);
      const data = await client.request(args.document, args.variables);
      return { data };
    } catch (error) {
      if (error instanceof ClientError) {
        return {
          error: {
            status: error.response.status,
            message: error.response.errors?.[0]?.message ?? "GraphQL request failed",
            source: "graphql",
          },
        };
      }
      return {
        error: {
          status: "FETCH_ERROR",
          message: error instanceof Error ? error.message : "GraphQL request failed",
          source: "graphql",
        },
      };
    }
  }

  const { url, method = "GET", params, body, baseUrl } = args;
  const result = await restBaseQuery(
    { url: `${baseUrl ?? ""}${url}`, method, params, body },
    api,
    extraOptions,
  );

  if (result.error) {
    const restError = result.error as FetchBaseQueryError;
    return {
      error: {
        status: restError.status as number | string,
        message: describeRestError(restError),
        source: "rest",
      },
    };
  }

  return { data: result.data, meta: result.meta };
};

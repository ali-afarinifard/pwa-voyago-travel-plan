import { baseApi } from "./baseApi";
import { describeWeatherCode } from "@/lib/utils/weather";
import type {
  ExchangeRatesResponse,
  OpenMeteoResponse,
  WeatherSummary,
} from "@/lib/types/travel";

const OPEN_METEO_BASE = "https://api.open-meteo.com/v1";
const REST_COUNTRIES_BASE = "https://restcountries.com/v3.1";

export const travelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Current weather for a coordinate — REST (Open-Meteo, no API key). */
    getCurrentWeather: builder.query<
      WeatherSummary,
      { lat: number; lon: number }
    >({
      query: ({ lat, lon }) => ({
        type: "rest",
        baseUrl: OPEN_METEO_BASE,
        url: "/forecast",
        params: {
          latitude: lat,
          longitude: lon,
          current_weather: true,
          timezone: "auto",
        },
      }),
      transformResponse: (response: OpenMeteoResponse): WeatherSummary => {
        const { condition, icon } = describeWeatherCode(
          response.current_weather.weathercode,
        );
        return {
          temperature: response.current_weather.temperature,
          windspeed: response.current_weather.windspeed,
          weatherCode: response.current_weather.weathercode,
          condition,
          icon,
          observedAt: response.current_weather.time,
          timezone: response.timezone,
        };
      },
      providesTags: (_result, _error, { lat, lon }) => [
        { type: "Weather", id: `${lat.toFixed(2)},${lon.toFixed(2)}` },
      ],
      keepUnusedDataFor: 60 * 15,
    }),

    /** Latest exchange rates with a given base currency — REST (Frankfurter, no API key). */
    getExchangeRates: builder.query<ExchangeRatesResponse, { base: string }>({
      query: ({ base }) => ({
        type: "rest",
        baseUrl: "",
        url: `/api/exchange-rates`,
        params: { from: base },
      }),
      providesTags: (_result, _error, { base }) => [
        { type: "Currency", id: base },
      ],
      keepUnusedDataFor: 60 * 60,
    }),

    /** Flags, coordinates, population, etc. for one country — REST (REST Countries). */
    getCountryDetails: builder.query({
      query: (code) => ({
        type: "rest",
        baseUrl: REST_COUNTRIES_BASE,
        url: `/alpha/${code}`,
        params: {
          fields:
            "flags,latlng,capital,population,area,subregion,timezones,maps",
        },
      }),
      transformResponse: (
        response,
      ) => (Array.isArray(response) ? response[0] : response),
      providesTags: (_result, _error, code) => [
        { type: "CountryDetails", id: code },
      ],
    }),
  }),
});

export const {
  useGetCurrentWeatherQuery,
  useGetExchangeRatesQuery,
  useGetCountryDetailsQuery,
} = travelApi;

/**
 * Maps WMO weather interpretation codes (used by Open-Meteo) to a
 * human-readable condition label and a lucide-react icon name.
 * https://open-meteo.com/en/docs#weathervariables
 */
export function describeWeatherCode(code: number): { condition: string; icon: string } {
  switch (true) {
    case code === 0:
      return { condition: "Clear sky", icon: "Sun" };
    case code >= 1 && code <= 2:
      return { condition: "Partly cloudy", icon: "CloudSun" };
    case code === 3:
      return { condition: "Overcast", icon: "Cloud" };
    case code === 45 || code === 48:
      return { condition: "Fog", icon: "CloudFog" };
    case code >= 51 && code <= 57:
      return { condition: "Drizzle", icon: "CloudDrizzle" };
    case (code >= 61 && code <= 67) || (code >= 80 && code <= 82):
      return { condition: "Rain", icon: "CloudRain" };
    case (code >= 71 && code <= 77) || code === 85 || code === 86:
      return { condition: "Snow", icon: "CloudSnow" };
    case code >= 95:
      return { condition: "Thunderstorm", icon: "CloudLightning" };
    default:
      return { condition: "Unknown", icon: "Cloud" };
  }
}

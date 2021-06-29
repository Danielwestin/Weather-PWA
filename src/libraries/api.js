import { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
import { usePreviousValue, useSearchParam } from "./hooks";

function normalizeData(cityData, weatherData) {
  const data = {
    place: cityData.place,
    county: cityData.county,
    country: cityData.country,
    // weather: weatherData,
    timeSeries: weatherData.timeSeries.slice(0, 57).map((timeSerie) => {
      return {
        time: timeSerie.validTime,
        temperature: timeSerie.parameters
          .filter((parameter) => {
            return parameter.name === "t";
          })
          .map(({ values, ...rest }) => {
            // const { values, ...secondParameter } = parameter;
            return { value: values[0], ...rest };
          })[0],
        wind: timeSerie.parameters.reduce(ParametersReducer("ws")),
        rain: timeSerie.parameters.reduce(ParametersReducer("pmean")),
        icon: timeSerie.parameters.reduce(ParametersReducer("Wsymb2")),
      };
    }),
  };
  return data;
}

//LÄTTARE ATT LÄSA
function ParametersReducer(word) {
  return (acc, { name, values, ...rest }) =>
    name === word ? { name, value: values[0], ...rest } : acc;
}

//SVÅRLÄST
// const myReducer = (word) => (acc, { name, values, ...rest }) =>
//   name === word ? { name, value: values[0], ...rest } : acc;

export function useQuery() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const locationName = useSearchParam("location");
  const query = usePreviousValue(locationName);

  useEffect(() => {
    setError("");

    (async () => {
      //?location=helsingborg&day=Idag

      if (!query) return console.log("Tom sökning");
      try {
        setLoading(true);
        const smhiResponse = await fetch(
          `https://www.smhi.se/wpt-a/backend_startpage_nextgen/geo/autocomplete/${query}`
        );
        const cities = await smhiResponse.json();
        if (!cities.length) return setError("Ingen stad hittades");
        const cityData = cities[0];

        const lon = +cityData.lon.toFixed(3);
        const lat = +cityData.lat.toFixed(3);

        const weatherResponse = await fetch(
          `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${lon}/lat/${lat}/data.json`
        );

        if (!weatherResponse.ok) return setError("OUT OF REACH");
        const weatherData = await weatherResponse.json();

        const data = normalizeData(cityData, weatherData);

        setData(data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    })();
  }, [query]);

  return { error, data, loading };
}

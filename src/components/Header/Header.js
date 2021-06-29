import { useState, useEffect, useRef } from "react";
import { useDebouncedValue } from "../../libraries/hooks";
import { useQuery } from "../../libraries/api";
import { reduceDaysArray } from "../../libraries/helpers";
import { useHistory } from "react-router-dom";
import { NavLink } from "../../libraries/custom";
import Content from "../Content/Content.js";
import styles from "./header.module.scss";

import SearchIcon from "../../SVG/Search";

import smoothscroll from "smoothscroll-polyfill";
import Loading from "../Loading/Loading";

function Header() {
  const [searchedCity, setSearchedCity] = useState("");
  const focusRef = useRef();
  const bringDownKeyboardRef = useRef();
  const debouncedQuery = useDebouncedValue(searchedCity, 1000);
  const { error, loading, data } = useQuery();
  const history = useHistory();

  useEffect(() => {
    smoothscroll.polyfill();

    if (!debouncedQuery) return;

    history.replace({
      path: "/",
      search: "?location=" + debouncedQuery + "&day=Idag",
    });

    bringDownKeyboardRef.current.blur();

    // if (!focusRef.current) return;
    setTimeout(() => {
      focusRef.current.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [debouncedQuery]);

  return (
    <header className={styles.header}>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>
          <h1>Nordic Weather</h1>
        </legend>

        <div className={styles.inputLabelWrapper}>
          <input
            type="text"
            name="location"
            id="location"
            className={styles.searchInput}
            value={searchedCity}
            onChange={(e) => setSearchedCity(e.target.value)}
            ref={bringDownKeyboardRef}
            autoFocus
            required
          />
          <label
            className={styles.inputLabel}
            htmlFor="location"
            aria-label="Search Icon"
          >
            <span className={styles.inputLabelContentName}>Sök på plats</span>
            <span className={styles.inputLabelSearchIcon}>
              <SearchIcon />
            </span>
          </label>
        </div>
      </fieldset>

      {error ? (
        <h2 ref={focusRef}>{error}</h2>
      ) : loading ? (
        <div
          ref={focusRef}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <h3>Loading...</h3>
          <Loading />
        </div>
      ) : (
        <>
          <h1 ref={focusRef}>{data.place}</h1>
          <h2>{data.county}</h2>
          <h3>{data.country}</h3>

          <div className={styles.days}>
            {data.timeSeries &&
              reduceDaysArray(data.timeSeries).map((day, i) => (
                <NavLink
                  to={{
                    pathname: "/",
                    search: "?location=" + debouncedQuery + "&day=" + day,
                  }}
                  key={i}
                  className={styles.dayLink}
                  activeClassName={styles.activeDayLink}
                  inactiveClassName={styles.inActiveDayLink}
                >
                  {day}
                </NavLink>
              ))}
          </div>
        </>
      )}

      {data.timeSeries && !error && <Content weatherData={data} />}
      {/* {data.timeSeries &&
          data.timeSeries
            // .filter((timeSerie) => getDay(timeSerie.time) === "Imorgon")
            .map((timeSerie) => (
              <li
                key={timeSerie.time}
                style={{ display: "flex", padding: "0.5rem 1rem" }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {getDay(timeSerie.time)}
                  <img
                    src={`/weatherIcons/${checkTime(
                      timeSerie.time,
                      timeSerie.icon.value
                    )}.png`}
                    alt="ikon för väder"
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: "1",
                  }}
                >
                  <div> */}
      {/* {new Date(timeSerie.time).toLocaleDateString()}{" "} */}
      {/* {new Date(timeSerie.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div>
                    Temperature:{" "}
                    <span
                      className={
                        timeSerie.temperature.value < 0 ? "cold" : "hot"
                      }
                    >
                      {timeSerie.temperature.value}{" "}
                    </span> */}
      {/* °{timeSerie.temperature.unit} */}
      {/* </div>
                </div>
              </li>
            ))} */}
    </header>
  );
}

export default Header;

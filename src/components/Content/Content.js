import React from "react";
import { checkTime, getDay, getMounth } from "../../libraries/helpers";
import { useLocation } from "react-router-dom";
import "../../App.scss";
import styles from "./content.module.scss";

export default function Content({ weatherData }) {
  const location = useLocation();
  const queryDay = new URLSearchParams(location.search);
  const day = queryDay.get("day");

  return (
    <main className={styles.content}>
      <h3>Visar väder för {day} </h3>
      <ul>
        {weatherData &&
          weatherData.timeSeries
            .filter((timeSerie) => getDay(timeSerie.time) === day)

            .map((timeSerie) => (
              <li key={timeSerie.time}>
                <div className={styles.liDayNIcon}>
                  {getDay(timeSerie.time)}
                  <img
                    style={{ width: "60px", height: "40px" }}
                    src={`/weatherIcons/${checkTime(
                      timeSerie.time,
                      timeSerie.icon.value
                    )}.png`}
                    alt="ikon för väder"
                  />
                </div>
                <div className={styles.weatherInfo}>
                  <div className={styles.datesNTime}>
                    <span className={styles.date}>
                      {new Date(timeSerie.time).toLocaleDateString([], {
                        day: "numeric",
                      })}{" "}
                      {getMounth(
                        new Date(timeSerie.time).toLocaleDateString([], {
                          month: "2-digit",
                        })
                      )}
                    </span>

                    <span className={styles.time}>
                      {new Date(timeSerie.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className={styles.windNTemp}>
                    <span className={styles.wind}>
                      {timeSerie.wind.value} {timeSerie.wind.unit}
                    </span>
                    <span
                      className={`${
                        timeSerie.temperature.value < 0
                          ? styles.cold
                          : styles.hot
                      } ${styles.temp}`}
                    >
                      {timeSerie.temperature.value}°{" "}
                    </span>
                    {/* {timeSerie.temperature.unit} */}
                  </div>
                </div>
              </li>
            ))}
      </ul>
    </main>
  );
}

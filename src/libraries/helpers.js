import { weekDays, months } from "./constants";

export function checkTime(time, number) {
  const clock = new Date(time).getHours();
  return clock >= 8 && clock <= 17 ? number : "night";
}

export function getDay(dates) {
  const today = new Date().getDay();
  const date = new Date(dates).getDay();

  //Svårläst
  // return date === today
  //   ? "Idag"
  //   : date === today + 1
  //   ? "Imorgon"
  //   : weekDays[date];

  //Enklare
  if (date === today) return "Idag";
  if (date === today + 1) return "Imorgon";
  return weekDays[date];
}

export function getMounth(month) {
  const monthToday = new Date(month).getMonth();
  return months[monthToday];
}

export function reduceDaysArray(array) {
  const daysArray = array.reduce(
    (uniq, item) =>
      uniq.includes(getDay(item.time)) ? uniq : [...uniq, getDay(item.time)],
    []
  );
  return daysArray;
}

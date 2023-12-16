// Copyright 2023-Present Soma Notes
import { Day } from "../signal/common.ts";

export const getFormattedDay = (date: Date): Day => {
  const yearString = date.getFullYear();
  const monthString = (date.getMonth() + 1).toString().padStart(2, "0");
  const dateString = date.getDate().toString().padStart(2, "0");

  return `${yearString}-${monthString}-${dateString}`;
};

export const getFormattedDayDiff = (date: Date, dayDiff: number): Day => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + dayDiff);

  return getFormattedDay(new Date(newDate));
};

export const getDateFromFormattedDay = (formattedDay: Day): Date => {
  const [year, month, day] = formattedDay.split("-");

  return new Date(Number(year), Number(month) - 1, Number(day));
};

export const getHumanReadableDayDiff = (day: Day): string => {
  switch (day) {
    case getFormattedDayDiff(new Date(), -1):
      return " (Yesterday)";
    case getFormattedDayDiff(new Date(), 0):
      return " (Today)";
    case getFormattedDayDiff(new Date(), 1):
      return " (Tomorrow)";
    case getFormattedDayDiff(new Date(), 2):
      return " (Day after tomorrow)";
    case getFormattedDayDiff(new Date(), -2):
      return " (Day before yesterday)";
    default:
      return "";
  }
};

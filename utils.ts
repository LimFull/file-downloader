import moment from "moment";
import {DiffUnit} from "./types";

export const getDiff = (date1: string, date2: string, unit: DiffUnit): number => {
  const time1 = moment(date1);
  const time2 = moment(date2)
  const duration = moment.duration(time2.diff(time1));

  if (unit === DiffUnit.MONTH) {
    return duration.asMonths()
  } else if (unit === DiffUnit.DAY) {
    return duration.asDays();
  } else if (unit === DiffUnit.HOUR) {
    return duration.asHours()
  } else if (unit === DiffUnit.MINUTE) {
    return duration.asMinutes()
  } else if (unit === DiffUnit.SECOND) {
    return duration.asSeconds()
  }

  return 0;
}
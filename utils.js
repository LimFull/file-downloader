"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDiff = void 0;
const moment_1 = __importDefault(require("moment"));
const types_1 = require("./types");
const getDiff = (date1, date2, unit) => {
    const time1 = (0, moment_1.default)(date1);
    const time2 = (0, moment_1.default)(date2);
    const duration = moment_1.default.duration(time2.diff(time1));
    if (unit === types_1.DiffUnit.MONTH) {
        return duration.asMonths();
    }
    else if (unit === types_1.DiffUnit.DAY) {
        return duration.asDays();
    }
    else if (unit === types_1.DiffUnit.HOUR) {
        return duration.asHours();
    }
    else if (unit === types_1.DiffUnit.MINUTE) {
        return duration.asMinutes();
    }
    else if (unit === types_1.DiffUnit.SECOND) {
        return duration.asSeconds();
    }
    return 0;
};
exports.getDiff = getDiff;

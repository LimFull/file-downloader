"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartIndex = exports.DiffUnit = void 0;
var DiffUnit;
(function (DiffUnit) {
    DiffUnit["SECOND"] = "second";
    DiffUnit["MINUTE"] = "minute";
    DiffUnit["HOUR"] = "hour";
    DiffUnit["DAY"] = "day";
    DiffUnit["MONTH"] = "month";
})(DiffUnit = exports.DiffUnit || (exports.DiffUnit = {}));
var ChartIndex;
(function (ChartIndex) {
    ChartIndex[ChartIndex["HIGH"] = 2] = "HIGH";
    ChartIndex[ChartIndex["LOW"] = 3] = "LOW";
    ChartIndex[ChartIndex["CLOSE"] = 4] = "CLOSE";
    ChartIndex[ChartIndex["VOLUME"] = 5] = "VOLUME";
    ChartIndex[ChartIndex["QUOTE_VOLUME"] = 7] = "QUOTE_VOLUME";
})(ChartIndex = exports.ChartIndex || (exports.ChartIndex = {}));

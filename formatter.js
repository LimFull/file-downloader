"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const moment_1 = __importDefault(require("moment"));
const types_1 = require("./types");
const utils_1 = require("./utils");
const indicators_1 = require("./indicators");
// open_time, open, high, low, close, volume, close_time, quote_volume, count, taker_buy_volume, taker_buy_quote_volume, ignore
const joinBook = (symbol, time, start, end) => __awaiter(void 0, void 0, void 0, function* () {
    const diff = (0, utils_1.getDiff)(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'), types_1.DiffUnit.DAY);
    let cursor = (0, moment_1.default)(start);
    for (let i = 0; i < diff + 1; i++) {
        const csv = fs_1.default.readFileSync(`./datas/${symbol}/${symbol}-${time}-${cursor.format('YYYY-MM-DD')}.csv`, 'utf-8');
        const rows = csv.split('\n');
        const textbook = [];
        if (rows[0].includes('open_time')) {
            rows.shift();
        }
        if (rows[rows.length - 1] === '') {
            rows.pop();
        }
        for (const i in rows) {
            const row = rows[i];
            textbook.push(row.split(','));
        }
        textbook.forEach((v, j) => {
            if (j === textbook.length - 1 && i === diff) {
                fs_1.default.appendFileSync(`./datas/${symbol}/${symbol}-${cursor.format('YYYY')}-joinBook.csv`, v.toString());
            }
            else {
                fs_1.default.appendFileSync(`./datas/${symbol}/${symbol}-${cursor.format('YYYY')}-joinBook.csv`, v + '\n');
            }
        });
        console.log("write", cursor.format('YYYY-MM-DD'));
        cursor = cursor.add(1, types_1.DiffUnit.DAY);
    }
    return;
});
const makeTextbook = (symbol, date) => __awaiter(void 0, void 0, void 0, function* () {
    const csv = fs_1.default.readFileSync(`./datas/${symbol}/${symbol}-${date.format('YYYY')}-joinBook.csv`, 'utf-8');
    const rows = csv.split('\n');
    const length = rows.length;
    console.log("length", length);
    const ema5array = (0, indicators_1.calculateEMA)(rows, 5);
    for (let i = 0; i < length; i++) {
        if (i < 4) {
            rows[i] = rows[i] + ',' + 'null';
        }
        else {
            rows[i] = rows[i] + "," + ema5array[i - 4];
        }
    }
    const ema10array = (0, indicators_1.calculateEMA)(rows, 10);
    for (let i = 0; i < length; i++) {
        if (i < 9) {
            rows[i] = rows[i] + ',' + 'null';
        }
        else {
            rows[i] = rows[i] + "," + ema10array[i - 9];
        }
    }
    const ema20array = (0, indicators_1.calculateEMA)(rows, 20);
    for (let i = 0; i < length; i++) {
        if (i < 19) {
            rows[i] = rows[i] + ',' + 'null';
        }
        else {
            rows[i] = rows[i] + "," + ema20array[i - 19];
        }
    }
    const ema60array = (0, indicators_1.calculateEMA)(rows, 60);
    for (let i = 0; i < length; i++) {
        if (i < 59) {
            rows[i] = rows[i] + ',' + 'null';
        }
        else {
            rows[i] = rows[i] + "," + ema60array[i - 59];
        }
    }
    const ema120array = (0, indicators_1.calculateEMA)(rows, 120);
    for (let i = 0; i < length; i++) {
        if (i < 119) {
            rows[i] = rows[i] + ',' + 'null';
        }
        else {
            rows[i] = rows[i] + "," + ema120array[i - 119];
        }
    }
    const sma5array = (0, indicators_1.calculateSMA)(rows, 5);
    for (let i = 0; i < length; i++) {
        if (i < 4) {
            rows[i] = rows[i] + ',' + 'null';
        }
        else {
            rows[i] = rows[i] + "," + sma5array[i - 4];
        }
    }
    const sma10array = (0, indicators_1.calculateSMA)(rows, 10);
    for (let i = 0; i < length; i++) {
        if (i < 9) {
            rows[i] = rows[i] + ',' + 'null';
        }
        else {
            rows[i] = rows[i] + "," + sma10array[i - 9];
        }
    }
    const sma20array = (0, indicators_1.calculateSMA)(rows, 20);
    for (let i = 0; i < length; i++) {
        if (i < 19) {
            rows[i] = rows[i] + ',' + 'null';
        }
        else {
            rows[i] = rows[i] + "," + sma20array[i - 9];
        }
    }
    const sma60array = (0, indicators_1.calculateSMA)(rows, 60);
    for (let i = 0; i < length; i++) {
        if (i < 59) {
            rows[i] = rows[i] + ',' + 'null';
        }
        else {
            rows[i] = rows[i] + "," + sma60array[i - 9];
        }
    }
    const sma120array = (0, indicators_1.calculateSMA)(rows, 120);
    for (let i = 0; i < length; i++) {
        if (i < 119) {
            rows[i] = rows[i] + ',' + 'null';
        }
        else {
            rows[i] = rows[i] + "," + sma120array[i - 9];
        }
    }
    const { macdData, signalData, histogramData } = (0, indicators_1.calculateMACD)(rows, 5, 12);
    for (let i = 0; i < length; i++) {
        rows[i] = rows[i] + ',' + macdData[i] + ',' + signalData[i];
    }
    const rsi14array = (0, indicators_1.calculateRSI)(rows, 5);
    for (let i = 0; i < length; i++) {
        rows[i] = rows[i] + ',' + rsi14array[i];
    }
    const stocahstic5array = (0, indicators_1.stochasticOscillator)(rows, 5, 5, 5);
    for (let i = 0; i < length; i++) {
        rows[i] = rows[i] + ',' + stocahstic5array[i].k + ',' + stocahstic5array[i].d + ',' + stocahstic5array[i].kperd;
    }
    const bollinger10 = (0, indicators_1.bollingerBands)(rows, 10);
    for (let i = 0; i < length; i++) {
        rows[i] = rows[i] + ',' + bollinger10.upperBands[i] + ',' + bollinger10.lowerBands[i];
    }
    const ema5VolumeArray = (0, indicators_1.calculateEMAVolume)(rows, 5);
    for (let i = 0; i < length; i++) {
        if (i < 4) {
            rows[i] = rows[i] + ',' + 'null';
        }
        else {
            rows[i] = rows[i] + "," + ema5VolumeArray[i - 4];
        }
    }
    const ema10VolumeArray = (0, indicators_1.calculateEMAVolume)(rows, 10);
    for (let i = 0; i < length; i++) {
        if (i < 9) {
            rows[i] = rows[i] + ',' + 'null';
        }
        else {
            rows[i] = rows[i] + "," + ema10VolumeArray[i - 9];
        }
    }
    const ema20VolumeArray = (0, indicators_1.calculateEMAVolume)(rows, 20);
    for (let i = 0; i < length; i++) {
        if (i < 19) {
            rows[i] = rows[i] + ',' + 'null';
        }
        else {
            rows[i] = rows[i] + "," + ema20VolumeArray[i - 19];
        }
    }
    const ema60VolumeArray = (0, indicators_1.calculateEMAVolume)(rows, 60);
    for (let i = 0; i < length; i++) {
        if (i < 59) {
            rows[i] = rows[i] + ',' + 'null';
        }
        else {
            rows[i] = rows[i] + "," + ema60VolumeArray[i - 59];
        }
    }
    const ema120VolumeArray = (0, indicators_1.calculateEMAVolume)(rows, 120);
    for (let i = 0; i < length; i++) {
        if (i < 119) {
            rows[i] = rows[i] + ',' + 'null';
        }
        else {
            rows[i] = rows[i] + "," + ema120VolumeArray[i - 119];
        }
    }
    const sma5VolumeArray = (0, indicators_1.calculateSMAVolume)(rows, 5);
    for (let i = 0; i < length; i++) {
        if (i < 4) {
            rows[i] = rows[i] + ',' + 'null';
        }
        else {
            rows[i] = rows[i] + "," + sma5VolumeArray[i - 4];
        }
    }
    const sma10VolumeArray = (0, indicators_1.calculateSMAVolume)(rows, 10);
    for (let i = 0; i < length; i++) {
        if (i < 9) {
            rows[i] = rows[i] + ',' + 'null';
        }
        else {
            rows[i] = rows[i] + "," + sma10VolumeArray[i - 9];
        }
    }
    const sma20VolumeArray = (0, indicators_1.calculateSMAVolume)(rows, 20);
    for (let i = 0; i < length; i++) {
        if (i < 19) {
            rows[i] = rows[i] + ',' + 'null';
        }
        else {
            rows[i] = rows[i] + "," + sma20VolumeArray[i - 9];
        }
    }
    const sma60VolumeArray = (0, indicators_1.calculateSMAVolume)(rows, 60);
    for (let i = 0; i < length; i++) {
        if (i < 59) {
            rows[i] = rows[i] + ',' + 'null';
        }
        else {
            rows[i] = rows[i] + "," + sma60VolumeArray[i - 9];
        }
    }
    const sma120VolumeArray = (0, indicators_1.calculateSMAVolume)(rows, 120);
    for (let i = 0; i < length; i++) {
        if (i < 119) {
            rows[i] = rows[i] + ',' + 'null';
        }
        else {
            rows[i] = rows[i] + "," + sma120VolumeArray[i - 9];
        }
    }
    rows.forEach((v, i) => {
        // if (i < 120) {
        //     return;
        // }
        if (i === rows.length - 1) {
            fs_1.default.appendFileSync(`./datas/${symbol}/${symbol}-${date.format('YYYY')}-textBook.csv`, v.toString());
        }
        else {
            fs_1.default.appendFileSync(`./datas/${symbol}/${symbol}-${date.format('YYYY')}-textBook.csv`, v + '\n');
        }
    });
    return;
});
function joinAndMake() {
    return __awaiter(this, void 0, void 0, function* () {
        // await joinBook('1000LUNCUSDT', '1m', moment('2022-09-09'), moment('2022-12-31'))
        yield makeTextbook('1000LUNCUSDT', (0, moment_1.default)('2022'));
    });
}
joinAndMake();

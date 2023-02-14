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
    const closeChangeArray = (0, indicators_1.changeAbs)(rows, types_1.ChartIndex.CLOSE);
    const volumeChangeArray = (0, indicators_1.changeAbs)(rows, types_1.ChartIndex.VOLUME);
    const ema5array = (0, indicators_1.calculateEMAAbs)(rows, 5, types_1.ChartIndex.CLOSE);
    const ema10array = (0, indicators_1.calculateEMAAbs)(rows, 10, types_1.ChartIndex.CLOSE);
    const ema20array = (0, indicators_1.calculateEMAAbs)(rows, 20, types_1.ChartIndex.CLOSE);
    const ema60array = (0, indicators_1.calculateEMAAbs)(rows, 60, types_1.ChartIndex.CLOSE);
    const ema120array = (0, indicators_1.calculateEMAAbs)(rows, 120, types_1.ChartIndex.CLOSE);
    const sma5array = (0, indicators_1.calculateSMAAbs)(rows, 5, types_1.ChartIndex.CLOSE);
    const sma10array = (0, indicators_1.calculateSMAAbs)(rows, 10, types_1.ChartIndex.CLOSE);
    const sma20array = (0, indicators_1.calculateSMAAbs)(rows, 20, types_1.ChartIndex.CLOSE);
    const sma60array = (0, indicators_1.calculateSMAAbs)(rows, 60, types_1.ChartIndex.CLOSE);
    const sma120array = (0, indicators_1.calculateSMAAbs)(rows, 120, types_1.ChartIndex.CLOSE);
    const { macdData, signalData, histogramData } = (0, indicators_1.calculateMACDAbs)(rows, 5, 12);
    const rsi14array = (0, indicators_1.calculateRSI)(rows, 14);
    const stocahstic5array = (0, indicators_1.stochasticOscillator)(rows, 14, 3, 3);
    const bollinger10 = (0, indicators_1.bollingerBands)(rows, 20);
    const ema5VolumeArray = (0, indicators_1.calculateEMAAbs)(rows, 5, types_1.ChartIndex.VOLUME);
    const ema10VolumeArray = (0, indicators_1.calculateEMAAbs)(rows, 10, types_1.ChartIndex.VOLUME);
    const ema20VolumeArray = (0, indicators_1.calculateEMAAbs)(rows, 20, types_1.ChartIndex.VOLUME);
    const ema60VolumeArray = (0, indicators_1.calculateEMAAbs)(rows, 60, types_1.ChartIndex.VOLUME);
    const ema120VolumeArray = (0, indicators_1.calculateEMAAbs)(rows, 120, types_1.ChartIndex.VOLUME);
    const sma5VolumeArray = (0, indicators_1.calculateSMAAbs)(rows, 5, types_1.ChartIndex.VOLUME);
    const sma10VolumeArray = (0, indicators_1.calculateSMAAbs)(rows, 10, types_1.ChartIndex.VOLUME);
    const sma20VolumeArray = (0, indicators_1.calculateSMAAbs)(rows, 20, types_1.ChartIndex.VOLUME);
    const sma60VolumeArray = (0, indicators_1.calculateSMAAbs)(rows, 60, types_1.ChartIndex.VOLUME);
    const sma120VolumeArray = (0, indicators_1.calculateSMAAbs)(rows, 120, types_1.ChartIndex.VOLUME);
    for (let i = 0; i < length; i++) {
        const ema5 = i < 4 ? 'NaN' : ema5array[i - 4];
        const ema10 = i < 9 ? 'NaN' : ema10array[i - 9];
        const ema20 = i < 19 ? 'NaN' : ema20array[i - 19];
        const ema60 = i < 59 ? 'NaN' : ema60array[i - 59];
        const ema120 = i < 119 ? 'NaN' : ema120array[i - 119];
        const sma5 = i < 4 ? 'NaN' : sma5array[i - 4];
        const sma10 = i < 9 ? 'NaN' : sma10array[i - 9];
        const sma20 = i < 19 ? 'NaN' : sma20array[i - 19];
        const sma60 = i < 59 ? 'NaN' : sma60array[i - 59];
        const sma120 = i < 119 ? 'NaN' : sma120array[i - 119];
        const ema5Volume = i < 4 ? 'NaN' : ema5VolumeArray[i - 4];
        const ema10Volume = i < 9 ? 'NaN' : ema10VolumeArray[i - 9];
        const ema20Volume = i < 19 ? 'NaN' : ema20VolumeArray[i - 19];
        const ema60Volume = i < 59 ? 'NaN' : ema60VolumeArray[i - 59];
        const ema120Volume = i < 119 ? 'NaN' : ema120VolumeArray[i - 119];
        const sma5Volume = i < 4 ? 'NaN' : sma5VolumeArray[i - 4];
        const sma10Volume = i < 9 ? 'NaN' : sma10VolumeArray[i - 9];
        const sma20Volume = i < 19 ? 'NaN' : sma20VolumeArray[i - 19];
        const sma60Volume = i < 59 ? 'NaN' : sma60VolumeArray[i - 59];
        const sma120Volume = i < 119 ? 'NaN' : sma120VolumeArray[i - 119];
        rows[i] = rows[i] + ',' + closeChangeArray[i] + ',' + volumeChangeArray[i] + ',' + ema5 + ',' + ema10 + ',' + ema20 + ',' + ema60 + ',' + ema120 + ',' + sma5 + ',' + sma10 + ',' + sma20 + ',' + sma60 + ',' + sma120 + ',' + macdData[i] + ',' + signalData[i] + ',' + rsi14array[i] + ',' + stocahstic5array[i].k + ',' + stocahstic5array[i].d + ',' + bollinger10.upperBands[i] + ',' + bollinger10.lowerBands[i] + ',' + ema5Volume + ',' + ema10Volume + ',' + ema20Volume + ',' + ema60Volume + ',' + ema120Volume + ',' + sma5Volume + ',' + sma10Volume + ',' + sma20Volume + ',' + sma60Volume + ',' + sma120Volume;
    }
    rows.forEach((v, i) => {
        // if (i < 120) {
        //     return;
        // }
        // if (i > 200) {
        //     return
        // }
        if (i < 200) {
            return;
        }
        if (i > 1640) {
            return;
        }
        if (i === rows.length - 1) {
            fs_1.default.appendFileSync(`./datas/${symbol}/${symbol}-${date.format('YYYY')}-textBook.csv`, v.toString());
        }
        else {
            fs_1.default.appendFileSync(`./datas/${symbol}/${symbol}-${date.format('YYYY')}-textBook.csv`, v + '\n');
        }
    });
    return;
});
const makeTextbookV2 = (symbol, date) => __awaiter(void 0, void 0, void 0, function* () {
    const csv = fs_1.default.readFileSync(`./datas/${symbol}/${symbol}-${date.format('YYYY')}-joinBook.csv`, 'utf-8');
    const rows = csv.split('\n');
    const length = rows.length;
    console.log("length", length);
    const closeChangeArray = (0, indicators_1.changeAbs)(rows, types_1.ChartIndex.CLOSE);
    const volumeChangeArray = (0, indicators_1.changeAbs)(rows, types_1.ChartIndex.VOLUME);
    const ema5array = (0, indicators_1.calculateEMAAbs)(rows, 5, types_1.ChartIndex.CLOSE);
    const ema10array = (0, indicators_1.calculateEMAAbs)(rows, 10, types_1.ChartIndex.CLOSE);
    const ema20array = (0, indicators_1.calculateEMAAbs)(rows, 20, types_1.ChartIndex.CLOSE);
    const ema60array = (0, indicators_1.calculateEMAAbs)(rows, 60, types_1.ChartIndex.CLOSE);
    const ema120array = (0, indicators_1.calculateEMAAbs)(rows, 120, types_1.ChartIndex.CLOSE);
    const sma5array = (0, indicators_1.calculateSMAAbs)(rows, 5, types_1.ChartIndex.CLOSE);
    const sma10array = (0, indicators_1.calculateSMAAbs)(rows, 10, types_1.ChartIndex.CLOSE);
    const sma20array = (0, indicators_1.calculateSMAAbs)(rows, 20, types_1.ChartIndex.CLOSE);
    const sma60array = (0, indicators_1.calculateSMAAbs)(rows, 60, types_1.ChartIndex.CLOSE);
    const sma120array = (0, indicators_1.calculateSMAAbs)(rows, 120, types_1.ChartIndex.CLOSE);
    const { macdData, signalData, histogramData } = (0, indicators_1.calculateMACDAbs)(rows, 5, 12);
    const rsi14array = (0, indicators_1.calculateRSI)(rows, 14);
    const stocahstic5array = (0, indicators_1.stochasticOscillator)(rows, 14, 3, 3);
    const bollinger10 = (0, indicators_1.bollingerBands)(rows, 20);
    const ema5VolumeArray = (0, indicators_1.calculateEMAAbs)(rows, 5, types_1.ChartIndex.VOLUME);
    const ema10VolumeArray = (0, indicators_1.calculateEMAAbs)(rows, 10, types_1.ChartIndex.VOLUME);
    const ema20VolumeArray = (0, indicators_1.calculateEMAAbs)(rows, 20, types_1.ChartIndex.VOLUME);
    const ema60VolumeArray = (0, indicators_1.calculateEMAAbs)(rows, 60, types_1.ChartIndex.VOLUME);
    const ema120VolumeArray = (0, indicators_1.calculateEMAAbs)(rows, 120, types_1.ChartIndex.VOLUME);
    const sma5VolumeArray = (0, indicators_1.calculateSMAAbs)(rows, 5, types_1.ChartIndex.VOLUME);
    const sma10VolumeArray = (0, indicators_1.calculateSMAAbs)(rows, 10, types_1.ChartIndex.VOLUME);
    const sma20VolumeArray = (0, indicators_1.calculateSMAAbs)(rows, 20, types_1.ChartIndex.VOLUME);
    const sma60VolumeArray = (0, indicators_1.calculateSMAAbs)(rows, 60, types_1.ChartIndex.VOLUME);
    const sma120VolumeArray = (0, indicators_1.calculateSMAAbs)(rows, 120, types_1.ChartIndex.VOLUME);
    const ema5HighArray = (0, indicators_1.calculateEMAAbs)(rows, 5, types_1.ChartIndex.HIGH);
    const ema10HighArray = (0, indicators_1.calculateEMAAbs)(rows, 10, types_1.ChartIndex.HIGH);
    const ema20HighArray = (0, indicators_1.calculateEMAAbs)(rows, 20, types_1.ChartIndex.HIGH);
    const ema60HighArray = (0, indicators_1.calculateEMAAbs)(rows, 60, types_1.ChartIndex.HIGH);
    const ema120HighArray = (0, indicators_1.calculateEMAAbs)(rows, 120, types_1.ChartIndex.HIGH);
    const sma5HighArray = (0, indicators_1.calculateSMAAbs)(rows, 5, types_1.ChartIndex.HIGH);
    const sma10HighArray = (0, indicators_1.calculateSMAAbs)(rows, 10, types_1.ChartIndex.HIGH);
    const sma20HighArray = (0, indicators_1.calculateSMAAbs)(rows, 20, types_1.ChartIndex.HIGH);
    const sma60HighArray = (0, indicators_1.calculateSMAAbs)(rows, 60, types_1.ChartIndex.HIGH);
    const sma120HighArray = (0, indicators_1.calculateSMAAbs)(rows, 120, types_1.ChartIndex.HIGH);
    const ema5LowArray = (0, indicators_1.calculateEMAAbs)(rows, 5, types_1.ChartIndex.LOW);
    const ema10LowArray = (0, indicators_1.calculateEMAAbs)(rows, 10, types_1.ChartIndex.LOW);
    const ema20LowArray = (0, indicators_1.calculateEMAAbs)(rows, 20, types_1.ChartIndex.LOW);
    const ema60LowArray = (0, indicators_1.calculateEMAAbs)(rows, 60, types_1.ChartIndex.LOW);
    const ema120LowArray = (0, indicators_1.calculateEMAAbs)(rows, 120, types_1.ChartIndex.LOW);
    const sma5LowArray = (0, indicators_1.calculateSMAAbs)(rows, 5, types_1.ChartIndex.LOW);
    const sma10LowArray = (0, indicators_1.calculateSMAAbs)(rows, 10, types_1.ChartIndex.LOW);
    const sma20LowArray = (0, indicators_1.calculateSMAAbs)(rows, 20, types_1.ChartIndex.LOW);
    const sma60LowArray = (0, indicators_1.calculateSMAAbs)(rows, 60, types_1.ChartIndex.LOW);
    const sma120LowArray = (0, indicators_1.calculateSMAAbs)(rows, 120, types_1.ChartIndex.LOW);
    const highChangeArray = (0, indicators_1.changeAbs)(rows, types_1.ChartIndex.HIGH);
    const lowChangeArray = (0, indicators_1.changeAbs)(rows, types_1.ChartIndex.LOW);
    for (let i = 0; i < length; i++) {
        const ema5 = i < 4 ? 'NaN' : ema5array[i - 4];
        const ema10 = i < 9 ? 'NaN' : ema10array[i - 9];
        const ema20 = i < 19 ? 'NaN' : ema20array[i - 19];
        const ema60 = i < 59 ? 'NaN' : ema60array[i - 59];
        const ema120 = i < 119 ? 'NaN' : ema120array[i - 119];
        const sma5 = i < 4 ? 'NaN' : sma5array[i - 4];
        const sma10 = i < 9 ? 'NaN' : sma10array[i - 9];
        const sma20 = i < 19 ? 'NaN' : sma20array[i - 19];
        const sma60 = i < 59 ? 'NaN' : sma60array[i - 59];
        const sma120 = i < 119 ? 'NaN' : sma120array[i - 119];
        const ema5Volume = i < 4 ? 'NaN' : ema5VolumeArray[i - 4];
        const ema10Volume = i < 9 ? 'NaN' : ema10VolumeArray[i - 9];
        const ema20Volume = i < 19 ? 'NaN' : ema20VolumeArray[i - 19];
        const ema60Volume = i < 59 ? 'NaN' : ema60VolumeArray[i - 59];
        const ema120Volume = i < 119 ? 'NaN' : ema120VolumeArray[i - 119];
        const sma5Volume = i < 4 ? 'NaN' : sma5VolumeArray[i - 4];
        const sma10Volume = i < 9 ? 'NaN' : sma10VolumeArray[i - 9];
        const sma20Volume = i < 19 ? 'NaN' : sma20VolumeArray[i - 19];
        const sma60Volume = i < 59 ? 'NaN' : sma60VolumeArray[i - 59];
        const sma120Volume = i < 119 ? 'NaN' : sma120VolumeArray[i - 119];
        const ema5High = i < 4 ? 'NaN' : ema5HighArray[i - 4];
        const ema10High = i < 9 ? 'NaN' : ema10HighArray[i - 9];
        const ema20High = i < 19 ? 'NaN' : ema20HighArray[i - 19];
        const ema60High = i < 59 ? 'NaN' : ema60HighArray[i - 59];
        const ema120High = i < 119 ? 'NaN' : ema120HighArray[i - 119];
        const sma5High = i < 4 ? 'NaN' : sma5HighArray[i - 4];
        const sma10High = i < 9 ? 'NaN' : sma10HighArray[i - 9];
        const sma20High = i < 19 ? 'NaN' : sma20HighArray[i - 19];
        const sma60High = i < 59 ? 'NaN' : sma60HighArray[i - 59];
        const sma120High = i < 119 ? 'NaN' : sma120HighArray[i - 119];
        const ema5Low = i < 4 ? 'NaN' : ema5LowArray[i - 4];
        const ema10Low = i < 9 ? 'NaN' : ema10LowArray[i - 9];
        const ema20Low = i < 19 ? 'NaN' : ema20LowArray[i - 19];
        const ema60Low = i < 59 ? 'NaN' : ema60LowArray[i - 59];
        const ema120Low = i < 119 ? 'NaN' : ema120LowArray[i - 119];
        const sma5Low = i < 4 ? 'NaN' : sma5LowArray[i - 4];
        const sma10Low = i < 9 ? 'NaN' : sma10LowArray[i - 9];
        const sma20Low = i < 19 ? 'NaN' : sma20LowArray[i - 19];
        const sma60Low = i < 59 ? 'NaN' : sma60LowArray[i - 59];
        const sma120Low = i < 119 ? 'NaN' : sma120LowArray[i - 119];
        rows[i] = rows[i] + ',' + closeChangeArray[i] + ',' + volumeChangeArray[i] + ',' + ema5 + ',' + ema10 + ',' + ema20 + ',' + ema60 + ',' + ema120 + ',' + sma5 + ',' + sma10 + ',' + sma20 + ',' + sma60 + ',' + sma120 + ',' + macdData[i] + ',' + signalData[i] + ',' + rsi14array[i] + ',' + stocahstic5array[i].k + ',' + stocahstic5array[i].d + ',' + bollinger10.upperBands[i] + ',' + bollinger10.lowerBands[i] + ',' + ema5Volume + ',' + ema10Volume + ',' + ema20Volume + ',' + ema60Volume + ',' + ema120Volume + ',' + sma5Volume + ',' + sma10Volume + ',' + sma20Volume + ',' + sma60Volume + ',' + sma120Volume + ',' + ema5High + ',' + ema10High + ',' + ema20High + ',' + ema60High + ',' + ema120High + ',' + sma5High + ',' + sma10High + ',' + sma20High + ',' + sma60High + ',' + sma120High + ',' + ema5Low + ',' + ema10Low + ',' + ema20Low + ',' + ema60Low + ',' + ema120Low + ',' + sma5Low + ',' + sma10Low + ',' + sma20Low + ',' + sma60Low + ',' + sma120Low + ',' + highChangeArray[i] + ',' + lowChangeArray[i];
    }
    rows.forEach((v, i) => {
        // if (i < 120) {
        //     return;
        // }
        // if (i > 200) {
        //     return
        // }
        if (i < 200) {
            return;
        }
        if (i > 1640) {
            return;
        }
        if (i === rows.length - 1) {
            fs_1.default.appendFileSync(`./datas/${symbol}/${symbol}-${date.format('YYYY')}-textBook.csv`, v.toString());
        }
        else {
            fs_1.default.appendFileSync(`./datas/${symbol}/${symbol}-${date.format('YYYY')}-textBook.csv`, v + '\n');
        }
    });
    return;
});
function joinAndMake(symbol, time, start, end) {
    return __awaiter(this, void 0, void 0, function* () {
        yield joinBook(symbol, time, start, end);
        yield makeTextbookV2(symbol, (0, moment_1.default)('2022'));
    });
}
joinAndMake('1000LUNCUSDT', '1m', (0, moment_1.default)('2022-09-09'), (0, moment_1.default)('2022-12-31'));

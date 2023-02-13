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
const https_1 = __importDefault(require("https"));
const types_1 = require("./types");
const utils_1 = require("./utils");
const moment_1 = __importDefault(require("moment"));
const decompress_1 = __importDefault(require("decompress"));
const SYMBOL = '1000LUNCUSDT';
const TIME = '15m';
const START_DATE = '2022-09-09';
const END_DATE = '2022-12-31';
const getNames = (symbol, time, date) => {
    const yyyyMMdd = date.format('YYYY-MM-DD');
    const path = `https://data.binance.vision/data/futures/um/daily/klines/${symbol}/${time}/${symbol}-${time}-${yyyyMMdd}.zip`;
    const fileName = `./datas/${symbol}/${symbol}_${time}_${yyyyMMdd}.zip`;
    return { path, fileName };
};
const download = (symbol, time, date) => __awaiter(void 0, void 0, void 0, function* () {
    const dir = `./datas/${symbol}`;
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir);
    }
    const { path, fileName } = getNames(symbol, time, date);
    return new Promise(resolve => {
        const file = fs_1.default.createWriteStream(fileName);
        https_1.default.get(path, (result) => {
            result.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log("Download Completed for", symbol, time, date);
                resolve();
            });
        });
    }).then(() => {
        return (0, decompress_1.default)(fileName, dir);
    }).then(() => {
        fs_1.default.rmSync(fileName);
    });
});
const downloadAll = (symbol, time, start, end, unit) => __awaiter(void 0, void 0, void 0, function* () {
    const diff = (0, utils_1.getDiff)(start, end, unit);
    let cursor = (0, moment_1.default)(start);
    for (let i = 0; i <= diff; i++) {
        yield download(symbol, time, cursor);
        cursor = cursor.add(1, unit);
    }
    console.log("Download All Completed");
});
downloadAll(SYMBOL, TIME, START_DATE, END_DATE, types_1.DiffUnit.DAY);

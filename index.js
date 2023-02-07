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
const moment_1 = __importDefault(require("moment"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const SYMBOL = '1000LUNCUSDT';
const TIME = '1m';
const DATE = '2023-02-03';
const END_DATE = '2023-02-05';
const getNames = (symbol, time, date) => {
    const path = `https://data.binance.vision/data/futures/um/daily/klines/${symbol}/${time}/${symbol}-${time}-${date}.zip`;
    const fileName = `./datas/${symbol}/${symbol}_${time}_${date}.zip`;
    return { path, fileName };
};
const download = (symbol, time, date) => __awaiter(void 0, void 0, void 0, function* () {
    const dir = `./datas/${symbol}`;
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir);
    }
    const { path, fileName } = getNames(symbol, '1m', '2023-02-05');
    const file = fs_1.default.createWriteStream(fileName);
    const request = https_1.default.get(path, (result) => {
        result.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log("Download Completed for", symbol, time, date);
        });
    });
});
const downloadAll = (symbol, time, start, end) => {
};
// download(SYMBOL, TIME, DATE)
console.log("duration", moment_1.default.duration('2022-01-01', '2022-01-03'));

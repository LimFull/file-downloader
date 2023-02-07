import moment from "moment";
import fs from 'fs';
import https from 'https';
import {CandleTime} from "./types";

const SYMBOL = '1000LUNCUSDT';
const TIME = '1m';
const DATE = '2023-02-03'
const END_DATE = '2023-02-05'


const getNames = (symbol: string, time: CandleTime, date: string) => {
  const path = `https://data.binance.vision/data/futures/um/daily/klines/${symbol}/${time}/${symbol}-${time}-${date}.zip`
  const fileName = `./datas/${symbol}/${symbol}_${time}_${date}.zip`
  return {path, fileName}
}

const download = async (symbol: string, time: CandleTime, date: string) => {
  const dir = `./datas/${symbol}`
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  const {path, fileName} = getNames(symbol, '1m', '2023-02-05')
  const file = fs.createWriteStream(fileName);
  const request = https.get(path, (result) => {
    result.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log("Download Completed for", symbol, time, date)
    })
  })
}

const downloadAll = (symbol: string, time: CandleTime, start: string, end: string) => {


}

// download(SYMBOL, TIME, DATE)

console.log("duration", moment.duration('2022-01-01', '2022-01-03'))
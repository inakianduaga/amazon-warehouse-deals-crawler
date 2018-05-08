import puppeteer from 'puppeteer'
import config from './config/config'
import { parseDisplayPrice } from './money'
import processProduct from './processor/product'

let iterations = 0
const intervalRef = setInterval(async () => {
  console.info('Launching product search update...')
  const browser = await puppeteer.launch(config.puppeteer)
  config.productQueries.forEach(processProduct(browser))

  // Bump counter
  iterations = iterations + 1

  // Stop loop after max iterations
  if (iterations >= 1) {
    clearInterval(intervalRef)
  }
}, config.crawler.interval)

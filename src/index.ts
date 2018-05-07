import puppeteer from 'puppeteer'
import config from './config/config'

setInterval(async () => {
  console.info('Launching product search update...')
  const browser = await puppeteer.launch(config.puppeteer)
  config.productQueries.forEach(processProduct(browser))
}, config.crawler.interval)

const processProduct = (browser: puppeteer.Browser) => async (product: typeof config.productQueries[0]) => {
  const page = await browser.newPage()
  await page.goto(product.query)
  const items = await page.waitForSelector('#atfResults .s-item-container')
  // console.log(items)
}

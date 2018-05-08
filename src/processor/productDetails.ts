import puppeteer from 'puppeteer'
import config from '../config/config'
import sendEmail from '../email'
import { parseDisplayPrice } from '../money'

const processProductDetail = (browser: puppeteer.Browser) => async (
  url: string,
  title: string,
  product: typeof config.productQueries[0]
) => {
  const page = await browser.newPage()
  await page.goto(url)

  // check that amazon warehouse deals is listed on the page
  const items: HTMLElement[] = Array.from(await page.evaluate(() => document.querySelectorAll('.olpOffer')))

  const cheapestWarehouseDealItem = items
    .map(item => {
      const sellerName = item.querySelector('.a-spacing-none.olpSellerName img')
      const price = item.querySelector('.olpOfferPrice')
      const condition = item.querySelector('.olpCondition')

      return {
        seller: sellerName && sellerName.getAttribute('alt'),
        price: price && price.textContent ? parseDisplayPrice(price.textContent, url.indexOf('.co.uk') !== -1) : null,
        condition: condition && condition.textContent
      }
    })
    .filter(x => x.seller && ['Warehouse Deals', 'Amazon Warehouse Deals', 'Amazon'].indexOf(x.seller) !== -1)
    .filter(x => x.price !== null && x.price < product.price.below)
    .sort((x, y) => (x.price as number) - (y.price as number))[0]

  if (cheapestWarehouseDealItem) {
    // Take screenshot of page
    const description = `
      Product: ${title} - 
      Price: ${cheapestWarehouseDealItem.price} - 
      Condition: ${cheapestWarehouseDealItem.condition}`

    // Generate description
    await page.setViewport(config.crawler.screenshotViewport)
    const screenshot = await page.screenshot()

    // Send email:
    // https://nodemailer.com/message/attachments/
    sendEmail(config.email, title, cheapestWarehouseDealItem.price as number, description, screenshot)

    // Mark article as email sent so we don't resend it for this price again
  }
}

export default processProductDetail

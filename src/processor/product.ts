import puppeteer from 'puppeteer'
import config from '../config/config'
import { parseDisplayPrice } from '../money'
import processProductDetail from './productDetails'

const processProduct = (browser: puppeteer.Browser) => async (product: typeof config.productQueries[0]) => {
  const page = await browser.newPage()
  await page.goto(product.query)

  const items: HTMLElement[] = Array.from(
    await page.evaluate(() => document.querySelectorAll('#atfResults .s-item-container'))
  )

  items
    .map(item => {
      const link = item.querySelector('.a-size-small.a-link-normal.a-text-normal')
      const title = item.querySelector('a.s-access-detail-page .s-access-title')
      const price = item.querySelector('.a-color-price')

      return {
        link: link && link.getAttribute('href'),
        title: title && title.getAttribute('attribute'),
        price:
          price && price.textContent
            ? parseDisplayPrice(price.textContent, product.query.indexOf('.co.uk') !== -1)
            : null
      }
    })
    .filter(x => x.link !== null && x.title !== null && x.price !== null)
    .filter(x => x.price !== product.price.below)
    .forEach(x => processProductDetail(browser)(x.link as string, x.title as string, product))
}

export default processProduct

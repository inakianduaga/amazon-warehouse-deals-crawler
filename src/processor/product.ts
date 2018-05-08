import puppeteer from 'puppeteer'
import config from '../config/config'
import { parseDisplayPrice } from '../money'
import processProductDetail from './productDetails'

type Item = {
  link: string
  title: string
  price: number
}

type ItemNullable = { [k in keyof Item]: Item[k] | null }

const isNotNull = (i: Item | ItemNullable): i is Item => i.link !== null && i.title !== null && i.price !== null

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
            ? parseDisplayPrice(product.query.indexOf('.co.uk') !== -1)(price.textContent)
            : null
      }
    })
    .filter(isNotNull)
    .filter(x => x.price !== product.price.below)
    .forEach(({ link, title }) => processProductDetail(browser)(link, title, product))
}

export default processProduct

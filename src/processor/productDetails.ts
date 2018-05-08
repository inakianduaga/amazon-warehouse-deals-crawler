import puppeteer from 'puppeteer'
import config from '../config/config'
import sendEmail from '../email'
import { parseDisplayPrice } from '../money'

type Item = {
  seller: string
  price: number
  condition: string
}

type ItemNullable = { [k in keyof Item]: Item[k] | null }

const isNotNull = (i: Item | ItemNullable): i is Item => i.seller !== null && i.price !== null && i.condition !== null

const cheapestWarehouseDealItem = (
  items: HTMLElement[],
  product: typeof config.productQueries[0],
  priceParser: ReturnType<typeof parseDisplayPrice>
): Item | undefined =>
  items
    .map(item => {
      const sellerName = item.querySelector('.a-spacing-none.olpSellerName img')
      const price = item.querySelector('.olpOfferPrice')
      const condition = item.querySelector('.olpCondition')

      return {
        seller: sellerName && sellerName.getAttribute('alt'),
        price: price && price.textContent ? priceParser(price.textContent) : null,
        condition: condition && condition.textContent
      }
    })
    .filter(isNotNull)
    .filter(x => ['Warehouse Deals', 'Amazon Warehouse Deals', 'Amazon'].indexOf(x.seller) !== -1)
    .filter(x => x.price < product.price.below)
    .sort((x, y) => x.price - y.price)[0]

export const sendItem = async (item: Item, title: string, page: puppeteer.Page) => {
  const description = `
      Product: ${title} - 
      Price: ${item.price} - 
      Condition: ${item.condition}`

  await page.setViewport(config.crawler.screenshotViewport)
  const screenshot = await page.screenshot()

  await page.close()
  return sendEmail(config.email, title, item.price, description, screenshot)
}

export const processProductDetail = (browser: puppeteer.Browser) => async (
  url: string,
  title: string,
  product: typeof config.productQueries[0]
): Promise<{ item: Item | undefined; page: puppeteer.Page }> => {
  const page = await browser.newPage()
  await page.goto(url)

  const items: HTMLElement[] = Array.from(await page.evaluate(() => document.querySelectorAll('.olpOffer')))
  const item = cheapestWarehouseDealItem(items, product, parseDisplayPrice(url.indexOf('.co.uk') !== -1))

  return { item, page }
}

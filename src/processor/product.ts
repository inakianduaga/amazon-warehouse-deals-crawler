import puppeteer from 'puppeteer'
import config from '../config/config'
import { parseDisplayPrice } from '../money'

type Item = {
  link: string
  title: string
  price: number
}

type ItemNullable = { [k in keyof Item]: Item[k] | null }

type ItemNullableWithStringPrice = Pick<ItemNullable, 'link' | 'title'> & { price: string | null }

const isNotNull = (i: Item | ItemNullable): i is Item => i.link !== null && i.title !== null && i.price !== null

const processProduct = (browser: puppeteer.Browser) => async (
  product: typeof config.productQueries[0]
): Promise<Item[]> => {
  const page = await browser.newPage()
  await page.goto(product.query)

  // page.evaluate will execute code within browser, so interface is via serializable results only
  const extractedItems: ItemNullableWithStringPrice[] = await page.evaluate(() => {
    const itemsAsNodes = document.querySelectorAll('#atfResults .s-item-container')
    const items: Element[] = Array.from(itemsAsNodes)

    return items.map(item => {
      const link = item.querySelector('.a-size-small.a-link-normal.a-text-normal')
      const title = item.querySelector('a.s-access-detail-page .s-access-title')
      const price = item.querySelector('.a-color-price')

      return {
        link: link && link.getAttribute('href'),
        title: title && title.getAttribute('data-attribute'),
        price: price && price.textContent
      }
    })
  })

  return extractedItems
    .map(({ price, title, link }) => ({
      title,
      link,
      price: price ? parseDisplayPrice(product.query.indexOf('.co.uk') !== -1)(price) : null
    }))
    .filter(isNotNull)
    .filter(x => x.price < product.price.below)
}

export default processProduct

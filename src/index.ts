import puppeteer from 'puppeteer'
import config from './config/config'

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
        price: price && price.textContent ? parsePrice(price.textContent, product.query.indexOf('.co.uk') !== -1) : null
      }
    })
    .filter(x => x.link !== null && x.title !== null && x.price !== null)
    .filter(x => x.price !== product.price.below)
    .forEach(x => processProductDetail(browser)(x.link as string, x.title as string, product))
}

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
        price: price && price.textContent ? parsePrice(price.textContent, url.indexOf('.co.uk') !== -1) : null,
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
    const screenshot = ''

    // Send email:
    // https://nodemailer.com/message/attachments/

    // Mark article as email sent so we don't resend it for this price again
  }
}

const parsePrice = (price: string, isUk: boolean) => {
  const currencySymbols = ['EUR', 'GBP', '£', '€']
  const currencyLessPrice = currencySymbols.reduce((p, currency) => p.replace(currency, ''), price)
  const localizedPrice = isUk
    ? currencyLessPrice
        .replace('.', '*')
        .replace(',', '.')
        .replace('*', ',')
    : currencyLessPrice

  return parseFloat(
    localizedPrice
      .replace('.', '')
      .split(',')[0]
      .trim()
  )
}

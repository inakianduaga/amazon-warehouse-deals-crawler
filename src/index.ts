import puppeteer from 'puppeteer'
import { from, interval, Observable, pipe } from 'rxjs'
import { catchError, combineLatest, delay, filter, finalize, map, mergeMap, take, tap, zip } from 'rxjs/Operators'
import config from './config/config'
import { parseDisplayPrice } from './money'
import processProduct from './processor/product'
import { processProductDetail, sendItem } from './processor/productDetails'

interval(config.crawler.interval).pipe(
  tap(() => console.info('Instantiating new browser - ')),
  mergeMap(() => puppeteer.launch(config.puppeteer)),
  take(1),
  tap(() => console.info('Preparing for crawling...')),
  mergeMap(browser =>
    from(config.productQueries)
      // process chain of queries
      .pipe(
        delay(config.crawler.delayPerProduct),
        map(product => ({
          browser,
          product
        })),
        tap(data => console.log(`Processing query ${data.product.label}`)),
        mergeMap(data =>
          from(processProduct(data.browser)(data.product))
            // Process all summary products matching query
            .pipe(
              tap(products => console.log(`identified ${products.length} products`)),
              mergeMap(products => from(products)),
              mergeMap(product =>
                from(processProductDetail(data.browser)(product.link, product.title, data.product))
                  //
                  .pipe(
                    //
                    filter(d => d.item !== undefined),
                    map(d => sendItem(d.item as any, product.title, d.page))
                  )
              )
            )
        ),
        tap(() => console.info('Finished crawling, terminating browser')),
        finalize(() => browser.close())
      )
  )
)

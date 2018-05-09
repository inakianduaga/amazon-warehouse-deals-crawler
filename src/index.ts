import puppeteer from 'puppeteer'
import { from, Observable, pipe, timer } from 'rxjs'
import {
  catchError,
  combineLatest,
  concatMap,
  delay,
  filter,
  finalize,
  map,
  mergeMap,
  reduce,
  take,
  tap,
  zip
} from 'rxjs/Operators'
import config from './config/config'
import log from './logging/log'
import { parseDisplayPrice } from './money'
import processProduct from './processor/product'
import { ISendItem, Item, processProductDetail, sendItems } from './processor/productDetails'

log.banner('===== Amazon Warehouse Deals Crawler ======')

timer(0, config.crawler.interval)
  .pipe(
    tap(i => log.info(`Run ${i}: Instantiating new browser`)),
    concatMap(() => puppeteer.launch(config.puppeteer)),
    take(1),
    tap(() => log.debug('Preparing for crawling...')),
    mergeMap(browser =>
      from(config.productQueries)
        // process chain of queries
        .pipe(
          delay(config.crawler.delayPerProduct),
          map(product => ({
            browser,
            product
          })),
          tap(data => log.info(`Processing query ${data.product.label}`)),
          mergeMap(data =>
            from(processProduct(data.browser)(data.product))
              // Process all summary products matching query
              .pipe(
                tap(products => console.log(`${data.product.label}: identified ${products.length} products`)),
                mergeMap(products => from(products)),
                mergeMap(product =>
                  from(processProductDetail(data.browser)(product.link, product.title, data.product))
                    //
                    .pipe(
                      //
                      filter((d): d is { item: Item; page: puppeteer.Page } => d.item !== undefined),
                      map(d => ({
                        ...d.item,
                        page: d.page,
                        url: product.link,
                        title: product.title
                      }))
                    )
                )
              )
          ),
          // consolidate all products into array
          reduce<ISendItem, ISendItem[]>((acc, value) => {
            acc.push(value)
            return acc
          }, []),
          tap(items => log.success(`Grouping matches and firing email w/ ${items.length} product(s)`)),
          mergeMap(items => from(sendItems(items.sort((a, b) => a.price - b.price)))),
          tap(() => log.debug('Finished crawling, terminating browser')),
          finalize(() => browser.close())
        )
    ),
    catchError((e, source) => {
      log.error(`An error has ocurred: ${e}`)
      return source
    })
  )
  .subscribe(() => null)

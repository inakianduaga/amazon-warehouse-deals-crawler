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
import { flagAsSent, hasBeenSent } from './persistance/storage'
import { ISendItem, ISendItemWithSku, Item, processProductDetail, sendItems } from './processor/productDetails'
import processQuery from './processor/query'

log.banner('===== Amazon Warehouse Deals Crawler ======')

timer(0, config.crawler.interval)
  .pipe(
    tap(i => log.info(`\n Run ${i}: Instantiating new browser`)),
    concatMap(() => puppeteer.launch(config.puppeteer)),
    take(2),
    mergeMap(browser =>
      from(config.productQueries)
        // process chain of queries
        .pipe(
          // delay(config.crawler.delayPerQuery),
          map(query => ({
            browser,
            query
          })),
          tap(data => log.info(`Processing query: "${data.query.label}"`, '1')),
          mergeMap(data =>
            from(processQuery(data.browser)(data.query))
              // Process all summary products matching query
              .pipe(
                map(products => products.filter(p => !hasBeenSent(p.sku))), // skip already sent
                tap(products => log.debug(`"${data.query.label}": identified ${products.length} new product(s)`, '2')),
                mergeMap(products => from(products)),
                mergeMap(product =>
                  from(processProductDetail(data.browser)(product.link, product.title, data.query))
                    //
                    .pipe(
                      //
                      filter((d): d is { item: Item; page: puppeteer.Page } => d.item !== undefined),
                      map(d => ({
                        ...d.item,
                        page: d.page,
                        url: product.link,
                        title: product.title,
                        sku: product.sku
                      }))
                    )
                )
              )
          ),
          // consolidate all products into array
          reduce<ISendItemWithSku, ISendItemWithSku[]>((acc, value) => {
            acc.push(value)
            return acc
          }, []),
          tap(items => log.success(`Grouping matches and firing email w/ ${items.length} product(s)`, '1')),
          map(x => x.sort((a, b) => a.price - b.price)), // sort price asc
          mergeMap(items => from(sendItems(items)).pipe(tap(() => items.forEach(item => flagAsSent(item.sku))))),
          tap(() => log.debug('Finished crawling, terminating browser', '1')),
          finalize(() => browser.close())
        )
    ),
    catchError((e, source) => {
      log.error(`An error has ocurred: ${e}`, '1')
      return source
    })
  )
  .forEach(() => null)

import puppeteer from 'puppeteer'
import { from, interval, Observable, pipe } from 'rxjs'
import { combineLatest, delay, map, mergeMap, take, tap, zip } from 'rxjs/Operators'
import config from './config/config'
import { parseDisplayPrice } from './money'
import processProduct from './processor/product'

interval(config.crawler.interval)
  .pipe(
    mergeMap(() => puppeteer.launch(config.puppeteer)),
    take(1),
    tap(() => console.info('Preparing for crawling...')),
    mergeMap(browser =>
      from(config.productQueries).pipe(
        delay(config.crawler.delayPerProduct),
        map(product => ({
          browser,
          product
        }))
      )
    )
  )
  .pipe(tap(data => console.log(`Processing query ${data.product.label}`)))
  .forEach(data => processProduct(data.browser)(data.product))

import config from './config/config'
import puppeteer, { Browser } from 'puppeteer'
import rx from 'rxjs'
import { map, flatMap, mergeMap, filter, switchMap } from 'rxjs/operators'

const isNotNull = <T>(t: T | null): t is T => t !== null

const clock$ = rx.interval(config.crawler.interval)

// Generate fresh browser per update
const browser$ = clock$.pipe(mergeMap(() => puppeteer.launch(config.puppeteer)))

// Loop through each product query
rx.combineLatest(browser$, rx.from(config.productQueries)).pipe(
  // navigate to page
  mergeMap(browserAndProduct => {
    const [browser, product] = browserAndProduct
    return rx.from(browser.newPage()).pipe(
      mergeMap(page =>
        rx.from(page.goto(product.query)).pipe(
          filter(isNotNull), // check page can be reached successfully
          map(x => page) // assign mutated page reference
        )
      ),
      map(x => ({
        page: x,
        product //retain product reference
      }))
    )
  }),
  // check items on page
  mergeMap(pageAndProduct => {
    const { page, product } = pageAndProduct

    return rx
      .from(page.waitForSelector('#atfResults .s-item-container'))
      .pipe(
        mergeMap(pContainer => pContainer.$('s-access-detail-page')),
        filter(isNotNull),
        mergeMap(pElement => pElement)
      )
  })

  // map(x => )
)

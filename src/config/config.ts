const config = {
  currencyConversion: {
    '.co.uk': 1.2,
    '.de': 1,
    '.fr': 1,
    '.it': 1
  },
  productQueries: [
    // Amazon.de oleds
    {
      query:
        'https://www.amazon.de/s/gp/search/ref=sr_nr_p_n_feature_three_br_2?fst=as%3Aoff&rh=n%3A3581963031%2Cn%3A562066%2Cn%3A%21569604%2Cn%3A761254%2Cn%3A1197292%2Cp_n_feature_three_browse-bin%3A497883011&bbn=3581963031&ie=UTF8&qid=1525726934&rnid=497879011',
      price: {
        below: 1400
      }
    },
    // Amazon.co.uk oleds
    {
      query:
        'https://www.amazon.co.uk/s/gp/search/ref=sr_nr_p_n_feature_three_br_1?fst=as%3Aoff&rh=n%3A3581866031%2Cn%3A560798%2Cn%3A%21560800%2Cn%3A560858%2Cn%3A560864%2Ck%3Aoled%2Cp_n_feature_three_browse-bin%3A1608893031&bbn=3581866031&keywords=oled&ie=UTF8&qid=1525727411&rnid=161069031',
      price: {
        below: 1400
      }
    }
  ],
  puppeteer: {
    /**
     * Docker fix for ERROR:zygote_host_impl_linux.cc(90)] Running as root without --no-sandbox is not supported.
     * {@link https://crbug.com/638180}
     */
    args: ['--no-sandbox'],
    devtools: process.env.DEBUG === 'true'
  },
  /**
   * Every how often we crawl all pages
   */
  crawler: {
    interval: 60 * 1000,
    navigationTimeout: 10 * 1000
  }
}

export default config

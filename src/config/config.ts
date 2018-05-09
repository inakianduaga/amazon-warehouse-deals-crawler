const config = {
  productQueries: [
    {
      label: 'amazon germany oleds',
      query:
        'https://www.amazon.de/s/gp/search/ref=sr_nr_p_n_feature_three_br_2?fst=as%3Aoff&rh=n%3A3581963031%2Cn%3A562066%2Cn%3A%21569604%2Cn%3A761254%2Cn%3A1197292%2Ck%3Aoled%2Cp_n_feature_three_browse-bin%3A497883011&bbn=3581963031&keywords=oled&ie=UTF8&qid=1525821517&rnid=497879011',
      price: {
        below: 1250,
        above: 950
      }
    },
    {
      label: 'amazon uk oleds',
      query:
        'https://www.amazon.co.uk/s/gp/search/ref=sr_nr_p_n_feature_three_br_1?fst=as%3Aoff&rh=n%3A3581866031%2Cn%3A560798%2Cn%3A%21560800%2Cn%3A560858%2Cn%3A560864%2Ck%3Aoled%2Cp_n_feature_three_browse-bin%3A1608893031&bbn=3581866031&keywords=oled&ie=UTF8&qid=1525727411&rnid=161069031',
      price: {
        below: 1250,
        above: 950
      }
    }
  ],
  puppeteer: {
    devtools: process.env.DEBUG === 'true'
  },
  /**
   * Every how often we crawl all pages
   */
  crawler: {
    /**
     * How much to wait between each product search
     */
    delayPerQuery: 4000,
    /**
     * Cron time gap
     */
    interval: 60 * 1000,
    navigationTimeout: 10 * 1000,
    screenshotViewport: {
      width: 1280,
      height: 1024
    }
  },
  email: {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    smtpConfig: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    }
  },
  persistance: {
    /**
     * Storage is relative to the project root folder
     */
    path: './.storage'
  }
}

export default config

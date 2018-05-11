type Query = {
  label: string
  /**
   * Amazon search url
   */
  query: string
  /**
   * The product title must contain at least one of these strings, to further refine results
   */
  skuNameMatch?: string[]
  price: {
    /**
     * product price must be at most this
     */
    below: number
    /**
     * product price must be at least this
     */
    above?: number
  }
  /**
   * If enabled, notifications will be re-sent if the new price is lower than the last notification's
   */
  renotifyOnLowerPrice?: boolean
}

export type Price = Query['price']

const productQueries: Query[] = [
  // Oleds
  {
    label: 'amazon germany oleds',
    query:
      'https://www.amazon.de/s/gp/search/ref=sr_nr_p_n_feature_three_br_2?fst=as%3Aoff&rh=n%3A3581963031%2Cn%3A562066%2Cn%3A%21569604%2Cn%3A761254%2Cn%3A1197292%2Ck%3Aoled%2Cp_n_feature_three_browse-bin%3A497883011&bbn=3581963031&keywords=oled&ie=UTF8&qid=1525821517&rnid=497879011',
    price: {
      below: 1250,
      above: 950
    },
    renotifyOnLowerPrice: true
  },
  {
    label: 'amazon uk oleds',
    query:
      'https://www.amazon.co.uk/s/gp/search/ref=sr_nr_p_n_feature_three_br_1?fst=as%3Aoff&rh=n%3A3581866031%2Cn%3A560798%2Cn%3A%21560800%2Cn%3A560858%2Cn%3A560864%2Ck%3Aoled%2Cp_n_feature_three_browse-bin%3A1608893031&bbn=3581866031&keywords=oled&ie=UTF8&qid=1525727411&rnid=161069031',
    price: {
      below: 1250,
      above: 950
    },
    renotifyOnLowerPrice: true
  },
  // Leds
  {
    label: 'samsung 55 series',
    query:
      'https://www.amazon.de/s/s/ref=sr_nr_p_n_size_browse-bin_1?fst=as%3Aoff&rh=n%3A3581963031%2Cn%3A562066%2Cn%3A%21569604%2Cn%3A761254%2Cn%3A1197292%2Ck%3Asamsung+55+zoll%2Cp_n_size_browse-bin%3A9590316031&bbn=3581963031&keywords=samsung+55+zoll&ie=UTF8&qid=1525972165&rnid=497868011',
    price: {
      below: 650,
      above: 500
    },
    skuNameMatch: ['Samsung MU7009', 'Samsung MU8009', 'Samsung MU9009'],
    renotifyOnLowerPrice: true
  },
  {
    label: 'lg 55 SJ series de',
    query:
      'https://www.amazon.de/s/ref=sr_nr_scat_1197292_ln?rh=n%3A1197292%2Ck%3Alg+4k&bbn=3581963031&keywords=lg+4k&ie=UTF8&qid=1525972461&scn=1197292&h=f4f33aee8a15178f0dae4ad9bf43f042c72942ed',
    price: {
      below: 625,
      above: 500
    },
    skuNameMatch: ['LG 55SJ'],
    renotifyOnLowerPrice: true
  },
  {
    label: 'lg 55 SJ series uk',
    query:
      'https://www.amazon.co.uk/s/gp/search/ref=sr_nr_p_n_size_browse-bin_2?fst=as%3Aoff&rh=n%3A3581866031%2Cn%3A560798%2Cn%3A%21560800%2Cn%3A560858%2Cn%3A560864%2Ck%3Alg+4k%2Cp_n_size_browse-bin%3A9591879031&bbn=3581866031&keywords=lg+4k&ie=UTF8&qid=1525973371&rnid=161398031',
    price: {
      below: 625,
      above: 500
    },
    skuNameMatch: ['LG 55SJ'],
    renotifyOnLowerPrice: true
  },
  {
    label: 'Sony 55XE70 de',
    query:
      'https://www.amazon.de/s/gp/search/ref=sr_nr_p_n_size_browse-bin_1?fst=as%3Aoff&rh=n%3A3581963031%2Cn%3A562066%2Cn%3A%21569604%2Cn%3A761254%2Cn%3A1197292%2Ck%3Asony+4k%2Cp_n_size_browse-bin%3A9590316031&bbn=3581963031&keywords=sony+4k&ie=UTF8&qid=1525973751&rnid=497868011',
    price: {
      below: 485,
      above: 400
    },
    skuNameMatch: ['KD55XE7', 'KD55XD8'],
    renotifyOnLowerPrice: true
  },
  {
    label: 'Sony 55XE70 uk',
    query:
      'https://www.amazon.co.uk/s/gp/search/ref=sr_nr_p_n_size_browse-bin_2?fst=as%3Aoff&rh=n%3A3581866031%2Cn%3A560798%2Cn%3A%21560800%2Cn%3A560858%2Cn%3A560864%2Ck%3A4k+sony%2Cp_n_size_browse-bin%3A9591879031&bbn=3581866031&keywords=4k+sony&ie=UTF8&qid=1525973524&rnid=161398031',
    price: {
      below: 485,
      above: 400
    },
    skuNameMatch: ['KD55XE7', 'KD55XD8'],
    renotifyOnLowerPrice: true
  },
  {
    label: 'Xbox One X Germany',
    query:
      'https://www.amazon.de/s/ref=sr_nr_n_0?fst=as%3Aoff&rh=n%3A3581963031%2Cn%3A300992%2Cn%3A%21541708%2Cn%3A2785606031%2Ck%3Axbox+one+x%2Cn%3A2785608031&bbn=3581963031&keywords=xbox+one+x&ie=UTF8&qid=1526070030&rnid=3581963031',
    price: {
      below: 350,
      above: 200
    },
    skuNameMatch: ['Xbox One X'],
    renotifyOnLowerPrice: true
  },
  {
    label: 'Xbox One X Italy',
    query:
      'https://www.amazon.it/s/ref=sr_nr_scat_2785640031_ln?rh=n%3A2785640031%2Ck%3Axbox+one+x&bbn=3581999031&keywords=xbox+one+x&ie=UTF8&qid=1526070159&scn=2785640031&h=d8f50b80ca97cff34416a84aa92830bc2a1a4c04',
    price: {
      below: 340,
      above: 200
    },
    skuNameMatch: ['Xbox One X'],
    renotifyOnLowerPrice: true
  }
]

export default productQueries

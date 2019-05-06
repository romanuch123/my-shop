const model = {
  options: {
    strings: ["Welcome, my dear friends", "Nice to see you here"],
    typeSpeed: 40,
    showCursor: false
  },
  productName: '#product-name',
  amountPurchase: '#amount-value',
  currencyPurchase: '#currency-value',
  purchaseDate: '#purchase-date',
  purchaseBtn: '#purchase-btn',
  allBtn: '#all',
  clearDate: '#clear-date',
  clearBtn: '#clear-btn',
  reportYear: '#report-year',
  reportCurrency: '#report-currency',
  reportBtn: '#report-btn',
  screenTyped: '#screen',
  typed: {},
  purchasedProducts: [],
  allPurchasesList: '',
  currencyRates: {},
  isProductsExistOnDate: false,
  currentYearPurchases: [],
  annualReport: 0,
};
export default model;
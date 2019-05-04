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
  logText: '',
  isProductsExistOnDate: false,
  currentYearPurchases: [],
  annualReport: 0,
}

const control = {
  init: function () {
    purchasesView.init();
    purchasesView.render();

    controlPanelView.init();
    controlPanelView.render();

    logView.init();

    model.typed = new Typed(model.screenTyped, model.options);
    model.purchasedProducts = JSON.parse(localStorage.purchasedProducts);
  },
  addPurchasedProduct: function () {    
    model.purchasedProducts.push({
      date: $(model.purchaseDate).val(),
      product: $(model.productName).val(),
      amount: $(model.amountPurchase).val(),
      currency: $(model.currencyPurchase).val()
    });
  },
  sortPurchasedProducts: function () {
    model.purchasedProducts.sort(function (a, b) {
      let dateA = new Date(a.date),
        dateB = new Date(b.date);
      return dateA - dateB;
    });
    localStorage.purchasedProducts = JSON.stringify(model.purchasedProducts);
  },
  getPurchasedProducts: function () {
    return model.purchasedProducts;
  },
  setAllPurchasesList: function () {    
    model.allPurchasesList = '';
    model.purchasedProducts.forEach((elem, index, arr) => {
      if (index !== 0) {
        if (elem.date === arr[index - 1].date) {
          model.allPurchasesList += `${elem.product} ${elem.amount} ${elem.currency}<br>`;
        } else {
          model.allPurchasesList += `<b>${elem.date}</b><br>`;
          model.allPurchasesList += `${elem.product} ${elem.amount} ${elem.currency}<br>`;
        }
      } else {
        model.allPurchasesList += `<b>${elem.date}</b><br>`;
        model.allPurchasesList += `${elem.product} ${elem.amount} ${elem.currency}<br>`;
      }
    });
  },
  getAllPurchasesList: function () {
    return model.allPurchasesList;
  },
  startScreenText: function (text) {
    model.typed.stop();
    $(model.screenTyped).html('');
    model.typed = new Typed(model.screenTyped, {
      strings: [text],
      typeSpeed: 40,
      showCursor: false
    });
  },
  getLogText: function () {
    return model.logText;
  },
  createLogText: function (text) {
    model.logText = text;
    logView.render();
  },
  setIsProductsExistOnDate: function () {
    model.isProductsExistOnDate = model.purchasedProducts.some(elem => {
      return elem.date === $(model.clearDate).val();
    });
  },
  getIsProductsExistOnDate: function () {
    return model.isProductsExistOnDate;
  },
  clearPurchasesOnDate: function () {
    model.purchasedProducts = model.purchasedProducts.filter(elem => {
      return elem.date !== $(model.clearDate).val();
    });
    localStorage.purchasedProducts = JSON.stringify(model.purchasedProducts);
  },
  setCurrencyRates: function () {
    $.ajax({
      url: 'http://data.fixer.io/api/latest?access_key=2cc37334fc8f835d800588ea18b22759',
      async: false,
    })
      .done(function (result) { model.currencyRates = result; })
      .fail(function () { control.startScreenText(`Error. Cannot get currency rates`); });
  },
  setCurrentYearPurchases: function () {
    model.currentYearPurchases = model.purchasedProducts.filter(elem => {
      return new Date(elem.date).getFullYear() === +$(model.reportYear).val();
    });
  },
  getCurrentYearPurchases: function () {
    return model.currentYearPurchases;
  },
  setAnnualReport: function () {
    model.annualReport = 0;
    model.currentYearPurchases.forEach(elem => {
      model.annualReport += (elem.amount / model.currencyRates.rates[`${elem.currency}`]) * model.currencyRates.rates[`${$(model.reportCurrency).val()}`];
    });
  },  
  clearInputField: function () {
    $(':input')
    .not(':button')
    .val('');
  }
};

const purchasesView = {
  init: function () {
    this.$container = $('#purchases');
    this.handleClicks();
  },
  render: function () {
    let template = `
<input type="text" name="product-name" id="product-name" placeholder="Please enter product name"/>
<div id="price">
<input type="number" name="amount-value" id="amount-value" placeholder="Please enter amount" min="0"/>
<select name="currency-value" id="currency-value">
<option value="" disabled selected>Currency</option>
<option value="USD">USD</option>
<option value="EUR">EUR</option>
<option value="PLN">PLN</option>
<option value="GBP">GBP</option>
<option value="UAH">UAH</option>
</select>
</div>
<input type="date" name="purchase-date" id="purchase-date"/>
<input type="button" id="purchase-btn" value="Purchase">
`;
    this.$container.html(template);
  },
  handleClicks: function () {
    this.$container.on('click', model.purchaseBtn, function () {
      if ($(model.productName).val() === '' || $(model.amountPurchase).val() === '' || $(model.currencyPurchase).val() === null || $(model.purchaseDate).val() === '') {
        control.createLogText(`<div class="log-item-empty"><p class="date-log-empty">${new Date().toLocaleTimeString()}</p>
<p class="empty"><b>Please, fill purchase fields and push the button «Purchase»</b></p></div>`);
        control.startScreenText('Please, fill purchase fields and push the button «Purchase»');
      } else {
        if ($(model.productName).val() == 0 || $(model.amountPurchase).val() <= 0 || $(model.purchaseDate).val() > new Date().toLocaleDateString().split('.').reverse().join('-')) {
          control.createLogText(`<div class="log-item-empty"><p class="date-log-empty">${new Date().toLocaleTimeString()}</p>
          <p class="empty"><b>Check the correctness of entered data</b></p></div>`);
          control.startScreenText(`Check the correctness of entered data`);
        } else {
          control.addPurchasedProduct();
          control.sortPurchasedProducts();
          control.setAllPurchasesList();          
          control.createLogText(`<div class="log-item"><p class="date-log">${new Date().toLocaleTimeString()}</p>
    <p>${control.getAllPurchasesList()}</p></div>`);
          control.startScreenText('Product added');
          control.clearInputField();
          }
        } 
    });
  }
};
const controlPanelView = {
  init: function () {
    this.$container = $('#control-panel');
    this.handleClicks();
  },
  render: function () {
    let template = `
<input type="button" name="all" id="all" value="All" />
<div id="clear">
<input type="date" name="clear-date" id="clear-date"/>
<input type="button" name="clear-btn" id="clear-btn" value="Clear"/>
</div>
<div id="report">
<input type="number" name="report-year" id="report-year" min="0" max="2019" placeholder="Year of report"/>
<select name="report-currency" id="report-currency">
<option value="" disabled selected>Currency</option>
<option value="USD">USD</option>
<option value="EUR">EUR</option>
<option value="PLN">PLN</option>
<option value="GBP">GBP</option>
<option value="UAH">UAH</option>
</select>
<input type="button" name="report-btn" id="report-btn" value="Report"/>
</div>
`;
    this.$container.html(template);
  },
  handleClicks: function () {
    this.$container.on('click', model.allBtn, function () {
      control.setAllPurchasesList();
      if (control.getPurchasedProducts().length) {
        control.createLogText(`<div class="log-item"><p class="date-log">${new Date().toLocaleTimeString()}</p>
<p>${control.getAllPurchasesList()}</p></div>`);
        control.startScreenText('All products');
      } else {
        control.createLogText(`<div class="log-item-empty"><p class="date-log-empty">${new Date().toLocaleTimeString()}</p>
<p class="empty"><b>Product list is Empty</b></p></div>`);
        control.startScreenText('No purchased products');
      }
      control.clearInputField();
    });
    this.$container.on('click', model.clearBtn, function () {
      if (($(model.clearDate).val()) === '') {
        control.createLogText(`<div class="log-item-empty"><p class="date-log-empty">${new Date().toLocaleTimeString()}</p>
  <p class="empty"><b>Please, chose date to clear</b></p></div>`);
        control.startScreenText('Please, chose date to clear');
      } else {
        if ($("#clear-date").val() > new Date().toLocaleDateString().split('.').reverse().join('-')) {
          control.createLogText(`<div class="log-item-empty"><p class="date-log-empty">${new Date().toLocaleTimeString()}</p>
        <p class="empty"><b>Wrong clear date</b></p></div>`);
          control.startScreenText(`Wrong clear date`);
        } else {
          control.setIsProductsExistOnDate();
          if (control.getIsProductsExistOnDate()) {
            control.clearPurchasesOnDate();
            if (control.getPurchasedProducts().length) {
              control.setAllPurchasesList();
              control.createLogText(`<div class="log-item"><p class="date-log">${new Date().toLocaleTimeString()}</p>
    <p>${control.getAllPurchasesList()}</p></div>`);
              control.startScreenText(`Clear products purchased on ${($(model.clearDate).val())}`);
            } else {
              control.createLogText(`<div class="log-item-empty"><p class="date-log-empty">${new Date().toLocaleTimeString()}</p>
    <p class="empty"><b>Product list is Empty</b></p></div>`);
              control.startScreenText(`Clear products purchased on ${($(model.clearDate).val())}`);
            }
            control.clearInputField();
          } else {
            control.createLogText(`<div class="log-item-empty"><p class="date-log-empty">${new Date().toLocaleTimeString()}</p>
  <p class="empty"><b>No products purchased on ${($(model.clearDate).val())}</b></p></div>`);
            control.startScreenText(`No products purchased on ${($(model.clearDate).val())}`);
          }
        }
      }
    });
    this.$container.on('click', model.reportBtn, function () {
      if ($(model.reportYear).val() <= 0 || $(model.reportYear).val() > new Date().getFullYear()) {
        control.createLogText(`<div class="log-item-empty"><p class="date-log-empty">${new Date().toLocaleTimeString()}</p>
        <p class="empty"><b>Wrong year of report</b></p></div>`);
        control.startScreenText(`Wrong year of report`);
      } else {
        control.setCurrentYearPurchases();
        try {
          if (control.getCurrentYearPurchases().length) {
            control.setCurrencyRates();
            control.setAnnualReport();
            control.createLogText(`<div class="log-item"><p class="date-log">${new Date().toLocaleTimeString()}</p>
    <p><b>Annual Report ${$(model.reportYear).val()}</b><br>${model.annualReport.toFixed(2)} ${$(model.reportCurrency).val()}</p></div>`);
            control.startScreenText(`Annual Report ${$(model.reportYear).val()}`);
          } else {
            control.createLogText(`<div class="log-item-empty"><p class="date-log-empty">${new Date().toLocaleTimeString()}</p>
    <p class="empty"><b>No purchases in ${$(model.reportYear).val()}</b></p></div>`);
            control.startScreenText(`No purchases in ${$(model.reportYear).val()}`);
            control.clearInputField();
          }
        } catch (e) {
          control.createLogText(`<div class="log-item-empty"><p class="date-log-empty">${new Date().toLocaleTimeString()}</p>
    <p class="empty"><b>Error. Cannot get currency rates</b></p></div>`);
          control.startScreenText(`Error. Cannot get currency rates`);
        }
      }
    });
  }
};

const logView = {
  init: function () {
    this.$container = $('#log');
  },
  render: function () {
    let template = control.getLogText();
    this.$container.after(template);
  }
};

control.init();
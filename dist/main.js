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

const control = {
  init: function () {
    this.setCurrencyRates();

    purchasesView.init();
    purchasesView.render();

    controlPanelView.init();
    controlPanelView.render();

    logView.init();

    model.typed = new Typed(model.screenTyped, model.options);
    model.purchasedProducts = JSON.parse(localStorage.purchasedProducts);
  },
  // Get currency rates
  setCurrencyRates: function () {
    $.ajax({
      url: 'http://data.fixer.io/api/latest?access_key=2cc37334fc8f835d800588ea18b22759',
      async: false,
    })
      .done(function (result) { model.currencyRates = result; })
      .fail(function () { control.startScreenText(`Error. Cannot get currency rates`); });
  },
  getAllCurrencyValue: function () {
    let curr = ``;
    try {
      for (key in model.currencyRates.rates) {
        curr += `<option value="${key}">${key}</option><br>`;
      }
    } catch (e) {
      control.printErrorMessage(`Error. Cannot get currency rates`);
    }
    return curr;
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
  createLogText: function (text) {
    logView.render(text);
  },
  printErrorMessage: function (message) {
    control.createLogText(`<div class="log-item-empty"><p class="date-log-empty">${new Date().toLocaleTimeString()}</p>
<p class="empty"><b>${message}</b></p></div>`);
    control.startScreenText(message);
  },
  clearInputField: function () {
    $(':input')
      .not(':button')
      .val('');
    $(':button')
      .not(model.allBtn)
      .attr("title", "Please, fill all fields")
      .prop("disabled", true);
  },
  // Validates
  allPurchaseFieldsAreFilled: function () {
    if ($(model.productName).val() === '' || $(model.amountPurchase).val() === '' || $(model.currencyPurchase).val() === null || $(model.purchaseDate).val() === '') {
      $(model.purchaseBtn).prop("disabled", true);
      $(model.purchaseBtn).attr("title", "Please, fill all fields");
    } else {
      $(model.purchaseBtn).prop("disabled", false);
      $(model.purchaseBtn).removeAttr("title");
    }
  },
  clearDateIsFilled: function () {
    if ($(model.clearDate).val() === '') {
      $(model.clearBtn).prop("disabled", true);
      $(model.clearBtn).attr("title", "Please, fill all fields");
    } else {
      $(model.clearBtn).prop("disabled", false);
      $(model.clearBtn).removeAttr("title");
    }
  },
  allReportFieldsAreFilled: function () {
    if ($(model.reportYear).val() === '' || $(model.reportCurrency).val() === null) {
      $(model.reportBtn).prop("disabled", true);
      $(model.reportBtn).attr("title", "Please, fill all fields");
    } else {
      $(model.reportBtn).prop("disabled", false);
      $(model.reportBtn).removeAttr("title");
    }
  },
  isEnterDataCorrect: function (e) {
    if ($(e.target)[0] === $(model.purchaseBtn)[0]) {
      return $(model.productName).val() == 0 || $(model.amountPurchase).val() <= 0 || $(model.purchaseDate).val() > new Date().toLocaleDateString().split('.').reverse().join('-');
    } else if ($(e.target)[0] === $(model.clearBtn)[0]) {
      return $("#clear-date").val() > new Date().toLocaleDateString().split('.').reverse().join('-');
    } else if ($(e.target)[0] === $(model.reportBtn)[0]) {
      return $(model.reportYear).val() <= 0 || $(model.reportYear).val() > new Date().getFullYear();
    }
  },
  //make Purchase 
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
  showAllPurchasesList: function (screenText, clear) {
    if (model.purchasedProducts.length) {
      control.setAllPurchasesList();
      control.createLogText(`<div class="log-item"><p class="date-log">${new Date().toLocaleTimeString()}</p>
<p>${model.allPurchasesList}</p></div>`);
      control.startScreenText(screenText);
    } else {
      control.createLogText(`<div class="log-item-empty"><p class="date-log-empty">${new Date().toLocaleTimeString()}</p>
<p class="empty"><b>Product list is Empty</b></p></div>`);
      control.startScreenText(clear || 'No purchased products');
    }
  },
  makePurchase: function () {
    control.addPurchasedProduct();
    control.sortPurchasedProducts();
    control.showAllPurchasesList('Product added');
    control.clearInputField();
  },
  // Clear purchases
  setIsProductsExistOnDate: function () {
    model.isProductsExistOnDate = model.purchasedProducts.some(elem => {
      return elem.date === $(model.clearDate).val();
    });
  },
  clearPurchasesOnDate: function () {
    model.purchasedProducts = model.purchasedProducts.filter(elem => {
      return elem.date !== $(model.clearDate).val();
    });
    localStorage.purchasedProducts = JSON.stringify(model.purchasedProducts);
  },
  makeClearPurchases: function () {
    control.setIsProductsExistOnDate();
    if (control.isProductsExistOnDate) {
      control.clearPurchasesOnDate();
      control.showAllPurchasesList(`Clear products purchased on ${($(model.clearDate).val())}`, `Clear products purchased on ${($(model.clearDate).val())}`);
      control.clearInputField();
    } else {
      control.createLogText(`<div class="log-item-empty"><p class="date-log-empty">${new Date().toLocaleTimeString()}</p>
  <p class="empty"><b>No products purchased on ${($(model.clearDate).val())}</b></p></div>`);
      control.startScreenText(`No products purchased on ${($(model.clearDate).val())}`);
    }
  },
  // Show Anual report
  setCurrentYearPurchases: function () {
    model.currentYearPurchases = model.purchasedProducts.filter(elem => {
      return new Date(elem.date).getFullYear() === +$(model.reportYear).val();
    });
  },
  setAnnualReport: function () {
    model.annualReport = 0;
    model.currentYearPurchases.forEach(elem => {
      model.annualReport += (elem.amount / model.currencyRates.rates[`${elem.currency}`]) * model.currencyRates.rates[`${$(model.reportCurrency).val()}`];
    });
  },
  showAnualReport: function () {
    control.setCurrentYearPurchases();
    if (model.currentYearPurchases.length) {
      control.setAnnualReport();
      control.createLogText(`<div class="log-item"><p class="date-log">${new Date().toLocaleTimeString()}</p>
<p><b>Annual Report ${$(model.reportYear).val()}</b><br>${model.annualReport.toFixed(2)} ${$(model.reportCurrency).val()}</p></div>`);
      control.startScreenText(`Annual Report ${$(model.reportYear).val()}`);
      control.clearInputField();
    } else {
      control.printErrorMessage(`No purchases in ${$(model.reportYear).val()}`);
    }
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
${control.getAllCurrencyValue()}
</select>
</div>
<input type="date" name="purchase-date" id="purchase-date"/>
<input type="button" id="purchase-btn" value="Purchase" disabled="true" title="Please, fill all fields">
`;
    this.$container.html(template);
  },
  handleClicks: function () {
    this.$container.on('keyup', model.productName, function () {
      control.allPurchaseFieldsAreFilled();
    });
    this.$container.on('keyup', model.amountPurchase, function () {
      control.allPurchaseFieldsAreFilled();
    });
    this.$container.on('change', model.amountPurchase, function () {
      control.allPurchaseFieldsAreFilled();
    });
    this.$container.on('change', model.currencyPurchase, function () {
      control.allPurchaseFieldsAreFilled();
    });
    this.$container.on('change', model.purchaseDate, function () {
      control.allPurchaseFieldsAreFilled();
    });
    this.$container.on('click', model.purchaseBtn, function (e) {
      if (control.isEnterDataCorrect(e)) {
        control.printErrorMessage(`Check the correctness of entered data`);
      } else {
        control.makePurchase();
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
<input type="button" name="all" id="all" value="All"/>
<div id="clear">
<input type="date" name="clear-date" id="clear-date"/>
<input type="button" name="clear-btn" id="clear-btn" value="Clear" disabled="true" title="Please, fill all fields"/>
</div>
<div id="report">
<input type="number" name="report-year" id="report-year" min="0" max="2019" placeholder="Year of report"/>
<select name="report-currency" id="report-currency">
<option value="" disabled selected>Currency</option>
${control.getAllCurrencyValue()}
</select>
<input type="button" name="report-btn" id="report-btn" value="Report" disabled="true" title="Please, fill all fields"/>
</div> 
`;
    this.$container.html(template);
  },
  handleClicks: function () {
    this.$container.on('click', model.allBtn, function () {
      control.showAllPurchasesList('All purchases');
    });
    this.$container.on('change', model.clearDate, function () {
      control.clearDateIsFilled();
    });
    this.$container.on('click', model.clearBtn, function (e) {
      if (control.isEnterDataCorrect(e)) {
        control.printErrorMessage(`Wrong clear date`);
      } else {
        control.makeClearPurchases();
      }
    });
    this.$container.on('keyup', model.reportYear, function () {
      control.allReportFieldsAreFilled();
    });
    this.$container.on('change', model.reportYear, function () {
      control.allReportFieldsAreFilled();
    });
    this.$container.on('change', model.reportCurrency, function () {
      control.allReportFieldsAreFilled();
    });
    this.$container.on('click', model.reportBtn, function (e) {
      if (control.isEnterDataCorrect(e)) {
        control.printErrorMessage(`Wrong year of report`);
      } else {
        control.showAnualReport();
      }
    });
  }
};

const logView = {
  init: function () {
    this.$container = $('#log');
  },
  render: function (textLog) {
    let template = textLog;
    this.$container.after(template);
  }
};

control.init();
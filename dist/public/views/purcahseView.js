import model from '../model/model.js';
import control from '../controler/controler.js';

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
export default purchasesView;
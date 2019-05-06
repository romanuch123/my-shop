import model from '../model/model.js';
import control from '../controler/controler.js';

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
export default controlPanelView;
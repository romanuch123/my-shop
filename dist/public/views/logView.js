const logView = {
  init: function () {
    this.$container = $('#log');
  },
  render: function (textLog) {
    let template = textLog;
    this.$container.after(template);
  }
};
export default logView;
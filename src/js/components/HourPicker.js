import BaseWidget from './BaseWidget.js';
import {settings,select} from '../settings.js';
import utils from '../utils';


class HourPicker extends BaseWidget{
  constructor(wrapper){
    super(wrapper, settings.hours.open);
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.output);

    thisWidget.value = thisWidget.dom.input.value;
  }
  initPlugin() {
    const  thisWidget = this;
    rangeSlider.create(thisWidget.dom.input);
    thisWidget.dom.input.addEventListener('input', function() {
      thisWidget.value = thisWidget.dom.input.value;
    });
  }
  parseValue(value) {
    utils.numberToHour(value);
    return value;
  }
  isValid() {
    return true;
  }
  renderValue() {
    const thisWidget = this;
    thisWidget.dom.output = thisWidget.value;
  }
}

export default HourPicker;
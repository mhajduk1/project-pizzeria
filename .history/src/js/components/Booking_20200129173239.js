import {templates, select} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
class Booking {
  constructor(bookingElem) {
    const thisBooking = this;

    thisBooking.render(bookingElem);
    thisBooking.initWidgets();
  }
  render(bookingElem){
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();
    console.log(bookingElem);

    thisBooking.dom = [];
    thisBooking.dom.wrapper = bookingElem;

    thisBooking.dom.wrapper = utils.createDOMFromHTML(generatedHTML);

    thisBooking.dom.wrapper.appenchild();

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);


  }
  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
  }
}

export default Booking;

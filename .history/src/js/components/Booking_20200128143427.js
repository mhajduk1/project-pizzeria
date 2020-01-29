import {templates, select} from '../settings.js';
import utils from '../utils.js';
export class Booking {
  construktor(bookingElem) {
    const thisBooking = this;

    thisBooking.render(bookingElem);
    thisBooking.initWidgets();
  }
  render(bookingElem){
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = [];
    thisBooking.dom.wrapper = bookingElem;

    thisBooking.dom.wrapper = utils.createDOMFromHTML(generatedHTML);

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);

  }
  initWidgets(){
    const thisBooking = this;
  }
}

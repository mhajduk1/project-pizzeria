import {templates} from '../settings.js';
export class Booking {
  construktor(bookingElem) {
    const thisBooking = this;

    thisBooking.render(bookingElem);
    thisBooking.initWidgets();
  }
  render(){
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();

  }
  initWidgets(){
    const thisBooking = this;
  }
}

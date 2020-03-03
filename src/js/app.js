import {select, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';
import MainPage from './components/MainPage.js';

const app = {
  initPages: function(){
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;

    thisApp.navLinks = document.querySelectorAll(select.nav.links);


    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages[0].id;

    for(let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }

    thisApp.activatePage(pageMatchingHash);

    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        // get page id from href attribute
        const id = clickedElement.getAttribute('href').replace('#', '');

        //run thisApp.activatePage with that id
        thisApp.activatePage(id);

        //change URL hash
        window.location.hash = '#' + id;
      });
    }

  },

  activatePage: function(pageId){
    const thisApp = this;
    //add class "active" to matching pages, remove from non-matching
    for(let page of thisApp.pages){

      page.classList.toggle(classNames.pages.active, page.id == pageId);

    }

    //add class "active" to matching links, remove from non-matching

    for(let link of thisApp.navLinks){

      link.classList.toggle(classNames.nav.active, link.getAttribute('href') == '#' + pageId);

    }

  },
  initMenu: function () {
    const thisApp = this;
    for (let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },

  initBooking: function(){
    const thisApp = this;
    const bookingElem = document.querySelector(select.containerOf.booking);
    thisApp.booking = new Booking(bookingElem);
  },
  initMainPage: function(){
    const thisApp = this;
    const mainPageElem = document.querySelector(select.containerOf.mainPage);
    thisApp.mainPage = new MainPage(mainPageElem);

    thisApp.mainLinks = document.querySelectorAll(select.main.links);

    for (let link of thisApp.mainLinks) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        const clickedElement = this;

        const id = clickedElement.getAttribute('href').replace('#', '');

        thisApp.activatePage(id);

        window.location.hash = '#/' + id;
      });
    }
  },
  initData: function () {
    const thisApp = this;

    thisApp.data = {};
    const url = select.db.url + '/' + select.db.product;
    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){

        /*save parsedResponse as thisApp.data.products*/
        thisApp.data.products = parsedResponse;

        /*execute initMenu method*/
        app.initMenu();

      });

  },
  init: function () {
    const thisApp = this;

    thisApp.initPages();
    thisApp.initData();
    thisApp.initBooking();
    thisApp.initMainPage();
  },
  initCart: function(){
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });

  },
};

app.init();
app.initCart();

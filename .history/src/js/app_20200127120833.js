import {select, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
const app = {
  initPages: function(){
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;

    thisApp.activatePage(thisApp.pages[0].id);
  },

  activatePage: function(pageId){
    const thisApp = this;
    //add class "active" to matching pages, remove from non-matching
    for(let page of thisApp.pages){
      if(page.id == pageId){
        page.class.add(classNames.pages.active);
      }else{
        page.class.remove(classNames.pages.active);
      }
    }

    //add class "active" to matching links, remove from non-matching
  },
  initMenu: function () {
    const thisApp = this;


    // console.log('thisApp.data:', thisApp.data);
    for (let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);

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
        console.log('parsedResponse', parsedResponse);

        /*save parsedResponse as thisApp.data.products*/
        thisApp.data.products = parsedResponse;

        /*execute initMenu method*/
        app.initMenu();

      });

    //console.log('thisApp.data', JSON.stringify(thisApp.data));
  },
  init: function () {
    const thisApp = this;
    // console.log('*** App starting ***');
    // console.log('thisApp:', thisApp);
    // console.log('classNames:', classNames);
    // console.log('settings:', settings);
    // console.log('templates:', templates);

    thisApp.initPages();
    thisApp.initData();
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

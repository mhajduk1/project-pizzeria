/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product', // CODE ADDED
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount', // CODE CHANGED
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    // CODE ADDED START
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
    // CODE ADDED END
  };
  
  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    // CODE ADDED START
    cart: {
      wrapperActive: 'active',
    },
    // CODE ADDED END
  };
  
  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }, // CODE CHANGED
    // CODE ADDED START
    cart: {
      defaultDeliveryFee: 20,
    },
    // CODE ADDED END
  };
  
  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    // CODE ADDED START
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
    // CODE ADDED END
  };

  class Product {
    constructor(id, data) {

      const thisProduct = this;
      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder();
    }

    renderInMenu() {
      const thisProduct = this;
      /*generate HTML based on template */
      const generatedHTML = templates.menuProduct(thisProduct.data);

      /*create element using utils.createElementFromHTML */
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);

      /*find menu container */
      const menuContainer = document.querySelector(select.containerOf.menu);

      /*add element to menu */
      menuContainer.appendChild(thisProduct.element);
    }

    getElements() {
      const thisProduct = this;
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }

    initAccordion() {
      const thisProduct = this;

      /* START: click event listener to trigger */
      thisProduct.accordionTrigger.addEventListener('click', function (event) {

        /* prevent default action for event */
        event.preventDefault();

        /* toggle active class on element of thisProduct */
        thisProduct.element.classList.add('active');

        /* find all active products */
        const activeProducts = document.querySelectorAll(select.all.menuProductsActive);

        /* START LOOP: for each active product */
        for (let product of activeProducts) {

          /* START: if the active product isn't the element of thisProduct */
          if (product !== thisProduct.element) {
            /* remove class active for the active product */
            product.classList.remove('active');

            /* END: if the active product isn't the element of thisProduct */
          }
          /* END LOOP: for each active product */
        }
      });
      /* END: click event listener to trigger */
    }

    initOrderForm() {
      const thisProduct = this;
      thisProduct.form.addEventListener('submit', function (event) {
        event.preventDefault();
        thisProduct.processOrder();
      });

      for (let input of thisProduct.formInputs) {
        input.addEventListener('change', function () {
          thisProduct.processOrder();
        });
      }

      thisProduct.cartButton.addEventListener('click', function (event) {
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart();
      });
    }

    processOrder() {
      const thisProduct = this;
      const formData = utils.serializeFormToObject(thisProduct.form);

      thisProduct.params = {};

      /* set variable price to equal thisProduct.data.price */
      let price = thisProduct.data.price;

      if (thisProduct.data.hasOwnProperty('params') == true) {

        /* START LOOP: for each paramId in thisProduct.data.params */
        for (let paramId in thisProduct.data.params) {

          /* save the element in thisProduct.data.params with key paramId */
          const param = thisProduct.data.params[paramId];

          /* START LOOP: for each optionId in param.options */
          for (let optionId in param.options) {

            /* save the element in param.options with key optionId */

            const option = param.options[optionId];
            const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;

            if (optionSelected && !option.default) {

              if(!thisProduct.params[paramId]){

                thisProduct.params[paramId] = {
                  label: param.label,
                  options: {},
                };

              }

              thisProduct.params[paramId].options[optionId] = Option.label;

              /* add price of option to variable price */
              price += option.price;

              /* END IF: if option is selected and option is not default */
            }

            /* START ELSE IF: if option is not selected and option is default */
            else if (!optionSelected && option.default) {

              /* deduct price of option from price */
              price -= option.price;

              /* END ELSE IF: if option is not selected and option is default */
            }

            const activeImage = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);

            if (activeImage) {

              if (optionSelected) {

                activeImage.classList.add('active');

              } else {

                activeImage.classList.remove('active');

              }
            }
          }
        }
      }
      
      /* multiply price by amount */
      thisProduct.priceSingle = price;
      thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;

      /* set the contents of thisProduct.priceElem to be the value of variable price */ 
      thisProduct.priceElem.innerHTML = thisProduct.price;

    }

    initAmountWidget() {
      const thisProduct = this;


      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      thisProduct.amountWidgetElem.addEventListener('updated', function () {

        thisProduct.processOrder();

      });
    }

    addToCart(){
      const thisProduct = this;

      thisProduct.name = thisProduct.data.name;
      thisProduct.amount = thisProduct.amountWidget.value;
      app.cart.add(thisProduct);
    }
    
  }

  class AmountWidget {
    constructor(element) {
      const thisWidget = this;

      thisWidget.getElements(element);
      thisWidget.value = settings.amountWidget.defaultValue;
      thisWidget.setValue(thisWidget.input.value);
      thisWidget.initActions(thisWidget.value);
    }

    getElements(element) {
      const thisWidget = this;
    
      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }

    announce() {
      const thisWidget = this;

      const event = new CustomEvent('updated', {
        bubbles: true
      });
      thisWidget.element.dispatchEvent(event);
    }

    initActions() {
      const thisWidget = this;
    
      thisWidget.input.addEventListener('change', function () {
        thisWidget.setValue(thisWidget.input.value);
      });

      thisWidget.linkDecrease.addEventListener('click', function (event) {
        event.preventDefault();
        thisWidget.setValue(thisWidget.value - 1);
      });

      thisWidget.linkIncrease.addEventListener('click', function () {
        thisWidget.setValue(thisWidget.value + 1);
      });
    }

    setValue(value) {
      const thisWidget = this;

      const newVal = parseInt(value);

      if (isNaN(newVal) || newVal > settings.amountWidget.defaultMax || newVal < settings.amountWidget.defaultMin) {
        thisWidget.input.value = thisWidget.value;
      } else {
        thisWidget.value = newVal;
        thisWidget.input.value = newVal;
        this.announce();
      }
    }
  }

  class Cart {
    constructor(element){
      const thisCart = this;
      thisCart.deliveryFee = 20;
      thisCart.productList = {};

      thisCart.products = [];

      thisCart.getElements(element);
      thisCart.initActions(element);
  
      // console.log('new Cart', thisCart);
    }
    getElements(element){

      const thisCart = this;

      thisCart.dom = {};

      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList); 
      thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];

      for(let key of thisCart.renderTotalsKeys){
        thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
      }
      
    }

    add(menuProduct){
      const thisCart = this;
      /*generate HTML based on template */
      const generatedHTML = templates.cartProduct(menuProduct);
      /*create element using utils.createElementFromHTML */
      thisCart.element = utils.createDOMFromHTML(generatedHTML);

      /*find menu container */
      thisCart.dom.productList = document.querySelector(select.cart.productList);

      /*add element to menu */
      thisCart.dom.productList.appendChild(thisCart.element);

      thisCart.products.push(new CartProduct(menuProduct, thisCart.element));

      thisCart.update();
      if(!thisCart.dom.productList.hasAttribute('updated')){
        thisCart.dom.productList.addEventListener('updated', function(){
        
          thisCart.update();
        });
      }
      // console.log('adding product', menuProduct);
    }

    initActions(){
      const thisCart = this;


      thisCart.dom.toggleTrigger.addEventListener('click', function(){
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });

      thisCart.dom.productList.addEventListener('updated', function(){
        thisCart.update();
      });
      thisCart.dom.productList.addEventListener('remove', function(event){
        thisCart.remove(event.detail.cartProduct);
      });
      
    }

    update(){
      const thisCart = this;

      thisCart.totalNumber = 0;
      thisCart.subtotalPrice = 0;

      for (let product of thisCart.products){
        //console.log(product);
        thisCart.subtotalPrice += product.price;
        //console.log(product.amount);
        thisCart.totalNumber += product.amount;
      }
      thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;

      // console.log('totalNumber', thisCart.totalNumber);
      // console.log('subtotalPrice', thisCart.subtotalPrice);
      // console.log('totalPrice', thisCart.totalPrice);

      for(let key of thisCart.renderTotalsKeys){
        for(let elem of thisCart.dom[key]){
          elem.innerHTML = thisCart[key];
        }
      }
    }

    remove(cartProduct){
      const thisCart = this;
      const index = thisCart.products.indexOf(cartProduct);
      thisCart.products.splice(index, 1);
      cartProduct.dom.wrapper.remove();
      thisCart.update();
    }
  }

  class CartProduct{

    constructor(menuProduct, element){

      const thisCartProduct = this;
      thisCartProduct.id = menuProduct.id;
      thisCartProduct.name = menuProduct.name;
      thisCartProduct.price = menuProduct.price;
      thisCartProduct.priceSingle = menuProduct.priceSingle;
      thisCartProduct.amount = menuProduct.amount;

      thisCartProduct.params = JSON.parse(JSON.stringify(menuProduct.params));

      thisCartProduct.getElements(element);
      thisCartProduct.initAmountWidget();
      thisCartProduct.initActions();

      // console.log('new cart product',thisCartProduct);
      // console.log('product data', menuProduct);
    }
    getElements(element){

      const thisCartProduct = this;

      thisCartProduct.dom = {};

      thisCartProduct.dom.wrapper = element;
      thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
      thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
      thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
      thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);
    }
    initAmountWidget() {
      const thisCartProduct = this;

      thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidget);
      
      thisCartProduct.dom.amountWidget.addEventListener('updated', function () {

        thisCartProduct.amount = thisCartProduct.amountWidget.value;
        thisCartProduct.price = thisCartProduct.priceSingle * thisCartProduct.amount;
        thisCartProduct.dom.price.innerHTML = thisCartProduct.price;

      });
    }

    remove(){
      const thisCartProduct = this;

      const event = new CustomEvent('remove', {
        bubbles: true,
        detail: {
          cartProduct: thisCartProduct,
        },
      });

      thisCartProduct.dom.wrapper.dispatchEvent(event);
    }

    initActions(){
      const thisCartProduct = this;
      
      thisCartProduct.dom.remove.addEventListener('click', function(event){
        event.preventDefault();
        thisCartProduct.remove();
        console.log('cliked remove');
      });
      thisCartProduct.dom.edit.addEventListener('click', function(){
        event.preventDefault();
        thisCartProduct.remove();
        console.log('cliked edit');
      });

    }
  }

  const app = {
    initMenu: function () {
      const thisApp = this;

      // console.log('thisApp.data:', thisApp.data);
      for (let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]);
      }
    },
    initData: function () {
      const thisApp = this;

      thisApp.data = dataSource;
    },
    init: function () {
      const thisApp = this;
      // console.log('*** App starting ***');
      // console.log('thisApp:', thisApp);
      // console.log('classNames:', classNames);
      // console.log('settings:', settings);
      // console.log('templates:', templates);
      thisApp.initData();
      thisApp.initMenu();
    },
    initCart: function(){
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);

    },
  };

  app.init();
  app.initCart();
}
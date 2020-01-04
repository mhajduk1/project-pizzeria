import {select,utils,templates} from './settings.js';
import AmountWidget from './components/AmountWidget.js';


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
    //app.cart.add(thisProduct);
    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });  

    thisProduct.element.dispatchEvent(event);

  }
    
}

export default Product;
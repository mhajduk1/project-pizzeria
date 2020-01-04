import {select,templates,classNames} from '../settings.js';
import CartProduct from './CartProduct.js';
import utils from '../utils.js';

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
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);

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

    thisCart.dom.form.addEventListener('submit', function(){
      event.preventDefault();
      thisCart.sendOrder();
    });

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
  sendOrder(){
    const thisCart = this;
    const url = select.db.url + '/' + select.db.order;

    const payload = {
      address: thisCart.dom.address.value,
      phone:  thisCart.dom.phone.value,
      totalNumber: thisCart.totalNumber,
      subtotalPrice: thisCart.subtotalPrice,
      deliveryFee: thisCart.deliveryFee,
      totalPrice: thisCart.totalPrice,
      products: [],
    };
    for(let product of thisCart.products){
      payload.products.push(product.getData());
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    fetch(url, options)
      .then(function(response){
        return response.json();
      })
      .then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);
      });
      
  }
}

export default Cart;
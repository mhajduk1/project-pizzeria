/* eslint-disable linebreak-style */

import {templates, select} from '../settings.js';
import utils from '../utils.js';

class MainPage{
  constructor(){
    const thisMainPage = this;

    thisMainPage.renderPage();
    thisMainPage.getElements();
    thisMainPage.getData();
  }
  renderPage(){
    const thisMainPage = this;
    const generatedHTML = templates.mainPage();
    thisMainPage.element = utils.createDOMFromHTML(generatedHTML);
    const mainContainer = document.querySelector(select.containerOf.mainPage);
    console.log(mainContainer);
    mainContainer.appendChild(thisMainPage.element);
  }

}

export default MainPage;
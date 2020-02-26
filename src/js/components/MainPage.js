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
    mainContainer.appendChild(thisMainPage.element);
  }
  getElements(){
    const thisMainPage = this;

    thisMainPage.imagesList = document.querySelector(select.containerOf.image);
  }
  getData(){
    const thisMainPage = this;

    thisMainPage.imagesList = {};
    const url = select.db.url + '/' + select.db.gallery;

    fetch(url)
      .then(function(rawResponse) {
        return rawResponse.json();
      })
      .then(function(parsedResponse) {
        thisMainPage.dataImages = parsedResponse;
        console.log('data from API: ', thisMainPage.dataImages);
        thisMainPage.renderImagesList();
      });
  }
  renderImagesList(){
    const thisMainPage = this;
    const mappedImages = thisMainPage.dataImages.map(function(imageObject) {
      return imageObject.image;
    });
    //console.log(mappedImages);
    const arrayConvertedToObject = Object.assign({}, mappedImages);
    //console.log(arrayConvertedToObject);
    const generatedHTML = templates.image({image: arrayConvertedToObject});
    thisMainPage.element = utils.createDOMFromHTML(generatedHTML);
    thisMainPage.imageList.appendChild(thisMainPage.element);
    //console.log(thisMainPage.element);
  }
}
export default MainPage;
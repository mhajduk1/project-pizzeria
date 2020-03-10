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
    thisMainPage.opinionList = document.querySelector(select.containerOf.opinions);
  }
  getData(){
    const thisMainPage = this;

    const urlFirst = select.db.url + '/' + select.db.gallery;
    const urlSecond = select.db.url + '/' + select.db.opinions;

    fetch(urlFirst)
      .then(function(rawResponse) {
        return rawResponse.json();
      })
      .then(function(parsedResponse) {
        thisMainPage.dataImages = parsedResponse;
        //console.log('data from API: ', thisMainPage.dataImages);
        thisMainPage.renderImagesList();
      });
    fetch(urlSecond)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        thisMainPage.dataOpinions = parsedResponse;
        thisMainPage.renderOpinionsList();
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
    //console.log(thisMainPage.element);
    thisMainPage.element = utils.createDOMFromHTML(generatedHTML);
    //console.log(templates.image);
    //console.log(thisMainPage.element);
    thisMainPage.imagesList.appendChild(thisMainPage.element);
    //console.log(thisMainPage.element);
  }
  renderOpinionsList() {
    const thisMainPage = this;

    const mappedOpinions = thisMainPage.dataOpinions.map(function(opinionObject) {
      return opinionObject.opinion;
    });
    const mappedOptions = thisMainPage.dataOpinions.map(function(opinionObject) {
      return opinionObject.options;
    });

    const opinionsConvertedToObject = Object.assign({}, mappedOpinions);
    const optionsConvertedToObject = Object.assign({}, mappedOptions);

    const opinionHTML = templates.opinions({opinion: opinionsConvertedToObject});
    const optionsHTML = templates.options({options: optionsConvertedToObject});

    thisMainPage.opinions = utils.createDOMFromHTML(opinionHTML);
    thisMainPage.options = utils.createDOMFromHTML(optionsHTML);
    console.log(thisMainPage.options);

    thisMainPage.opinionList.appendChild(thisMainPage.opinions);
    //thisMainPage.options.appendChild(thisMainPage.options);

    thisMainPage.initSlaider();
  }
  initSlaider(){
    const thisMainPage = this;
    thisMainPage.circleList = thisMainPage.options.querySelectorAll('li');
    for(let circle of thisMainPage.circleList) {
      circle.addEventListener('click', function(event){
        event.preventDefault();
        thisMainPage.changeOpinion();
        thisMainPage.changeCircle();
      });
    }
    thisMainPage.opinions = document.querySelectorAll('.opinion');

    let opinionNumber = 0;

    setInterval(function(){
      let selectOpinion = thisMainPage.opinions[opinionNumber];
      let selectCircle = thisMainPage.circleList[opinionNumber];
      console.log(thisMainPage.circleList);
      selectOpinion.classList.remove('active');
      selectCircle.classList.remove('active');

      if (opinionNumber >= thisMainPage.opinions.length - 1 ) {
        opinionNumber = 0;
      }
      else {
        opinionNumber += 1;
      }
      console.log(opinionNumber);
      console.log(selectOpinion);
      selectCircle = thisMainPage.circleList[opinionNumber];
      selectCircle.classList.add('active');
    }, 3000);
  }
  changeOpinion() {
    const clickedElement = event.target;
    const opinionClass = clickedElement.getAttribute('data-option');
    const selectOpinion = document.querySelector('.' + opinionClass);
    const activeOpinion = document.querySelector('.option.active');
    activeOpinion.classList.remove('active');
    selectOpinion.classList.add('active');
  }
  changeCircle(){
    const clickedElement = event.target;
    const activeCircle = document.querySelector('.corusel-option .active');
    activeCircle.classList.remove('active');
    clickedElement.classList.add('active');
  }
}
export default MainPage;
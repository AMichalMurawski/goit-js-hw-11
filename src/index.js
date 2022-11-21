import './css/styles.css';
import { getResponseImageArray } from './fetchResponseAxios';
import axios from 'axios';
// import Notiflix from 'notiflix';

const ELEMENTS_PER_PAGE = 40;
let nrOfPage = 1;

const searchBtn = document.querySelector('[data-submit-btn]');
const searchInput = document.querySelector('[data-search-input]');

searchBtn.addEventListener('click', event => {
  event.preventDefault();
  const searchText = searchInput.value;

  const imageArray = getResponseImageArray(
    searchText,
    nrOfPage,
    ELEMENTS_PER_PAGE
  );
});

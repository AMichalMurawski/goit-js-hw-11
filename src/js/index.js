import '../css/styles.css';
import 'node_modules/modern-normalize/modern-normalize.css';
import { getPixabayImages } from './fetchPixabayImages';
// import axios from 'axios';
// import Notiflix from 'notiflix';

const ELEMENTS_PER_PAGE = 40;
let nrOfPage = 1;

const searchBtn = document.querySelector('[data-submit-btn]');
const searchInput = document.querySelector('[data-search-input]');
const galleryHtml = document.querySelector('.gallery');

searchBtn.addEventListener('click', event => {
  event.preventDefault();
  galleryHtml.innerHTML = '';
  const searchText = searchInput.value;
  nrOfPage = 1;
  fetchPixabay(searchText, nrOfPage);
});

async function fetchPixabay(searchText, pageNr) {
  const imageArray = await getPixabayImages(
    searchText,
    pageNr,
    ELEMENTS_PER_PAGE
  );
  addImagesToHtml(imageArray);
}

function addImagesToHtml(images) {
  galleryHtml.insertAdjacentHTML(
    'beforeend',
    images
      .map(
        image =>
          `<div class="photo-card">
            <div class="photo-image">
              <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
            </div>
            <div class="info">
              <p class="info-item"><b>Likes</b></br>${image.likes}</p>
              <p class="info-item"><b>Views</b></br>${image.views}</p>
              <p class="info-item"><b>Comments</b></br>${image.comments}</p>
              <p class="info-item"><b>Downloads</b></br>${image.downloads}</p>
            </div>
          </div>`
      )
      .join('\n')
  );
}

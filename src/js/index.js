import '../css/styles.css';
import '../../node_modules/modern-normalize/modern-normalize.css';
import { getPixabayImages } from './fetchPixabayImages';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const ELEMENTS_PER_PAGE = 40;
let nrOfPage = 1;
let searchText = '';

const searchBtn = document.querySelector('[data-submit-btn]');
const searchInput = document.querySelector('[data-search-input]');
const galleryHtml = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

searchBtn.addEventListener('click', event => {
  event.preventDefault();
  galleryHtml.innerHTML = '';
  searchText = searchInput.value;
  nrOfPage = 1;
  fetchPixabay(searchText, nrOfPage);
});

loadMoreBtn.style.display = 'none';
loadMoreBtn.addEventListener('click', event => {
  nrOfPage++;
  fetchPixabay(searchText, nrOfPage);
});

galleryHtml.addEventListener('click', event => event.preventDefault());

var lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

async function fetchPixabay(searchText, pageNr) {
  const imageArray = await getPixabayImages(
    searchText,
    pageNr,
    ELEMENTS_PER_PAGE
  );
  if (pageNr === 1) {
    if (imageArray.totalHits > 0) {
      loadMoreBtn.style.display = 'block';
      Notify.success(`Hooray! We found ${imageArray.totalHits} images.`);
    } else if (imageArray.totalHits === 0) {
      loadMoreBtn.style.display = 'none';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } else {
      loadMoreBtn.style.display = 'none';
      Notify.warning(`It's a problem with js code!`);
      return;
    }
  }
  if ((pageNr - 1) * ELEMENTS_PER_PAGE >= imageArray.totalHits) {
    Notify.warning(
      `We're sorry, but you've reached the end of search results.`
    );
    return;
  }
  if (imageArray.totalHits > 0) {
    addImagesToHtml(imageArray.data);
  }
}

function addImagesToHtml(images) {
  galleryHtml.insertAdjacentHTML(
    'beforeend',
    images
      .map(
        image =>
          `<div class="photo-card">
            <div class="photo-image">
              <a href="${image.largeImageURL}">
                <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
              </a>
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
  lightbox.refresh();
}

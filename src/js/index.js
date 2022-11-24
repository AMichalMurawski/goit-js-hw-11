import '../css/styles.css';
import '../../node_modules/modern-normalize/modern-normalize.css';
import { getPixabayImages } from './fetchPixabayImages';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import InfiniteScroll from 'infinite-scroll';

const ELEMENTS_PER_PAGE = 40;
let nrOfPage = 0;
let nextPage = false;
let searchText = '';
let automaticLoad = false;

const searchBtn = document.querySelector('[data-submit-btn]');
const searchInput = document.querySelector('[data-search-input]');
const galleryHtml = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const loadedOptions = document.querySelector('.loaded-options');

searchBtn.addEventListener('click', event => {
  event.preventDefault();
  galleryHtml.innerHTML = '';
  searchText = searchInput.value;
  nrOfPage = 1;
  nextPage = true;
  firstSearch();
});

loadedOptions.textContent = 'Handle loading';
loadedOptions.addEventListener('click', () => {
  if (automaticLoad) {
    nrOfPage > 0 ? (loadMoreBtn.style.display = 'block') : null;
    loadedOptions.textContent = 'Handle loading';
    automaticLoad = false;
  } else {
    loadMoreBtn.style.display = 'none';
    loadedOptions.textContent = 'Automatic loading';
    automaticLoad = true;
  }
  nrOfPage > 0 ? checkAutoScroll() : null;
});

loadMoreBtn.style.display = 'none';
loadMoreBtn.addEventListener('click', event => {
  nrOfPage++;
  fetchPixabay(searchText, nrOfPage);
});

galleryHtml.addEventListener('click', event => event.preventDefault());

window.addEventListener('scroll', () => {
  if (
    automaticLoad &&
    window.scrollY + window.innerHeight >= document.documentElement.scrollHeight
  ) {
    nrOfPage++;
    fetchPixabay(searchText, nrOfPage);
  }
});

var lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

async function firstSearch() {
  await fetchPixabay(searchText, nrOfPage);
  automaticLoad ? checkAutoScroll() : null;
}

async function checkAutoScroll() {
  if (automaticLoad && document.body.scrollHeight < window.innerHeight) {
    nrOfPage++;
    await fetchPixabay(searchText, nrOfPage);
    await checkAutoScroll();
  }
}

async function fetchPixabay(searchText, pageNr) {
  if (!nextPage) {
    notifyMessage(pageNr, undefined);
    return;
  }
  const imageArray = await getPixabayImages(
    searchText,
    pageNr,
    ELEMENTS_PER_PAGE
  );
  if (notifyMessage(pageNr, imageArray.totalHits)) {
    addImagesToHtml(imageArray.data);
  }
  if (pageNr > 1) {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
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

function notifyMessage(pageNr, totalHits) {
  if (totalHits === undefined) {
    // loadMoreBtn.style.display = 'none';
    automaticLoad === false
      ? Notify.warning(
          `We're sorry, but you've reached the end of search results.`
        )
      : null;
    nextPage = false;
    return false;
  }
  if (pageNr > 1) {
    return true;
  }
  if (totalHits > 0) {
    !automaticLoad ? (loadMoreBtn.style.display = 'block') : null;
    Notify.success(`Hooray! We found ${totalHits} images.`);
    return true;
  }
  if (totalHits === 0) {
    loadMoreBtn.style.display = 'none';
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    nextPage = false;
    return false;
  }
  loadMoreBtn.style.display = 'none';
  Notify.warning(`It's a problem with js code!`);
  return false;
}

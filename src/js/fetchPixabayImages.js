import axios from 'axios';
import { Notify } from 'notiflix';

const API_KEY = '31382977-48057b8c379edff4cc262b675';
const API_WEB = 'https://pixabay.com/api/';

async function getPixabayImages(inputText, pageNr, perPageNr) {
  return await axios
    .get(`${API_WEB}?`, {
      params: {
        key: API_KEY,
        q: inputText,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: pageNr,
        per_page: perPageNr,
      },
    })
    .then(response => {
      const responseTotalHits = response.data.totalHits;
      if (responseTotalHits === 0) {
        throw (err = { totalHits: 0 });
      }
      const dataLength = response.data.hits.length;
      const responseDataArray = {
        totalHits: responseTotalHits,
        data: [],
      };
      for (let i = 0; i < dataLength; i++) {
        responseDataArray.data.push({
          webformatURL: response.data.hits[i].webformatURL,
          largeImageURL: response.data.hits[i].largeImageURL,
          tags: response.data.hits[i].tags,
          likes: response.data.hits[i].likes,
          views: response.data.hits[i].views,
          comments: response.data.hits[i].comments,
          downloads: response.data.hits[i].downloads,
        });
      }
      return responseDataArray;
    })
    .catch(error => {
      return error;
    });
}

export { getPixabayImages };

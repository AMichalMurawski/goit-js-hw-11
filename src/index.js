import './css/styles.css';
import axios from 'axios';
// import Notiflix from 'notiflix';

axios
  .get('')
  .then(response  => {
    // handle success
    console.log(response);
  })
  .catch(error => {
    // handle error
    console.log(error);
  })
  .finally(() => {
    // always executed
  });

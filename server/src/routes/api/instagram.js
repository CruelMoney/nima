var async = require('async');
import fetchInstas from '../../logic/instagram';

const get = async (req, res) => {
  try {
    const data = await fetchInstas({tag: 'nimacph', count: 10});
    return res.apiResponse(data);
  } catch (error) {
    console.log(error)
    error = error.message || error;
    return res.apiError(error);
  }
}

export {
  get
}
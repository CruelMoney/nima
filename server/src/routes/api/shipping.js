
const shipping = require('../../logic/shipping');

const get = async (req, res) => {
  const id = req.params.id;
  try {
    const shipment = await shipping.getShippingStatus({parcelID:id});
    if (!shipment) throw new Error("No shipment.");
    return res.apiResponse(shipment);
  } catch (error) {
    console.log(error)
    error = error.message || error;
    return res.apiError(error);
  }
}

const post = async (req, res) => {
  try {
    const shipment = await shipping.getOrderLabel({});
    if (!shipment) throw new Error("No shipment.");
    return res.apiResponse(shipment);
  } catch (error) {
    console.log(error)
    error = error.message || error;
    return res.apiError(error);
  }
}

const getAll = async (req, res) => {
  try {
   
    const shipments = await shipping.getShippings();
    if (!shipments) throw new Error("No shipment.");
    return res.apiResponse(shipments);
  } catch (error) {
    console.log(error)
    error = error.message || error;
    return res.apiError(error);
  }
}

export {
  get,
  post,
  getAll
}
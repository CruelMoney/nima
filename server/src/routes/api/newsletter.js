var async = require('async'),
keystone = require('keystone');
const emailService = require('../../logic/email');

/**
 * Newsletter signup
 */
const post = async (req, res) => {
  const {
    email,
    name,
    ...rest
  } = req.body;

  try {
    await emailService.addCustomer({
      email, 
      name:{
        first: name,
        last: ''
      },
      receivesNewsletter: true
    });

    // return new product stock
    return res.apiResponse({});

  } catch (error) {
    console.log(error)
    error = error.message || error;
    return res.apiError(error);
  }
}


export {
  post
}
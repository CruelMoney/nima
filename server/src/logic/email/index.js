const keystone = require('keystone');
var User = keystone.list('User').model;
var Configuration = keystone.list('APIsConfiguration').model;
const nodemailer = require('nodemailer');
const emailTemplate = require('./emailTemplate');
var mg = require('nodemailer-mailgun-transport');

const addCustomer = async ({email, name, ...rest}) => {
    return User.findOne({"email" : email})
    .exec()
    .then(async (dbUser)=>{
      let user = null; 
      if(!dbUser){ // Email not exist
        user = new User({
          ...rest,
          name: { ...name },
          email: email,
          password: email,
          isCustomer: true,
          isAdmin: false,
        });
      }else{ // Exists, update values
        user = dbUser;
        user.set({
          isCustomer: true,
          name: { ...name },
          receivesNewsletter: dbUser.receivesNewsletter || rest.receivesNewsletter
        });
      }
      await user.save();
      return user;
    })
    .catch(err => {throw err});
}

const sendEmail = async ({
  receiverEmail,
  type,
  order, 
  items,
  coupon,
  shipping
}) => {

  try {
    const conf = await Configuration.findOne();
    const { key } = conf;

    const auth = {
      auth: {
        api_key: key.mailgun,
        domain: 'mg.nimacph.dk'
      }
    }
    
    var transporter = nodemailer.createTransport(mg(auth));
    
    const htmlPack = await emailTemplate.getTemplate({type, order, items, coupon, shipping});

    const mailOptions = {
      "from": "noreply@nimacph.dk", // sender address
      "to": receiverEmail, // list of receivers,
      "h:Reply-To" : "nimacph@gmail.com",
      ...htmlPack
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if(err)
        console.log(err)
      else
        console.log(info);
    });
    
  } catch (error) {
    console.log(error);
  }
  
   

}





export {
  addCustomer,
  sendEmail
}
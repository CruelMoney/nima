const keystone = require('keystone');
var User = keystone.list('User').model;

const addCustomer = async ({email, name, ...rest}) => {
    return User.findOne({"email" : email})
    .exec()
    .then((dbUser)=>{
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
      return user.save();
    })
    .catch(err => {throw err});
}


export {
  addCustomer
}
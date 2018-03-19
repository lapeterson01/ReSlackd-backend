//add dummy user so we can test routes in postman without worrying about authentication
const dummyUser = {
  uId:'44', 
  name: 'Jermain Thiel', 
  imageURL: 'https://vignette.wikia.nocookie.net/detectiveconan96/images/7/72/Generic_Male_Profile.jpg/revision/latest', 
  googleID: 'd6a767a0-9ee3-4f17-bf57-fe7e692f854b', 
  createdAt: '1498372652254', 
  lastActiveAt: '1521234996020', 
  lastLoginAt: '1499682760019'
};

module.exports = (req, res, next) => {
  
  //add dummy user to request so we can test get and post routes. comment out once testing is over
  if (!req.user) req.user = dummyUser;
  
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' });
  }

  next();
};
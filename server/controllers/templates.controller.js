// const express = require('express');
// const router = express.Router();
// const Template = require('../models/template');

// // var jwt = require('express-jwt');
// // var auth = jwt({
// //   secret: 'MY_SECRET',
// //   userProperty: 'payload'
// // });
// // search
// router.get('/search',/*passport.authenticate('jwt', {session:false}),*/ (req, res) => {
//     console.log(req.user)
//     Template.searchTemplate(req.query.name, req.user, (err, templates) => {
//         if(err ) throw err;
//         else if(!templates) return res.json({success:false,msg:'user not found'});  
//         return res.json( templates.hits.hits);
//     });
// });


// module.exports = router;

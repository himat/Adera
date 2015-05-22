var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */
router.get('/userlist', function(req, res) {
    var db = req.db;
    db.collection('userlist').find().toArray(function (err, items) {
        res.json(items);
    });
});

//GET add new user page
router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'add new user' });
});

//POST to add newuser
router.post('/newuser', function(req, res) {
    var db = req.db;
    db.collection('userlist').insert(req.body, function(err, resultl) {
        res.send( 
            (err === null) ? {msg:''} : {msg:err} 
        );
    });
});

//DELETE to delete user
router.delete('/deleteuser/:id', function(req, res) {
    var db = req.db;
    var userToDelete = req.params.id;
    db.collection('userlist').removeById(userToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error ' + err });
    });
});

module.exports = router;

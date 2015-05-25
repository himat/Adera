var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */
router.get('/userslist', function(req, res) {
    var db = req.db;
    console.log('get sent to /userslist');
   
    db.collection('users').find().toArray(function(err, items) {
        console.log('USERS OUTPUT: ' + items);
        res.json(items);
        
    });
                                                            
});

router.get('/aderaPlaid', function(req, res) {
    var db = req.db;
    db.collection('aderaPlaid').find().toArray(function(err, items) {
        res.json(items);
    });
});

router.get('/aderaBlue', function(req, res) {
    var db = req.db;
    db.collection('aderaBlue').find().toArray(function(err, items) {
        res.json(items);
    });
});

router.get('/aderaAll', function(req, res) {
    var db = req.db;
    var itemsTotal=[], s1,s2, closed=[false,false];
    
    var adding = function(data){
        console.log(data);
        itemsTotal.push(data);
    };
    
    var closing=function(i){
        closed[i]=true;
        if(closed[0]&&closed[1])
            return res.json(itemsTotal);
    };
    s1 = db.collection('aderaPlaid').find().stream();
    s1.on('data', adding);
    s1.on('close', function(){ closing(0); });
    
    s2=db.collection('aderaBlue').find().stream();
    s2.on('data', adding);
    s2.on('close', function() {closing(1);} );
    
    
});

//GET add new user page
router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'add new user' });
});

//POST to add newuser
router.post('/newuser', function(req, res) {
    var db = req.db;
    db.collection('aderaBlue').insert(req.body, function(err, result) {
        res.send( 
            (err === null) ? {msg:''} : {msg:err} 
        );
    });
});


//POST to add new pill/timestamp data received from the plaid bottle
router.post('/aderaPlaid', function(req, res) {
    var db = req.db;
    db.collection('aderaPlaid').insert(req.body, function(err, result) {
        res.send(
            (err === null) ? {msg:''} : {msg:err}
            );
    });
});

//POST to add new pill/timestampe data received from the blue bottle
router.post('/aderaBlue', function(req, res) {
    var db = req.db;
    db.collection('aderaBlue').insert(req.body, function(err, result) {
        res.send(
            (err === null) ? {msg:''} : {msg:err}
            );
    });
});


//DELETE to delete user
router.delete('/deleteuser/:id', function(req, res) {
    var db = req.db;
    var userToDelete = req.params.id;
    db.collection('aderaBlue').removeById(userToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error ' + err });
    });
});

module.exports = router;

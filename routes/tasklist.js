// express
const express = require('express');
const router = express.Router();
// schemas
var Tasklist = require('../models/tasklist');
// api/tasklist
router.route('')
  .get((req, res) => {
  Tasklist.getTasklist((err, tasklist) => {
    if(err)
      return next(err);

    res.json(tasklist);
  }, parseInt(req.query.skip), parseInt(req.query.limit));
}).post((req, res, next) => {
  let newTasklist = new Tasklist({
      title: req.body.title,
      details: req.body.details
  });

  Tasklist.addTasklist(newTasklist, (err, tasklist) => {
    if(err)
      return next(err);

    res.json(tasklist);
  });
});
// api/tasklist/:_id
router.route('/:_id')
  .get((req, res) => {
  Tasklist.getTasklistById(req.params._id, (err, tasklist) => {
    if(err)
      return next(err);

    res.json(tasklist);
  });
}).put((req, res) => {
  let updatedTasklist = new Tasklist({
      title: req.body.title,
      details: req.body.details
  });

  Tasklist.updateTasklist(req.params._id, updatedTasklist, {}, (err, tasklist) => {
    if(err)
      return next(err);

    res.json(updatedTasklist);
  });
}).delete((req, res) => {
  Tasklist.removeTasklist(req.params._id, (err, tasklist) => {
    if(err)
      return next(err);

    res.json(tasklist);
  });
});

module.exports = router;
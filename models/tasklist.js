// mongoose
const mongoose = require('mongoose');
// schema
var tasktlistSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  }
});

var Tasklist = module.exports = mongoose.model('Tasklist', tasktlistSchema, 'tasklist');
// get tasklist
module.exports.getTasklist = (callback, skip, limit) => {
  Tasklist.find(callback).skip(skip).limit(limit).sort({_id: 1});
};
// get tasklist by id
module.exports.getTasklistById = (_id, callback) => {
  Tasklist.findById(_id, callback);
};
// add tasklist
module.exports.addTasklist = (params, callback) => {
  Tasklist.create(params, callback);
};
// update tasklist
module.exports.updateTasklist = (_id, params, options, callback) => {
  var query = {_id: _id};
  var update = {
    title: params.title,
    details: params.details
  };

  Tasklist.findOneAndUpdate(query, update, options, callback);
};
// delete tasklist
module.exports.removeTasklist = (_id, callback) => {
  var query = {_id: _id};
  Tasklist.remove(query, callback);
};
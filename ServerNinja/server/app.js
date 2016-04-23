var express = require('express');
var app = express();
var socket = require('socket.io')();
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/chat');
var models = require('./models');

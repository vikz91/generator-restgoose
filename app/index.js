'use strict';
var util = require('util'),
path = require('path'),
yeoman = require('yeoman-generator'),
monty = require('./yo-ascii'),
_s = require('underscore.string'),
mkdirp = require('mkdirp');


var MongooseGenerator = module.exports = function MongooseGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(MongooseGenerator, yeoman.generators.Base);

MongooseGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Monty greet the user.
  console.log(monty);


  var prompts = [
  {
    name: 'dbName',
    message: 'Database Name',
    default: 'myDb'
  },
  {
    name: 'dbHost',
    message: 'Database Host',
    default: 'localhost'
  },
  {
    name: 'dbUser',
    message: 'Database User',
    default: ''
  },
  {
    type: 'password',
    name: 'dbPassword',
    message: 'Database Password',
    default: ''
  },
  {
    name: 'dbPort',
    message: 'Database Port',
    default: 27017
  },
  {
    type:'confirm',
    name:'useUserAuth',
    message:'Install User Authentication using JWT',
    default:true
  }
  ];

  this.prompt(prompts, function (props) {
    this.dbName = props.dbName;
    this.slugName = _s.slugify(this.appname);
    this.capName = _s.capitalize(this.appname);
    this.dbHost = props.dbHost;
    this.dbUser = props.dbUser;
    this.dbPassword = props.dbPassword;
    this.dbPort = props.dbPort;
    this.useUserAuth=props.useUserAuth;
    cb();
  }.bind(this));
};

MongooseGenerator.prototype.app = function app() {
  mkdirp('test');
  mkdirp('config');
  this.template('_package.json', 'package.json');
  this.template('_app.js', 'app.js');
  this.fs.copy(this.templatePath('Gruntfile.js'), this.destinationPath('Gruntfile.js'));
  this.fs.copy(this.templatePath('bowerrc'), this.destinationPath('.bowerrc'));  
  this.template('_bower.json', 'bower.json');
  this.fs.copy(this.templatePath('.gitignore'), this.destinationPath('.gitignore'));
};

MongooseGenerator.prototype.routes = function routes() {
  mkdirp('routes');
  this.fs.copy(this.templatePath('routes/index.js'), this.destinationPath('routes/index.js'));
};

MongooseGenerator.prototype.publicFiles = function publicFiles() {
  mkdirp('public');
  mkdirp('public/css');
  this.fs.copy(this.templatePath('public/css/style.css'), this.destinationPath('public/css/style.css'));
  mkdirp('public/js');
  this.fs.copy(this.templatePath('public/js/script.js'), this.destinationPath('public/js/script.js'));
};

MongooseGenerator.prototype.views = function views() {
  mkdirp('views');
  this.fs.copy(this.templatePath('views/index.html'), this.destinationPath('views/index.html'));
};

MongooseGenerator.prototype.projectfiles = function projectfiles() {
  this.template('_README.md', 'README.md');
  this.fs.copy(this.templatePath('editorconfig'), this.destinationPath('.editorconfig'));
  this.fs.copy(this.templatePath('jshintrc'), this.destinationPath('.jshintrc'));
};

MongooseGenerator.prototype.db = function db() {
  mkdirp('models');
  mkdirp('api');
  mkdirp('apiObjects');
  this.template('config/_db.js', 'config/db.js');

  //UserAuth
  if(this.useUserAuth){
    //Copy the User Auth Files
    this.fs.copy(this.templatePath('models/user.js'), this.destinationPath('models/user.js'));
    this.fs.copy(this.templatePath('api/user.js'), this.destinationPath('api/user.js'));
    this.fs.copy(this.templatePath('apiObjects/user.js'), this.destinationPath('apiObjects/user.js'));
    this.template('config/_gcon.js', 'config/gcon.js');
  }
};

MongooseGenerator.prototype.installItem = function installItem() {

  this.composeWith("mongoose:schema", {args: ["item|name:String,price:Number"]}, function(){

  });
};

MongooseGenerator.prototype.test = function test() {
  
};



MongooseGenerator.prototype.install = function install(){
  this.installDependencies();
};
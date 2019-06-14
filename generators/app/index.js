'use strict'

const Generator = require('yeoman-generator')
const chalk = require('chalk')
const yosay = require('yosay')
const _s = require('underscore.string')

const mkdirp = require('mkdirp')

module.exports = class extends Generator {
  prompting () {
    // have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the Rapid Rest API Generator ${chalk.red('generator-restgoose')}!`)
    )

    const prompts = [{
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
      name: 'dbPort',
      message: 'Database Port',
      default: 27017
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
    }
    ]

    return this.prompt(prompts).then(props => {
      // to access props later use this.props.someAnswer;
      this.props = props
      this.props.slugName = _s.slugify(this.appname)
      this.props.capName = _s.capitalize(this.appname)
    })
  }

  configuring () {
    this.spawnCommand('git', ['init'])

    let templatesToCopy = ['package.json', 'README.md', 'app.js', 'config', 'app.sh', 'docker-compose.yml']

    for (let i = 0; i < templatesToCopy.length; i += 1) {
      this.fs.copyTpl(
        this.templatePath(templatesToCopy[i]),
        this.destinationPath(templatesToCopy[i]), this.props
      )
    }

    this.fs.copyTpl(
      this.templatePath('.localrcjs'),
      this.destinationPath('.localrc'), this.model
    )
  }

  writing () {
    let dirsToCreate = [
      'api', 'apiObjects', 'models', 'tests', 'docs', 'logs', 'public', 'sdk/unity', 'sdk/angular', 'tmp'
    ]

    let filesToCopy = ['.editorconfig', 'Dockerfile', '.gitignore', 'routes', 'middleware', 'library', 'sdk', 'bootstrap']

    dirsToCreate.forEach(x => {
      mkdirp(x)
    })

    for (let i = 0; i < filesToCopy.length; i += 1) {
      this.fs.copyTpl(
        this.templatePath(filesToCopy[i]),
        this.destinationPath(filesToCopy[i]), this.props
      )
    }
  }

  install () {
    this.installDependencies({
      bower: false
    })
  }
}

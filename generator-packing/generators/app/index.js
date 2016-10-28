'use strict';

var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var util = require('util');
var assign = require('object-assign');
var glob = require('packing-glob');

/**
 * 将用户选择项信息打平
 * 便于在模版替换时使用
 *
 * @param answers {Object}
 * @return {Object}
 *
 */
function flattenFeature(answers) {
  var features = {};
  Object.keys(answers).forEach(function(key) {
    if (util.isArray(answers[key])) {
      answers[key].forEach(function(item) {
        features[item] = true;
      });
    } else {
      features[key] = answers[key];
    }
  });
  return features;
}

module.exports = yeoman.Base.extend({
  initializing: function () {
    this.props = {};
  },

  default: function () {
    if (path.basename(this.destinationPath()) !== this.props.name) {
      this.log(
        'Your generator must be inside a folder named ' + this.props.name + '\n' +
        'I\'ll automatically create this folder.'
      );
      mkdirp(this.props.name);
      this.destinationRoot(this.destinationPath(this.props.name));
    }
  },

  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the breathtaking ' + chalk.red('generator-packing') + ' generator!'
    ));

    // @see https://github.com/SBoudrias/Inquirer.js
    var prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'name',
        default: this.appname,
      },
      {
        type: 'confirm',
        name: 'react',
        message: 'Use react?',
        default: true
      },
      {
        type: 'confirm',
        name: 'redux',
        message: 'Use redux?',
        default: true,
        when: function (answers) {
          return answers.react;
        }
      },
      {
        type: 'list',
        name: 'css',
        message: 'Choose a CSS Preprocessor:',
        choices: [
          {
            name: 'none',
            value: ''
          },
          {
            name: 'less',
            value: 'less'
          },
          {
            name: 'sass',
            value: 'sass'
          }
        ]
      },
      {
        type: 'confirm',
        name: 'maven',
        message: 'Use maven?',
        default: true
      },
      {
        type: 'list',
        name: 'template',
        message: 'Choose a template:',
        choices: [
          {
            name: 'ejs',
            value: 'ejs'
          },
          {
            name: 'handlebars',
            value: 'handlebars'
          },
          {
            name: 'html',
            value: 'html'
          },
          {
            name: 'pug',
            value: 'pug'
          },
          {
            name: 'smarty',
            value: 'smarty'
          },
          {
            name: 'velocity',
            value: 'velocity'
          },
          {
            name: 'artTemplate',
            value: 'artTemplate'
          }
        ],
        default: 2
      },
      {
        type: 'confirm',
        name: 'intranet',
        message: 'Are you in the QUNAR office network?',
        default: false
      }
    ];

    return this.prompt(prompts).then(function (answers) {
      this.props.name = answers.name;
      this.props.template = answers.template;
      delete answers.name;
      assign(this.props, flattenFeature(answers));
    }.bind(this));
  },

  writing: {
    folders: function () {
      // console.log('this.props: %s', this.props);
      var folders = ['config', 'tools'];
      var pattern = '{' + folders.join( ',') + '}/**/*';
      var options = {
        cwd: this.sourceRoot()
      };
      // copy and replace template
      glob(pattern, options).forEach(function(file) {
        this.fs.copyTpl(
          this.templatePath(file),
          this.destinationPath(file),
          { props: this.props }
        );
      }.bind(this));

      // copy only
      this.fs.copy(
        this.templatePath('mock'),
        this.destinationPath('mock')
      );

      this.fs.copy(
        this.templatePath('src'),
        this.destinationPath('src')
      );

      this.fs.copy(
        this.templatePath('assets'),
        this.destinationPath('assets')
      );

    },

    packageJSON: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        { props: this.props }
      );
    },

    babelrc: function () {
      this.fs.copyTpl(
        this.templatePath('babelrc'),
        this.destinationPath('.babelrc'),
        { props: this.props }
      );
    },

    editorConfig: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
    },

    eslintrc: function () {
      this.fs.copy(
        this.templatePath('eslintrc'),
        this.destinationPath('.eslintrc')
      );
    },

    gitignore: function () {
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );
    },

    pom: function () {
      if (this.props.maven) {
        this.fs.copyTpl(
          this.templatePath('pom.xml'),
          this.destinationPath('pom.xml'),
          { props: this.props }
        );
      }
    },

    readme: function () {
      this.fs.copyTpl(
        this.templatePath('README.md'),
        this.destinationPath('README.md'),
        { props: this.props }
      );
    },

  },

  install: function () {
    var options = {
      registry: 'https://registry.npm.taobao.org',
      disturl: 'https://npm.taobao.org/dist',
      sassBinarySite: 'http://npm.taobao.org/mirrors/node-sass'
    };
    if (this.props.intranet) {
      options.registry = 'http://registry.npm.corp.qunar.com';
    }

    this.npmInstall('', options);
  },

  end: function() {
    console.log('🔚');
  }
});

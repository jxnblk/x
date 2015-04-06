
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var cssstats = require('cssstats');
var filesize = require('filesize');
var marked = require('marked');
var markedExample = require('marked-example');
var data = require('../package.json');

var tpl = _.template(fs.readFileSync(path.join(__dirname, './src/template.html'), 'utf8'));
var css = fs.readFileSync(path.join(__dirname, '../x.min.css'), 'utf8');

var renderer = new marked.Renderer();
renderer.code = markedExample({
  classes: {
    container: 'mb2 bg-darken-1 rounded',
    rendered: 'p2',
    code: 'm0 p2 bg-darken-1 rounded-bottom'
  }
});

renderer.heading = function (text, level) {
  var name = _.kebabCase(text);
  var result;
  if (level < 4) {
    result =
      '<h' + level + ' id="' + name + '">'+
      '<a href="#' + name + '">'+ text + '</a>'+
      '</h' + level + '>';
  } else {
    result = '<h' + level + '>' + text + '</h' + level + '>';
  }
  return result;
}


data.stats = cssstats(css);
data.filesize = filesize;
data.examples = marked( fs.readFileSync(path.join(__dirname, './src/examples.md'), 'utf8'), { renderer: renderer } );

var html = tpl(data);

fs.writeFileSync(path.join(__dirname, '../index.html'), html);



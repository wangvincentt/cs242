browserify www/js/main.js -o www/bundle_temp.js;
babel www/bundle_temp.js -o www/bundle.js;
rm www/bundle_temp.js

lessc www/less/entry.less www/bundle.css

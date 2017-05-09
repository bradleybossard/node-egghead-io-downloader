const fetch = require('fetch');
const async = require('async');
const cheerio = require('cheerio');
const fs = require('fs');
const exec = require('child_process').exec;
const slugify = require('slugify');

let directoryName = 'Unknown';

function pad(num, size) {
	var s = num + '';
	while (s.length < size) s = '0' + s;
	return s;
}

function sanitizeString(string) {
  return string
	  .trim()
	  .replace(/ /g, '-')
	  .replace(/\./g, '-')
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .replace(/'/g, '')
}

var q = async.queue(function(task, callback) {
	const cmd = 'youtube-dl ' + task.url + ' -o ' + task.filepath;
	const child = exec(cmd,  function (err, stdout, stderr) {
		if (err !== null) {
			console.log('exec error: ' + err);
			callback(err);
		}
		callback();
	});
}, 2);

// assign a callback
q.drain = function() {
	const cmd = 'zip -r ' + directoryName + '.zip ' + directoryName;
	const child = exec(cmd,  function (err, stdout, stderr) {
		if (err !== null) {
			console.log('exec error: ' + err);
      retrun;
		}
    console.log('All items have been processed');
	});
};


function fetchFile(url) {
  fetch.fetchUrl(url, function(err, meta, body) {
		let $ = cheerio.load(body);

    directoryName = slugify($('.f4.f3-m.f2-l.mt3.mt0-l.avenir.fw6.lh-copy.mb3.flex').text().toLowerCase());

		if (!fs.existsSync(directoryName)){
				fs.mkdirSync(directoryName);
		}

    $('.index__rowWrapper__30Oqk').each(function(i, el) {
      const videoUrl = $(el).find('.flex.bg-white.index__bgLink__2Zu5-').attr('href');
      const filename = videoUrl.substr(videoUrl.lastIndexOf('/') + 1)
      const filepath = directoryName + '/' +
											 pad(i+1, 2) + '-' +
  										 filename + '.mp4';
      console.log('videoUrl = ', videoUrl);
      console.log('  filename = ', filename);
      console.log('  filepath = ', filepath);
			q.push({url: videoUrl, filepath: filepath}, function() {
				console.log('Finished processing ' + filename);
  		});
    });
  });
}

// TODO: Verify an actual url
const url = process.argv[2];
fetchFile(url);


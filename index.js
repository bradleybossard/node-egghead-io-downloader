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

    directoryName = sanitizeString($('.title-subtitle-block .title').text());

		if (!fs.existsSync(directoryName)){
				fs.mkdirSync(directoryName);
		}

    // TODO: Add some error handling if no .cell-lesson-title rows 
    $('.lesson-row').each(function(i, el) {
      const filename = sanitizeString($(el).find('.cell-lesson-title').text()) + '.mp4';
      const filepath = directoryName + '/' +
											 pad(i+1, 2) + '-' +
  										 filename;
      const videoUrl = $(el).find('.cell-lesson-title a').attr('href');
			q.push({url: videoUrl, filepath: filepath}, function() {
				console.log('Finished processing ' + filename);
  		});
    });
  });
}

// TODO: Verify an actual url
const url = process.argv[2];
fetchFile(url);


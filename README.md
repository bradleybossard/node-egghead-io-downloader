# egghead-io-course-downloader

### Purpose

node.js script for downloading an entire egghead.io course.  Sometimes they are offered for free for a short time, and I like to watch them at 2-3 times the speed, which is a premium feature.  So I download them, then use VLC to play them back, etc.  (VLC has best keyboard shortcuts, FYI).

### Dependencies
This script requires [youtube-dl] and zip to be installed on your system.

### Installation

    npm install

### Usage

    node index.js <url>    # where <url> points to the course landing page

### Example

    node index.js https://egghead.io/courses/creating-node-js-apis-with-swagger

### Notes

Script scrapes course title, sanitizes if and uses it to create a directory name.
Then it scrapes the lesson names and santizes them to create filenames with a leading 0.
This makes it easy to sort them in a file browser and play them in order.
Lastly, the script creates a .zip file of the directory (to be revisited).

[youtube-dl]:https://rg3.github.io/youtube-dl/

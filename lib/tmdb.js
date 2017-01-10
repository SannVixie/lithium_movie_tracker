"use strict";
const jsdom = require("jsdom");
var jsonfile = require("jsonfile");

var file = "/tmp/tmdb-data.json";

let list = [];

function update(pages) {
  list = [];
  pages = pages ? pages : 3;

  console.log("tmdb: update");
  for (let page = 1; page <= pages; page++) {
    jsdom.env("https://www.themoviedb.org/discover/movie?page=" + page, [], function(err, window) {

      let movies = window.document.getElementsByClassName("item poster card");
      for (let m of movies) {
        let title = m.getElementsByClassName("title result")[0].textContent.trim();
        let year = m.getElementsByClassName("release_date")[0].textContent.trim();
        let overview = m.getElementsByClassName("overview")[0].textContent.trim();
        let image = m.getElementsByClassName("poster lazyload fade")[0].outerHTML.replace(/.*data-src="/, "").replace(/".*/, "");
        let search = "https://www.skytorrents.in/search/all/ed/1/?q=" + title.replace(/[':]/g, "") + " " + year;
        console.log("\n", title, " - ", year, "\n", overview, "\n", image);
        list.push({ title, year, overview, image, search });
      }
      jsonfile.writeFile(file, list, function(err) {
        console.error(err);
      });

    });
  }
}

jsonfile.readFile(file, function(err, obj) {
  if (err) {
    console.log(err);
  } else if (!obj) {
    console.log("tmdb: nothing loaded");
  } else {
    console.log("tmdb: loaded", obj.length);
    list = obj;
  }
  if (list.length == 0) {
    update(3);
  }
});

module.exports = {
  update,
  get: () => {
    return list;
  }
};

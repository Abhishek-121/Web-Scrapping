 let request = require("request");
 // Request module is used to send the request to the web page and bring html so that we can 
//  perform operation on the page using selectors with cheerio
let fs = require("fs");
// fs module is used to create file by taking 2 argument- path of file to be created and data(HTML)
let cheerio = require("cheerio");
const getAllMatches = require("./allMatches");
//Cheerio is used to extract specific data from an HTML file using selectors, class and ids.

let link = "https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415";

request(link, cb);

function cb(error, response, html){
  if(error == null && response.statusCode == 200){
    parseData(html);
  }
  else if(response.statusCode == 404){
    console.log("Page not found");
  }
  else{
    console.log(error);
  }
}

function parseData(html){
  let ch = cheerio.load(html);
  let aTag = ch(".widget-items.cta-link a").attr("href");
  let completeLink = "https://www.espncricinfo.com" + aTag;
  console.log(completeLink);
  getAllMatches(completeLink);
}
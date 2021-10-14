const request = require("request");
let fs = require("fs");
let cheerio = require("cheerio");
const { find } = require("cheerio/lib/api/traversing");

function getMatch(link){
  request(link, cb);
}

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
  let bothInnings = ch(".card.content-block.match-scorecard-table .Collapsible");
  for(let i=0;i<bothInnings.length;i++){
    let teamName = ch(bothInnings[i]).find("h5").text().split("INNINGS")[0].trim();
    // console.log(teamName);
    if(!teamName.includes("Team")){
      let allTrs = ch(bothInnings[i]).find(".table.batsman tbody tr");
      for(let j=0;j<allTrs.length-1;j++){
        let allTds = ch(allTrs[j]).find("td");
        if(allTds.length>1){
          let batsmanName = ch(allTds[0]).find("a").text().trim();
          let runs  = ch(allTds[2]).text().trim();
          let balls = ch(allTds[3]).text().trim();
          let fours = ch(allTds[5]).text().trim();
          let sixes = ch(allTds[6]).text().trim();
          let strikeRate = ch(allTds[7]).text().trim();
          // console.log(`Batsman = ${batsmanName} Runs = ${runs} Balls = ${balls} Fours = ${fours} Sixes = ${sixes} SR = ${strikeRate}`);
          processDetails(teamName, batsmanName, runs, balls, fours, sixes, strikeRate);
        }
      }
    }
  }
}

function checkTeamName(teamName){
  return fs.existsSync(teamName);
}

function createTeam(teamName){
  //teamname = Australia
  fs.mkdirSync(teamName);
}

function checkBatsman(teamName, batsmanName){
  let batsmanPath = `${teamName}/${batsmanName}.json`;
  return fs.existsSync(batsmanPath);
}

function updateBatsman(teamName, batsmanName, runs, balls, fours, sixes, strikeRate){
  let batsmanPath = `${teamName}/${batsmanName}.json`;
  let batsmanFile = fs.readFileSync(batsmanPath);
  // Convert batsman Stringified into original form
  batsmanFile = JSON.parse(batsmanFile);
  let inning = {
    Runs : runs, 
    Balls : balls, 
    Fours : fours, 
    Sixes : sixes,
    SR : strikeRate
  }
  console.log(Array.isArray(batsmanFile));
  batsmanFile.push(inning);
  batsmanFile = JSON.stringify(batsmanFile);
  fs.writeFileSync(batsmanPath , batsmanFile);
}

function createBatsman(teamName, batsmanName, runs, balls, fours, sixes, strikeRate){
  let batsmanPath = `${teamName}/${batsmanName}.json`;
  let batsmanFile = [];
  let inning = {
    Runs : runs,
    Balls : balls,
    Fours : fours,
    Sixes : sixes,
    SR : strikeRate
  }
  batsmanFile.push(inning);
  batsmanFile = JSON.stringify(batsmanFile);
  fs.writeFileSync(batsmanPath, batsmanFile);
}


function processDetails(teamName, batsmanName, runs, balls, fours, sixes, strikeRate){
  //Check team present or not and implement these functions with the help of fs module
  let isTeamExist = checkTeamName(teamName);
  if(isTeamExist){
    let isBatsmanExist = checkBatsman(teamName, batsmanName);
    if(isBatsmanExist){
      updateBatsman(teamName, batsmanName, runs, balls, fours, sixes, strikeRate);
    }
    else{
      createBatsman(teamName, batsmanName, runs, balls, fours, sixes, strikeRate);
    }
  }
  else{
    createTeam(teamName);
    createBatsman(teamName, batsmanName, runs, balls, fours, sixes, strikeRate);
  }
}

module.exports = getMatch;

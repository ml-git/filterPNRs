
const VerEx = require('verbal-expressions');
const indexJS = require("./index.js");
const fs = require('mz/fs');
const replace = require('replace-in-file');
const Regex = require("regex");
const faker = require('faker');
const moment = require('moment');
const argv = require('yargs').argv;
const inputDir = "./inputFiles";
const outputDir = "./outputFiles";



var findReplace = (inputDirectory) => {
    
   // var content = indexJS.readNamedFile(inputDirectory);
    const ccodeRegex = /\s[A-Z]{3}/gi;
    const allSplChrTokens = /\+|\'|\`|\t|\n|\:|@|\//gi;
    var ccodeArr = [];
    
    
    fs.readFile(inputDirectory, 'utf8').then(
            contents => {
                var docApisNameTokenArr = contents.match(ccodeRegex);
    
                //console.log(docApisNameTokenArr);
                
                 if(docApisNameTokenArr){
                    docApisNameTokenArr.forEach((tifTokensLine)=>{
                var [, iso] = tifTokensLine.split(allSplChrTokens);
                 
                  if(iso)ccodeArr.push(iso);
                    })};
                  console.log(ccodeArr); 
                  indexJS.writeParsedFile('./ccodeOut.txt', ccodeArr);
            })
    
    
    
};


findReplace('./ccodes.txt');
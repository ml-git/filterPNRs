
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

var findReplace = (inputDirectory, callback) => {

    
    const tifNameToken = "TIF+";
    const ssrDocsToken = "SSR+DOCS:HK::DL:::::/";
    const plusToken = "+";
    const slashToken = "/";
    const colonToken = ":";
    const allSplChrTokens = /\+|\'|\`|\:|@|\//gi;
    const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,9}/gi;
    const tifRegexMatcher = new Regex(/TIF+?/gm);
    const tifTokenRegex = /(TIF[:!@#\$%\^\&*\)\(+=._-]{1,4}[a-zA-Z\.\-'\s]{3,}[:!@#\$%\^\&*\)\(+=._-]*[a-zA-Z\.\-']*[:!@#\$%\^\&*\)\(+=._-]*[a-zA-Z\.\-\'\s]{3,})/gi;
    const nadAPIsTokenRegex = /(NAD[:!@#\$%\^\&*\)\(\+=._-][a-zA-Z\.\-'\s]{1,}[:!@#\$%\^\&*\)\(+=._-]*([a-zA-Z\.\-']*[:!@#\$%\^\&*\)\(+=._-]*)*(ATT)?)/gi;
    const docAPIsTokenRegex = /(DOC[':!@#\$%\^\&*\)\(\+=._-][0-9a-zA-Z\s]*([:!@#\$%\^\&*\)\(\+=._-]*[0-9a-zA-Z\s]*)*[':!@#\$%\^\&*\)\(\+=._-](DTM)?)/gi;
    // -- pre sept13 -- /(TIF[:!@#\$%\^\&*\)\(+=._-]*[a-zA-Z\.\-']*[:!@#\$%\^\&*\)\(+=._-]*[a-zA-Z\.\-']*[:!@#\$%\^\&*\)\(+=._-]*[a-zA-Z])/gi;
    // -- /(TIF\+[a-zA-Z\.\-']*\+[a-zA-Z\.\-']*\:[a-zA-Z])/gi;
    const ssrDocsHKDLRegex = /(SSR[:!@#\$%\^\&*\)\(+=._-]*DOCS(\:[\s0-9a-zA-Z]*\:)*\:*[\s0-9a-zA-Z]*(\:)*[\s0-9a-zA-Z]*(\:[\s0-9a-zA-Z]*)*\/[\s0-9a-zA-Z]*\/[\s0-9a-zA-Z]*\/[\s0-9a-zA-Z]*\/[\s0-9a-zA-Z]*\/[\s0-9a-zA-Z]*\/[\s0-9a-zA-Z]*\/[\s0-9a-zA-Z]*\/[\s0-9a-zA-Z-']*\/[\s0-9a-zA-Z-']*(\'|\/))/gi;
    // - /(SSR[:!@#\$%\^\&*\)\(+=._-]*DOCS(\:[\s0-9a-zA-Z]*\:)*\:*[\s0-9a-zA-Z]*(\:)*[\s0-9a-zA-Z]*(\:[\s0-9a-zA-Z]*)*\/[\s0-9a-zA-Z]*\/[\s0-9a-zA-Z]*\/[\s0-9a-zA-Z]*\/[\s0-9a-zA-Z]*\/[\s0-9a-zA-Z]*\/[\s0-9a-zA-Z]*\/[\s0-9a-zA-Z]*\/[\s0-9a-zA-Z-']*\/[\s0-9a-zA-Z-']*\/)/gi;
    // (SSR[:!@#\$%\^\&*\)\(+=._-]*DOCS(\:[\s0-9a-zA-Z]*\:)*\:*[\s0-9a-zA-Z]*(\:)*[\s0-9a-zA-Z]*(\:[\s0-9a-zA-Z]*)*\/[\s0-9a-zA-Z]*\/[\s0-9a-zA-Z]*\/[\s0-9a-zA-Z]*\/[\s0-9a-zA-Z]*\/[\s0-9a-zA-Z]*\/[\s0-9a-zA-Z]*\/[\s0-9a-zA-Z]*\/[\s0-9a-zA-Z-']*\/[\s0-9a-zA-Z-']*(\'|\/))
    const addIFTTokenRegex = /IFT[:!@#\$%\^\&*\)\(+=._-]*([0-9a-zA-Z\s]*\:[0-9a-zA-Z\s]*\+[0-9a-zA-Z\s]*\+[0-9a-zA-Z\s]*\+[0-9a-zA-Z\s]*)/gi;
    const addLineTokenRegex = /(ADD[:!@#\$%\^\&*\)\(\+=._]*[0-9a-zA-Z\s]*[:!@#\$%\^\&*\)\(\+=._]*[0-9a-zA-Z\s]*)/gi;
    const emailIFTTokenRegex = /IFT[:!@#\$%\^\&*\)\(\+=._]*[0-9a-zA-Z\s]*[:!@#\$%\^\&*\)\(\+=._]*[0-9a-zA-Z\s]*[:!@#\$%\^\&*\)\(\+=._]*[0-9a-zA-Z\s]*[:!@#\$%\^\&*\)\(\+=._]*[0-9a-zA-Z\s]*[:!@#\$%\^\&*\)\(\+=._]*[0-9a-zA-Z\s]*[:!@#\$%\^\&*\)\(\+=._\/]*[:!@#\$%\^\&*\)\(\+=._]*[0-9a-zA-Z\s]*(\.[a-zA-Z]{2,4})/gi;
    //  /(SSR\+DOCS(\:[a-zA-Z]*\:)*\/[a-zA-Z]\/[a-zA-Z]{3}\/[0-9]*\/\/[0-9]{2}[a-zA-Z]{3}[0-9]{2}\/[a-zA-Z]\/[0-9]{2}[a-zA-Z]{3}[0-9]{2}\/[a-zA-Z]*\/)/gi;
    //(SSR\+DOCS(\:[\s0-9a-zA-Z]*\:)*\:*[\s0-9a-zA-Z]*(\:)*[\s0-9a-zA-Z]*(\:[\s0-9a-zA-Z]*)*)\/
    const salSuffix = ['MR','MRS','JR','MS'];
    const salSuffixToken = new Regex(/(MR[S]|MR)/gm);
    const salSuffixMRSToken = new Regex(/(MRS)/);
    const salSuffixMRToken = new Regex(/(MR)/);
    const ignoreTokensAny = ['ATT','DTM','TBM MAIL','ADD','TBM MAIL TO'];
    const noTouchSegments = ['SA','SAC','SS','SSR','DAT','TKT','UNB','UNH','UNG','FO','RI','FOP','DE','SC','BE','KA','NA','JE','PA','EL','LI','IS','VISA','MC','CAN','JU','JUN','JUL','APR','EST','LIN','LO','QU','CON','CHN','HER','DING','ART','CONTAIN','CONTA','GMAIL','GMAIL\.COM','YAHOO\.COM','YAHOO','HOTMAIL','HOTMAIL\.COM','TAI','USA','CAN','GBR','TRI','AFG','ALA','Alb','ALB','Alg','DZA','Ame','ASM','And','AND','Ang','AGO','Ang','AIA','Ant','ATG','Arg','ARG','Arm','ARM','Aru','ABW','Aus','AUS','Aus','AUT','Aze','AZE','Bah','BHS','Bah','BHR','Ban','BGD','Bar','BRB','Bel','BLR','Bel','BEL','Bel','BLZ','Ben','BEN','Ber','BMU','Bhu','BTN','Bol','BOL','Bos','BIH','Bot','BWA','Bra','BRA','Bri','VGB','Bru','BRN','Bul','BGR','Bur','BFA','Bur','BDI','Cam','KHM','Cam','CMR','Can','CAN','Cap','CPV','Cay','CYM','Cen','CAF','Cha','TCD','Chi','CHL','Chi','CHN','Hon','HKG','Mac','MAC','Col','COL','Com','COM','Con','COG','Coo','COK','Cos','CRI','CIV','Cro','HRV','Cub','CUB','Cyp','CYP','Cze','CZE','Dem','PRK','Dem','COD','Den','DNK','Dji','DJI','Dom','DMA','Dom','DOM','Ecu','ECU','Egy','EGY','SLV','Equ','GNQ','Eri','ERI','Est','EST','Eth','ETH','Fae','FRO','Fal','FLK','Fij','FJI','Fin','FIN','Fra','FRA','Fre','GUF','Fre','PYF','Gab','GAB','Gam','GMB','Geo','GEO','Ger','DEU','Gha','GHA','Gib','GIB','Gre','GRC','Gre','GRL','Gre','GRD','Gua','GLP','Gua','GUM','Gua','GTM','Gue','GGY','Gui','GIN','Gui','GNB','Guy','GUY','Hai','HTI','Hol','VAT','Hon','HND','Hun','HUN','Ice','ISL','Ind','IND','Ind','IDN','Ira','IRN','Ira','IRQ','Ire','IRL','Isl','IMN','Isr','ISR','Ita','ITA','Jam','JAM','Jap','JPN','Jer','JEY','Jor','JOR','Kaz','KAZ','Ken','KEN','Kir','KIR','Kuw','KWT','Kyr','KGZ','Lao','LAO','Lat','LVA','Leb','LBN','Les','LSO','Lib','LBR','Lib','LBY','Lie','LIE','Lit','LTU','Lux','LUX','Mad','MDG','Mal','MWI','Mal','MYS','Mal','MDV','Mal','MLI','Mal','MLT','Mar','MHL','Mar','MTQ','Mau','MRT','Mau','MUS','May','MYT','Mex','MEX','Mic','FSM','Mol','MDA','Mon','MCO','Mon','MNG','Mon','MNE','Mon','MSR','Mor','MAR','Moz','MOZ','Mya','MMR','Nam','NAM','Nau','NRU','Nep','NPL','Net','NLD','Net','ANT','New','NCL','New','NZL','Nic','NIC','Nig','NER','Nig','NGA','Niu','NIU','Nor','NFK','Nor','MNP','Nor','NOR','Occ','PSE','Oma','OMN','Pak','PAK','Pal','PLW','Pan','PAN','Pap','PNG','Par','PRY','Per','PER','Phi','PHL','Pit','PCN','Pol','POL','Por','PRT','Pue','PRI','Qat','QAT','Rep','KOR','REU','Rom','ROU','Rus','RUS','Rwa','RWA','Sai','BLM','Sai','SHN','Sai','KNA','Sai','LCA','Sai','MAF','Sai','SPM','Sai','VCT','Sam','WSM','San','SMR','Sao','STP','Sau','SAU','Sen','SEN','Ser','SRB','Sey','SYC','Sie','SLE','Sin','SGP','Slo','SVK','Slo','SVN','Sol','SLB','Som','SOM','Sou','ZAF','Spa','ESP','Sri','LKA','Sud','SDN','Sur','SUR','Sva','SJM','Swa','SWZ','Swe','SWE','Swi','CHE','Syr','SYR','Taj','TJK','Tha','THA','The','MKD','Tim','TLS','Tog','TGO','Tok','TKL','Ton','TON','Tri','TTO','Tun','TUN','Tur','TUR','Tur','TKM','Tur','TCA','Tuv','TUV','Uga','UGA','Ukr','UKR','Uni','ARE','Uni','GBR','Uni','TZA','Uni','USA','Uni','VIR'
                             ,'Uru','URY','Uzb','UZB','Van','VUT','Ven','VEN','Vie','VNM','Wal','WLF','Wes','ESH','Yem','YEM','Zam','ZMB','Zim','ZWE'];

   


    const extractTIFNames = VerEx()
        .find(tifNameToken)

        .beginCapture() // lastname
        .word()
        .endCapture()
        .then(plusToken)
        .beginCapture() // firstname
        .word()
        .endCapture()
        .oneOrMore();
        
    const extractSSRDOCSTokens = VerEx()
        .find(ssrDocsToken)

        .beginCapture() // PassengerType
        .word()
        .endCapture()
        .then(slashToken)
        .beginCapture() //Country
        .word()
        .endCapture()
        .then(slashToken)
        .beginCapture() // Document
        .digit().repeatPrevious(9)
        .endCapture()
        .then(slashToken)
        .then(slashToken)
        .beginCapture() // DOB
        .digit().repeatPrevious(2)
        .word()
        .digit().repeatPrevious(2)
        .endCapture()
        .then(slashToken)
        .beginCapture() // Gender
        .word()
        .endCapture()
        .then(slashToken)
        .beginCapture() // Exp. Date
        .digit().repeatPrevious(2)
        .word()
        .digit().repeatPrevious(2)
        .endCapture()
        ;

    const replaceIOFilepath = VerEx()
        .find(inputDir);
        
        function randomBetween(min, max) {
            if (min < 0) {
                return min + Math.random() * (Math.abs(min) + max);
            }
            else {
                return min + Math.random() * max;
            }
        };
        
        function getAPastDate(){
            return (''+Math.floor(randomBetween(0, 3))) + (Math.floor(randomBetween(1, 9))) + faker.date.month().slice(0, 3) + (Math.floor(randomBetween(1, 9))) + (Math.floor(randomBetween(1, 9)));
        };
        
        function getAFutureDate(){
            return moment().add(randomBetween(1, 9), 'year').format('DDMMMYY');
        };
        
        function getADocumentNum(){
            return Math.floor(Math.random() * 1000000000);
        };
        
        function getIFTAddr(){
            return faker.address.streetAddress()+' '+faker.address.city()+' '+faker.address.stateAbbr();
        };  
            
        function getIFTAddrStreetName(){
            return faker.address.streetAddress();
        };     
      
        function getIFTEmailPrefix(){
            return 'CTCE '+(faker.internet.email().split('@'))[0];
        };
        
        function getFakerLastName(){
                    var lName = faker.name.lastName();
                    if(!lName.match('\'')) return lName;
                    else faker.name.lastName();
                };     
        
        function getFakerFirstName(){
            var fName = faker.name.firstName();
                    if(!fName.match('\'')) return fName;
                    else faker.name.firstName();
        };     
            


    var arrFiles = indexJS.getAllFiles(inputDir);
    var inputFilesArr = arrFiles;
    arrFiles.forEach((value, index, arr) => { 
        const nameTokens = {};
        arr[index] = replaceIOFilepath.replace(value, outputDir);
        
            fs.readFile(value, 'utf8').then(
            contents => {

                const count = (str, reg) => {
                    const re = reg;///TIF+?/gm;
                    return ((str || '').match(re) || []).length;
                };
               
                const times = x => f => {
                    if (x > 0) {
                        try{}catch(e){console.log(e)};
                        //f();
                        times(x - 1)(f);
                    }
                };

                var tifMatchTokenArr = contents.match(tifTokenRegex);

                if(tifMatchTokenArr){
                    tifMatchTokenArr.forEach((tifTokensLine)=>{
                    var [, lastName, firstName] = tifTokensLine.split(plusToken);
                    console.log('Names --> ' + lastName + ' // ' + firstName);

                    //strip salutations
                   if ((firstName)){
                       firstName = firstName.slice(0, -3);
                       
                        if (firstName.split(allSplChrTokens)) {
                              firstName.split(allSplChrTokens).forEach((line) => {
                                  if((line) && (line.length > 2)){
                                      firstName = line;
                                  }
                                  
                              })
                   
                      }
                       
                   }
                   
                   if ((lastName) && (lastName.match(allSplChrTokens))){
                      
                          if (lastName.split(allSplChrTokens)) {
                              lastName.split(allSplChrTokens).forEach((line) => {
                                  if((line) && (line.length > 2)){
                                      lastName = line;
                                  }
                                  
                              })
                   
                      }
                       
                   }
                
                    if ((lastName) && (!nameTokens.hasOwnProperty(lastName))) {
                        nameTokens[lastName] = getFakerLastName();
                    } // lastName

                    if ((firstName) && (!nameTokens.hasOwnProperty(firstName))) {
                        nameTokens[firstName] = getFakerFirstName();
                    } // firstName

                });
                }

                var ssrDocsTokenArr = contents.match(ssrDocsHKDLRegex);

                if(ssrDocsTokenArr){
                ssrDocsTokenArr.forEach((ssrDocsLine)=>{
                    console.log(' split is '+ssrDocsLine.split(allSplChrTokens) );
                    var [, paxType, country, docNum, , dob, gender, expDate] = ssrDocsLine.split(slashToken);
                    console.log('SSR TOKENS --> ' + paxType + ' // ' + country + ' // ' + docNum + ' // ' + dob + ' // ' + gender + ' // ' + expDate);
                    
                    if ((docNum) && (!nameTokens.hasOwnProperty(docNum))) {
                        nameTokens[docNum] = getADocumentNum();
                    }
                    if ((dob) && (!nameTokens.hasOwnProperty(dob))) {
                        nameTokens[dob] = getAPastDate();
                    }
                    if ((expDate) && (!nameTokens.hasOwnProperty(expDate))) {
                        nameTokens[expDate] = getAFutureDate();
                    }
                    
                });
                }
                
                //APIs message NAD name mask
                var nadApisNameTokenArr = contents.match(nadAPIsTokenRegex);

                if(nadApisNameTokenArr){
                nadApisNameTokenArr.forEach((ssrDocsLine)=>{
                    console.log('NAD split is '+ssrDocsLine.split(allSplChrTokens) );
                    var [, , , , lname, fname, token , ] = ssrDocsLine.split(allSplChrTokens);
                    console.log('NAD TOKENS --> ' + lname + ' // ' + fname );
                    
                    if ((lname) && (!nameTokens.hasOwnProperty(lname))) {
                        nameTokens[lname] = getFakerLastName();
                    }
                    if ((fname) && (!nameTokens.hasOwnProperty(fname))) {
                        nameTokens[fname] = getFakerFirstName();
                    }
                    // ignoreTokensParsed parsed
                    if((token)&&(!ignoreTokensAny.includes(token))&(!nameTokens.hasOwnProperty(token))){
                        nameTokens[token] = getFakerFirstName();
                    }
                    
                    // if ((expDate) && (!nameTokens.hasOwnProperty(expDate))) {
                    //     nameTokens[expDate] = getAFutureDate();
                    // }
                    
                });
                }
                
                //APIs message DOC Document mask
                var docApisNameTokenArr = contents.match(docAPIsTokenRegex);

                if(docApisNameTokenArr){
                docApisNameTokenArr.forEach((ssrDocsLine)=>{
                    console.log('DOC APIs split is '+ssrDocsLine.split(allSplChrTokens) );
                    var [ , , doc, , docMore] = ssrDocsLine.split(allSplChrTokens);
                    console.log('DOC APIs  TOKENS --> ' + doc  + ' // '+ docMore );
                    
               
                    // ignoreTokensParsed parsed
                    if((doc)&&(!ignoreTokensAny.includes(doc))&(!nameTokens.hasOwnProperty(doc))){
                        nameTokens[doc] = getADocumentNum();
                    }
                     if((docMore)&&(!ignoreTokensAny.includes(docMore))&(!nameTokens.hasOwnProperty(docMore))){
                                nameTokens[docMore] = getADocumentNum();
                            }
                    
                });
                }
                
                //IFT Address tokenization/replacement
                var addrIFTTokenArr = contents.match(addIFTTokenRegex);
                
                if(addrIFTTokenArr){
                    addrIFTTokenArr.forEach((iftAddrLine)=>{
                    console.log(' split is '+iftAddrLine.split(plusToken) );
                    var [, , , addrToken, ] = iftAddrLine.split(plusToken);
                    
                    if ((addrToken) && (!nameTokens.hasOwnProperty(addrToken))) {
                        nameTokens[addrToken] = getIFTAddr();
                    }
                    
                    });
                } // end IFT addressing token indexing
                
                //ADD Address tokenization/replacement
                var addrADDTokenArr = contents.match(addLineTokenRegex);
                
                if(addrADDTokenArr){
                    addrADDTokenArr.forEach((iftAddrLine)=>{
                    console.log(' ADD split is '+iftAddrLine.split(allSplChrTokens) );
                    var [, , , addrToken, ] = iftAddrLine.split(allSplChrTokens);
                    
                    if ((addrToken) && (!nameTokens.hasOwnProperty(addrToken))) {
                        nameTokens[addrToken] = getIFTAddrStreetName();
                    }
                    
                    // logic for long form ADD lines 
                    var randomArrADDTokens = iftAddrLine.split(allSplChrTokens);
                    
                    if(randomArrADDTokens){
                    randomArrADDTokens.forEach((value)=>{
                        console.log(' ADD long format values - '+ value);
                        
                        if((value)&&(!ignoreTokensAny.includes(value))&(!nameTokens.hasOwnProperty(value))){
                        nameTokens[value] = getFakerFirstName()+' '+getFakerLastName();
                    }
                    
                    });
                    }
                    
                    });
                } // end ADD addressing token indexing
                
                //emailIFTTokenRegex
                //Email Address tokenization
                var emailIFTTokenArr = contents.match(emailIFTTokenRegex);
                
                if(emailIFTTokenArr){
                    emailIFTTokenArr.forEach((iftAddrLine)=>{
                    console.log(' EMAIL split is '+iftAddrLine.split(allSplChrTokens) );
                    var [, , , , ,addrToken, ] = iftAddrLine.split(allSplChrTokens);
                    
                    if ((addrToken) && (!nameTokens.hasOwnProperty(addrToken))) {
                        nameTokens[addrToken] = getIFTEmailPrefix();
                    }
                    
                    });
                } // end Email addressing token indexing

                //console.log(nameTokens);
                //shelve out chars less than a certain length
                var namedTokens = [];
                Object.keys(nameTokens).forEach(key => {
                    if((key && key.trim().length <4) || noTouchSegments.includes(key)){
                        delete nameTokens[key];
                    }
                    
                });
                
                console.log(nameTokens);
                if(nameTokens.length>0){
                     //replace all tokens
                var re = new RegExp(Object.keys(nameTokens).join("|"), "gi");
                contents = contents.replace(re, function(matched) {
                    return nameTokens[matched];
                });
                    
                }
                
                indexJS.writeParsedFile(arr[index], contents);
                
            }
        )
        .catch(err => console.error(err));
        
    }); // end of arrFiles loop
    
    callback();

}; // end of FindReplace


//Delete files if option passed
// --deletePostProcessing=Yes
var delAllFilesCallback = () => {
            if (argv.deletePostProcessing=='Yes') {
             indexJS.delAllFiles(inputDir);
            }
};

findReplace(inputDir, delAllFilesCallback);

//strip-outs
// times(count(contents, /TIF+?/gm))(() => {
                //     var [, lastName, firstName] = extractTIFNames.exec(contents);
                //     console.log('ToBeReplaced --> ' + lastName + ' // ' + firstName);

                //     //strip salutations
                //   firstName = firstName.slice(0, -3);
                
                //     if (!nameTokens.hasOwnProperty(lastName)) {
                //         nameTokens[lastName] = getFakerLastName();
                //     } // lastName

                //     if (!nameTokens.hasOwnProperty(firstName)) {
                //         nameTokens[firstName] = getFakerFirstName();
                //     } // firstName

                // });

                // var matchExists =  tifRegexMatcher.exec(contents);
                // while(matchExists){
                //     var [, lastName, firstName] = extractTIFNames.exec(matchExists[0]);
                // }
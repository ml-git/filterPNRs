var fs = require('fs');
var fse = require("fs-extra");


var writeParsedFile = function(pathandlocation, data) {
    fs.writeFile(pathandlocation, data, function(err, data) {
        if (err) console.log(err);
        console.log("Successfully Written to File.");
    })
};

var readNamedFile = (fileName) => {

    return fs.readFile(fileName, 'utf8', function(err, data) {
        if (err) throw err;
        console.log(data);
        return data;
    })
} // end of readNamedFile

var getFiles = (dir) => {

    let fileList = [];

    var files = fs.readdirSync(dir);
    for (var i in files) {
        if (!files.hasOwnProperty(i)) continue;
        var name = dir + '/' + files[i];
        if (!fs.statSync(name).isDirectory()) {
            fileList.push(name);
        }
    }
    return fileList;

} // end of getFiles

var getAllFiles = (dir, fileList) => {

    fileList = fileList || [];

    var files = fs.readdirSync(dir);
    for (var i in files) {
        if (!files.hasOwnProperty(i)) continue;
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, fileList);
        }
        else {
            fileList.push(name);
        }
    }
    return fileList;
} // end of getAllFiles

var delAllFiles = (dir, fileList) => {

 fileList = fileList || [];

    var files = fs.readdirSync(dir);
    for (var i in files) {
        if (!files.hasOwnProperty(i)) continue;
        var name = dir + '/' + files[i];
        
        fse.removeSync(name); // delete the files
    }
}

module.exports = {
    readNamedFile,
    writeParsedFile,
    getAllFiles,
    delAllFiles
}

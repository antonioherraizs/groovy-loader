var songScrapper = function() {

    // start here: http://developers.grooveshark.com

    var APIkey, APIbaseURL, APIParams;
    var songs, songIDs;

    function init() {
        console.log('init');
        if (typeof(Grooveshark.addSongsByID) === "function" && 
            typeof(jQuery) === "function") {
                APIkey = "802213dd5f828fb1c25a9a4a2af52228";
                APIbaseURL = "http://tinysong.com/b/";
                APIParams = "?format=json&key=" + APIkey;
                main();
            }
    };

    function main() {
        console.log('main');
        songIDs = Array();

        // get songs paste and parse them
        // next version should improve this part
        songs = prompt("Paste the list of songs");
        var tmp = songs.replace(/  /g,',').split(',');
        songs = Array();
        for (var i = 0; i < tmp.length; i++) {
            if (tmp[i].length > 3)
                songs.push(tmp[i].trim());
        }

        if (songs.length > 0) {
            console.log("We have: " + songs.length + " songs to find");
            findSong();
        }
    };

    function findSong() {
        var song = songs.pop();
        var url = APIbaseURL + song.replace(/ /g, '+') + APIParams;
        console.log("URL: " + url);

        // make API call to tinysong (http://tinysong.com/api)
        $.get(url, function(data) {
            if (typeof(data.SongID) !== "undefined") {
                songIDs.push(data.SongID);
                console.log("We have " + songIDs.length
                    + " songIDs: " + songIDs);
            }
            processAPIResponse();
        }, "json" );
    };

    function processAPIResponse() {
        // if there are songs left, set timer for next call
        // otherwise add them to Grooveshark
        if (songs.length > 0)
            setTimeout(function() {findSong()}, 3000);
        else
            Grooveshark.addSongsByID(songIDs);
    }

    // start the magic
    init();

};songScrapper();
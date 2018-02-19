const osmosis = require('osmosis');
const async = require('async');
const util = require('util');

const TODAY_ENDPOINT = "https://my.cs.ubc.ca/m/project/";
const CALENDER_ENDPOINT = "https://my.cs.ubc.ca/space/";
const DISCOVER_ROOMS_ENDPOINT = "https://my.cs.ubc.ca/docs/project-rooms-and-dlc";
const VERIFY_TOKEN_ENDPOINT = "https://my.cs.ubc.ca/";

const WELCOME_MESSAGE = "Please log in!";


let rooms = [
	"ICCSX139",
	"ICCSX141",
	"ICCSX151",
	"ICCSX153",
	"ICCSX237",
	"ICCSX239",
	"ICCSX241",
	"ICCSX337",
	"ICCSX339",
	"ICCSX341"
];


function RoomTool(){
	this.isAuthenticated = false;
}

/**
* Stores a session cookie for CS website
*	> By running this function you may be in violation of UBC's online terms of use. I accept no responsibility for this.
*/
RoomTool.prototype.login = function(name, token, cb) {
	let cookies = {};
	cookies[name] = token;
	osmosis.config('cookies', cookies);
	osmosis
	.get(VERIFY_TOKEN_ENDPOINT)
	.set('name', 'div.panel-pane.pane-page-title.group-h1 > div > h1')
	.data(function (data) {
		if(data.name !== undefined){
			this.isAuthenticated = true;
			this.cookie = [name, token];
		}
		if(cb != null){
			cb(null, data.name);
		}

	});
}

RoomTool.prototype.getRoom = function(name, cb){
	if(!isNaN(name)){
		name = "ICCSX" + name;
	}
	let ret = {
		room: "Not found",
		bookings: []
	};

	osmosis
	.get(TODAY_ENDPOINT + name)
	.set('header', '.page-header')
	.find('.views-row')
	.set({
		'startTime': '.date-display-start',
		'endTime': '.date-display-end',
		'title': 'a'
	})
	.data(function(entry){
		if(entry.header){
			ret.room = entry.header;
		}

		if(entry.startTime){
			delete entry.header;
			ret.bookings.push(entry);
		}
	})
	.done(function(){
		ret.room = ret.room.substring(0, ret.room.indexOf(':'));
		cb(null, ret);
	})
}

RoomTool.prototype.getAllRooms = function(cb){
	async.map(rooms, this.getRoom, function(err, results) {
    	console.log(util.inspect(results, false, null));
	});
}

module.exports = new RoomTool(); 
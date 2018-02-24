# icics-rooms
Node library for finding available rooms at ICICS UBC.


## Installation 
```sh
$ npm i icics-rooms
```

## Usage
```javascript
const rooms = require('icics-rooms');

let today = rooms.getAllRooms();
for(var room = 0; room < today.length; room++){
	console.log("This room has the name " + today[room].room);
	for(var booking = 0; booking < today[room].bookings.length; booking++){
		const bookingData = today[room].bookings[booking];
		console.log("It has a booking " 
						+ "called " + bookingData.name 
						+ " from  " + bookingData.startTime 
						+ " until " + bookingData.endTime);
	}
}
```

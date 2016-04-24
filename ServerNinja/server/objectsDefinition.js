/*Drone object*/
{
	id: '01' // type string, unique id generated from device
	accuracy: 0 // type number
	latitude: 0.0, // type number
	longitude: 0.0, // type number
	height: 0.0, // type number, meters
	orientation: 'ND' // type string
	velocity: 0 // type number, meters over seconds
}

/*NFZ object*/
{
	latitude: 0.0, // type number
	longitude: 0.0, // type number
	radius: 1, // type number, the radio would be given in meters
	description: 'No description Assgined' // type string, text that describe the type o reason because is a restricted area
	created: new Date(), // created date
	updated: new Date() // updated date 
}

/*WAZ object*/
{
	latitude: 0.0, // type number
	longitude: 0.0, // type number
	radius: 1, // type number, the radio would be given in meters
	description: 'No description Assgined', // type string
	warning_levet: 'low' // type string, low, medius, high, disaster
}


/*event clientConnection send*/
{
	id: '0a', // type string, unique
	droneId: '01', // type string 
	role: 'admin/customer' // type string, two options, admin or customer
	email: 'fake@lie.com' // type string, would be in a valid email format 
}

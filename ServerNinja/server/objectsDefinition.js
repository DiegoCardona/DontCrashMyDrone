/*Drone object*/
{
	id: '01' // type string, unique id generated from device
	accuracy: 0 // type number
	latitude: 0.0, // type number
	longitude: 0.0, // type number
	height: 0.0, // type number, meters
	destination: 'ND' // type string
	velocity: 0 // type number, meters over seconds
}

/*NFZ object*/
{
	latitude: 0.0, // type number
	longitude: 0.0, // type number
	radio: 1, // type number, the radio would be given in meters
	description: 'No description Assgined' // type string, text that describe the type o reason because is a restricted area
}

/*WAZ object*/
{
	latitude: 0.0, // type number
	longitude: 0.0, // type number
	radio: 1, // type number, the radio would be given in meters
	description: 'No description Assgined', // type string
	warinig_levet: 'low' // type string, low, medius, high, disaster
}

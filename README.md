# Fly Drone Fly

Web platform to manage drones and evade dangerous zones and dangerous crashes between drones

### Socket Events


**event:** testConnection

**response:** confirmedConnection

**sent data:** ```javascript {id:'some_real_id'}```

**received data:** ok



**event:** clientConnection

**response:** connection

**sent data:** ```javascript {id: '0a', // type string, uniquedroneId: '01', // type string role: 'admin/customer' // type string, two options, admin or customeremail: 'fake@lie.com' // type string, would be in a valid email format }```

**received data:** ```javascript {Drone:{},Drones:[{}],WAZ:[{}],NFZ:[{}]}```


**event:** droneReport

**response:** report

**sent data:** ```javascript {id: '01' // type string, unique id generated from deviceaccuracy: 0 // type numberlatitude: 0.0, // type numberlongitude: 0.0, // type numberheight: 0.0, // type number, metersorientation: 'ND' // type stringvelocity: 0 // type number, meters over seconds}```

**received data:** ok


**event:** allMap

**response:** allMap

**sent data:** ```javascript {id: '0a', // type string, uniquedroneId: '01', // type string role: 'admin/customer' // type string, two options, admin or customeremail: 'fake@lie.com' // type string, would be in a valid email format }```

**received data:** ```javascript {Drone:{},Drones:[{}],WAZ:[{}],NFZ:[{}]}```


**event:** wazMap

**response:** wazMap

**sent data:** ```javascript {id: 'xx'}```

**received data:** WAZ Objects List


**event:** nfzMap

**response:** nfzMap

**sent data:** ```javascript {id: 'xx'}```

**received data:** NFZ Objects List


**event:** dronesMap

**response:** dronesMap

**sent data:** ```javascript {id: 'xx',droneId: 'current_drone_id'}```

**received data:** Drones Objects List


**event:** droneHealthy

**response:** droneHealthy

**sent data:** ```javascript {id: 'xx',droneId: 'x1x'}```

**received data:** Drone Object


### Objects Format Definition
**Drone object**
```javascript
{
	id: '01' // type string, unique id generated from device
	accuracy: 0 // type number
	latitude: 0.0, // type number
	longitude: 0.0, // type number
	height: 0.0, // type number, meters
	orientation: 'ND' // type string
	velocity: 0 // type number, meters over seconds
}
```
**NFZ object**
```javascript

{
	latitude: 0.0, // type number
	longitude: 0.0, // type number
	radius: 1, // type number, the radio would be given in meters
	description: 'No description Assgined' // type string, text that describe the type o reason because is a restricted area
}
```
**WAZ object**
```javascript
{
	latitude: 0.0, // type number
	longitude: 0.0, // type number
	radius: 1, // type number, the radio would be given in meters
	description: 'No description Assgined', // type string
	warning_levet: 'low' // type string, low, medius, high, disaster
}
```

**event clientConnection send**
```javascript
{
	id: '0a', // type string, unique
	droneId: '01', // type string 
	role: 'admin/customer' // type string, two options, admin or customer
	email: 'fake@lie.com' // type string, would be in a valid email format 
}
```

continue

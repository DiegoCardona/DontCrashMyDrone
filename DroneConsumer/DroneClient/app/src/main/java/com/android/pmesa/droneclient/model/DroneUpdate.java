package com.android.pmesa.droneclient.model;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by pablomesa on 23/04/16.
 */
public class DroneUpdate {
    double latitude;
    double longitude;
    float accuracy;
    double altitude;
    String id;
    double speed;
    float bearing;

    public DroneUpdate(double latitude, double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public float getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(float accuracy) {
        this.accuracy = accuracy;
    }

    public double getAltitude() {
        return altitude;
    }

    public void setAltitude(double altitude) {
        this.altitude = altitude;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public double getSpeed() {
        return speed;
    }

    public void setSpeed(double speed) {
        this.speed = speed;
    }

    public float getDestination() {
        return bearing;
    }

    public void setDestination(float destination) {
        this.bearing = destination;
    }

    public JSONObject getJSonFormat() throws JSONException {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("longitude", longitude);
        jsonObject.put("latitude", latitude);
        jsonObject.put("height", altitude);
        jsonObject.put("id", id);
        jsonObject.put("accuracy", accuracy);
        jsonObject.put("orientation", getBearingString());
        jsonObject.put("velocity", speed);
        return jsonObject;
    }

    public String getBearingString() {
        String directions[] = {"N", "NE", "E", "SE", "S", "SW", "NW"};
        return directions[(int) Math.round((((double) bearing % 360) / 45))];
    }
}

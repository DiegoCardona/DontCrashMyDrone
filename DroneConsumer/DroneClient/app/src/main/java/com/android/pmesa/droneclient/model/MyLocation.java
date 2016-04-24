package com.android.pmesa.droneclient.model;

import android.location.Location;

import java.util.Date;

/**
 * Created by pablomesa on 23/04/16.
 */
public class MyLocation {

    public Date date;

    Location location;

    public MyLocation(Location mLocation, Date mDate) {
        location = mLocation;
        date = mDate;
    }

    public double speed(MyLocation myLocation) {
        double distance = distance(myLocation.location.getLatitude(), myLocation.location.getLongitude(), this.location.getLatitude(), this.location.getLongitude());
        long seconds = (myLocation.date.getTime() - this.date.getTime()) / 1000;
        return distance / seconds;
    }

    private double distance(double lat1, double long1, double lat2, double long2) {
        double dlong = (long2 - long1) * (Math.PI / 180.0f);
        double dlat = (lat2 - lat1) * (Math.PI / 180.0f);
        double a = Math.pow(Math.sin(dlat / 2.0), 2)
                + Math.cos(lat1 * (Math.PI / 180.0f))
                * Math.cos(lat2 * (Math.PI / 180.0f))
                * Math.pow(Math.sin(dlong / 2.0), 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double d = 3956 * c;

        return d;
    }

    public float distanceBetween(MyLocation second) {
        long seconds = (this.date.getTime() - second.date.getTime()) / 1000;

        return this.location.distanceTo(second.location) / seconds;
    }
}


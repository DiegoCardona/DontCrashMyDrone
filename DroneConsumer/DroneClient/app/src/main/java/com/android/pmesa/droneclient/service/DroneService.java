package com.android.pmesa.droneclient.service;

import android.Manifest;
import android.app.Service;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Bundle;
import android.os.IBinder;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.ActivityCompat;
import android.util.Log;

import com.android.pmesa.droneclient.model.MyLocation;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.LocationListener;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;

import java.util.Date;

/**
 * Created by pablomesa on 23/04/16.
 */
public class DroneService extends Service implements LocationListener, GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener {

    GoogleApiClient googleApiClient;
    private LocationRequest mLocationRequest;
    private MyLocation lastLocation;
    private double speed;

    public void initGoogleApiClient() {
        googleApiClient = new GoogleApiClient.Builder(this).addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .addApi(LocationServices.API)
                .build();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onLocationChanged(Location location) {
        if (lastLocation == null) {
            lastLocation = new MyLocation(location, new Date());
        } else {
            MyLocation location1 = new MyLocation(location, new Date());
            try {
                speed = location1.distanceBetween(lastLocation);
            } catch (Exception e) {
                e.printStackTrace();
                speed = 0;
            }

        }
        Log.d("Service", "location update...");
        Log.d("Service", "altitude: " + location.hasAltitude());
        sendLocationToUI(location);
    }

    @Override
    public void onStart(Intent intent, int startId) {
        super.onStart(intent, startId);
        handleStart();
    }

    private void handleStart() {
        Log.d("Service", "Starting service..");
        initGoogleApiClient();
        googleApiClient.connect();
    }

    @Override
    public void onDestroy() {
        if (googleApiClient.isConnected())
            googleApiClient.disconnect();
    }

    @Override
    public void onConnected(@Nullable Bundle bundle) {
        Log.d("Service", "onConnected executed");
        mLocationRequest = LocationRequest.create();
        mLocationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
        mLocationRequest.setInterval(3000);
        mLocationRequest.setFastestInterval(2000);
        mLocationRequest.setSmallestDisplacement(1);
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
//            ActivityCompat.requestPermissions();
            return;
        }
        LocationServices.FusedLocationApi.requestLocationUpdates(googleApiClient, mLocationRequest,
                this);
    }

    @Override
    public void onConnectionSuspended(int i) {
        googleApiClient.connect();
    }

    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {
        Log.d("Service", "Failed");
    }

    private void sendLocationToUI(Location location) {
        double latitude = location.getLatitude();
        float accuracy = location.getAccuracy();
        double altitude = location.getAltitude();
        double longitude = location.getLongitude();
        Intent broadcast = new Intent();
        broadcast.putExtra("lat", latitude);
        broadcast.putExtra("lon", longitude);
        broadcast.putExtra("acc", accuracy);
        broadcast.putExtra("alti", altitude);
        broadcast.putExtra("speed", speed);
        broadcast.putExtra("orientation", location.getBearing());
        broadcast.setAction("latlng");
        sendBroadcast(broadcast);
    }
}

package com.android.pmesa.droneclient.ui;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.util.Log;

import com.android.pmesa.droneclient.R;
import com.android.pmesa.droneclient.model.DroneCommunication;
import com.android.pmesa.droneclient.model.DroneUpdate;
import com.android.pmesa.droneclient.service.DroneService;
import com.android.pmesa.droneclient.socketio.DroneSocket;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;

import org.json.JSONException;

public class MapsActivity extends FragmentActivity implements OnMapReadyCallback, DroneCommunication {

    private GoogleMap mMap;
    private BroadcastReceiver receiver;
    DroneSocket server;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_maps);
        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);
        Log.d("Maps", "Creating maps");
        IntentFilter filter = new IntentFilter();
        filter.addAction("latlng");
        receiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String action = intent.getAction();
                if (action.equals("latlng")) {
                    //Receives lat/lng
                    double lat = intent.getDoubleExtra("lat", 0);
                    double lon = intent.getDoubleExtra("lon", 0);
                    float acc = intent.getFloatExtra("acc", 0);
                    double speed = intent.getDoubleExtra("speed", 0);
                    double alti = intent.getDoubleExtra("alti", 0);
                    float bearing = intent.getFloatExtra("orientation", 0);
                    Log.d("Maps", "loc: " + lat + "/" + lon);
                    updateLocation(new LatLng(lat, lon), speed, alti, acc, bearing);
                }
            }
        };
        startService(new Intent(this, DroneService.class));
        registerReceiver(receiver, filter);
        server = new DroneSocket(this);
        server.connect();
        try {
            server.sendUserInformation();
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        unregisterReceiver(receiver);
        stopService(new Intent(this, DroneService.class));
        server.disconnect();
    }

    private void updateLocation(LatLng latLng, double speed, double alti, float accuracy, float bearing) {
        if (mMap != null) {
            mMap.clear();
            MarkerOptions marker = new MarkerOptions().position(latLng)
                    .title("Drone");
            mMap.addMarker(marker);
            mMap.moveCamera(CameraUpdateFactory.newLatLng(latLng));
            try {
                DroneUpdate droneUpdate = new DroneUpdate(latLng.latitude, latLng.longitude);
                droneUpdate.setAccuracy(accuracy);
                droneUpdate.setAltitude(alti);
                droneUpdate.setSpeed(speed);
                droneUpdate.setDestination(bearing);
                droneUpdate.setId("1969");
                server.sendLocation(droneUpdate.getJSonFormat());
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }


    /**
     * Manipulates the map once available.
     * This callback is triggered when the map is ready to be used.
     * This is where we can add markers or lines, add listeners or move the camera. In this case,
     * we just add a marker near Sydney, Australia.
     * If Google Play services is not installed on the device, the user will be prompted to install
     * it inside the SupportMapFragment. This method will only be triggered once the user has
     * installed Google Play services and returned to the app.
     */
    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
        LatLng initial = new LatLng(4.710989, -74.072092);
        mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(initial, 14f));
        // Add a marker in Sydney and move the camera
//        LatLng sydney = new LatLng(-34, 151);
//        mMap.addMarker(new MarkerOptions().position(sydney).title("Marker in Sydney"));
//        mMap.moveCamera(CameraUpdateFactory.newLatLng(sydney));
    }

    @Override
    public void onError() {

    }

    @Override
    public void onSuccess() {

    }
}

package com.android.pmesa.droneclient.socketio;

import android.util.Log;

import com.android.pmesa.droneclient.model.DroneCommunication;

import org.json.JSONException;
import org.json.JSONObject;

import java.net.URISyntaxException;

import io.socket.client.Ack;
import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

/**
 * Created by androiddev on 3/11/16.
 */
public class DroneSocket {
    private final static String DEBUG_TAG = DroneSocket.class.getSimpleName();
    private Socket mSocket;
    private DroneCommunication callback;
    private boolean connected;
    private String id;

    public DroneSocket(DroneCommunication callback) {
        this.callback = callback;
        setCallback(callback);
        connect();
    }

    public void connect() {
        try {
            mSocket = IO.socket("http://ec2-52-90-14-133.compute-1.amazonaws.com:3000");
            mSocket.on(Socket.EVENT_CONNECT, new Emitter.Listener() {
                @Override
                public void call(Object... args) {
                    try {
                        sendUserInformation();
                        registerEvents();
                    } catch (JSONException e) {
                        e.printStackTrace();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            });
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
    }

    public void setCallback(DroneCommunication callback) {
        this.callback = callback;
    }

    public void sendUserInformation() throws JSONException, InterruptedException {
        String id = mSocket.connect().id();
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("username", "Pablo");
        jsonObject.put("email", "pmesa@clickdelivery.com");
        jsonObject.put("id", id);
        if (jsonObject.has("id")) {
            Log.d(DEBUG_TAG, jsonObject.toString());
            mSocket.emit("userConnected", jsonObject.toString());
            mSocket.emit("testConnection", jsonObject.toString());
            connected = true;
        }
    }


    public void disconnect() {
        mSocket.disconnect();
    }


    public void registerEvents() {
        mSocket.on("confirmedConnection", new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                Log.d(DEBUG_TAG, args[0].toString());
            }
        });
        mSocket.on("report", new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                Log.d(DEBUG_TAG, args[0].toString());
            }
        });
    }

    public boolean isConnected() {
        return connected;
    }

    public void sendLocation(JSONObject drone) throws JSONException {
        Log.d(DEBUG_TAG, drone.toString());
        mSocket.emit("droneReport", drone.toString(), new Ack() {
            @Override
            public void call(Object... args) {
                Log.d(DEBUG_TAG, args[0].toString());
            }
        });
    }
}

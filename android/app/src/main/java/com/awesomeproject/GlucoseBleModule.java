// GlucoseBleModule.java

package com.awesomeproject;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.awesomeproject.Services.BluetoothGlucoseMeter;

public class GlucoseBleModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public GlucoseBleModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "GlucoseBle";
    }

    @ReactMethod
    public void sampleMethod(String stringArgument) {
        
        // BluetoothGlucoseMeter.start_service(device.address);
        BluetoothGlucoseMeter.start_service(stringArgument);
    }

}

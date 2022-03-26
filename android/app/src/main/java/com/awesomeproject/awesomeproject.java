package com.carbs;

import android.annotation.SuppressLint;
import android.app.Application;
import android.content.Context;
import android.content.ContextWrapper;
import android.content.res.Configuration;
import android.os.Build;
import android.preference.PreferenceManager;
import androidx.annotation.StringRes;
import androidx.multidex.MultiDexApplication;
import android.util.Log;

import com.carbs.Services.BluetoothGlucoseMeter;





/**
 * Created by Emma Black on 3/21/15.
 */

public class awesomeproject extends MultiDexApplication {

    private static final String TAG = "awesomeproject.java";
    @SuppressLint("StaticFieldLeak")
    private static Context context;
    private static boolean fabricInited = false;
    private static boolean bfInited = false;
    public static boolean useBF = false;
    private static Boolean isRunningTestCache;


    @Override
    public void onCreate() {
        awesomeproject.context = getApplicationContext();
        super.onCreate();
    }

    public static Context getAppContext() {
        return awesomeproject.context;
    }

    public static boolean checkAppContext(Context context) {
        if (getAppContext() == null) {
            awesomeproject.context = context;
            return false;
        } else {
            return true;
        }
    }


    public static String gs(@StringRes final int id) {
        return getAppContext().getString(id);
    }

    public static String gs(@StringRes final int id, String... args) {
        return getAppContext().getString(id, (Object[]) args);
    }

    //}
}

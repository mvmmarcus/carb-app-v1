package com.awesomeproject.Services;

import android.annotation.TargetApi;
import android.app.Service;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothManager;
import android.bluetooth.BluetoothProfile;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanFilter;
import android.bluetooth.le.ScanResult;
import android.bluetooth.le.ScanSettings;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.IBinder;
import android.os.ParcelUuid;
import android.os.PowerManager;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;
import android.util.Log;

import com.awesomeproject.awesomeproject;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentLinkedQueue;

/**
 * Created by jamorham on 09/12/2016.
 * based on code by LadyViktoria
 * <p>
 * Should support any bluetooth standard compliant meter
 * offering the Glucose Service, like the excellent
 * Contour Next One
 */

@TargetApi(Build.VERSION_CODES.KITKAT)
public class BluetoothGlucoseMeter extends Service {

    public final static String BLUETOOTH_GLUCOSE_METER_TAG = "Bluetooth Glucose Meter";

    private static final String GLUCOSE_READING_MARKER = "Glucose Reading From: ";
    private static final String TAG = BluetoothGlucoseMeter.class.getSimpleName();

    private static final UUID GLUCOSE_SERVICE = UUID.fromString("00001808-0000-1000-8000-00805f9b34fb");
    private static final UUID CURRENT_TIME_SERVICE = UUID.fromString("00001805-0000-1000-8000-00805f9b34fb");
    private static final UUID DEVICE_INFO_SERVICE = UUID.fromString("0000180a-0000-1000-8000-00805f9b34fb");
    private static final UUID CONTOUR_SERVICE = UUID.fromString("00000000-0002-11e2-9e96-0800200c9a66");

    private static final UUID CLIENT_CHARACTERISTIC_CONFIG = UUID.fromString("00002902-0000-1000-8000-00805f9b34fb");
    private static final UUID GLUCOSE_CHARACTERISTIC = UUID.fromString("00002a18-0000-1000-8000-00805f9b34fb");
    private static final UUID CONTEXT_CHARACTERISTIC = UUID.fromString("00002a34-0000-1000-8000-00805f9b34fb");
    private static final UUID RECORDS_CHARACTERISTIC = UUID.fromString("00002a52-0000-1000-8000-00805f9b34fb");
    private static final UUID TIME_CHARACTERISTIC = UUID.fromString("00002a2b-0000-1000-8000-00805f9b34fb");
    private static final UUID DATE_TIME_CHARACTERISTIC = UUID.fromString("00002a08-0000-1000-8000-00805f9b34fb");

    private static final UUID CONTOUR_1022 = UUID.fromString("00001022-0002-11e2-9e96-0800200c9a66");
    private static final UUID CONTOUR_1025 = UUID.fromString("00001025-0002-11e2-9e96-0800200c9a66");
    private static final UUID CONTOUR_1026 = UUID.fromString("00001026-0002-11e2-9e96-0800200c9a66");

    private static final UUID ISENS_TIME_SERVICE = UUID.fromString("0000fff0-0000-1000-8000-00805f9b34fb");
    private static final UUID ISENS_TIME_CHARACTERISTIC = UUID.fromString("0000fff1-0000-1000-8000-00805f9b34fb");

    private static final UUID MANUFACTURER_NAME = UUID.fromString("00002a29-0000-1000-8000-00805f9b34fb");


    private static final ConcurrentLinkedQueue<Bluetooth_CMD> queue = new ConcurrentLinkedQueue<>();
    private static final Object mLock = new Object(); // ok static?

    private static final int STATE_DISCONNECTED = 0;
    private static final int STATE_CONNECTING = 1;
    private static final int STATE_CONNECTED = 2;

    // private static final long NO_CLOCK_THRESHOLD = Constants.MINUTE_IN_MS * 70; // +- minutes

    private static final boolean d = false;
    private static final boolean ignore_control_solution_tests = true;

    private static final long SCAN_PERIOD = 10000;

    private static boolean await_acks = false;
    public static boolean awaiting_ack = false;
    public static boolean awaiting_data = false;

    private static int bondingstate = -1;
    private static long started_at = -1;

    private static BluetoothAdapter mBluetoothAdapter;
    public static String mBluetoothDeviceAddress;
    private static String mLastConnectedDeviceAddress;
    private static String mLastManufacturer = "";
    private static BluetoothGatt mBluetoothGatt;

    private static int mConnectionState = STATE_DISCONNECTED;
    private static int service_discovery_count = 0;
    private static boolean services_discovered = false;
    private static Bluetooth_CMD last_queue_command;

    private static int highestSequenceStore = 0;

    // bluetooth gatt callback
    private final BluetoothGattCallback mGattCallback = new BluetoothGattCallback() {
        @Override
        public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {

            if (newState == BluetoothProfile.STATE_CONNECTED) {

                if (mConnectionState != STATE_CONNECTED) {
                    // TODO sane release
                    mConnectionState = STATE_CONNECTED;
                    mLastConnectedDeviceAddress = gatt.getDevice().getAddress();

                     // Log.d(mLastConnectedDeviceAddress, "Connected to device");
                 

                    // Log.d(TAG, "Delay for settling");
                    waitFor(600);
                    // Log.d("Discovering services");

                    service_discovery_count = 0; // reset as new non retried connnection
                    discover_services();
                    // Bluetooth_CMD.poll_queue(); // do we poll here or on service discovery - should we clear here?
                } else {
                    // TODO timeout
                    Log.e(TAG, "Apparently already connected - ignoring");
                }
            } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
                final int old_connection_state = mConnectionState;
                mConnectionState = STATE_DISCONNECTED;
                // Log.d("Disconnected");

             
                close();
                refreshDeviceCache(mBluetoothGatt);
                Bluetooth_CMD.poll_queue();
                // attempt reconnect
                reconnect();
            }
        }


        @Override
        public void onServicesDiscovered(BluetoothGatt gatt, int status) {
            if (status == BluetoothGatt.GATT_SUCCESS) {
                services_discovered = true;
                // Log.d("Services discovered");

                bondingstate = mBluetoothGatt.getDevice().getBondState();
                if (bondingstate != BluetoothDevice.BOND_BONDED) {
                    // Log.d("Attempting to create pairing bond - device must be in pairing mode!");
                    mBluetoothGatt.getDevice().createBond();
                    waitFor(1000);
                    bondingstate = mBluetoothGatt.getDevice().getBondState();
                    if (bondingstate != BluetoothDevice.BOND_BONDED) {
                        // Log.d("Pairing appeared to fail");
                    } else {
                      //  sendDeviceUpdate(gatt.getDevice());
                    }
                } else {
                    Log.d(TAG, "Device is already bonded - good");
                }

             

                if (queue.isEmpty()) {
                    // Log.d("Requesting data from meter");

                    Bluetooth_CMD.read(DEVICE_INFO_SERVICE, MANUFACTURER_NAME, "get device manufacturer");
                    Bluetooth_CMD.read(CURRENT_TIME_SERVICE, TIME_CHARACTERISTIC, "get device time");

                    Bluetooth_CMD.notify(GLUCOSE_SERVICE, GLUCOSE_CHARACTERISTIC, "notify new glucose record");
                    Bluetooth_CMD.enable_notification_value(GLUCOSE_SERVICE, GLUCOSE_CHARACTERISTIC, "notify new glucose value");

                    Bluetooth_CMD.enable_notification_value(GLUCOSE_SERVICE, CONTEXT_CHARACTERISTIC, "notify new context value");
                    Bluetooth_CMD.notify(GLUCOSE_SERVICE, CONTEXT_CHARACTERISTIC, "notify new glucose context");

                    Bluetooth_CMD.enable_indications(GLUCOSE_SERVICE, RECORDS_CHARACTERISTIC, "readings indication request");
                    Bluetooth_CMD.notify(GLUCOSE_SERVICE, RECORDS_CHARACTERISTIC, "notify glucose record");
                    Bluetooth_CMD.write(GLUCOSE_SERVICE, RECORDS_CHARACTERISTIC, new byte[]{0x01, 0x01}, "request all readings");
                    Bluetooth_CMD.notify(GLUCOSE_SERVICE, GLUCOSE_CHARACTERISTIC, "notify new glucose record again"); // dummy

                    Bluetooth_CMD.poll_queue();

                } else {
                    Log.e(TAG, "Queue is not empty so not scheduling anything..");
                }
            } else {
                Log.w(TAG, "onServicesDiscovered received: " + status);
            }
        }

        @Override
        public void onDescriptorWrite(BluetoothGatt gatt,
                                      BluetoothGattDescriptor descriptor,
                                      int status) {
            Log.d(TAG, "Descriptor written to: " + descriptor.getUuid() + " getvalue: "  + " status: " + status);
            if (status == BluetoothGatt.GATT_SUCCESS) {
                Bluetooth_CMD.poll_queue();
            } else {
                Log.e(TAG, "Got gatt descriptor write failure: " + status);
                Bluetooth_CMD.retry_last_command(status);
            }
        }


        @Override
        public void onCharacteristicWrite(BluetoothGatt gatt,
                                          BluetoothGattCharacteristic characteristic,
                                          int status) {
            if (status == BluetoothGatt.GATT_SUCCESS) {
                if (ack_blocking()) {
                    if (d)
                        Log.d(TAG, "Awaiting ACK before next command: " + awaiting_ack + ":" + awaiting_data);
                } else {
                    Bluetooth_CMD.poll_queue();
                }
            } else {
                Log.e(TAG, "Got gatt write failure: " + status);
                Bluetooth_CMD.retry_last_command(status);
            }
        }

        @Override
        public void onCharacteristicRead(BluetoothGatt gatt,
                                         BluetoothGattCharacteristic characteristic,
                                         int status) {
            if (status == BluetoothGatt.GATT_SUCCESS) {

                Bluetooth_CMD.poll_queue();
            } else {
                Log.e(TAG, "Got gatt read failure: " + status);
                Bluetooth_CMD.retry_last_command(status);
            }
        }

        @Override
        public void onCharacteristicChanged(BluetoothGatt gatt,
                                            BluetoothGattCharacteristic characteristic) {

                Bluetooth_CMD.poll_queue();
        }
    };

    // end callback

    private BluetoothManager mBluetoothManager;
    private BluetoothLeScanner mLEScanner;
    private ScanSettings settings;
    private List<ScanFilter> filters;
    private ScanCallback mScanCallback;

    private String lastScannedDeviceAddress = "";
    // old api
    private BluetoothAdapter.LeScanCallback mLeScanCallback =
            new BluetoothAdapter.LeScanCallback() {
                @Override
                public void onLeScan(final BluetoothDevice device, int rssi,
                                     byte[] scanRecord) {

                }
            };


    private static boolean isBonded() {
        return (bondingstate == BluetoothDevice.BOND_BONDED);
    }

    private synchronized static void forgetDevice(String address) {
        Log.d(TAG, "forgetDevice() start");
        try {
            if ((mBluetoothAdapter == null) || (address == null)) return;
            final Set<BluetoothDevice> pairedDevices = mBluetoothAdapter.getBondedDevices();
            if (pairedDevices.size() > 0) {
                for (BluetoothDevice device : pairedDevices) {
                    if (device.getName() != null) {
                        if (device.getAddress().equals(address)) {
                            Log.e(TAG, "Unpairing.. " + address);
                            try {
                                Method m = device.getClass().getMethod("removeBond", (Class[]) null);
                                m.invoke(device, (Object[]) null);

                            } catch (Exception e) {
                                Log.e(TAG, e.getMessage(), e);
                            }
                        }
                    }

                }
            }
            Log.d(TAG, "forgetDevice() finished");
        } catch (Exception e) {
            Log.wtf(TAG, "Exception forgetting: " + address + " " + e);
        }
    }

    /**
     * /**
     * After using a given BLE device, the app must call this method to ensure resources are
     * released properly.
     */
    private static synchronized void close() {
        if (mBluetoothGatt == null) {
            return;
        }
        Log.d(TAG, "Closing gatt");
        mBluetoothGatt.close();
        mBluetoothGatt = null;
    }


    protected static void waitFor(final int millis) {
        synchronized (mLock) {
            try {
                Log.e(TAG, "waiting " + millis + "ms");
                mLock.wait(millis);
            } catch (final InterruptedException e) {
                Log.e(TAG, "Sleeping interrupted", e);
            }
        }
    }

    @Override
    public void onCreate() {
        super.onCreate();
        if (Build.VERSION.SDK_INT < 29) {
            final IntentFilter pairingRequestFilter = new IntentFilter(BluetoothDevice.ACTION_PAIRING_REQUEST);
            pairingRequestFilter.setPriority(IntentFilter.SYSTEM_HIGH_PRIORITY - 1);
            registerReceiver(mPairingRequestRecevier, pairingRequestFilter);
        } else {
            // UserError.Log.d(TAG, "Not registering pairing receiver on Android 10+");
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent == null) {
            stopSelf();
            return START_NOT_STICKY;
        }

        initialize();
        final String service_action = intent.getStringExtra("service_action");
        if (service_action != null) {
            if (service_action.equals("connect")) {
                // some reset method neeeded - as we don't appear to have shutdown
                close();
                mLastConnectedDeviceAddress = "";
                bondingstate = -1;
                mConnectionState = STATE_DISCONNECTED;
                scanLeDevice(false); // stop scanning
                String connect_address = intent.getStringExtra("connect_address");
                connect(connect_address);
            } else if (service_action.equals("scan")) {
                beginScan();
            } else if (service_action.equals("forget")) {
                final String forget_address = intent.getStringExtra("forget_address");
                forgetDevice(forget_address);
                beginScan();
            }
        } else {
            // default action here?
        }
        //return super.onStartCommand(intent, flags, startId);
        return START_STICKY;
    }


    @Override
    public void onDestroy() {
        super.onDestroy();
        close();
        try {
            unregisterReceiver(mPairingRequestRecevier);
        } catch (Exception e) {
            Log.e(TAG, "Error unregistering pairing receiver: " + e);
        }
        started_at = -1;
    }

    public void startup() {
        initScanCallback();
    }

    // robustly discover device services
    private synchronized void discover_services() {
        awaiting_data = false; // reset
        awaiting_ack = false;
        services_discovered = false;
        service_discovery_count++;
        if (mBluetoothGatt != null) {
            if (mConnectionState == STATE_CONNECTED) {

                mBluetoothGatt.discoverServices();
             
            } else {
                Log.e(TAG, "Cannot discover services as we are not connected");
            }
        } else {
            Log.e(TAG, "mBluetoothGatt is null!");
        }
    }

    private void reconnect() {
         Log.e(mBluetoothDeviceAddress, "Attempting reconnection:");
        connect(mBluetoothDeviceAddress);
    }

    // seriously..
    private boolean refreshDeviceCache(BluetoothGatt gatt) {
        if (gatt == null) return false;
        try {
            Method localMethod = gatt.getClass().getMethod("refresh", new Class[0]);
            if (localMethod != null) {
                return (Boolean) localMethod.invoke(gatt, new Object[0]);
            }
        } catch (Exception localException) {
            Log.e(TAG, "An exception occured while refreshing device");
        }
        return false;
    }


    private static void broadcastUpdate(final String action, final String data) {
        final Intent intent = new Intent(action);
        intent.putExtra("data", data);
        LocalBroadcastManager.getInstance(awesomeproject.getAppContext()).sendBroadcast(intent);
    }

    private static boolean ack_blocking() {
        final boolean result = await_acks && (awaiting_ack || awaiting_data);
        if (result) {
            if (d) Log.d(TAG, "Ack blocking: " + awaiting_ack + ":" + awaiting_data);
        }
        return result;
    }


    private static final BroadcastReceiver mPairingRequestRecevier = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
        }
    };

 
    @Override
    public IBinder onBind(Intent intent) {
        //return mBinder;
        throw new UnsupportedOperationException("Not yet implemented");
    }

    /**
     * Initializes a reference to the local Bluetooth adapter.
     *
     * @return Return true if the initialization is successful.
     */
    private boolean initialize() {
        // For API level 18 and above, get a reference to BluetoothAdapter through
        // BluetoothManager.
        if (mBluetoothManager == null) {
            mBluetoothManager = (BluetoothManager) getSystemService(Context.BLUETOOTH_SERVICE);
            if (mBluetoothManager == null) {
                return false;
            }
        }

        mBluetoothAdapter = mBluetoothManager.getAdapter();
        if (mBluetoothAdapter == null) {
            return false;
        }
        startup();
        return true;
    }

    /**
     * Connects to the GATT server hosted on the Bluetooth LE device.
     *
     * @param address The device address of the destination device.
     * @return Return true if the connection is initiated successfully. The connection result
     * is reported asynchronously through the
     * {@code BluetoothGattCallback#onConnectionStateChange(android.bluetooth.BluetoothGatt, int, int)}
     * callback.
     */
    private synchronized boolean connect(final String address) {
        if ((address == null) || (address.equals("00:00:00:00:00:00"))) {
            if (d) Log.d(TAG, "ignoring connect with null address");
            return false;
        }
        Log.d(TAG, "connect() called with address: " + address);
        if (mBluetoothAdapter == null) {
            Log.w(TAG, "BluetoothAdapter not initialized or unspecified address.");
            return false;
        }
    

        // Previously connected device.  Try to reconnect.
        // Log.d("Trying to connect to: " + address);
        if (mBluetoothDeviceAddress != null && address.equals(mBluetoothDeviceAddress)
                && mBluetoothGatt != null) {
            if (d) Log.d(TAG, "Trying to use an existing mBluetoothGatt for connection.");
            if (mBluetoothGatt.connect()) {
                mConnectionState = STATE_CONNECTING;
                return true;
            } else {
                return false;
            }
        }

        final BluetoothDevice device = mBluetoothAdapter.getRemoteDevice(address);
        if (device == null) {
            // Log.d("Device not found.  Unable to connect.");
            return false;
        }
        mBluetoothGatt = device.connectGatt(this, true, mGattCallback);
        refreshDeviceCache(mBluetoothGatt);
        if (d) Log.d(TAG, "Trying to create a new connection.");
        mBluetoothDeviceAddress = address;
        mConnectionState = STATE_CONNECTING;
        return true;
    }

    /**
     * Disconnects an existing connection or cancel a pending connection. The disconnection result
     * is reported asynchronously through the
     * {@code BluetoothGattCallback#onConnectionStateChange(android.bluetooth.BluetoothGatt, int, int)}
     * callback.
     */
    private void disconnect() {
        if (mBluetoothAdapter == null || mBluetoothGatt == null) {
            Log.w(TAG, "BluetoothAdapter not initialized");
            return;
        }
        mBluetoothGatt.disconnect();
    }


    /**
     * Retrieves a list of supported GATT services on the connected device. This should be
     * invoked only after {@code BluetoothGatt#discoverServices()} completes successfully.
     *
     * @return A {@code List} of supported services.
     */
    private List<BluetoothGattService> getSupportedGattServices() {
        if (mBluetoothGatt == null) return null;
        return mBluetoothGatt.getServices();
    }

    // currently not used, will need updating if it is
    @TargetApi(21)
    private void initScanCallback() {
        Log.d(TAG, "init v21 ScanCallback()");

        // v21 version
        if (Build.VERSION.SDK_INT >= 21) {
            mScanCallback = new ScanCallback() {
                @Override
                public void onScanResult(int callbackType, ScanResult result) {
                    Log.i(TAG, "onScanResult result: " + result.toString());
                    final BluetoothDevice btDevice = result.getDevice();
                    scanLeDevice(false); // stop scanning
                    connect(btDevice.getAddress());
                }

                @Override
                public void onBatchScanResults(List<ScanResult> results) {
                    for (ScanResult sr : results) {
                        Log.i("ScanResult - Results", sr.toString());
                    }
                }

                @Override
                public void onScanFailed(int errorCode) {
                    Log.e(TAG, "Scan Failed Error Code: " + errorCode);
                    if (errorCode == 1) {
                        Log.e(TAG, "Already Scanning: "); // + isScanning);
                        //isScanning = true;
                    } else if (errorCode == 2) {
                        // reset bluetooth?
                    }
                }
            };
        }
    }

    private void scanLeDevice(final boolean enable) {
        final boolean force_old = true;
        // Log.d(enable ? "Starting Scanning" + "\nMake sure meter is turned on - For pairing hold the meter power button until it flashes blue" : "Stopped Scanning");
        if (enable) {
           
            if ((Build.VERSION.SDK_INT < 21) || (force_old)) {
                Log.d(TAG, "Starting old scan");
                mBluetoothAdapter.startLeScan(mLeScanCallback);
            } else {
                mLEScanner.startScan(filters, settings, mScanCallback);
                Log.d(TAG, "Starting api21 scan");
            }
        } else {
            if ((Build.VERSION.SDK_INT < 21) || (force_old)) {
                mBluetoothAdapter.stopLeScan(mLeScanCallback);
            } else {
                mLEScanner.stopScan(mScanCallback);
            }
        }
    }

    private void beginScan() {
        if (Build.VERSION.SDK_INT >= 21) {
        

            // set up v21 scanner
            mLEScanner = mBluetoothAdapter.getBluetoothLeScanner();
            settings = new ScanSettings.Builder()
                    .setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY)
                    .build();
            filters = new ArrayList<>();

            filters.add(new ScanFilter.Builder().setServiceUuid(new ParcelUuid(GLUCOSE_SERVICE)).build());
        }
        // all api versions
        scanLeDevice(true);
    }

    public static void immortality() {
            startIfEnabled();
    }



    public static void startIfEnabled() {
      
      start_service("78:04:73:C7:55:7D");
              
    }

    // remote api for stopping
    public static void stop_service() {
        final Intent stop_intent = new Intent(awesomeproject.getAppContext(), BluetoothGlucoseMeter.class);
        awesomeproject.getAppContext().stopService(stop_intent);
    }

    // remote api for starting
    public static void start_service(String connect_address) {
        stop_service(); // is this right?
        final Intent start_intent = new Intent(awesomeproject.getAppContext(), BluetoothGlucoseMeter.class);
        if ((connect_address != null) && (connect_address.length() > 0)) {
            if (connect_address.equals("auto")) {
                connect_address = "78:04:73:C7:55:7D";
            }
            start_intent.putExtra("service_action", "connect");
            start_intent.putExtra("connect_address", connect_address);
        } else {
            start_intent.putExtra("service_action", "scan");
        }
        awesomeproject.getAppContext().startService(start_intent);
    }

    // remote api for forgetting
    public static void start_forget(String forget_address) {
        stop_service(); // is this right?
        final Intent start_intent = new Intent(awesomeproject.getAppContext(), BluetoothGlucoseMeter.class);
        if ((forget_address != null) && (forget_address.length() > 0)) {
            start_intent.putExtra("service_action", "forget");
            start_intent.putExtra("forget_address", forget_address);
            awesomeproject.getAppContext().startService(start_intent);
        }
    }

    public static void sendImmediateData(UUID service, UUID characteristic, byte[] data, String notes) {
        Log.d(TAG, "Sending immediate data: " + notes);
        Bluetooth_CMD.process_queue_entry(Bluetooth_CMD.gen_write(service, characteristic, data, notes));
    }

    private static final String PREF_HIGHEST_SEQUENCE = "bt-glucose-sequence-max-";

    private static void setHighestSequence(int sequence) {
        highestSequenceStore = sequence;
      
    }


    // jamorham bluetooth queue methodology
    private static class Bluetooth_CMD {

        final static long QUEUE_TIMEOUT = 10000;
        private static final int MAX_RESEND = 3;
        static long queue_check_scheduled = 0;
        public long timestamp;
        public String cmd;
        public byte[] data;
        public String note;
        public UUID service;
        public UUID characteristic;
        public int resent;

        private Bluetooth_CMD(String cmd, UUID service, UUID characteristic, byte[] data, String note) {
            this.cmd = cmd;
            this.service = service;
            this.characteristic = characteristic;
            this.data = data;
            this.note = note;
            this.timestamp = System.currentTimeMillis();
            this.resent = 0;
        }

        private synchronized static void add_item(String cmd, UUID service, UUID characteristic, byte[] data, String note) {
            queue.add(gen_item(cmd, service, characteristic, data, note));
        }

        private static Bluetooth_CMD gen_item(String cmd, UUID service, UUID characteristic, byte[] data, String note) {
            final Bluetooth_CMD btc = new Bluetooth_CMD(cmd, service, characteristic, data, note);
            return btc;
        }

        private static Bluetooth_CMD gen_write(UUID service, UUID characteristic, byte[] data, String note) {
            return gen_item("W", service, characteristic, data, note);
        }

        private static void write(UUID service, UUID characteristic, byte[] data, String note) {
            add_item("W", service, characteristic, data, note);
        }

        private static void read(UUID service, UUID characteristic, String note) {
            add_item("R", service, characteristic, null, note);
        }

        private static void notify(UUID service, UUID characteristic, String note) {
            add_item("N", service, characteristic, new byte[]{0x01}, note);
        }

        private static Bluetooth_CMD gen_notify(UUID service, UUID characteristic, String note) {
            return gen_item("N", service, characteristic, new byte[]{0x01}, note);
        }

        private static void unnotify(UUID service, UUID characteristic, String note) {
            add_item("U", service, characteristic, new byte[]{0x00}, note);
        }

        private static void enable_indications(UUID service, UUID characteristic, String note) {
            add_item("D", service, characteristic, BluetoothGattDescriptor.ENABLE_INDICATION_VALUE, note);
        }

        private static void enable_notification_value(UUID service, UUID characteristic, String note) {
            add_item("D", service, characteristic, BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE, note);
        }

        private static Bluetooth_CMD gen_enable_notification_value(UUID service, UUID characteristic, String note) {
            return gen_item("D", service, characteristic, BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE, note);
        }

        private static synchronized void check_queue_age() {
            queue_check_scheduled = 0;
            if (!queue.isEmpty()) {
                final Bluetooth_CMD btc = queue.peek();
                if (btc != null) {
                    long queue_age = System.currentTimeMillis() - btc.timestamp;
                    if (d) Log.d(TAG, "check queue age.. " + queue_age + " on " + btc.note);
                    if (queue_age > QUEUE_TIMEOUT) {
                        // Log.d("Timed out on: " + btc.note + (isBonded() ? "" : "\nYou may need to enable the meter's pairing mode by holding the power button when turning it on until it flashes blue"));
                        queue.clear();
                        last_queue_command = null;
                        close();
                        waitFor(3000);
                        //reconnect(); hmm we would like to reconnect here
                    }
                }
            } else {
                if (d) Log.d(TAG, "check queue age - queue is empty");
            }
        }

        private static synchronized void empty_queue() {
            queue.clear();
        }

        private static synchronized void delete_command(final UUID fromService, final UUID fromCharacteristic) {
            try {
                for (Bluetooth_CMD btc : queue) {
                    if (btc.service.equals(fromService) && btc.characteristic.equals(fromCharacteristic)) {
                        Log.d(TAG, "Removing: " + btc.note);
                        queue.remove(btc);
                        break; // currently we only ever need to do one so break for speed
                    }
                }
            } catch (Exception e) {
                Log.wtf("Got exception in delete: ", e);
            }
        }

        private static synchronized void transmute_command(final UUID fromService, final UUID fromCharacteristic,
                                                           final UUID toService, final UUID toCharacteristic) {
            try {
                for (Bluetooth_CMD btc : queue) {
                    if (btc.service.equals(fromService) && btc.characteristic.equals(fromCharacteristic)) {
                        btc.service = toService;
                        btc.characteristic = toCharacteristic;
                        Log.d(TAG, "Transmuted service: " + fromService + " -> " + toService);
                        Log.d(TAG, "Transmuted charact: " + fromCharacteristic + " -> " + toCharacteristic);
                        break; // currently we only ever need to do one so break for speed
                    }
                }
            } catch (Exception e) {
                Log.wtf("Got exception in transmute: ", e);
            }
        }

        private static synchronized void replace_command(final UUID fromService, final UUID fromCharacteristic, String type,
                                                         Bluetooth_CMD btc_replacement) {
            try {
                for (Bluetooth_CMD btc : queue) {
                    if (btc.service.equals(fromService)
                            && btc.characteristic.equals(fromCharacteristic)
                            && btc.cmd.equals(type)) {
                        btc.service = btc_replacement.service;
                        btc.characteristic = btc_replacement.characteristic;
                        btc.cmd = btc_replacement.cmd;
                        btc.data = btc_replacement.data;
                        btc.note = btc_replacement.note;
                        Log.d(TAG, "Replaced service: " + fromService + " -> " + btc_replacement.service);
                        Log.d(TAG, "Replaced charact: " + fromCharacteristic + " -> " + btc_replacement.characteristic);
                        Log.d(TAG, "Replaced     cmd: " + btc_replacement.cmd);
                        break; // currently we only ever need to do one so break for speed
                    }
                }
            } catch (Exception e) {
                Log.wtf("Got exception in replace: ", e);
            }
        }

        private static synchronized void insert_after_command(final UUID fromService, final UUID fromCharacteristic,
                                                              Bluetooth_CMD btc_replacement) {

            final ConcurrentLinkedQueue<Bluetooth_CMD> tmp_queue = new ConcurrentLinkedQueue<>();
            try {
                for (Bluetooth_CMD btc : queue) {
                    tmp_queue.add(btc);
                    if (btc.service.equals(fromService) && btc.characteristic.equals(fromCharacteristic)) {
                        if (btc_replacement != null) tmp_queue.add(btc_replacement);
                        btc_replacement = null; // first only item
                    }
                }

                queue.clear();
                queue.addAll(tmp_queue);

            } catch (Exception e) {
                Log.wtf("Got exception in insert_after: ", e);
            }
        }


        private synchronized static void poll_queue() {
            poll_queue(false);
        }

        private synchronized static void poll_queue(boolean startup) {

            if (mConnectionState == STATE_DISCONNECTED) {
                Log.e(TAG, "Connection is disconnecting, deleting queue");
                last_queue_command = null;
                queue.clear();
                return;
            }

            if (mBluetoothGatt == null) {
                Log.e(TAG, "mBluetoothGatt is null - connect and defer");
                // connect?
                // set timer?
                return;
            }
            if (startup && queue.size() > 1) {
                Log.d(TAG, "Queue busy deferring poll");
                // set timer??
                return;
            }

            final long time_now = System.currentTimeMillis();
            if ((time_now - queue_check_scheduled) > 10000) {
              
                queue_check_scheduled = time_now;
            } else {
                if (d) Log.d(TAG, "Queue check already scheduled");
            }

            if (ack_blocking()) {
                if (d) Log.d(TAG, "Queue blocked by awaiting ack");
                return;
            }

            Bluetooth_CMD btc = queue.poll();
            if (btc != null) {
               
                last_queue_command = btc;
                process_queue_entry(btc);
            } else {
                if (d) Log.d(TAG, "Queue empty");
            }
        }

        private static synchronized void retry_last_command(int status) {
            if (last_queue_command != null) {
                if (last_queue_command.resent <= MAX_RESEND) {
                    last_queue_command.resent++;
                    if (d) Log.d(TAG, "Delay before retry");
                    waitFor(200);
                    Log.d(TAG, "Retrying try:(" + last_queue_command.resent + ") last command: " + last_queue_command.note);
                    process_queue_entry(last_queue_command);
                } else {
                    Log.e(TAG, "Exceeded max resend for: " + last_queue_command.note);
                    last_queue_command = null;

                }
            } else {
                Log.d(TAG, "No last command to retry");
            }
        }


        private static void process_queue_entry(Bluetooth_CMD btc) {

            if (mBluetoothAdapter == null || mBluetoothGatt == null) {
                Log.w(TAG, "BluetoothAdapter not initialized");
                return;
            }

            BluetoothGattService service = null;
            final BluetoothGattCharacteristic characteristic;
            if (btc.service != null) service = mBluetoothGatt.getService(btc.service);
            if ((service != null) || (btc.service == null)) {
                if ((service != null) && (btc.characteristic != null)) {
                    characteristic = service.getCharacteristic(btc.characteristic);
                } else {
                    characteristic = null;
                }
                if (characteristic != null) {
                    switch (btc.cmd) {
                        case "W":
                            characteristic.setValue(btc.data);
                            if (await_acks && (characteristic.getValue().length > 1)) {
                                awaiting_ack = true;
                                awaiting_data = true;
                                if (d) Log.d(TAG, "Setting await ack blocker 1");
                            
                            }
                        
                            break;

                        case "R":
                            mBluetoothGatt.readCharacteristic(characteristic);
                            break;

                        case "N":
                            mBluetoothGatt.setCharacteristicNotification(characteristic, true);
                            waitFor(100);
                            poll_queue(); // we don't get an event from this
                            break;

                        case "U":
                            mBluetoothGatt.setCharacteristicNotification(characteristic, false);
                            break;

                        case "D":
                            final BluetoothGattDescriptor descriptor = characteristic.getDescriptor(
                                    CLIENT_CHARACTERISTIC_CONFIG);
                            descriptor.setValue(btc.data);
                            mBluetoothGatt.writeDescriptor(descriptor);
                            break;

                        default:
                            Log.e(TAG, "Unknown queue cmd: " + btc.cmd);

                    } // end switch

                } else {
                    Log.e(TAG, "Characteristic was null!!!!");
                }

            } else {
                Log.e(TAG, "Got null service error on: " + btc.service);
            }
        }

    }
}
# Connecting Wireless CCTVs & IP Cameras to TransitIntel AI

The TransitIntel AI Passenger Counting system runs entirely within the web browser to ensure privacy and low latency. Because it is a web application, it uses standard browser APIs (`navigator.mediaDevices`) to access cameras.

By default, web browsers can only access **USB webcams** or **built-in cameras** that the operating system recognizes as standard video input devices. 

If you want to use a wireless CCTV, a Wi-Fi body cam, or a local RTSP IP camera installed in a Matatu, you must route that camera's video feed into a **Virtual Camera** on the device running the TransitIntel dashboard.

Here is a step-by-step guide to achieving this using free software.

## Step 1: Connect to the Camera's Network
1. Ensure the camera (CCTV/IP Camera) is powered on.
2. Connect the laptop or tablet running the TransitIntel dashboard to the same Wi-Fi network as the camera. (Many wireless dashcams and IP cameras create their own Wi-Fi hotspot).
3. Find the camera's RTSP stream URL or IP address. It usually looks like `rtsp://192.168.1.100:554/stream1`. Refer to your camera's manual for the exact URL.

## Step 2: Install Virtual Camera Software
You need software that can read the network stream and output it as a virtual webcam. **OBS Studio** is highly recommended for this.

1. Download and install [OBS Studio](https://obsproject.com/).
2. Open OBS Studio.

## Step 3: Add the Wireless Camera to OBS
1. In OBS, go to the **Sources** box at the bottom.
2. Click the **+** button and select **Media Source** (or **VLC Video Source** if you have the VLC plugin installed).
3. Name it "CCTV Camera" and click OK.
4. Uncheck "Local File".
5. In the **Input** field, paste your camera's RTSP URL (e.g., `rtsp://admin:password@192.168.1.100:554/stream`).
6. Click OK. You should now see the live video feed from your wireless CCTV in the OBS preview window.

## Step 4: Start the Virtual Camera
1. In OBS, look at the **Controls** panel on the bottom right.
2. Click **Start Virtual Camera**.
3. OBS is now taking your wireless camera feed and tricking your computer into thinking it is a physical webcam.

## Step 5: Select the Camera in TransitIntel AI
1. Open the TransitIntel AI Dashboard in your browser (Google Chrome or Microsoft Edge recommended).
2. On the camera widget, locate the **Camera** dropdown menu in the top left corner.
3. Click the dropdown and select **OBS Virtual Camera**.
4. The TransitIntel AI will now begin counting passengers using the feed from your wireless CCTV!

---
**Troubleshooting:**
*   **Camera not showing in dropdown?** Make sure you clicked "Start Virtual Camera" in OBS, then refresh the TransitIntel dashboard.
*   **Video is lagging?** Wireless RTSP streams can sometimes have latency. In OBS, you can right-click the Media Source, go to Properties, and lower the "Network Buffering" setting.
*   **No "OBS Virtual Camera" option?** Ensure you didn't deny camera permissions in your browser. Click the lock icon in the URL bar and allow Camera access.

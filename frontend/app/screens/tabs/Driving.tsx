import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRef, useState, useEffect } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isDetecting, setIsDetecting] = useState(false);
  const [detection, setDetection] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<any>(null);

  // Backend URL - replace with your actual backend URL
  // SUBJECT TO CHANGE EVERY TIME I REOPEN THE NGROK ENDPOINT
  const BACKEND_URL = "https://upright-husky-precise.ngrok-free.app";

  // Function to capture and send image to backend
  const captureAndSendImage = async () => {
    if (cameraRef.current && !isProcessing) {
      try {
        setIsProcessing(true);

        // Take a picture
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.5,
          base64: false,
          skipProcessing: true,
        });

        // Create form data
        const formData = new FormData();
        formData.append("image", {
          uri: photo.uri,
          type: "image/jpeg",
          name: "camera_frame.jpg",
        } as any);

        // Send to your backend
        const response = await fetch(`${BACKEND_URL}/process-image`, {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const result = await response.json();
        console.log("Traffic light detection result:", result);
        setDetection(result);
      } catch (error) {
        console.error("Error capturing or sending image:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Set up interval for continuous detection
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isDetecting) {
      interval = setInterval(() => {
        captureAndSendImage();
      }, 500); // Send image every .5 milliseconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isDetecting]);

  const toggleDetection = () => {
    setIsDetecting((prevState) => !prevState);
    if (!isDetecting) {
      setDetection(null); // Clear previous detection when starting
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        {/* Guide lines for middle third */}
        <View style={[styles.guideline, { left: "33%" }]} />
        <View style={[styles.guideline, { left: "67%" }]} />

        {/* Detection result display */}
        {detection && detection.success && detection.prediction && (
          <View style={styles.detectionContainer}>
            {detection.prediction.detected ? (
              <View
                style={[
                  styles.trafficLight,
                  detection.prediction.color === "red"
                    ? styles.redLight
                    : detection.prediction.color === "green"
                    ? styles.greenLight
                    : detection.prediction.color === "yellow"
                    ? styles.yellowLight
                    : styles.unknownLight,
                ]}
              >
                <Text style={styles.lightText}>
                  {detection.prediction.color.toUpperCase()}
                </Text>
                <Text style={styles.confidenceText}>
                  {Math.round(detection.prediction.confidence * 100)}%
                </Text>
              </View>
            ) : (
              <Text style={styles.noDetectionText}>
                {detection.prediction.message}
              </Text>
            )}
          </View>
        )}

        {/* Processing indicator */}
        {isProcessing && (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              isDetecting ? styles.stopButton : styles.startButton,
            ]}
            onPress={toggleDetection}
          >
            <Text style={styles.text}>
              {isDetecting ? "Stop Detection" : "Start Detection"}
            </Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
    justifyContent: "space-between",
  },
  button: {
    alignSelf: "flex-end",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
  },
  startButton: {
    backgroundColor: "rgba(0, 153, 51, 0.6)",
  },
  stopButton: {
    backgroundColor: "rgba(204, 0, 0, 0.6)",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  guideline: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  detectionContainer: {
    position: "absolute",
    top: "10%",
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  trafficLight: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  redLight: {
    backgroundColor: "rgba(255, 0, 0, 0.8)",
  },
  yellowLight: {
    backgroundColor: "rgba(255, 255, 0, 0.8)",
  },
  greenLight: {
    backgroundColor: "rgba(0, 255, 0, 0.8)",
  },
  unknownLight: {
    backgroundColor: "rgba(100, 100, 100, 0.8)",
  },
  lightText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  confidenceText: {
    color: "#fff",
    fontSize: 14,
    marginTop: 5,
  },
  noDetectionText: {
    color: "#fff",
    fontSize: 16,
    padding: 10,
  },
  processingContainer: {
    position: "absolute",
    top: "25%",
    alignSelf: "center",
  },
});

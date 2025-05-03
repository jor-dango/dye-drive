import {
  GoBottom,
  GoTop,
  StopBottom,
  StopTop,
  YieldBottom,
  YieldTop,
} from "@/components/ui/DrivingSVGs";
import { Colors } from "@/constants/Colors";
import TypeStyles from "@/constants/TypeStyles";
import { useColorScheme } from "@/hooks/useColorScheme";
import { supabase } from "@/lib/supabase";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useRef, useState, useEffect, ReactElement } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Audio, AVPlaybackSource, AVPlaybackStatus } from "expo-av";

const SVG_HEIGHT = "15%";
type LightVisualization = {
  key: string;
  topElement: ReactElement;
  bottomElement: ReactElement;
  lightColor: string;
  lightAction: string;
  textSize: number;
};

export default function App() {
  const router = useRouter();
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isDetecting, setIsDetecting] = useState(false);
  const [detection, setDetection] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [foundError, setFoundError] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [userPrefs, setUserPrefs] = useState<{
    audioalertstyle: string;
    visualalertstyle: string;
    colorblindnesstype: string;
    id: string;
    language: string;
  } | null>(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const soundFiles: Record<
    "green" | "yellow" | "red" | "none",
    AVPlaybackSource
  > = {
    green: require("../../../assets/audio/green.m4a"),
    yellow: require("../../../assets/audio/yellow.m4a"),
    red: require("../../../assets/audio/red.m4a"),
    none: require("../../../assets/audio/none.m4a"),
  };

  const lightColors = {
    green: "#03CA03",
    yellow: "#E2B500",
    red: "#E10707",
  };
  const lightText: LightVisualization[] = [
    {
      key: "green",
      topElement: <GoTop height={SVG_HEIGHT} color={colors.secondary} />,
      bottomElement: <GoBottom height={SVG_HEIGHT} color={lightColors.green} />,
      lightColor: "GREEN",
      lightAction: "GO",
      textSize: 100,
    },
    {
      key: "yellow",
      topElement: <YieldTop height={SVG_HEIGHT} color={colors.secondary} />,
      bottomElement: (
        <YieldBottom height={SVG_HEIGHT} color={lightColors.yellow} />
      ),
      lightColor: "YELLOW",
      lightAction: "YIELD",
      textSize: 100,
    },
    {
      key: "red",
      topElement: <StopTop height={SVG_HEIGHT} color={colors.secondary} />,
      bottomElement: <StopBottom height={SVG_HEIGHT} color={lightColors.red} />,
      lightColor: "RED",
      lightAction: "STOP",
      textSize: 100,
    },
    {
      key: "", // No light detected
      topElement: (
        <View
          style={{
            width: "100%",
            height: SVG_HEIGHT,
            backgroundColor: colors.secondary,
          }}
        />
      ), // This exists just for spacing
      bottomElement: (
        <View
          style={{
            width: "100%",
            height: SVG_HEIGHT,
            backgroundColor: "#9E9E9E",
          }}
        />
      ),
      lightColor: "No light detected",
      lightAction: "No light detected",
      textSize: TypeStyles.h1.fontSize,
    },
  ];
  const [currentLight, setCurrentLight] = useState<LightVisualization[]>(
    lightText.filter((light) => light.key === "")
  );

  useEffect(() => {
    async function loadPreferences() {
      try {
        setIsLoading(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data, error } = await supabase
            .from("userprefs")
            .select("*")
            .eq("id", user.id);
          if (error) {
            Alert.alert(error.message);
            setFoundError(true);
          }
          setUserPrefs(data![0]);
        } else {
          console.error("User not found.");
          setFoundError(true);
        }
      } catch (error) {
        console.error("Error fetching user: ", error);
      } finally {
        if (foundError) {
          router.back();
        }
        setIsLoading(false);
        setFoundError(false);
      }
    }
    loadPreferences();
  }, []);

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
          quality: 0.1,
          base64: false,
          shutterSound: false,
          skipProcessing: false,
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

        // Parse JSON response
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
      }, 700); // Send image every second
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
  const lastColorRef = useRef<string | null>(null); // tracks last detected color

  // Set the current light object to whatever the model detects the light is currently
  useEffect(() => {
    const playSoundForColor = async (
      color: "green" | "yellow" | "red" | "none"
    ) => {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          soundFiles[color]
        );
        setSound(newSound);
        await newSound.playAsync();
      } catch (err) {
        console.warn("Audio playback error:", err);
      }
    };

    const detectedColor = detection?.prediction?.color as
      | "green"
      | "yellow"
      | "red"
      | null;

    if (detectedColor && detectedColor !== lastColorRef.current) {
      lastColorRef.current = detectedColor;

      setCurrentLight(lightText.filter((light) => light.key === detectedColor));

      // Play corresponding sound
      playSoundForColor(detectedColor);
    } else if (!detectedColor && lastColorRef.current !== "none") {
      lastColorRef.current = "none";

      setCurrentLight(lightText.filter((light) => light.key === ""));
      playSoundForColor("none");
    }

    console.log("Current light:", currentLight);
  }, [detection]);

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
    <View
      className="w-full h-full flex gap-4 px-5 pb-10 pt-20"
      style={{ backgroundColor: colors.background }}
    >
      <View className="flex flex-row">
        <TouchableOpacity
          className="bg-accent px-6 py-4 rounded-full"
          onPress={() => router.back()}
        >
          <Text style={[TypeStyles.p, { color: colors.text }]}>
            Finish Drive
          </Text>
        </TouchableOpacity>
      </View>

      {/* Visual Display */}
      <View
        className="w-full flex-1 rounded-2xl overflow-hidden p-3"
        style={{ backgroundColor: colors.secondary }}
      >
        <View
          className="w-full flex-1 rounded-lg overflow-hidden justify-between "
          style={{ backgroundColor: colors.background }}
        >
          {currentLight[0].topElement}
          <Text
            style={[
              TypeStyles.h1,
              {
                color: colors.text,
                textAlign: "center",
                fontSize: currentLight[0].textSize,
              },
            ]}
          >
            {userPrefs?.audioalertstyle === "action"
              ? currentLight[0].lightAction
              : currentLight[0].lightColor}
          </Text>
          {currentLight[0].bottomElement}
        </View>
      </View>

      {/* Camera Wrapper */}
      <View className="w-full aspect-video rounded-2xl overflow-hidden">
        <CameraView
          style={{ height: "100%", width: "100%" }}
          facing={facing}
          ref={cameraRef}
        ></CameraView>
      </View>

      {/* Buttons */}
      <View className="flex flex-row">
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

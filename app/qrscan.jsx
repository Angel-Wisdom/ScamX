import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function QrScan() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const handleScan = (scanningResult) => {
    if (scanned) return;
    setScanned(true);

    const data = scanningResult.data;

    // Simple fraud detection check
    if (data.includes("fraud") || data.includes("scam")) {
      setResult("⚠️ Fraudulent QR detected!");
    } else {
      setResult("✅ QR is safe!");
    }
  };

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>No access to camera</Text>
        <Button title="Allow Camera" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleScan}
        style={StyleSheet.absoluteFillObject}
      />

      {scanned && (
        <View style={styles.overlay}>
          <Text style={styles.result}>{result}</Text>
          <Button title="Scan Again" onPress={() => setScanned(false)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  result: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "white",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 8,
  },
});

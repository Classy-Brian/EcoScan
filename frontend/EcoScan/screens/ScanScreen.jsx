import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, ScrollView } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';

export default function HomeScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Camera Section Centered */}
      <View style={styles.cameraContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.camera}
        />
      </View>

      {/* Description Text Below Camera */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>EcoScan</Text>
        <Text style={styles.description}>
          EcoScan - App that lets you scan barcodes and get information on how to dispose/recycle items responsibly.
        </Text>
      </View>

      {/* Steps Below Description */}
      <View style={styles.stepsContainer}>
        <Text style={styles.stepTitle}>Steps:</Text>
        <Text style={styles.stepText}>1. Open the EcoScan app.</Text>
        <Text style={styles.stepText}>2. Scan the barcode of an item.</Text>
        <Text style={styles.stepText}>3. Get information on how to dispose/recycle the item responsibly.</Text>
        <Text style={styles.stepText}>4. Follow the disposal/recycling instructions.</Text>
      </View>

      {/* Button to Scan Again */}
      {scanned && (
        <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20, // Adds space at the bottom of the content
  },
  cameraContainer: {
    width: '100%',
    height: 400, // Adjust the camera height if necessary
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, // Space between camera and description
  },
  camera: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  textContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  stepsContainer: {
    marginTop: 30, // Adds space between description and steps
    paddingHorizontal: 20,
    alignItems: 'flex-start',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  stepText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
});

import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, ScrollView, TextInput } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native'; // Add this for navigation

export default function HomeScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const navigation = useNavigation(); // Hook for navigation

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    // Simulate barcode data from a scanned item
    const barcodeInfo = {
      barcode: data,
      quantity: '33 cl',
      packaging: 'Plastic, Bottle',
      brand: 'Sidi Ali',
      category: 'Beverages and beverages preparations, Beverages, Waters, Spring waters, Mineral waters, Unsweetened beverages, Natural mineral waters',
      country: 'Morocco',
    };
    navigation.navigate('instruction', { barcodeInfo }); // Wrap barcodeInfo in params
  };
  
  const handleManualBarcode = () => {
    if (barcodeInput) {
      setScanned(true);
      console.log(barcodeInput)
      const barcodeInfo = {
        // barcode: barcodeInput,
        id: barcodeInput
        // name: 'Sidi Ali - 33 cl',
        // quantity: '33 cl',
        // packaging: 'Plastic, Bottle',
        // brand: 'Sidi Ali',
        // category: 'Beverages and beverages preparations, Beverages, Waters, Spring waters, Mineral waters, Unsweetened beverages, Natural mineral waters',
        // country: 'Morocco',
      };
      navigation.navigate('instruction', { barcodeInfo }); // Wrap barcodeInfo in params
    }
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

      {/* Manual Barcode Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Barcode"
          value={barcodeInput}
          onChangeText={setBarcodeInput}
          keyboardType="numeric"
        />
        <Button title="Enter Barcode Manually" onPress={handleManualBarcode} />
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
    paddingBottom: 20,
  },
  cameraContainer: {
    width: '100%',
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
  inputContainer: {
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
});

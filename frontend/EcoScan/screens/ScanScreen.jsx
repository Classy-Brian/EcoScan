// app/(tabs)/scan.js

// Import necessary components and hooks from React, React Native, Expo, and Expo Router.
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, ScrollView, TextInput } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useRouter } from 'expo-router';
import axios from 'axios';

// Define the main functional component named HomeScreen.
export default function HomeScreen() {
  // State for storing whether the app has camera permission.  Starts as null (unknown).
  const [hasPermission, setHasPermission] = useState(null);

  // State for tracking whether a barcode has been scanned. Starts as false.
  const [scanned, setScanned] = useState(false);

  // State for storing the manually entered barcode. Starts as an empty string.
  const [barcodeInput, setBarcodeInput] = useState('');

  const [output, setOutput] = useState('');

  const [instruction, setInstruction] = useState('');

  // Get the router instance using the useRouter hook from expo-router.  This is used for navigation.
  const router = useRouter(); 

  // useEffect hook to request camera permissions when the component mounts.
  useEffect(() => {
    // Immediately invoked async function (IIFE) to handle the permission request.
    (async () => {
      // Request permission to use the camera for barcode scanning.
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      // Update the hasPermission state based on the permission status.
      setHasPermission(status === 'granted');
    })(); // The empty dependency array [] ensures this effect runs only once, on mount.
  }, []);


  const fetchBarcode = async (barcode) => {
    try {
      const apiUrl = `http://localhost:6968/barcode?barcode=${barcode}`;
      
      const response = await fetch(apiUrl);
  
      // Check if the response is ok (status code 200-299)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log("Fetched barcode data:", data);
  
      // You can process or display the fetched data as needed
      setOutput(data.length > 0 ? data : []);
  
    } catch (err) {
      console.error('Error fetching barcode:', err);
    }
  };

  const fetchInstructions = async (barcode) => {
    try {
      const apiUrl = `http://localhost:6968/explain?barcode=${barcode}`;
      
      const response = await fetch(apiUrl);
  
      // Check if the response is ok (status code 200-299)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data2 = await response.json();
      console.log("Fetched instruction data:", data2);
  
      // You can process or display the fetched data as needed
      setInstruction(data2.length > 0 ? data2 : []);
  
    } catch (err) {
      console.error('Error fetching instruction:', err);
    }
  };

  // Function to handle barcode scanning events.
  const handleBarCodeScanned = ({ type, data }) => {
    // Set scanned to true to indicate a barcode has been scanned.
    setScanned(true);
    fetchBarcode(data)
    console.log(barcodeInput)
    let barcode = barcodeInput; // Assign barcodeInput directly
    let packaging = 'Plastic, Bottle';
    let brand = 'Sidi Ali';
    console.log("SCANSCREEN (Manual)", { barcode, packaging, brand});
    router.push({ pathname: 'instruction', params: { barcode, packagin, brand} });
  };

  // Function to handle manual barcode entry.
  const handleManualBarcode = async () => {
    if (barcodeInput) {
        setScanned(true);


        const barcodeData = await fetchBarcode(barcodeInput);

        const instructionsData = await fetchInstructions(barcodeInput);

        // Now both output and instruction are ready
        let barcode = barcodeInput;
        let packaging = barcodeData?.materials?.[0]?.packaging || 'Unknown';
        let brand = barcodeData?.name || 'Unknown Product';
        let materials = barcodeData?.materials || [];
        let recycling_instructions = instructionsData;  // Use returned value
        let images = barcodeData?.images || [];


        console.log("SCANSCREEN (Manual)", { barcode, packaging, brand, materials, images, recycling_instructions });
        router.push({ pathname: 'instruction', params: { barcode, packaging, brand, materials, recycling_instructions, images } });
        }
    };

  // Render a loading message while waiting for permission status.
  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  // Render a message if camera access is denied.
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  // Main component rendering.
  return (
    // ScrollView allows scrolling if the content exceeds the screen height.
    // contentContainerStyle ensures content is centered even when not scrollable.
    <ScrollView contentContainerStyle={styles.container}>
      {/* Camera Section */}
      <View style={styles.cameraContainer}>
        {/* BarCodeScanner component from expo-barcode-scanner. */}
        <BarCodeScanner
          // If scanned is true, don't call handleBarCodeScanned (prevents multiple scans).
          // If scanned is false, wcall handleBarCodeScanned when a barcode is detected.
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          // Apply styles for the camera view.
          style={styles.camera}
        />
      </View>

      {/* Description Text Section */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>EcoScan</Text>
        <Text style={styles.description}>
          EcoScan - App that lets you scan barcodes and get information on how
          to dispose/recycle items responsibly.
        </Text>
      </View>

      {/* Manual Barcode Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Barcode"
          value={barcodeInput} // Controlled component: value is tied to state.
          onChangeText={setBarcodeInput} // Update state when text changes.
          keyboardType="numeric" // Show a numeric keyboard.
        />
        <Button title="Enter Barcode Manually" onPress={handleManualBarcode}/>
      </View>

      {/* Conditional "Scan Again" Button */}
      {/* Only show the button if a barcode has been scanned. */}
      {scanned && (
        <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
      )}
    </ScrollView>
  );
}

// StyleSheet for styling the components.
const styles = StyleSheet.create({
  // Styles for the main ScrollView container.
  container: {
    flexGrow: 1, // Allows the content to grow and fill available space.
    justifyContent: 'center', // Center content vertically.
    alignItems: 'center', // Center content horizontally.
    paddingBottom: 20, // Add some padding at the bottom.
  },
  // Styles for the container holding the BarCodeScanner.
  cameraContainer: {
    width: '100%',
    height: 400, // Or adjust as needed
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  // Styles for the BarCodeScanner itself (makes it fill its container).
  camera: {
    width: '100%', // Use percentages for responsiveness
    height: '100%', // Use percentages for responsiveness
    position: 'absolute', // Position absolutely within the container.
  },
  // Styles for the text container below the camera.
  textContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  // Styles for the title text.
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  // Styles for the description text.
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  // Styles for the container holding the manual barcode input.
  inputContainer: {
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  // Styles for the TextInput.
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
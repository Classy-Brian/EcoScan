import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function InstructionScreen({ route }) {
  // Destructure the barcodeInfo object from route.params
  console.log(route?.params);
  const { barcodeInfo } = route?.params || {};
  console.log(route?.params);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Item Details</Text>
      <Text style={styles.label}>Barcode ID: {barcodeInfo.id}</Text>
      <Text style={styles.label}>Item Name: {barcodeInfo.name}</Text>
      <Text style={styles.label}>Quantity: {barcodeInfo.quantity}</Text>
      <Text style={styles.label}>Packaging: {barcodeInfo.packaging}</Text>
      <Text style={styles.instructions}>
        Follow these instructions to dispose or recycle the item responsibly.
      </Text>
      {/* You can add more specific disposal instructions based on the barcode data */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  instructions: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    color: '#333',
  },
});

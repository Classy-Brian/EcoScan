import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function InstructionScreen() {
  // Destructure directly from useLocalSearchParams
  const { barcode, quantity, packaging, brand, category, country } = useLocalSearchParams();

  // Improved console log for debugging:
  console.log("Instruction Screen Params:", JSON.stringify({ barcode, quantity, packaging, brand, category, country }, null, 2));

  // You can simplify the conditional rendering since you're checking for individual variables.
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Instructions for {brand || 'Product'}</Text>

      {barcode && <Text style={styles.text}>Barcode: {barcode}</Text>}
      {quantity && <Text style={styles.text}>Quantity: {quantity}</Text>}
      {packaging && <Text style={styles.text}>Packaging: {packaging}</Text>}
      {brand && <Text style={styles.text}>Brand: {brand}</Text>}
      {category && <Text style={styles.text}>Category: {category}</Text>}
      {country && <Text style={styles.text}>Country: {country}</Text>}

      <Text style={styles.instructions}>
        Detailed recycling instructions go here.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  instructions: {
    fontSize: 16,
    marginTop: 20,
  },
});
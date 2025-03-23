import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function InstructionScreen() {
  // Get parameters from navigation
  const { barcode, packaging, brand, materials, recycling_instructions, images } = useLocalSearchParams();

  console.log("Instruction Screen Params:", JSON.stringify({ barcode, packaging, brand, materials, recycling_instructions, images }, null, 2));

  // Extract material details
  const material = materials?.[0]?.material?.replace("en:", "") || "Unknown";
  const shape = materials?.[0]?.shape?.replace("en:", "") || "Unknown";

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Instructions for {brand || 'Product'}</Text>

      {/* Centered Image */}
      <View style={styles.imageContainer}>
        {images && images.length > 0 ? (
          <Image source={{ uri: images[0] }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholder}>No Image Available</Text>
        )}
      </View>

      {/* Material Info */}
      <View style={styles.materialContainer}>
        <Text style={styles.materialText}>Material: {material}</Text>
        <Text style={styles.materialText}>Shape: {shape}</Text>
      </View>

      {/* Product Details */}
      {barcode && <Text style={styles.text}>Barcode: {barcode}</Text>}
      {packaging && <Text style={styles.text}>Packaging: {packaging}</Text>}
      {brand && <Text style={styles.text}>Brand: {brand}</Text>}

      {/* Recycling Instructions */}
      <Text style={styles.subtitle}>Recycling Instructions</Text>
      {recycling_instructions?.map((step, index) => (
        <View key={index} style={styles.stepContainer}>
          <Text style={styles.stepTitle}>{step.step}. {step.title}</Text>
          <Text style={styles.stepDescription}>{step.description}</Text>
          {step.notes && <Text style={styles.stepNotes}>Note: {step.notes}</Text>}
        </View>
      ))}

      <Text style={styles.disclaimer}>
        This information is for general guidance only. Always refer to your local recycling guidelines.
      </Text>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 3,         // Added border width for outline
    borderColor: '#333',    // Added border color for outline
  },
  image: {
    width: '80%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 10,
  },
  imagePlaceholder: {
    fontSize: 16,
    color: '#888',
  },
  materialContainer: {
    padding: 10,
    backgroundColor: '#e3e3e3',
    borderRadius: 10,
    marginBottom: 10,
  },
  materialText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  stepContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepDescription: {
    fontSize: 16,
    marginTop: 5,
  },
  stepNotes: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 5,
    color: '#555',
  },
  disclaimer: {
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
  },
});

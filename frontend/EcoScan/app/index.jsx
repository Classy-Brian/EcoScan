import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../components/Color';

export default function Index() {
  const router = useRouter(); // For navigation

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image 
        source={require('../assets/images/logo.svg')} 
        style={styles.logo} 
      />

      {/* Title */}
      <Image 
        source={require('../assets/images/logotext.svg')} 
        style={styles.logo} 
      />

      {/* Get Started Button */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/scan')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center everything vertically
    alignItems: 'center', // Center everything horizontally
    backgroundColor: colors.header, // Match background with header
  },
  logo: {
    width: 300,  // Increase size if needed
    height: 170,  // Adjust proportionally
    resizeMode: 'contain',
    marginBottom: 20, // Space between logo and title
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: colors.white, // White text for contrast
    marginBottom: 20, // Space between title and button
  },
  button: {
    backgroundColor: colors.primary, // Button color
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
});

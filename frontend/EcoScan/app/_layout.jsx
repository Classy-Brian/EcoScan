import { Image, View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router'; // Use Stack from expo-router
import { colors } from "../components/Color";
import { Tabs } from 'expo-router';


function HeaderLogo() {
  return (
    <View style={styles.logoContainer}>
      <Image
        style={styles.stretch}
        source={require('../assets/images/ecoscan_logo.png')}
      />
    </View>
  );
}

function HeaderTitle() {
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>EcoScan</Text>
    </View>
  );
}

const _layout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="(tabs)"
        options={{
          headerShown: true,
          headerLeft: () => null,
          headerBackVisible: false,
          headerRight: () => <HeaderLogo />,
          headerTitle: () => <HeaderTitle />,
          headerStyle: {
            backgroundColor: colors.header,
            position: 'relative', // Positioning for logo and title
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center', // Ensures the title is centered
          }, 
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    position: 'absolute', // Absolute positioning for the logo
    right: 20, // Adjust the position from the right edge
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stretch: {
    width: 120,
    height: 50,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black', // Set title color to black
  },
});

export default _layout;

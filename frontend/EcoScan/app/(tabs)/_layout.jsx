import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Colors } from "../../constants/Colors";
import { useColorScheme } from '../../hooks/useColorSchema';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute', // Use transparent background on iOS for blur effect
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="scan"
        options={{
          title: 'home',
        }}
      />
    </Tabs>
  );
}

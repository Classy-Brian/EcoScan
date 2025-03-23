import { Stack } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Colors } from "../../constants/Colors";
import { useColorScheme } from '../../hooks/useColorSchema';

export default function StackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="scan" />
      <Stack.Screen name="instruction" />
    </Stack>
  );
}


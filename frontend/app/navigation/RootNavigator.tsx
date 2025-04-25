import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { Stack } from 'expo-router'
import React from 'react'

function RootNavigator() {
  const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

  return (
    <Stack
    screenOptions={{
      headerShown: false
    }}
    >
      <Stack.Screen name="screens/onboarding/Welcome" />
      <Stack.Screen name="screens/onboarding/Onboarding1" />
      <Stack.Screen name="screens/onboarding/Onboarding2" />
    </Stack>
  )
}

export default RootNavigator
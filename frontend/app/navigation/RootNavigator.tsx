import { Stack } from 'expo-router'
import React from 'react'

function RootNavigator() {

  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="screens/onboarding/Welcome" />
      <Stack.Screen name="screens/onboarding/Onboarding1" />
      <Stack.Screen name="screens/onboarding/Onboarding2" />

      <Stack.Screen name="screens/tabs/Home" options={{ animation: 'none' }} />
      <Stack.Screen name="screens/tabs/Profile" options={{ animation: 'none' }} />
      <Stack.Screen name="screens/tabs/Settings" options={{ animation: 'none' }} />
    </Stack>
  )
}

export default RootNavigator
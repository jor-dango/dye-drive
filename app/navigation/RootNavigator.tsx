import { Stack } from 'expo-router'
import React from 'react'

function RootNavigator() {
  return (
    <Stack>
      <Stack.Screen name="screens/onboarding/Welcome" />
    </Stack>
  )
}

export default RootNavigator
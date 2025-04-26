import { Stack } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

function HomeNavigator() {
  return (
    <Stack>
      <Stack.Screen name="screens/tabs/Home" />
    </Stack>
  )
}

export default HomeNavigator
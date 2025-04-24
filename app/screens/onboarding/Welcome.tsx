import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react'
import { Text, View } from 'react-native'

function Welcome() {

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View className='bg-accent'>
      <Text>This is welcome</Text>
    </View>
  )
}

export default Welcome
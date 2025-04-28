import { View, Text, Animated, TouchableOpacity, useAnimatedValue } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'expo-router'
import { HomeIcon, Settings as SettingsIcon, UserRound } from 'lucide-react-native'
import { ProfileRoutes } from '@/constants/types';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

const ANIMATION_LENGTH = 350;

function Settings() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const oppositeColors = Colors[colorScheme === 'dark' ? 'light' : 'dark']; // Note that this also catches if colorScheme is null bc null is falsy
  const [buttonSelected, setButtonSelected] = useState<ProfileRoutes>('Settings');

  const fadeOutVal = useAnimatedValue(0);
  const marginRef = useRef(new Animated.Value(21));

  // Fade in everything at the beginning
  useEffect(() => {
    Animated.timing(fadeOutVal, {
      toValue: 1,
      duration: ANIMATION_LENGTH,
      useNativeDriver: true
    }).start();
  }, [])

  function fadeOutTo(route: ProfileRoutes) {
    Animated.timing(fadeOutVal, {
      toValue: 0,
      duration: ANIMATION_LENGTH,
      useNativeDriver: true
    }).start();

    if (route === 'Home')
    Animated.timing(marginRef.current, {
      toValue: 0,
      duration: ANIMATION_LENGTH,
      useNativeDriver: false
    }).start();
    setButtonSelected(route);
    console.log(route)

    // Navigate to route after animation plays
    setTimeout(
      () => router.navigate(`/screens/tabs/${route}`),
      ANIMATION_LENGTH)
  }


  return (
    <View className='w-full h-full flex gap-4 p-10 py-20' style={{ backgroundColor: colors.background }}>
      <Animated.View style={{ opacity: fadeOutVal }} className={'bg-accent w-full flex-1'}>
        <Text>Settings</Text>
      </Animated.View>

      <View className='flex flex-row w-full justify-evenly'>

        <Animated.View style={{ marginTop: marginRef.current }}>
          <TouchableOpacity
            className='p-4 border-2 rounded-full'
            style={{ borderColor: colors.text, backgroundColor: buttonSelected === "Profile" ? colors.text : oppositeColors.text }}
            onPress={() => fadeOutTo('Profile')}
          >
            <UserRound stroke={!(buttonSelected === "Profile") ? colors.text : oppositeColors.text} />
          </TouchableOpacity>
        </Animated.View>

        <View>
          <TouchableOpacity
            className='p-4 border-2 rounded-full mt-6'
            style={{ borderColor: colors.text, backgroundColor: buttonSelected === "Home" ? colors.text : oppositeColors.text }}
            onPress={() => fadeOutTo('Home')}
          >
            <HomeIcon stroke={!(buttonSelected === "Home") ? colors.text : oppositeColors.text} />
          </TouchableOpacity>
        </View>

        <Animated.View style={{ marginTop: marginRef.current }}>
          <TouchableOpacity
            className='p-4 border-2 rounded-full'
            style={{ borderColor: colors.text, backgroundColor: buttonSelected === "Settings" ? colors.text : oppositeColors.text }}
          >
            <SettingsIcon stroke={!(buttonSelected === "Settings") ? colors.text : oppositeColors.text} />
          </TouchableOpacity>
        </Animated.View>

      </View>
    </View>
  )
}

export default Settings
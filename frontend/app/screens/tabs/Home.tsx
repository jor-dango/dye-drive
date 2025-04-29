import { Colors } from '@/constants/Colors';
import { ProfileRoutes } from '@/constants/types';
import TypeStyles from '@/constants/TypeStyles';
import { useColorScheme } from '@/hooks/useColorScheme';
import { supabase } from '@/lib/supabase'
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { CircleArrowOutUpRight, HomeIcon, Settings, UserRound } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react'
import { Animated, Button, Text, TouchableOpacity, useAnimatedValue, View } from 'react-native'

const ANIMATION_LENGTH = 350;

function Home() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const oppositeColors = Colors[colorScheme === 'dark' ? 'light' : 'dark']; // Note that this also catches if colorScheme is null bc null is falsy

  const [buttonSelected, setButtonSelected] = useState<ProfileRoutes>('Home');

  const fadeOutVal = useAnimatedValue(1);
  const marginRef = useRef(new Animated.Value(0));

  useEffect(() => {
    if (router.canDismiss()) {
      router.dismissAll();
      router.replace('/screens/tabs/Home')
    }
  }, []);

  async function handlePress() {
    try {
      const { error } = await supabase.auth.signOut();
      router.navigate("/")
    }
    catch (error) {
      console.error(error);
    }
  }

  function fadeOutTo(route: ProfileRoutes) {
    Animated.timing(fadeOutVal, {
      toValue: 0,
      duration: ANIMATION_LENGTH,
      useNativeDriver: true
    }).start();

    Animated.timing(marginRef.current, {
      toValue: 21,
      duration: ANIMATION_LENGTH,
      useNativeDriver: false
    }).start();
    setButtonSelected(route);
    console.log(route)

    setTimeout(() => {
      router.navigate(`/screens/tabs/${route}`)
    }, ANIMATION_LENGTH)
    
    // Reset all values after animation plays bc back navigating doesn't reset the page ig so you gotta do that shit manually
    setTimeout(() => {
      setButtonSelected("Home");
      marginRef.current.setValue(0); 
      fadeOutVal.setValue(1);
    }, ANIMATION_LENGTH + 100)

  }

  return (
    <View className='w-full h-full flex gap-4 p-10 pt-20' style={{ backgroundColor: colors.background }}>

      {/* Main content */}
      <Animated.View className='flex-1' style={{ opacity: fadeOutVal }}>
        <Text style={[TypeStyles.h1, { color: colors.text, textAlign: 'center' }]}>Welcome back!</Text>
        <Button title="log out" onPress={handlePress} />
        <View className='flex-1' />
        <View className='w-full flex items-center gap-4'>
          <Text style={[TypeStyles.p, { color: colors.text }]}>Start a drive</Text>
          <TouchableOpacity className='w-3/4 aspect-square' onPress={() => router.navigate('/screens/tabs/Driving')}>
            <LinearGradient
              colors={['#6663A6', '#464383']}
              style={{ width: '100%', height: '100%', borderRadius: 99999, padding: 20 }}
            >
              <LinearGradient
                colors={['#464383', '#6663A6']}
                style={{ width: '100%', height: '100%', borderRadius: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <CircleArrowOutUpRight stroke={Colors['dark'].text} height={'50%'} width={'50%'} />
              </LinearGradient>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View className='flex-1' />
      </Animated.View>

      {/* Navbar */}
      <View className='flex flex-row w-full justify-evenly'>
        <Animated.View style={{ marginTop: marginRef.current }}>
          <TouchableOpacity
            className='p-4 border-2 rounded-full'
            style={{ borderColor: colors.text, backgroundColor: buttonSelected === "Profile" ? oppositeColors.background : colors.background }}
            onPress={() => fadeOutTo('Profile')}
          >
            <UserRound stroke={!(buttonSelected === "Profile") ? colors.text : oppositeColors.text} />
          </TouchableOpacity>
        </Animated.View>

        <View>
          <TouchableOpacity
            className='p-4 border-2 rounded-full mt-6'
            style={{ borderColor: colors.text, backgroundColor: buttonSelected === "Home" ? oppositeColors.background : colors.background }}
          >
            <HomeIcon stroke={!(buttonSelected === "Home") ? colors.text : oppositeColors.text} />
          </TouchableOpacity>
        </View>

        <Animated.View style={{ marginTop: marginRef.current }}>
          <TouchableOpacity
            className='p-4 border-2 rounded-full'
            style={{ borderColor: colors.text, backgroundColor: buttonSelected === "Settings" ? oppositeColors.background : colors.background }}
            onPress={() => fadeOutTo('Settings')}
          >
            <Settings stroke={!(buttonSelected === "Settings") ? colors.text : oppositeColors.text} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  )
}

export default Home
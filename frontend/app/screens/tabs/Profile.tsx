import { View, Text, Animated, TouchableOpacity, useAnimatedValue } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'expo-router'
import { HomeIcon, Settings, UserRound } from 'lucide-react-native'
import { ProfileRoutes } from '@/constants/types';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { supabase } from '@/lib/supabase';
import TypeStyles from '@/constants/TypeStyles';

const ANIMATION_LENGTH = 350;

function Profile() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const oppositeColors = Colors[colorScheme === 'dark' ? 'light' : 'dark']; // Note that this also catches if colorScheme is null bc null is falsy
  const [buttonSelected, setButtonSelected] = useState<ProfileRoutes>('Profile');
  const [loading, setLoading] = useState(false);

  const fadeOutVal = useAnimatedValue(0);
  const marginRef = useRef(new Animated.Value(21));

  // Fade in everything at the beginning
  useEffect(() => {
    Animated.timing(fadeOutVal, {
      toValue: 1,
      duration: ANIMATION_LENGTH,
      useNativeDriver: true
    }).start();
  }, []);

  async function handleLogOut() {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      router.navigate("/")
    }
    catch (error) {
      console.error(error);
    }
    finally {
      setLoading(false);
    }
  }

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
    <View className='w-full h-full flex gap-4 p-10 pt-20' style={{ backgroundColor: colors.background }}>
      <Animated.View style={{ opacity: fadeOutVal }} className={'w-full flex-1'}>
        <TouchableOpacity
          className={`${loading ? 'opacity-20' : ''} flex flex-row items-center justify-center px-[18] py-[12] mt-6 bg-accent rounded-[8] gap-3`}
          onPress={handleLogOut}
          disabled={loading}
        >
          <Text style={[TypeStyles.p, { color: colors.text }]}>Log Out</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Navbar */}
      <View className='flex flex-row w-full justify-evenly'>

        <Animated.View style={{ marginTop: marginRef.current }}>
          <TouchableOpacity
            className='p-4 border-2 rounded-full'
            style={{ borderColor: colors.text, backgroundColor: buttonSelected === "Profile" ? oppositeColors.background : colors.background }}
          >
            <UserRound stroke={!(buttonSelected === "Profile") ? colors.text : oppositeColors.text} />
          </TouchableOpacity>
        </Animated.View>

        <View>
          <TouchableOpacity
            className='p-4 border-2 rounded-full mt-6'
            style={{ borderColor: colors.text, backgroundColor: buttonSelected === "Home" ? oppositeColors.background : colors.background }}
            onPress={() => fadeOutTo('Home')}
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

export default Profile
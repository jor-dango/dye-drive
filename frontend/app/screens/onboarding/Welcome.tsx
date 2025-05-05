import { Icon, IconBackdrop } from '@/assets/images/Icon';
import { Colors } from '@/constants/Colors';
import TypeStyles from '@/constants/TypeStyles';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import React, { useEffect } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

function Welcome() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    if (router.canDismiss()) {
      router.dismissAll();
      router.replace('/screens/onboarding/Welcome')
    }
  }, [])

  return (
    <View
      className="w-full h-full flex gap-3 p-10 py-20"
      style={{ backgroundColor: colors.background }}
    >
      <View className='absolute flex w-full h-full items-center -z-10'>
        <IconBackdrop color={colors.secondary} width={'90%'}/> 
      </View>
      <Icon color={colors.text} width={'25%'} />
      <Text style={[TypeStyles.h2, { color: colors.text }]}>
        Start your journey with Dye Drive.
      </Text>
      <Text style={[TypeStyles.p, { color: colors.text }]}>
        No need to keep questioning the color of the light. Let our app take
        care of it for you.
      </Text>
      <View className="flex flex-row-reverse mt-6">
        <TouchableOpacity
          className="flex flex-row items-center px-[18] py-[12] mt-6 bg-accent rounded-[8] gap-3"
          onPress={() => router.navigate("/screens/onboarding/Login")}
        >
          <Text style={[TypeStyles.p, { color: colors.text }]}>
            Get Started
          </Text>
          <ArrowRight stroke={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Welcome;

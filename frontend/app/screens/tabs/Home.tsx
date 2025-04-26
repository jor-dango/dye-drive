import { supabase } from '@/lib/supabase'
import { Link, useRouter } from 'expo-router';
import React from 'react'
import { Button, Text, View } from 'react-native'

function Home() {
  const router = useRouter();

  async function handlePress() {
    try {
      const { error } = await supabase.auth.signOut();
      router.navigate("/")
    }
    catch (error) {
      console.error(error);
    }
  }

  return (
    <View className='bg-accent mt-20'>
      <Text>This is home</Text>
      <Button title="eweww" onPress={handlePress}/>
      <Link href="/screens/onboarding/Onboarding1">eowiqje</Link>
    </View>
  )
}

export default Home
import { supabase } from '@/lib/supabase'
import { Link, useRouter } from 'expo-router';
import React, { useEffect } from 'react'
import { Button, Text, View } from 'react-native'

function Home() {
  const router = useRouter();


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

  return (
    <View className='p-10 py-20'>
      <Text>This is home</Text>
      <Button title="log out" onPress={handlePress} />
      <Link href="/screens/onboarding/Onboarding1">eowiqje</Link>
    </View>
  )
}

export default Home
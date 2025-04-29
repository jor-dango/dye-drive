import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js';
import { Redirect } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, View } from 'react-native';

function EntryPoint() {
  const [user, setUser] = useState<User | null>();
  const [finishedPrefs, setFinishedPrefs] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        console.log("found user as ", user)
        setUser(user);

        if (user) {
          
          const { count, error } = await supabase
          .from('userprefs')
          .select('*', { count: 'exact', head: true })
          .not('visualalertstyle', 'is', null)
          .eq('id', user.id);

          if (count === 1) { // This is true if the preferences are done being completed because the row exists AND visualalertstyle isnt null
            setFinishedPrefs(true);
          }

          if (error) {
            Alert.alert(error.message);
          }
        }
      }
      catch (error) {
        console.error("Error fetching user: ", error);
      }
      finally {
        setIsLoading(false);
      }
    }
    checkUser();
  }, [])

  if (isLoading) {
    return <View className='h-full w-full' />
  }

  if (finishedPrefs) {
    return <Redirect href="/screens/tabs/Home" />
  }

  // This triggers when the user exists (acct already made) but they haven't finished setting their prefs
  if (user) {
    return <Redirect href="/screens/onboarding/Onboarding1" />
  }

  return <Redirect href="/screens/onboarding/Welcome" />
}

export default EntryPoint
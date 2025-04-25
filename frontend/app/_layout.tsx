import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

import './global.css'
import RootNavigator from './navigation/RootNavigator';
import { DMSans_500Medium, DMSans_500Medium_Italic, DMSans_600SemiBold, DMSans_600SemiBold_Italic, DMSans_700Bold, DMSans_700Bold_Italic } from '@expo-google-fonts/dm-sans';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    DMSans_500Medium,
    DMSans_500Medium_Italic,
    DMSans_600SemiBold,
    DMSans_600SemiBold_Italic,
    DMSans_700Bold,
    DMSans_700Bold_Italic
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator/> {/* This is fake news, the real entry point is not this but in app/index.tsx */}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

import { View, Text, Animated, TouchableOpacity, useAnimatedValue, ScrollView, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'expo-router'
import { ArrowRight, Check, ChevronDown, HomeIcon, Settings as SettingsIcon, UserRound } from 'lucide-react-native'
import { AudioAlertTypes, ProfileRoutes, VisualAlertTypes } from '@/constants/types';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import TypeStyles from '@/constants/TypeStyles';
import { audioAlertStyles, deficiencies, langs, visualAlertStyles } from '@/constants/PreferenceVals';
import { SelectList } from 'react-native-dropdown-select-list';
import { supabase } from '@/lib/supabase';

const ANIMATION_LENGTH = 350;

function Settings() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const oppositeColors = Colors[colorScheme === 'dark' ? 'light' : 'dark']; // Note that this also catches if colorScheme is null bc null is falsy

  const [selectedAudioAlert, setSelectedAudioAlert] = useState<AudioAlertTypes | null>(null);
  const [selectedVisualAlert, setSelectedVisualAlert] = useState<VisualAlertTypes | null>(null);
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [selectedDeficiency, setSelectedDeficiency] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [foundError, setFoundError] = useState(false);

  const hasMounted = useRef(false);
  const [isChanged, setIsChanged] = useState(false);

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
    console.log(isChanged)
  }, [])

  useEffect(() => {
    if (hasMounted.current) {
      setIsChanged(true);
    }
    else {
      hasMounted.current = true;
    }
  }, [selectedLang, selectedDeficiency, selectedAudioAlert, selectedVisualAlert]);

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

  async function updatePreferences() {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase
        .from('userprefs')
        .update({
          language: selectedLang,
          colorblindnesstype: selectedDeficiency,
          audioalertstyle: selectedAudioAlert,
          visualalertstyle: selectedVisualAlert
        })
        .eq('id', user.id);
      if (error) {
        Alert.alert(error.message);
        setFoundError(true);
      }
    }
    else {
      console.error("User not found.");
      setFoundError(true);
    }

    if (foundError === false) {
      router.navigate("/screens/tabs/Home")
    }
    setFoundError(false);
    setLoading(false);
  }

  return (
    <View className='w-full h-full flex gap-4 p-10 pt-20' style={{ backgroundColor: colors.background }}>
      <Animated.View style={{ opacity: fadeOutVal }} className={'w-full flex-1 gap-8'}>

        {/* Save Button */}
        <View className='flex flex-row'>
          <TouchableOpacity
            className={`${(loading || !isChanged) ? 'opacity-20' : ''} flex flex-row items-center justify-between px-[18] py-[12] mt-6 bg-accent rounded-[8] gap-3`}
            onPress={updatePreferences}
            disabled={!isChanged}
          >
            <Text style={[TypeStyles.p, { color: colors.text }]}>Save</Text>
            <Check stroke={colors.text} />
          </TouchableOpacity>
        </View>

        {/* All the preferences */}
        <ScrollView className='flex-1' contentContainerStyle={{ display: 'flex', gap: 32 }}>
          <View className='flex gap-2'>
            <Text style={[TypeStyles.h3, { color: colors.text }]}>Select an audio alert style</Text>
            {audioAlertStyles.map((alertType) =>
              <TouchableOpacity
                key={alertType.ref}
                style={{ borderColor: colors.text, backgroundColor: (selectedAudioAlert === alertType.ref ? oppositeColors.background : undefined) }}
                onPress={() => setSelectedAudioAlert(alertType.ref)}
                className={`flex p-4 border rounded-2xl`}
              >
                <Text style={[TypeStyles.p, { color: (selectedAudioAlert === alertType.ref ? oppositeColors.text : colors.text) }]}>{alertType.text}</Text>
                {alertType.secondaryText ?
                  <Text style={TypeStyles.p} className='text-textsecondary'>{alertType.secondaryText}</Text>
                  :
                  null
                }
              </TouchableOpacity>
            )}
          </View>
          <View className='flex gap-2'>
            <Text style={[TypeStyles.h3, { color: colors.text }]}>Select a visual alert style</Text>
            {visualAlertStyles.map((alertType) =>
              <TouchableOpacity
                key={alertType.ref}
                style={{ borderColor: colors.text, backgroundColor: (selectedVisualAlert === alertType.ref ? oppositeColors.background : undefined) }}
                onPress={() => setSelectedVisualAlert(alertType.ref)}
                className={`flex p-4 border rounded-2xl`}
              >
                <Text style={[TypeStyles.p, { color: (selectedVisualAlert === alertType.ref ? oppositeColors.text : colors.text) }]}>{alertType.text}</Text>
              </TouchableOpacity>
            )}
          </View>
          <View className='flex gap-2'>
            <Text style={[TypeStyles.h3, { color: colors.text }]}>Select a language</Text>
            <SelectList
              setSelected={(val: string) => setSelectedLang(val)}
              data={langs}
              save="key"
              arrowicon={<ChevronDown color={colors.text} />}
              search={false}
              boxStyles={{ borderColor: colors.text, alignItems: "center" }}
              inputStyles={{ color: colors.text }}
              dropdownTextStyles={{ color: colors.text }}
            />
          </View>
          <View className='flex gap-2'>
            <Text style={[TypeStyles.h3, { color: colors.text }]}>Select your colorblindness</Text>
            <SelectList
              setSelected={(val: string) => setSelectedDeficiency(val)}
              data={deficiencies}
              save="key"
              arrowicon={<ChevronDown color={colors.text} />}
              search={false}
              boxStyles={{ borderColor: colors.text, alignItems: "center" }}
              inputStyles={{ color: colors.text }}
              dropdownTextStyles={{ color: colors.text }}
            />
          </View>
        </ScrollView>
      </Animated.View>

      {/* Navbar */}
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
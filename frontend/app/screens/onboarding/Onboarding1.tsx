import { Colors } from '@/constants/Colors';
import TypeStyles from '@/constants/TypeStyles';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';
import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react-native';
import React, { useEffect, useState } from 'react'
import { Alert, Button, TouchableOpacity } from 'react-native';
import { Text, useColorScheme, View } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list';


function Onboarding1() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [selectedDeficiency, setSelectedDeficiency] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [foundError, setFoundError] = useState(false);  

  const langs = [
    {
      key: "en",
      value: "English"
    },
    {
      key: "es",
      value: "Spanish"
    },
  ];

  const deficiencies = [
    {
      key: "deuteranopia",
      value: "Deuteranopia"
    },
    {
      key: "tritanopia",
      value: "Tritanopia"
    },
  ];

    useEffect(() => {
      if (router.canDismiss()) {
        router.dismissAll();
        router.replace('/screens/onboarding/Onboarding1')
      }
    }, [])

  async function handleOnboarding() {
    setLoading(true);

    if (selectedLang === null || selectedDeficiency === null) {
      Alert.alert("Please select your preferences.")
      setLoading(false);
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Check if the user already has entries; ie. has already started the onboarding process
      const { count, error } = await supabase
        .from('userprefs')
        .select('*', { count: 'exact', head: true })
        .eq('id', user.id);

      if (count !== 0) { // If they have, just update their preferences
        const { error } = await supabase
          .from('userprefs')
          .update({
            language: selectedLang,
            colorblindnesstype: selectedDeficiency
          })
          .eq('id', user.id);
        if (error) {
          Alert.alert(error.message);
          setFoundError(true);
        }
      }
      else { // Otherwise, make a new row      
        const { error } = await supabase
          .from('userprefs')
          .insert({
            id: user.id,
            language: selectedLang,
            colorblindnesstype: selectedDeficiency
          })

        if (error) {
          Alert.alert(error.message);
          setFoundError(true);
        }
      }
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
      router.navigate("/screens/onboarding/Onboarding2")
    }
    setFoundError(false);
    setLoading(false);
  }

  return (
    <View className='w-full h-full flex gap-8 p-10 py-20' style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View className='flex gap-4 mb-4'>
        <View className='flex flex-row gap-4'>
          <View className='bg-accent w-2' />
          <Text style={[TypeStyles.h1, { color: colors.text }]}>Let's get to know you.</Text>
        </View>
        <Text style={[TypeStyles.p, { color: colors.text }]}>You can always change this at a later date.</Text>
      </View>

      {/* Dropdowns */}
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


      <View className='mt-auto flex flex-row gap-6 '>
        <TouchableOpacity
          className='flex flex-row items-center py-[12] mt-6 gap-3'
          onPress={() => router.back()}
        >
          <ArrowLeft stroke={"#737A8D"} />
          <Text className='text-textsecondary' style={TypeStyles.p}>Go Back</Text>
        </TouchableOpacity>
        <View className='flex flex-1'>
          <TouchableOpacity
            className={`${loading ? 'opacity-20' : ''} flex flex-row items-center justify-between px-[18] py-[12] mt-6 bg-accent rounded-[8] gap-3`}
            onPress={handleOnboarding}
            disabled={loading}
          >
            <Text style={[TypeStyles.p, { color: colors.text }]}>Continue</Text>
            <ArrowRight stroke={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Onboarding1
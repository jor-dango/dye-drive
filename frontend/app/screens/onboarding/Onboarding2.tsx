import { Colors } from '@/constants/Colors';
import { audioAlertStyles, visualAlertStyles } from '@/constants/PreferenceVals';
import { AudioAlertTypes, VisualAlertTypes } from '@/constants/types';
import TypeStyles from '@/constants/TypeStyles';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import React, { useState } from 'react'
import { Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Text, useColorScheme, View } from 'react-native'



function Onboarding2() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const oppositeColors = Colors[colorScheme === 'dark' ? 'light' : 'dark']; // Note that this also catches if colorScheme is null bc null is falsy
  const router = useRouter();
  const [selectedAudioAlert, setSelectedAudioAlert] = useState<AudioAlertTypes | null>(null);
  const [selectedVisualAlert, setSelectedVisualAlert] = useState<VisualAlertTypes | null>(null);
  const [loading, setLoading] = useState(false);
  const [foundError, setFoundError] = useState(false);

  async function handleOnboarding() {
    setLoading(true);

    if (selectedAudioAlert === null || selectedVisualAlert === null) {
      Alert.alert("Please select your preferences.")
      setLoading(false);
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase
        .from('userprefs')
        .update({
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
    <View className='w-full h-full flex gap-8 p-10 py-20' style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View className='flex gap-4 mb-4'>
        <View className='flex flex-row gap-4'>
          <View className='bg-accent w-2' />
          <Text style={[TypeStyles.h1, { color: colors.text }]}>How should we alert you?</Text>
        </View>
        <Text style={[TypeStyles.p, { color: colors.text }]}>You can always change this at a later date.</Text>
      </View>

      {/* Options */}
      <ScrollView contentContainerStyle={{display: 'flex', gap: 32}}>
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
      </ScrollView>


      <View className='mt-auto flex flex-row gap-6'>
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

export default Onboarding2
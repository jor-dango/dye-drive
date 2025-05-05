import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState, TouchableOpacity, Text } from 'react-native'
import { supabase } from '../lib/supabase'
import { Button, Input } from '@rneui/themed'
import { useRouter } from 'expo-router'
import { useColorScheme } from '@/hooks/useColorScheme'
import { Colors } from '@/constants/Colors'
import TypeStyles from '@/constants/TypeStyles'

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})

export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? "light"];
    const router = useRouter();

    async function signInWithEmail() {
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error)
            Alert.alert(error.message)
        else {
            router.navigate("/")
        }
        setLoading(false)
    }

    async function signUpWithEmail() {
        setLoading(true)
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if (error) Alert.alert(error.message)
        if (!session) Alert.alert('Please check your inbox for email verification!')
        setLoading(false)
    }

    return (
        <View
            className="w-full h-full flex gap-4 px-5 pb-10 pt-20"
            style={{ backgroundColor: colors.background }}
        >
            <Text style={[TypeStyles.h1, { color: colors.text }]}>Sign In</Text>
            <Input
                label="Email"
                onChangeText={(text) => setEmail(text)}
                value={email}
                placeholder="email@address.com"
                autoCapitalize={'none'}
                style={[TypeStyles.p, { color: colors.text }]}
            />
            <Input
                label="Password"
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry={true}
                placeholder="Enter password here"
                autoCapitalize={'none'}
                style={[TypeStyles.p, { color: colors.text }]}
            />
            <View className='flex gap-2'>
                <TouchableOpacity
                    className={`${loading ? 'opacity-20' : ''} flex flex-row items-center justify-center px-[18] py-[12] mt-6 bg-accent rounded-[8] gap-3`}
                    onPress={() => signInWithEmail()}
                    disabled={loading}
                >
                    <Text style={[TypeStyles.p, { color: colors.text }]}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`${loading ? 'opacity-20' : ''} flex flex-row items-center justify-center px-[18] py-[12] mt-6 border border-accent rounded-[8] gap-3`}
                    onPress={() => signUpWithEmail()}
                    disabled={loading}
                >
                    <Text style={[TypeStyles.p, { color: colors.text }]}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        padding: 12,
    },
    verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: 'stretch',
    },
    mt20: {
        marginTop: 20,
    },
})
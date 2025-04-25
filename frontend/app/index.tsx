import { Redirect } from 'expo-router'
import React from 'react'

function EntryPoint() {
  return (
    true ?
    <Redirect href="/screens/onboarding/Welcome"/>
    :
    <Redirect href="/screens/tabs/Home"/>
  )
}

export default EntryPoint
import { Platform, StyleSheet } from "react-native";

// DMSans_500Medium,
// DMSans_500Medium_Italic,
// DMSans_600SemiBold,
// DMSans_600SemiBold_Italic,
// DMSans_700Bold,
// DMSans_700Bold_Italic

export default StyleSheet.create({
  h1: {
    fontSize: 48,
    fontFamily: Platform.select({
      android: 'DMSans_700Bold',
      ios: 'DMSans-Bold'
    })
  },
  h2: {
    fontSize: 36,
    fontFamily: Platform.select({
      android: 'DMSans_700Bold',
      ios: 'DMSans-Bold'
    })
  },
  h3: {
    fontSize: 24,
    fontFamily: Platform.select({
      android: 'DMSans_600Semibold',
      ios: 'DMSans-SemiBold'
    })
  },
  p: {
    fontSize: 16,
    fontFamily: Platform.select({
      android: 'DMSans_500Medium',
      ios: 'DMSans-Medium'
    })
  }
})
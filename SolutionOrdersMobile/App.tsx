import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import Greeting from './src/components/Greeting';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView>
        <Greeting name="Anna" age={25} />
        <Greeting name="Piotr" isVip={true} />
        <Greeting name="Kasia" age={30} isVip={true} />
        <Greeting name="Jan" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default App;
import { View, Text, Button } from 'react-native'
import { useRouter } from 'expo-router'
import React from 'react'

const Home = () => {
  const router = useRouter();
  return (
    <View style={{
      flex: 1,
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Text>Bem vindo ao Offline App</Text>
      <Button title='Entrar' onPress={() => router.push('./login')}></Button>
      <Text>Primeira vez? Registre-se.</Text>
      <Button title='Registrar-se'></Button>
    </View>
  )
}

export default Home
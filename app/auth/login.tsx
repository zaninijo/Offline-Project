import { View, Text, TextInput, Button, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useAuth } from '@/context/auth'
import { useRouter } from 'expo-router'

const Login = () => {
  const router = useRouter()

  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('Erros aqui...')

  const handleLogin = async () => {
    try {
      await login(email, password)
      router.replace("/app")
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <View style={{
      flex: 1,
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10
    }}>
      <TextInput style={style.inputBox}
        placeholder='E-mail' textContentType='emailAddress' value={email} onChangeText={(text) => setEmail(text)}
      ></TextInput>
      <TextInput style={style.inputBox}
        placeholder='Senha' textContentType='password' value={password} onChangeText={(text) => setPassword(text)}
      ></TextInput>
      <Text style={style.inputBox}>{error}</Text>
      <Button 
        title='Entrar' onPress={() => handleLogin()}
      ></Button>
    </View>
  )
}

const style = StyleSheet.create({
  inputBox: {
    height: 50,
    borderColor: "#000000",
    borderStyle: 'solid',
    borderWidth: 2,
    width: '100%',
    paddingHorizontal: 10,
  }
})

export default Login
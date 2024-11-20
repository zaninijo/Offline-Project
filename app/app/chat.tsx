import { View, Text, Button, TextInput, FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import api from '@/util/composeApiUrl'
import { useAuth } from '@/context/auth'
import { RNWebSocket } from '@/types/rn-websocket'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface ChatSession {
  path: string,
  key: string,
  timestamp: number,
  timeout: number
}

export default () => {
  const fbAuth = useAuth();

  const [ws, setWs] = useState<RNWebSocket>()


  const [chatSession, setChatSession] = useState<ChatSession|null>(null);
  const STORAGE_KEY = '@chat_session';

  const [chatConnected, setChatConnected] = useState(false);
  const [waitingResponse, setWaitingResponse] = useState(false)

  const [userMessage, setUserMessage] = useState<string>("");
  const [messages, setMessages] = useState<{
    id: string,
    owner: number,
    content: string
  }[]>([]);
  
  const [suggestions, setSuggestions] = useState<string[]>([])
  
  const updateChatSession = (session: ChatSession | null) => {
    setChatSession(session);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session))
      .catch((error) => console.error('Erro ao salvar a sessão no armazenamento:', error));
  }

  const addMessage = (message: string, owner: number) => {
    const parsedMessage = {
      id: Date.now().toString(),
      owner: owner,
      content: message 
    };

    setMessages([...messages, parsedMessage]);
  };

  const sendMessage = (message: string, wsocket: RNWebSocket = ws!) => {
    if (waitingResponse || !message) return;
    addMessage(message, 0)
    if (!chatConnected) {
      addMessage('Não foi possível enviar a mensagem.', 1)
    };
    wsocket.send(JSON.stringify({type:'message', content: message}))
    setUserMessage('')
    setWaitingResponse(true)
  }

  const createChannel = async (session?: ChatSession) => {
  
    try {

      let chatPath: string;
      let accessKey: string;
      let timeout: number;

      const currentTime = Date.now()
      if (session && session.timeout + session.timestamp < currentTime) {
        chatPath = session.path;
        accessKey = session.key;
        timeout = session.timeout;
      }
      else {
        const response = await fetch(api('chat'), {
          method: "GET",
          headers: {
            "X-Authorization": `${await fbAuth.user!.getIdToken()}`,
          }
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${data.message}`)
        }

        chatPath = data.chatPath;
        accessKey = data.accessKey;
        timeout = data.timeout;
        setSuggestions(JSON.parse(data.suggestion))
      }

      setWs(new (WebSocket as RNWebSocket)(chatPath, '', {
        headers: {
          "ws-key": accessKey
        }
      }))

      if (!ws) throw new Error('O WebSocket não foi criado'); // não é necessário mas evita erros no typescript 

      ws.onopen = () => {
        console.log('Conectado ao chat');
        ws.send(JSON.stringify({type:'message', content: "Iniciar"}))
        setChatConnected(true)
      };
  
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type !== 'response') {
          return
        };

        addMessage(data.content.response, 1);
        setSuggestions(data.content.suggest);
        setWaitingResponse(false);
        updateChatSession({ path: chatPath, key: accessKey, timestamp: Date.now(), timeout:  timeout});
        // código para adicionar o contexto do usuário e armazenar
      };
  
      ws.onerror = (error) => {
        console.log('Ocorreu um erro no chat:', error);
        addMessage('Ocorreu um erro no chat.', 1);
      };
  
      ws.onclose = (event) => {
        console.log('Conexão fechada:', event.code, event.reason);
        if (event.code !== 1000) {
          console.log('Fechamento anormal:', event.code, event.reason);
        }
        addMessage('O chat acabou.', 1);
        setChatConnected(false);
      };

      updateChatSession({ path: chatPath, key: accessKey, timestamp: Date.now(), timeout:  timeout});
      return;

    } catch (error) {
      console.log('Não foi possível criar um canal. ', error);
      addMessage('Ocorreu um erro no chat. Por favor, reinicie o aplicativo.', 1);
    }
  }

  useEffect(() => {
    const loadSession = () => {
      AsyncStorage.getItem(STORAGE_KEY)
        .then((storage) => {
          if (storage) {
            const session = JSON.parse(storage);
            createChannel(session);
          } else {
            createChannel();
          }
        })
        .catch((error) => {
          console.error('Erro ao carregar a sessão:', error);
        });
    };


    loadSession()
  }, [])
  
  return (
    <View>
      <Text>Chat com AI</Text>

      { chatConnected 
        ? <></>
        : <Text>Conectando</Text>
      }
      
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            { item.owner
            ? <Text>
              <Text style={{color:"#e120a1"}}>{ item.owner }:</Text>
              <Text>{ item.content }</Text>
            </Text>
            : <Text>
              <Text style={{color:"#eebc1b"}}>{ item.owner }:</Text>
              <Text>{ item.content }</Text>
            </Text>
            }
          </View>
        )}
      />

      <View style={{ flex: 1, height: 50 }}>
        <TextInput style={{ height: "100%"}} onChangeText={setUserMessage}></TextInput>
        <Button title="Enviar mensagem" onPress={() => sendMessage(userMessage)} disabled={waitingResponse || !chatConnected}></Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  messageContainer: {
    flex: 1,
    minHeight: 30,
  },
})


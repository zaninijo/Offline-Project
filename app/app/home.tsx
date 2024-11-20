import { Text, View, Button} from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        rowGap: 20,
      }}
    >
      <Text>Offline Project Demo</Text>
      <Button title="Selecionar aplicativos rastreados" onPress={() => router.push("/app/trackedAppsList")}></Button>
      <Button title="Ler dados de uso" onPress={() => router.push("/app/statsScreen")}></Button>
      <Button title="Ler/Limpar Stat Storage" onPress={() => router.push("/app/statsStorageScreen")}></Button>
      <Button title="Conversar com a inteligência artificial" onPress={() => router.push("/app/chat")}></Button>
    </View>
  );
}
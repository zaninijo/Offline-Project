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
      <Button title="Read Use Stats" onPress={() => router.push("./demoScreen/statsScreen")}></Button>
      <Button title="Set Tracked Apps" onPress={() => router.push("./demoScreen/trackedAppsList")}></Button>
    </View>
  );
}
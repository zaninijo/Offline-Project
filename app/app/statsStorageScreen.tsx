import { Text, View, Button, ScrollView } from "react-native";
import { useStatsStorageContext } from "@/context/statsStorage";

export default () => {
  const { statsStorage, flushStatsStorage } = useStatsStorageContext();

  return (
    <View
      style={{
        flex: 1,
        paddingVertical: 10,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ScrollView style={{ marginVertical:10, backgroundColor:"#EEEDDD" }}>
        <Text>{statsStorage ? JSON.stringify(statsStorage.map(({appIcon, ...rest}) => rest), null, 2) : 'No data available'}</Text>
      </ScrollView>
      {statsStorage &&
        <View style={{ flexDirection: "row", gap:10 }}> 
          <Button title='Flush Data' onPress={async () => flushStatsStorage()}></Button>
        </View>
      }
    </View>
  );
}
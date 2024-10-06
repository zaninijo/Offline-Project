import { useState } from "react";
import { Text, View, Button, ScrollView } from "react-native";

import { RawStat, AppInfo, Stat } from "@/utils/types";
import { getAllDay, getAllDayMinus } from '@/utils/timeDict';
import launchConfig from '@/utils/openUsageStatsConfig' 

import { fecthUsageStats, formatStats } from '@/hooks/usageStats';

import { useTrackedAppsStorageContext } from '@/contexts/trackedAppsStorage';

export default function Screen() {
  const { isInTrackedAppsStorage, findInTrackedAppsStorage } = useTrackedAppsStorageContext();

  const [data, setData] = useState<Stat[]|null>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error|null>(null);
  
  const fecthData = async () => {
    setLoading(true)
    
    const rawStats = await fecthUsageStats(getAllDayMinus().aWeek, getAllDay(), isInTrackedAppsStorage)
    const { formatedStats, error } = await formatStats(rawStats.data, findInTrackedAppsStorage)

    setData(formatedStats)
    setLoading(false)
    setError(error)
  }

  return (
    <View
      style={{
        flex: 1,
        paddingVertical: 10,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{flexDirection: "row", gap:10}}>  
        <Button title="Activate Permission" onPress={() => launchConfig()}></Button>
        <Button title="Fetch Data" onPress={() => fecthData()}></Button>
      </View>
      <ScrollView style={{ marginVertical:10, backgroundColor:"#EEEDDD" }}>
        <Text>{data ? JSON.stringify(data.map(({appIcon, ...rest}) => rest), null, 2) : 'No data available'}</Text>
      </ScrollView>
      {loading ? <Text>Loading...</Text> :
        <View style={{ flexDirection: "row", gap:10 }}> 
          <Button title='Store Data'></Button>
          <Button title='Flush Data'></Button>
        </View>
      }
      {error ? <Text>Error: {error.message}</Text> : null}
    </View>
  );
}
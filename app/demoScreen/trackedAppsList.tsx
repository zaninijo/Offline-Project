import { Text, Image, View, FlatList, NativeModules, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, FC } from 'react';

const { InstalledApps } = NativeModules;
import { useTrackedAppsStorageContext } from '@/contexts/trackedAppsStorage';
import { AppInfo } from "@/utils/types";

interface addAppBtnProps {
  initialState: boolean,
  callback: () => void
}

interface AppItemProps {
  item: AppInfo;
  isInTrackedAppsStorage: (app: AppInfo|string) => boolean;
  saveApp: (app: AppInfo) => void;
  removeApp: (app: AppInfo) => void;
}

const AppItem: FC<AppItemProps> = React.memo(({ item, isInTrackedAppsStorage, saveApp, removeApp }) => {
  return (
    <View key={item.packageName} style={styles.appContainer}>
      <Image style={styles.appIcon} source={{ uri: `data:image/png;base64,${item.icon}` }} />
      <View style={styles.appTextContainer}>
        <Text>{item.appName}</Text>
        <Text>{item.packageName}</Text>
      </View>
      <AddAppButtonComponent initialState={isInTrackedAppsStorage(item)}
        callback={() => {
          isInTrackedAppsStorage(item) ? removeApp(item) : saveApp(item);
        }}
      />
    </View>
  )
});

const AddAppButtonComponent: FC<addAppBtnProps> = ({ initialState, callback }) => {
  const [activated, setActivated] = useState(initialState)

  useEffect(() => {
    setActivated(initialState)
  }, [initialState])

  return (
    <TouchableOpacity
      onPress={() => {
        setActivated(!activated)
        callback()
      }}
      style={
        [styles.addAppButton, activated
          ? { backgroundColor: '#7CB342' }
          : { backgroundColor: '#D32F2F' }]}>
    </TouchableOpacity>
  )
}

const TrackedAppList = () => {
  const { trackedAppsStorage, saveApp, removeApp, isInTrackedAppsStorage } = useTrackedAppsStorageContext();

  const [apps, setApps] = useState<AppInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredApps, setFilteredApps] = useState<AppInfo[]>([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    InstalledApps.getInstalledApps()
      .then((installedApps: AppInfo[]) => {
        setApps(installedApps);
        setFilteredApps(installedApps);
      })
      .catch((error: any) => {
        console.warn(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, []);

  useEffect(() => {
    const plainTextQuery = searchQuery.toLowerCase();
    setFilteredApps(
      apps.filter((app) => {
        return (
          app.appName.toLowerCase().includes(plainTextQuery) ||
          app.packageName.toLowerCase().includes(plainTextQuery)
        );
      })
    );
  }, [searchQuery, apps]);

  return (
    <View>
      <Text>{JSON.stringify(trackedAppsStorage.map(app => app.packageName))}</Text>
      <TextInput onChangeText={setSearchQuery} placeholder='Search for apps' style={styles.searchBar}></TextInput>

      {loading
        ? (<ActivityIndicator size="large" color="#0000ff" />)
        : (<FlatList data={filteredApps} keyExtractor={(item) => item.packageName} renderItem={({ item }) => (
          <AppItem item={item} isInTrackedAppsStorage={isInTrackedAppsStorage} saveApp={saveApp} removeApp={removeApp} />
        )}></FlatList>
        )}
    </View>
  )
}

const styles = StyleSheet.create({

  searchBar: {
    margin: 12,
    padding: 12,
    fontSize: 16,
    flexGrow: 1,
    backgroundColor: '#DCBFA7',
  },
  appContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  appTextContainer: {
    flexGrow: 1,
    flexShrink: 1,
    marginRight: 10,
    maxHeight: 80,
    overflow: 'hidden',
    backgroundColor: '#DCBFA7',
  },
  appIcon: {
    marginRight: 10,
    height: 50,
    width: 50
  },
  addAppButton: {
    height: 32,
    width: 32,
    marginLeft: 'auto',
    backgroundColor: '#DCBFA7',
  }
})

export default TrackedAppList
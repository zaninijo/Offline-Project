import { createContext, useState, useContext, FC, ReactNode, useEffect} from 'react'
import { AppInfo } from '@/types/types'
import AsyncStorage from '@react-native-async-storage/async-storage';

const trackedAppsContext = createContext<{
  trackedAppsStorage: AppInfo[],
  saveApp: (appInfo: AppInfo) => Promise<void>,
  removeApp: (appInfo: AppInfo) => Promise<void>
  isInTrackedAppsStorage: (appInfo: AppInfo|string) => boolean
  findInTrackedAppsStorage: (appInfo: AppInfo|string) => AppInfo|undefined
} | null >(null);

export const TrackedAppsStorageProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [trackedAppsStorage, setTrackedAppsStorage] = useState<AppInfo[]>([]);
  const STORAGE_KEY = '@storage_TrackedApps';

  useEffect(() => {
    const loadApps = async () => {
      try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedData !== null) {
          const parsedData: AppInfo[] = JSON.parse(storedData);
          setTrackedAppsStorage(parsedData);
        }
      } catch (error) {
        console.error(error)
      }
    };

    loadApps()
  },[])

  // É importante que aceite string pois o usageStats só fornece os packageName dos aplicativos
  const isInTrackedAppsStorage = (appInfo: AppInfo|string): boolean => {
    const packageName = typeof appInfo === 'string' ? appInfo : appInfo.packageName;
    return trackedAppsStorage.some(app => app.packageName === packageName)
  }

  // Mesma coisa que a função de cima mas esta retorna o AppInfo
  const findInTrackedAppsStorage = (appInfo: AppInfo|string): AppInfo|undefined => {
    const packageName = typeof appInfo === 'string' ? appInfo = appInfo : appInfo.appName;
    return trackedAppsStorage.find(app => app.packageName === packageName)
  }

  const saveApp = async (appInfo: AppInfo) => {
    try {
      if (!isInTrackedAppsStorage(appInfo)) {
          const newAppsStorage = [...trackedAppsStorage, appInfo];
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newAppsStorage));
          setTrackedAppsStorage(newAppsStorage);
      }
    } catch (error) {
      console.error(error)
    }
  }

  const removeApp = async (appInfo: AppInfo) => {
    try {
      if (isInTrackedAppsStorage(appInfo)) {
          const newAppsStorage = trackedAppsStorage.filter(app => app.packageName !== appInfo.packageName)
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newAppsStorage));
          setTrackedAppsStorage(newAppsStorage);
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <trackedAppsContext.Provider value={{ trackedAppsStorage: trackedAppsStorage, saveApp, removeApp, isInTrackedAppsStorage, findInTrackedAppsStorage }}>
      {children} 
    </trackedAppsContext.Provider>
  );
};

export const useTrackedAppsStorageContext = () => {
  const context = useContext(trackedAppsContext);
  if (!context) throw new Error("O contexto não está disponível.");
  return context;
}

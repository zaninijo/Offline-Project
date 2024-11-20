import { createContext, useState, useContext, FC, ReactNode, useEffect} from 'react'
import { Stat, AppInfo, RawStat } from '@/types/types'
import AsyncStorage from '@react-native-async-storage/async-storage';

const usageStatsContext = createContext<{
  statsStorage: Stat[],
  updateStatsStorage: (stat: Stat[]) => Promise<void>,
  flushStatsStorage: () => Promise<void>
} | null >(null);

export const StatsStorageProvider: FC<{ children: ReactNode }> = ({ children }) => {
  
  const [statsStorage, setStatStorage] = useState<Stat[]>([]);
  const STORAGE_KEY = '@storage_Stats';

  useEffect(() => {
    const loadStats = async () => {
      try {
        const storedStat = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedStat) {
          const parsedData: Stat[] = JSON.parse(storedStat);
          setStatStorage(parsedData);
        }
      } catch (error) {
        console.error(error)
      }
    };
    
    loadStats()
  },[])

  const updateStatsStorage = async (statArray: Stat[]) => {
    try {
      let updatedStorage = [...statsStorage]
      statArray.forEach(stat => {
        const repeatedPackage = updatedStorage.find(storagedStat => storagedStat.packageName === stat.packageName)
        const isOutsideTimeSpan =  repeatedPackage && (repeatedPackage.timeSpan.end < stat.timeSpan.end || repeatedPackage.timeSpan.start > stat.timeSpan.start)
        
        if ( repeatedPackage && isOutsideTimeSpan && stat.timeSpan.start ) { // É necessário verificar se o timeSpan.start != 0 (as vezes acontece)
          const activityUpdate = stat.activity.concat(repeatedPackage.activity); // Juntar os arrays
          stat.activity = [...new Set(activityUpdate)];  // Remover duplicados
          updatedStorage = updatedStorage.filter(storagedStat => storagedStat.packageName !== stat.packageName); // Remove antigo
          updatedStorage.push(stat); // Adiciona novo
        }
        else if (!repeatedPackage) {
          updatedStorage.push(stat);
        }
      })
      setStatStorage(updatedStorage);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStorage));
      
    } catch (error) {
      console.error(error)
    }
  }

  const flushStatsStorage = async () => { // função de teste só pra deletar todos os dados
    await AsyncStorage.setItem(STORAGE_KEY, "")
    setStatStorage([])
  }

  return (
    <usageStatsContext.Provider value={{ statsStorage, updateStatsStorage, flushStatsStorage }}>
      {children} 
    </usageStatsContext.Provider>
  );
};

export const useStatsStorageContext = () => {
  const context = useContext(usageStatsContext);
  if (!context) throw new Error("O contexto não está disponível.");
  return context;
}

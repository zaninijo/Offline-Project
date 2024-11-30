import { View, Text, Button, TextInput, FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import RNPickerSelect from 'react-native-picker-select';
import { time } from '@/util/timeDict';
import { useStatsStorageContext } from '@/context/statsStorage';

export default () => {

  const { statsStorage } = useStatsStorageContext()

  const [granularity, setGranularity] = useState<string>('daily')
  const [interval, setInterval] = useState<number>(1)
  const [minInterval, setMinInterval] = useState<number>(1)
  const [maxInterval, setMaxInterval] = useState<number>(7)
  const [multiplier, setMultiplier] = useState<number>(time.day)
  const [widgets, setWidgets] = useState<string[]>([])
  
  const granularityOptions = [
    { label: 'Diário', value: 'daily' },
    { label: 'Semanal', value: 'weekly' },
    { label: 'Mensal', value: 'monthly' },
    { label: 'Anual', value: 'yearly' },
  ];

  useEffect(() => {
    switch (granularity) {
      case 'daily': {
        setMinInterval(1); setMaxInterval(7); setMultiplier(time.day); break;
      }
      case 'weekly': {
        setMinInterval(1); setMaxInterval(4); setMultiplier(time.week); break;
      }
      case 'monthly': {
        setMinInterval(1); setMaxInterval(12); setMultiplier(time.month); break;
      }
      case 'yearly': {
        setMinInterval(1); setMaxInterval(5); setMultiplier(time.year); break;
      }
    }
    setInterval(1);
  }, [granularity]);

  const intervalOptions = Array.from({ length: maxInterval }, (_, index) => ({
    label: `${index + minInterval} unidade(s)`,
    value: index + minInterval,
  }));

  const generateView = (periodStart: number) => {
    // filtrar dados
    
  }

  return (
    <View>
      <Text>Filtrar por:</Text>
      <RNPickerSelect
        placeholder={{ label: 'Granularidade', value: null }}
        items={granularityOptions}
        onValueChange={(value) => setGranularity(value)}
        value={granularity}
      />

      <RNPickerSelect
        placeholder={{ label: 'Intervalo', value: null }}
        items={intervalOptions}
        onValueChange={(value) => setInterval(value)}
        value={interval}
      />
      <Button title='Gerar'></Button>
    </View>
  )
}

const styles = StyleSheet.create({

})


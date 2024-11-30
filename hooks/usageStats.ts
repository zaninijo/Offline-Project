import { NativeModules } from 'react-native';
import { useState } from 'react'
const { UsageStatsModule } = NativeModules;
import { AppInfo, Stat, RawStat } from '@/types/types'
import { generateAccent } from '@/theme';


export async function fecthUsageStats(startTime: number, endTime: number, filterFunc?: (packageName: string) => boolean) {
    try {
        const unfilteredData: RawStat[] = await UsageStatsModule.getUsageStats(startTime, endTime)
        // filtra os dados para serem retornados só os aplicativos que estão na lista de rastreamento.
        const data = filterFunc ? unfilteredData.filter((stat) => filterFunc(stat.packageName)) : unfilteredData
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function formatStats(usageEntries: RawStat[]|null, findInTrackedAppsStorage: (packageName: string) => AppInfo|undefined) {

    let error: Error|null = null
    let formatedStats: Stat[] = []

    try {
        usageEntries?.forEach((usageEntry) => {
            if (formatedStats.some((stat) => stat.packageName === usageEntry.packageName)) return;

            const appInfo = findInTrackedAppsStorage(usageEntry.packageName)!;
            
            let spanData = {
                start: usageEntry.timeEnd - usageEntry.totalTime,
                end: usageEntry.timeEnd
            };

            let activityData: { start: number, end: number, total: number }[] = [];
            
            usageEntries
            .filter((actEntry) => (usageEntry.packageName === actEntry.packageName && actEntry.timeEnd !== 0))
            .forEach((actEntry) => {

                    // já aproveito o loop pra atualizar o spanData
                    if (spanData.start > actEntry.timeStart) { spanData.start = actEntry.timeStart };
                    if (spanData.end < actEntry.timeEnd) { spanData.end = actEntry.timeEnd };

                    /* verifico se a atividade que foi iterada anteriormente ocorre no mesmo dia que a atual.
                    se forem do mesmo dia, eu junto as duas numa só. :^)
                    talvez essa parte do código é inútil, eu fiz ela tentando resolver um problema que não existe
                    mas vou deixar para possíveis adversidades */

                    const lastEntry = activityData[activityData.length-1]

                    if (lastEntry) {                   
                        const lastEntryDate = new Date(lastEntry.start).getDate()
                        const currentEntryDate = new Date(actEntry.timeStart).getDate()
                    
                        if (lastEntryDate === currentEntryDate) {
                            activityData[activityData.length-1] = {
                                start: lastEntry.start,
                                end: actEntry.timeEnd,
                                total: actEntry.totalTime + lastEntry.total
                            };
                            return;
                        }
                    }
                    // comentario superior só se refere ao trecho acima
                
                    activityData.push({
                        start: actEntry.timeStart,
                        end: actEntry.timeEnd,
                        total: actEntry.totalTime
                    });
                });

            const newStat = {
                packageName: appInfo.packageName,
                appName: appInfo.appName,
                timeSpan: spanData,
                appIcon: appInfo.icon,
                activity: activityData,
                color: '#FFFFFF'
            };

            formatedStats.push(newStat);
        })

        const colors = generateAccent(formatedStats.length)
        formatedStats = formatedStats.map((entry, i) => {
            entry.color = colors[i]
            return entry
        })
    }
    catch (err) {
        error = err as Error
    }
    finally {
        return { formatedStats, error }
    }
};
// AppInfo é como o dado vem do NativeModule "AppInfo", inalterado. É usado no sistema de rastreamento (trackedAppsStorage e trackedAppsList) na definição de aplicativos rastreados.
export type AppInfo = {
    appName: string;
    packageName: string;
    icon: string; // Base64
}

// UsageStat é como o dado vem do NativeModule "UsageStat", inalterado. É usado na formação do tipo abaixo.
export type RawStat = {
    packageName: string;
    totalTime: number;
    timeStart: number;
    timeEnd: number
}

// Stat é a junção dos dois acima, é neste tipo que as informações de uso dos aplicativos rastreados são guardadas.
export type Stat = {
    packageName: string;
    appName: string;
    timeSpan: { // start = antigo; end = novo  
        start: number,
        end: number,
    };
    appIcon: string;
    activity: {
        start: number,
        end: number,
        total: number
    }[];
}


export type AIUseInfo = { // StatInfo é a maneira como qual os dados devem ser formatados para que a IA possa interpreta-los.
    dataInterval: string;
    summary: {
        totalUsageTime: string,
        mostUsedApp: string,
        averageDailyUsage: string,
        averageUsagePerApp: string,
        totalTrackedApps: number,
        mostActivePeriod: string[]
    };
    topApps: {
        appName: string,
        totalUsageTime: number,
        averageDailyUsage: number,
    }[]

} ;


export type AIChatResponse = {
    response: string;
    suggest: string[];
  };


import * as IntentLauncher from 'expo-intent-launcher'

export default async function openUsageSettings() {
    try {
        await IntentLauncher.startActivityAsync('android.settings.USAGE_ACCESS_SETTINGS');
    } catch (error) {
        console.error('Erro ao abrir as configurações de acesso de uso:', error);
        return error
    }
    return
};
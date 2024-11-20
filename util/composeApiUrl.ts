import { API_BASE_URL } from '@/config.json'

export default (route: string) => {
    return new URL(`http://${API_BASE_URL}/${route}`)
}
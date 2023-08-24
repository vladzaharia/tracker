import { createInfoApi } from '../api'

export default async function SyncLoader() {
	const infoApi = createInfoApi()
	return (await infoApi.getSyncConfig()).data
}

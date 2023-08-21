import { createInfoApi } from '../api'

export default async function ConfigLoader() {
	const infoApi = createInfoApi()
	return (await infoApi.listConfig()).data
}

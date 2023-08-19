import { ActionApi, AdminApi, Configuration, ConfigurationParameters, DatabaseApi, InfoApi, TrackerApi } from 'tracker-server-client'

export const getApiConfig = (parameters: Omit<ConfigurationParameters, 'basePath'> = {}) => {
	return new Configuration({
		...parameters,
		basePath: `${window.location.protocol}//${window.location.host.replace(':4200', ':8787')}/api`,
	})
}

export const createTrackerApi = () => {
	return new TrackerApi(getApiConfig())
}

export const createActionApi = () => {
	return new ActionApi(getApiConfig())
}

export const createInfoApi = () => {
	return new InfoApi(getApiConfig())
}

export const createAdminApi = (accessToken: string) => {
	return new AdminApi(getApiConfig({ accessToken }))
}

export const createDatabaseApi = (accessToken: string) => {
	return new DatabaseApi(getApiConfig({ accessToken }))
}

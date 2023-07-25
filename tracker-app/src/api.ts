import { Configuration, ConfigurationParameters, TrackerApi } from 'tracker-server-client'

export const getApiConfig = (parameters: Omit<ConfigurationParameters, 'basePath'> = {}) => {
	return new Configuration({
		...parameters,
		basePath: `${window.location.protocol}//${window.location.host.replace(':4200', ':8787')}/api`,
	})
}

export const createTrackerApi = () => {
	return new TrackerApi(getApiConfig())
}

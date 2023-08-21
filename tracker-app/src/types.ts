export type CommonColor = 'primary' | 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'yellow' | 'grey-dark'
export type CommonColorAlt = 'primary alt' | 'blue alt' | 'green alt' | 'red alt' | 'orange alt' | 'purple alt' | 'yellow alt'

export type ApiType = 'gm' | 'admin'

export type Theme = 'light' | 'dark' | undefined

export interface OpenIDScopeProps {
	user: boolean
	admin: boolean
}

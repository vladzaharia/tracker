import { ReactNode, useEffect, useRef, useState } from 'react'
import './app.css'
import usePrefersColorScheme from 'use-prefers-color-scheme'
import { ContainerContext } from '../../hooks/container'
import { Theme } from '../../types'
import { NameContext } from '../../hooks/name'
import useLocalStorage from 'use-local-storage'
import { ThemeContext } from '../../hooks/theme'
import { useLocation } from 'react-router-dom'
import GlobalNav from '../global-nav/global-nav'

export interface AppProps {
	children?: ReactNode
}

export default function App({ children }: AppProps) {
	const [theme, setTheme] = useState<Theme>()
	const [nameStorage] = useLocalStorage('name', '')
	const [name, setName] = useState<string | undefined>(nameStorage)
	const defaultTheme = usePrefersColorScheme()
	const appRef = useRef<HTMLDivElement>(null)
	const location = useLocation()

	useEffect(() => {
		setTheme(defaultTheme === 'light' ? 'light' : 'dark')
	}, [location.pathname])

	return (
		<NameContext.Provider value={{ name, setName }}>
			<ContainerContext.Provider value={appRef}>
				<ThemeContext.Provider value={{ theme, setTheme }}>
					<div className={`app ${theme}`} ref={appRef}>
						<GlobalNav />
						{children}
					</div>
				</ThemeContext.Provider>
			</ContainerContext.Provider>
		</NameContext.Provider>
	)
}

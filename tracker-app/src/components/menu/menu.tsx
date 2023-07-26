import { ReactNode } from 'react'
import './menu.css'
import Header, { HeaderProps } from '../header/header'
import { AnimatePresence } from 'framer-motion'

export interface MenuProps {
	className?: string
	headerProps?: HeaderProps
	children: ReactNode
}

export default function Menu({ headerProps, children, className }: MenuProps) {
	return (
		<div className={`menu ${className || ''}`}>
			<AnimatePresence mode="popLayout" key="menu-animate">
				{headerProps && <Header className="center corner-left" key="header" {...headerProps} />}
				{children}
			</AnimatePresence>
		</div>
	)
}

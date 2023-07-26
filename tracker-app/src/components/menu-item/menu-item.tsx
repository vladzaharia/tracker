import { IconDefinition } from '@fortawesome/pro-regular-svg-icons'
import { useNavigate } from 'react-router-dom'
import Button, { ButtonProps } from '../button/button'
import './menu-item.css'
import { CommonColor } from '../../types'

interface MenuItemProps extends ButtonProps {
	icon: IconDefinition
	destination: string
	color: CommonColor
}

export function MenuItem({ color, text, icon, className, destination, ...buttonProps }: MenuItemProps) {
	const navigate = useNavigate()

	return (
		<div
			className={`menu-item clickable ${color} ${className || ''}`}
			onClick={() => {
				navigate(destination)
			}}
		>
			<Button
				className={className}
				color={color}
				iconProps={{
					icon: icon,
				}}
				{...buttonProps}
			/>
			<span className="fw-500">{text}</span>
		</div>
	)
}

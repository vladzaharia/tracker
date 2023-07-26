import { faRight } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Moment } from 'moment'

import './date-duration.css'
import moment from 'moment'

export const DateDuration = ({ startDate, endDate, className }: { startDate: Moment; endDate: Moment; className?: string }) => {
	const outdated = endDate.year() !== moment().year()

	return (
		<div className={`date-duration ${className || ''}`}>
			<span className="date">
				{outdated ? (
					<span className="large">{startDate.format('MMM D, YYYY')}</span>
				) : (
					<span className="larger">{startDate.format('MMM D')}</span>
				)}
			</span>
			<span className="icon">
				<FontAwesomeIcon icon={faRight} />
			</span>
			<span className="date">
				{outdated ? (
					<span className="large">{endDate.format('MMM D, YYYY')}</span>
				) : (
					<span className="larger">{endDate.format('MMM D')}</span>
				)}
			</span>
		</div>
	)
}

import {
	faBed,
	faCircleCheck,
	faCircleQuestion,
	faDown,
	faDownLeft,
	faDownRight,
	faHourglass,
	faLeft,
	faMaskSnorkel,
	faOctagon,
	faRight,
	faUp,
	faUpLeft,
	faUpRight,
} from '@fortawesome/pro-solid-svg-icons'
import moment from 'moment-timezone'
import { TripStatusActivityEnum, TripType } from 'tracker-server-client'

export const getIcon = (activity: TripStatusActivityEnum, course: number) => {
	switch (activity) {
		case 'diving':
			return faMaskSnorkel
		case 'moving':
			return getArrowIcon(course)
		case 'stopped':
			return faOctagon
		case 'sleeping':
			return faBed
		case 'outdated':
			return faHourglass
		case 'ended':
			return faCircleCheck
		case 'unknown':
		default:
			return faCircleQuestion
	}
}

export const getColor = (activity: TripStatusActivityEnum) => {
	switch (activity) {
		case 'diving':
			return 'blue'
		case 'moving':
			return 'green'
		case 'stopped':
			return 'red'
		case 'sleeping':
			return 'purple'
		case 'outdated':
			return 'orange'
		case 'ended':
			return 'orange'
		case 'unknown':
		default:
			return 'grey'
	}
}

export const getTitle = (activity: TripStatusActivityEnum, type: TripType, velocity: number) => {
	switch (activity) {
		case 'diving':
			return 'Diving'
		case 'moving':
			if (type === 'scuba') {
				return (
					<>
						Sailing at <span className="fw-500">{velocity}</span> km/h
					</>
				)
			} else if (type === 'road') {
				return (
					<>
						Driving at <span className="fw-500">{velocity}</span> km/h
					</>
				)
			}

			return (
				<>
					Moving at <span className="fw-500">{velocity}</span> km/h
				</>
			)
		case 'stopped':
			return 'Stopped'
		case 'sleeping':
			return 'Sleeping soundly'
		case 'ended':
			return 'Trip has ended!'
		case 'outdated':
			return 'No update'
		case 'unknown':
		default:
			return 'Unknown'
	}
}

export const getDescription = (activity: TripStatusActivityEnum, type: TripType, course: number, time_zone: string) => {
	switch (activity) {
		case 'diving':
			return 'Check back in about an hour to see my progress!'
		case 'moving':
			return (
				<>
					<span className="mr-025">Heading</span> <span className="fw-500">{course}</span> ° {getDirection(course)}
				</>
			)
		case 'stopped':
			return type === 'scuba'
				? 'The boat has stopped, check back later to see its progress!'
				: "I've stopped, check back later to see my progress!"
		case 'sleeping':
			return (
				<>
					<span>It's currently</span> <span className="fw-500">{moment().tz(time_zone).format('hh:mm A')}</span> here.
				</>
			)
		case 'ended':
			return 'Check back next year for another adventure!'
		case 'outdated':
			return 'Last ping was more than 8 hours ago.'
		case 'unknown':
		default:
			return 'Status is unknown, sorry about that!'
	}
}

export const getArrowIcon = (course: number) => {
	if (course < 22.5 || course >= 337.5) {
		return faUp
	} else if (course < 67.5 && course >= 22.5) {
		return faUpRight
	} else if (course < 112.5 && course >= 67.5) {
		return faRight
	} else if (course < 157.5 && course >= 112.5) {
		return faDownRight
	} else if (course < 202.5 && course >= 157.5) {
		return faDown
	} else if (course < 247.5 && course >= 202.5) {
		return faDownLeft
	} else if (course < 292.5 && course >= 247.5) {
		return faLeft
	} else if (course < 337.5 && course >= 292.5) {
		return faUpLeft
	}
}

export const getDirection = (course: number) => {
	if (course < 22.5 && course >= 337.5) {
		return 'North'
	} else if (course < 67.5 && course >= 22.5) {
		return 'Northwest'
	} else if (course < 112.5 && course >= 67.5) {
		return 'West'
	} else if (course < 157.5 && course >= 112.5) {
		return 'Southwest'
	} else if (course < 202.5 && course >= 157.5) {
		return 'South'
	} else if (course < 247.5 && course >= 202.5) {
		return 'Southeast'
	} else if (course < 292.5 && course >= 247.5) {
		return 'East'
	} else if (course < 337.5 && course >= 292.5) {
		return 'Northeast'
	}
}

import { faCog, faCompass, faGlobeAmericas, faLocationDot, faRotate, faRotateExclamation, faTimer } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GetSyncConfig200Response } from 'tracker-server-client'
import { useAuth } from 'react-oidc-context'
import { useLoaderData } from 'react-router-dom'
import { createSyncApi } from '../../../api'
import Action from '../../../components/action/action'
import Button from '../../../components/button/button'
import Header from '../../../components/header/header'
import { useNotificationAwareRequest } from '../../../hooks/notification'
import useReload from '../../../hooks/reload'
import './sync.css'
import SectionTitle from '../../../components/section-title/section-title'
import moment from 'moment'

export default function AdminSync() {
	const syncConfig = useLoaderData() as GetSyncConfig200Response
	useReload(syncConfig)

	const request = useNotificationAwareRequest()
	const auth = useAuth()

	const api = createSyncApi(auth.user?.access_token || 'someaccesstoken')

	const runSync = async (updateAll = false) => {
		await request(
			async () => {
				await api.runSync(updateAll)
			},
			{
				message: 'Successfully ran sync!',
			}
		)
	}

	return (
		<div className="sync">
			<Header
				title={'Garmin Sync'}
				color="orange"
				className="corner-right"
				leftActions={<FontAwesomeIcon icon={faCompass} size="lg" />}
				rightActions={
					<>
						<Button color="green" onClick={async () => await runSync()} iconProps={{ icon: faRotate }} popoverProps={{ color: 'green', description: 'Sync' }} />
						<Button color="green" onClick={async () => await runSync(true)} iconProps={{ icon: faRotateExclamation }} popoverProps={{ color: 'green', description: 'Full sync' }} />
					</>
				}
			/>
			<SectionTitle color="orange"><FontAwesomeIcon icon={faCog} className='mr-05' /> Configuration</SectionTitle>
			<Action color="orange" text="Garmin username" description="The username of the Garmin account to fetch data from.">
				{syncConfig.username}
			</Action>

			<SectionTitle color="orange"><FontAwesomeIcon icon={faTimer} className='mr-05' /> Last fetch</SectionTitle>
			{syncConfig.cron ? (
				<>
					<Action color="orange" text="Time fetched" description="When data was last fetched from Garmin.">
						<span className="fetch-time">
							<span className="fw-500">{moment(syncConfig.cron.last_run).calendar()}</span>
							<span className="description">{moment(syncConfig.cron.last_run).utc().format('MMM Do YYYY, HH:mm')} UTC</span>
						</span>
					</Action>
					{syncConfig.cron.reason ? (
						<Action color="orange" text="Fetch reason" description="Reason why last fetch occured.">
							{syncConfig.cron.reason}
						</Action>
					) : undefined}
					{syncConfig.cron.schedule ? (
						<Action color="orange" text="Cron schedule" description="Cron schedule which runs the sync task.">
							{syncConfig.cron.schedule}
						</Action>
					) : undefined}
					{syncConfig.cron.next_run ? (
						<Action color="orange" text="Next fetch" description="When the fetch task will next run.">
							{syncConfig.cron.next_run}
						</Action>
					) : undefined}
				</>
			) : undefined}

			{syncConfig.trips ? (
				<>
					<SectionTitle color="orange"><FontAwesomeIcon icon={faGlobeAmericas} className='mr-05' /> Trips</SectionTitle>
					<Action color="orange" text="Number imported" description="Number of trips imported on last fetch.">
						{syncConfig.trips.imported}
					</Action>
					<Action color="orange" text="Points imported" description="Number of points imported on last fetch.">
						{syncConfig.trips.points}
					</Action>
					<Action color="orange" text="Number skipped" description="Number of trips skipped on last fetch.">
						{syncConfig.trips.skipped}
					</Action>
				</>
			) : undefined}
			{syncConfig.waypoints ? (
				<>
					<SectionTitle color="orange"><FontAwesomeIcon icon={faLocationDot} className='mr-05' /> Waypoints</SectionTitle>
					<Action color="orange" text="Number imported" description="Number of waypoints imported on last fetch.">
						{syncConfig.waypoints.imported}
					</Action>
					<Action color="orange" text="Number updated" description="Number of waypoints updated on last fetch.">
						{syncConfig.waypoints.updated}
					</Action>
					<Action color="orange" text="Number skipped" description="Number of waypoints skipped on last fetch.">
						{syncConfig.waypoints.skipped}
					</Action>
				</>
			) : undefined}
		</div>
	)
}

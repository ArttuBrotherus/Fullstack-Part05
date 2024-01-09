import PropTypes from 'prop-types'

const Notification = ({ message }) => {

	const notifStyle = {
		background: "lightgrey",
		fontSize: "20px",
		borderStyle: "solid",
		borderRadius: "5px",
		padding: "10px",
		marginBottom: "10px"
	}

	if (message === '') {
		return null
	}

	return (
		<div className='error' style={notifStyle}>
			{message}
		</div>
	)
}

Notification.propTypes = {
	message: PropTypes.string.isRequired
}

export default Notification
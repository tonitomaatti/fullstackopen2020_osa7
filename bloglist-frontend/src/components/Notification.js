import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)

  if (!notification.content) {
    return null
  }

  const notificationStyle = {
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  if (notification.type === 'success') {
    notificationStyle.color = 'green'
  } else if (notification.type === 'error') {
    notificationStyle.color = 'red'
  }

  return (
    <div id="notification" style={notificationStyle}>
      {notification.content}
    </div>
  )
}

export default Notification
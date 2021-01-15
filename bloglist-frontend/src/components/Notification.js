import React from 'react'

const Notification = ({ message }) => {
  if (message === null) {
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

  if (message.type === 'success') {
    notificationStyle.color = 'green'
  } else if (message.type === 'error') {
    notificationStyle.color = 'red'
  }

  return (
    <div id="notification" style={notificationStyle}>
      {message.content}
    </div>
  )
}

export default Notification
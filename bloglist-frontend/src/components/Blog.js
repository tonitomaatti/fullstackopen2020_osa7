import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, likeBlog, currentUser, removeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [fullView, setFullView] = useState(false)

  const toggleFullView = () => {
    setFullView(!fullView)
  }

  const visibility = { display: fullView ? '' : 'none' }

  const label = fullView ? 'hide' : 'view'

  const showRemove = { display: currentUser === blog.user.username ? '' : 'none' }

  const like = () => {
    likeBlog(
      {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        user: blog.user,
        likes: blog.likes + 1
      },
      blog.id
    )
  }

  const remove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`) ) {
      removeBlog(blog.id)
    }
  }

  return (
    <div style={blogStyle}>
      <div className="blogTitle">
        {blog.title}
        <button className="toggle-view-button" onClick={toggleFullView}>{label}</button>
      </div>
      <div style={visibility} className="blogDetails">
        <div>{blog.url}</div>
        <div>
          {blog.likes}
          <button className="like-button" onClick={like}>like</button>
        </div>
        <div>{blog.author}</div>
        <div style={showRemove}>
          <button onClick={remove}>remove</button>
        </div>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  likeBlog: PropTypes.func.isRequired,
  currentUser: PropTypes.string.isRequired,
  removeBlog: PropTypes.func.isRequired
}

export default Blog

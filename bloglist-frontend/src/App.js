import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const blogFormRef = useRef()

  const sortAndSetBlogs = (blogsToSort) => {
    blogsToSort.sort((blog1, blog2) => {
      return blog2.likes - blog1.likes
    })
    setBlogs(blogsToSort)
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      blogService.setToken(user.token)

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )

      setUser(user)
      setUsername('')
      setPassword('')
      setMessage(
        {
          content: 'Login succesful',
          type: 'success'
        }
      )
      setTimeout(() => {
        setMessage(null)
      }, 5000)

    } catch (error) {
      setMessage(
        {
          content: 'wrong username or password',
          type: 'error'
        }
      )
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const loginForm = () => (
    <form id="loginForm" onSubmit={handleLogin}>
      <div>
        username
        <input
          id="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="login-button" type="submit">login</button>
    </form>
  )

  const createBlog = (blogObject) => {

    blogFormRef.current.toggleVisibility()

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        sortAndSetBlogs(blogs.concat(returnedBlog))
        setMessage(
          {
            content: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
            type: 'success'
          }
        )
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch( () => {
        setMessage(
          {
            content: 'blog creation failed',
            type: 'error'
          }
        )
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }

  const likeBlog = (blogObject, id) => {

    blogService
      .update(blogObject, id)
      .then(returnedBlog => {
        sortAndSetBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
      })
  }

  const removeBlog = (id) => {

    blogService
      .remove(id)
      .then( () => {
        sortAndSetBlogs(blogs.filter(blog => blog.id !== id))
      })
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      sortAndSetBlogs( blogs )
    )
  }, [])

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

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel='New Blog' ref={blogFormRef}>
        <BlogForm createBlog={createBlog}/>
      </Togglable>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          likeBlog={likeBlog}
          currentUser={user.username}
          removeBlog={removeBlog}
        />
      )}
    </div>
  )
}

export default App
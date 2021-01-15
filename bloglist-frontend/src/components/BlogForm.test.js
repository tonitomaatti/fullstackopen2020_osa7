import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import BlogForm from './BlogForm'

test('<BlogForm /> submits with right content', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm createBlog={createBlog}/>
  )

  const form = component.container.querySelector('form')

  const title = component.container.querySelector('#title')
  fireEvent.change(title, {
    target: { value: 'A test title' }
  })

  const author = component.container.querySelector('#author')
  fireEvent.change(author, {
    target: { value: 'Test Author' }
  })

  const url = component.container.querySelector('#url')
  fireEvent.change(url, {
    target: { value: 'https://www.testurl.com' }
  })

  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)

  const resultBlog = createBlog.mock.calls[0][0]
  expect(resultBlog.title).toBe('A test title')
  expect(resultBlog.author).toBe('Test Author')
  expect(resultBlog.url).toBe('https://www.testurl.com')
})
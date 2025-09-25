
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../app/page' //change to your file path
 
describe('Page', () => {
  it('renders a heading', () => {
    render(<Page />)
 
    const heading = screen.getByRole('heading', { level: 1 })
 
    expect(heading).toBeInTheDocument()
  })
})
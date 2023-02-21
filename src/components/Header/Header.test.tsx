import { screen } from "@testing-library/dom"
import { render } from "@testing-library/react"
import Header from "./Header"

test('Header renders correctly', () => {
    render(<Header />)
    const element = screen.getByTestId('header')
    expect(element).toBeInTheDocument()
})
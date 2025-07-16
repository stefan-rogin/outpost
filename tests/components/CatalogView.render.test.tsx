import { CatalogView } from "@/components/CatalogView"
import { render, screen } from "@testing-library/react"

describe("CatalogView render tests", () => {
  // TODO: Mock resources?
  test("renders content", () => {
    const mockSelectHandler = () => (): void => {}
    render(<CatalogView onSelect={mockSelectHandler} />)
    expect(screen.getByText("Extractor - Vapor")).toBeInTheDocument()
    expect(screen.getByText("Extractor - Gas")).toBeInTheDocument()
    expect(
      screen.getByRole("img", { name: "Extractor - Vapor" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("img", { name: "Extractor - Gas" })
    ).toBeInTheDocument()
  })
})

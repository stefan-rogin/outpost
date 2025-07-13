import { CatalogView } from "@/components/CatalogView"
import { render, screen } from "@testing-library/react"

describe("CatalogView render tests", () => {
  // TODO: Mock resources?
  test("renders content", () => {
    const mockSelectHandler = () => (): void => {}
    render(<CatalogView onSelect={mockSelectHandler} />)
    expect(screen.getByText("Solid Extractor Small")).toBeInTheDocument()
    expect(screen.getByText("Liquid Extractor Small")).toBeInTheDocument()
    expect(
      screen.getByRole("img", { name: "Solid Extractor Small" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("img", { name: "Liquid Extractor Small" })
    ).toBeInTheDocument()
  })
})

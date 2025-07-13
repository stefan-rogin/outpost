import { render, screen } from "@testing-library/react"
import { CatalogPage } from "@/components/CatalogPage"
import { testCategory } from "../testObjects"

describe("CatalogPage render tests", () => {
  test("renders content", () => {
    const mockSelectHandler = () => (): void => {}
    const mockNavHandler = () => (): void => {}
    render(
      <CatalogPage
        category={testCategory}
        onSelect={mockSelectHandler}
        onGroupNav={mockNavHandler}
      />
    )
    expect(screen.getByText("Solid Storage Small")).toBeInTheDocument()
    expect(screen.getByText("Outpost Transfer Container")).toBeInTheDocument()
    expect(
      screen.getByRole("img", { name: "Solid Storage Small" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("img", { name: "Outpost Transfer Container" })
    ).toBeInTheDocument()
  })
})

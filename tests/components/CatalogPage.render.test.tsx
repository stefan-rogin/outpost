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
    expect(screen.getByText("Storage - Solid")).toBeInTheDocument()
    expect(screen.getByText("Transfer Container")).toBeInTheDocument()
    expect(
      screen.getByRole("img", { name: "Storage - Solid" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("img", { name: "Transfer Container" })
    ).toBeInTheDocument()
  })
})

import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { Home } from "@/app/page"

describe("page render tests", () => {
  test("renders interactive content", async () => {
    render(<Home />)
    expect(screen.getByText("Solid Extractor Small")).toBeInTheDocument()
    expect(screen.getByText("Liquid Extractor Small")).toBeInTheDocument()
    expect(
      screen.getByText("Start outpost project by selecting modules to build.")
    ).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText("Previous page"))
    await waitFor(() => {
      expect(screen.getByText("Solid Storage Small")).toBeInTheDocument()
      expect(screen.getByText("Liquid Storage Small")).toBeInTheDocument()
    })

    const nextOptionArrows = screen.getAllByLabelText("Next option")
    fireEvent.click(nextOptionArrows[1])
    await waitFor(() => {
      expect(screen.getByText("Liquid Storage Medium")).toBeInTheDocument()
    })

    fireEvent.click(screen.getByAltText("Liquid Storage Medium"))
    await waitFor(() => {
      expect(
        screen.queryByText(
          "Start outpost project by selecting modules to build."
        )
      ).toBeNull()
      expect(screen.queryByText("Materials")).toBeInTheDocument()
    })
  })
})

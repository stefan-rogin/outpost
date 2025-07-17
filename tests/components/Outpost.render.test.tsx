import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { Outpost } from "@/components/Outpost"

describe("page render tests", () => {
  test("renders interactive content", async () => {
    render(<Outpost />)
    expect(screen.getByText("Extractor - Solid")).toBeInTheDocument()
    expect(screen.getByText("Extractor - Liquid")).toBeInTheDocument()
    expect(screen.getByText("Starfield Outpost Planner")).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText("Previous page"))
    await waitFor(() => {
      expect(screen.getByText("Scan Booster")).toBeInTheDocument()
      expect(screen.getByText("Cargo Link")).toBeInTheDocument()
    })

    const nextOptionArrows = screen.getAllByLabelText("Next option")
    fireEvent.click(nextOptionArrows[0])
    await waitFor(() => {
      expect(screen.getByText("Scan Booster - Advanced")).toBeInTheDocument()
    })

    fireEvent.click(screen.getByAltText("Scan Booster - Advanced"))
    await waitFor(() => {
      expect(screen.queryByText("Starfield Outpost Planner")).toBeNull()
      expect(screen.queryByText("Materials")).toBeInTheDocument()
    })
  })
})

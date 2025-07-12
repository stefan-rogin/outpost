import { changeQty, Home } from "@/app/page"
import { ResourceId } from "@/models/resource"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

describe("page", () => {
  test("changeQty handles add/remove actions, removing unused keys", () => {
    const items = new Map<ResourceId, number>()
    const step1 = changeQty("OutpostStorageSolidSmall", "add", items)
    expect(step1.get("OutpostStorageSolidSmall")).toBe(1)
    const step2 = changeQty("OutpostStorageSolidSmall", "add", step1)
    expect(step2.get("OutpostStorageSolidSmall")).toBe(2)
    const step3 = changeQty("OutpostStorageSolidMedium", "add", step2)
    expect(step3.get("OutpostStorageSolidSmall")).toBe(2)
    expect(step3.get("OutpostStorageSolidMedium")).toBe(1)
    const step4 = changeQty("OutpostStorageSolidSmall", "remove", step3)
    expect(step4.get("OutpostStorageSolidSmall")).toBe(1)
    expect(step4.get("OutpostStorageSolidMedium")).toBe(1)
    const step5 = changeQty("OutpostStorageSolidSmall", "remove", step4)
    expect(step5.has("OutpostStorageSolidSmall")).toBe(false)
    expect(step5.get("OutpostStorageSolidMedium")).toBe(1)
  })

  test.skip("renders interactive content", async () => {
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

import {
  CatalogPage,
  VisualGroup,
  mapCategoryToVisual,
  getNavOption,
  VisualCategory,
  getVisualForSelection
} from "@/components/CatalogPage"
import { CatalogCategory, CatalogGroup } from "@/models/catalog"
import { render, screen } from "@testing-library/react"
import { ResourceId } from "@/models/resource"
import { QtyChange } from "@/models/types"

const testGroups: CatalogGroup[] = [
  {
    title: "Solid storage",
    options: [
      "OutpostStorageSolidSmall",
      "OutpostStorageSolidMedium",
      "OutpostStorageSolidLarge"
    ]
  },
  {
    title: "Transfer Container",
    options: ["OutpostTransferContainer"]
  }
]

const testCategory: CatalogCategory = {
  title: "Storage",
  items: testGroups
}

describe("CatalogPage", () => {
  test("mapCategoryToVisual transforms catalog map", () => {
    const expected: VisualCategory = {
      title: "Storage",
      items: [
        {
          ...testGroups[0],
          selected: "OutpostStorageSolidSmall"
        },
        {
          ...testGroups[1],
          selected: "OutpostTransferContainer"
        }
      ]
    }

    expect(mapCategoryToVisual(testCategory)).toStrictEqual(expected)
  })

  test("getVisualForSelection changes selection", () => {
    const visual = mapCategoryToVisual(testCategory)
    const expected: VisualCategory = {
      title: "Storage",
      items: [
        {
          ...testGroups[0],
          selected: "OutpostStorageSolidMedium"
        },
        {
          ...testGroups[1],
          selected: "OutpostTransferContainer"
        }
      ]
    }

    expect(
      getVisualForSelection(visual, "OutpostStorageSolidMedium")
    ).toStrictEqual(expected)
  })

  test("getNavOption scrolls through options", () => {
    const sidedLeft: VisualGroup = {
      ...testGroups[0],
      selected: "OutpostStorageSolidSmall"
    }
    expect(getNavOption(sidedLeft, "next")).toBe("OutpostStorageSolidMedium")
    expect(getNavOption(sidedLeft, "prev")).toBe("OutpostStorageSolidLarge")

    const sidedRight = {
      ...testGroups[0],
      selected: "OutpostStorageSolidLarge"
    }
    expect(getNavOption(sidedRight, "next")).toBe("OutpostStorageSolidSmall")
    expect(getNavOption(sidedRight, "prev")).toBe("OutpostStorageSolidMedium")

    const singleOption = {
      ...testGroups[1],
      selected: "OutpostTransferContainer"
    }
    expect(getNavOption(singleOption, "next")).toBe("OutpostTransferContainer")
    expect(getNavOption(singleOption, "prev")).toBe("OutpostTransferContainer")
  })

  // TODO: make test conditional on process args
  test.skip("renders content", () => {
    const mockHandler = (id: ResourceId, action: QtyChange) => (): void => {}
    render(<CatalogPage category={testCategory} onSelect={mockHandler} />)
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

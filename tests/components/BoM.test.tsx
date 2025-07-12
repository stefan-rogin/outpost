import { ResourceId, Resource } from "@/models/resource"
import * as Resources from "@/lib/resources"
import { BoM, aggregateBlueprints } from "@/components/BoM"
import { render, screen } from "@testing-library/react"

const resources: Record<ResourceId, Resource> = {
  InorgCommonAluminum: {
    id: "InorgCommonAluminum",
    name: "Aluminum"
  },
  InorgCommonIron: {
    id: "InorgCommonIron",
    name: "Iron"
  },
  InorgCommonNickel: {
    id: "InorgCommonNickel",
    name: "Nickel"
  },
  Mfg_Tier01_AdaptiveFrame: {
    id: "Mfg_Tier01_AdaptiveFrame",
    name: "Adaptive Frame",
    blueprint: {
      InorgCommonIron: 1,
      InorgCommonAluminum: 1
    }
  },
  OutpostStorageLiquidLarge: {
    id: "OutpostStorageLiquidLarge",
    name: "Liquid Storage Large",
    blueprint: {
      Mfg_Tier01_AdaptiveFrame: 10,
      InorgCommonAluminum: 20,
      InorgCommonNickel: 16
    }
  },
  OutpostStorageSolidLarge: {
    id: "OutpostStorageSolidLarge",
    name: "Solid Storage Large",
    blueprint: {
      Mfg_Tier01_AdaptiveFrame: 10,
      InorgCommonIron: 20,
      InorgCommonAluminum: 16
    }
  }
}

const testItems = new Map<ResourceId, number>([
  ["OutpostStorageLiquidLarge", 2],
  ["OutpostStorageSolidLarge", 3]
])
const expected = new Map<ResourceId, number>([
  ["Mfg_Tier01_AdaptiveFrame", 2 * 10 + 3 * 10],
  ["InorgCommonAluminum", 2 * 20 + 3 * 16],
  ["InorgCommonIron", 3 * 20],
  ["InorgCommonNickel", 2 * 16]
])

jest.mock("@/lib/resources", () => ({
  tryGetResource: jest.fn()
}))
const tryGetResource = Resources.tryGetResource as jest.MockedFunction<
  (id: ResourceId) => Resource | undefined
>
tryGetResource.mockImplementation(id => resources[id])

describe("BoM", () => {
  test("aggregates materials for a list of constructible items", () => {
    expect(aggregateBlueprints(testItems)).toStrictEqual(expected)
  })

  test("is resilient for non-constructible items or missing resources", () => {
    const badItems = new Map<ResourceId, number>([
      ...testItems,
      ["InorgCommonAluminum", 2],
      ["fake", 1]
    ])

    expect(aggregateBlueprints(badItems)).toStrictEqual(expected)
  })

  test.skip("renders content", () => {
    render(<BoM items={testItems} />)
    expect(screen.getByText("50 x Adaptive Frame")).toBeInTheDocument()
    expect(screen.getByText("88 x Aluminum")).toBeInTheDocument()
    expect(screen.getByText("32 x Nickel")).toBeInTheDocument()
    expect(screen.getByText("60 x Iron")).toBeInTheDocument()
  })
})

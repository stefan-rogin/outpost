import { ResourceId, Resource } from "@/models/resource"
import * as Resources from "@/lib/resources"
import { aggregateBlueprints, BomItem, Bill } from "@/components/BoM"
import { testResources, testOrder } from "../testObjects"

const expected: Bill = new Map<ResourceId, BomItem>([
  [
    "Mfg_Tier01_AdaptiveFrame",
    {
      item: testResources["Mfg_Tier01_AdaptiveFrame"],
      quantity: 2 * 10 + 3 * 10
    }
  ],
  [
    "InorgCommonAluminum",
    {
      item: testResources["InorgCommonAluminum"],
      quantity: 2 * 20 + 3 * 16
    }
  ],
  [
    "InorgCommonIron",
    {
      item: testResources["InorgCommonIron"],
      quantity: 3 * 20
    }
  ],
  [
    "InorgCommonNickel",
    {
      item: testResources["InorgCommonNickel"],
      quantity: 2 * 16
    }
  ]
])

jest.mock("@/lib/resources", () => ({
  getResource: jest.fn()
}))
const getResource = Resources.getResource as jest.MockedFunction<
  (id: ResourceId) => Resource | undefined
>
getResource.mockImplementation(id => testResources[id])

describe("BoM tests", () => {
  test("aggregates materials for a list of constructible items", () => {
    expect(aggregateBlueprints(testOrder, new Map())).toStrictEqual(expected)
  })
})

import { ResourceId, Resource } from "@/models/resource"
import * as Resources from "@/lib/resources"
import { aggregateBlueprints } from "@/components/BoM"
import { testResources, testOrder } from "../testObjects"

const expected = new Map<ResourceId, number>([
  ["Mfg_Tier01_AdaptiveFrame", 2 * 10 + 3 * 10],
  ["InorgCommonAluminum", 2 * 20 + 3 * 16],
  ["InorgCommonIron", 3 * 20],
  ["InorgCommonNickel", 2 * 16]
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
    expect(aggregateBlueprints(testOrder)).toStrictEqual(expected)
  })
})

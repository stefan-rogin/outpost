import { ResourceId, Resource, Constructible } from "@/models/resource"
import * as Resources from "@/service/resource"
import {
  aggregateBlueprints,
  getCsvFromProject,
  getScarcity,
  getTier
} from "@/service/bom"
import { testResources, testOrder, testBill, testCsv } from "../testObjects"

jest.mock("@/service/resource", () => ({
  getResource: jest.fn()
}))
const getResource = Resources.getResource as jest.MockedFunction<
  (id: ResourceId) => Resource | undefined
>
getResource.mockImplementation(id => testResources[id])

describe("service/bom", () => {
  test("aggregates materials for a list of constructible items", () => {
    expect(aggregateBlueprints(testOrder, new Map())).toStrictEqual(testBill)
  })

  test("gets scarcity for resources", () => {
    expect(getScarcity(testResources["InorgCommonAluminum"])).toBe("Common")
  })

  test("gets tier for constructibles", () => {
    expect(
      getTier(testResources["Mfg_Tier01_AdaptiveFrame"] as Constructible)
    ).toBe("Tier01")
  })

  test("creates csv export for a project", () => {
    // WARN: Potential for flakiness
    expect(getCsvFromProject(testBill, testOrder)).toBe(testCsv)
  })
})

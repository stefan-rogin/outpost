import { ResourceId, Resource, Constructible } from "@/models/resource"
import * as Resources from "@/service/resource"
import {
  getAggregatedItems,
  getAggregatedDeconstructed,
  getCsvFromProject,
  getScarcity,
  getTier
} from "@/service/bom"
import {
  testResources,
  testOrder,
  testBillWithDeconstructItemSet,
  testBillWithDeconstructDeconstructedSet,
  testCsv,
  testProject
} from "../testObjects"

jest.mock("@/service/resource", () => ({
  getResource: jest.fn()
}))
const getResource = Resources.getResource as jest.MockedFunction<
  (id: ResourceId) => Resource | undefined
>
getResource.mockImplementation(id => testResources[id])

describe("service/bom", () => {
  test("aggregates materials for a list of constructible items with deconstructed items", () => {
    expect(
      getAggregatedItems(testOrder, testProject.deconstructed)
    ).toStrictEqual(testBillWithDeconstructItemSet)
  })

  test("aggregates deconstructed materials for a list of constructible items with deconstructed items", () => {
    expect(
      getAggregatedDeconstructed(testOrder, testProject.deconstructed)
    ).toStrictEqual(testBillWithDeconstructDeconstructedSet)
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
    expect(getCsvFromProject(testBillWithDeconstructItemSet, testOrder)).toBe(
      testCsv
    )
  })
})

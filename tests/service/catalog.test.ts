import { mapCatalogFromConfig } from "@/service/catalog"
import { testCategory, testConfig } from "../testObjects"
import { CatalogCategory } from "@/models/catalog"
import * as Resources from "@/service/resource"
import { testResources } from "../testObjects"
import { Resource, ResourceId } from "@/models/resource"

jest.mock("@/service/resource", () => ({
  getResource: jest.fn()
}))

const getResource = Resources.getResource as jest.MockedFunction<(id: ResourceId) => Resource | undefined>
getResource.mockImplementation(id => testResources[id])

describe("service/catalog tests", () => {
  test("mapCatalogFromConfig", () => {
    const expected: CatalogCategory[] = [testCategory]
    expect(mapCatalogFromConfig(testConfig)).toStrictEqual(expected)
  })
})

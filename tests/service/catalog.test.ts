import { mapCatalogFromConfig } from "@/service/catalog"
import { testCategory, testConfig } from "../testObjects"
import { CatalogCategory } from "@/models/catalog"

describe("service/catalog tests", () => {
  test("mapCatalogFromConfig", () => {
    const expected: CatalogCategory[] = [testCategory]
    expect(mapCatalogFromConfig(testConfig)).toStrictEqual(expected)
  })
})

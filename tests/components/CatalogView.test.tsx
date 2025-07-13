import { mapCatalogFromConfig } from "@/components/CatalogView"
import { testCategory, testConfig } from "../testObjects"
import { CatalogCategory } from "@/models/catalog"

describe("CatalogView tests", () => {
  test("mapCatalogFromConfig", () => {
    const expected: CatalogCategory[] = [testCategory]
    expect(mapCatalogFromConfig(testConfig)).toStrictEqual(expected)
  })
})

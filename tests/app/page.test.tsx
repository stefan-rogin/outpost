import { changeOrderQty } from "@/app/page"
import { testResources } from "../testObjects"
import { Resource, ResourceId } from "@/models/resource"
import * as Resources from "@/lib/resources"

jest.mock("@/lib/resources", () => ({
  getResource: jest.fn()
}))
const getResource = Resources.getResource as jest.MockedFunction<
  (id: ResourceId) => Resource | undefined
>
getResource.mockImplementation(id => testResources[id])

describe("page tests", () => {
  test("changeOrderQty handles add/remove actions, removing unused keys", () => {
    const order = new Map()
    const step1 = changeOrderQty("OutpostStorageSolidLarge", "add", order)
    expect(step1.get("OutpostStorageSolidLarge")).toHaveProperty("quantity", 1)
    const step2 = changeOrderQty("OutpostStorageSolidLarge", "add", step1)
    expect(step2.get("OutpostStorageSolidLarge")).toHaveProperty("quantity", 2)
    const step3 = changeOrderQty("OutpostStorageLiquidLarge", "add", step2)
    expect(step3.get("OutpostStorageSolidLarge")).toHaveProperty("quantity", 2)
    expect(step3.get("OutpostStorageLiquidLarge")).toHaveProperty("quantity", 1)
    const step4 = changeOrderQty("OutpostStorageSolidLarge", "remove", step3)
    expect(step4.get("OutpostStorageSolidLarge")).toHaveProperty("quantity", 1)
    expect(step4.get("OutpostStorageLiquidLarge")).toHaveProperty("quantity", 1)
    const step5 = changeOrderQty("OutpostStorageSolidLarge", "remove", step4)
    expect(step5.has("OutpostStorageSolidLarge")).toBe(false)
    expect(step5.get("OutpostStorageLiquidLarge")).toHaveProperty("quantity", 1)
  })
})

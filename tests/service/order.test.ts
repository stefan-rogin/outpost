import { changeOrderQty } from "@/service/order"
import { testResources } from "../testObjects"
import { Resource, ResourceId } from "@/models/resource"
import * as Resources from "@/service/resource"

jest.mock("@/service/resource", () => ({
  getResource: jest.fn()
}))
const getResource = Resources.getResource as jest.MockedFunction<
  (id: ResourceId) => Resource | undefined
>
getResource.mockImplementation(id => testResources[id])

describe("service/order tests", () => {
  test("changeOrderQty handles add/remove actions, removing unused keys", () => {
    const order = new Map()
    const step1 = changeOrderQty("OutpostStorageSolid01Large", "add", order)
    expect(step1.get("OutpostStorageSolid01Large")).toHaveProperty(
      "quantity",
      1
    )
    const step2 = changeOrderQty("OutpostStorageSolid01Large", "add", step1)
    expect(step2.get("OutpostStorageSolid01Large")).toHaveProperty(
      "quantity",
      2
    )
    const step3 = changeOrderQty("OutpostStorageGas01Large", "add", step2)
    expect(step3.get("OutpostStorageSolid01Large")).toHaveProperty(
      "quantity",
      2
    )
    expect(step3.get("OutpostStorageGas01Large")).toHaveProperty("quantity", 1)
    const step4 = changeOrderQty("OutpostStorageSolid01Large", "remove", step3)
    expect(step4.get("OutpostStorageSolid01Large")).toHaveProperty(
      "quantity",
      1
    )
    expect(step4.get("OutpostStorageGas01Large")).toHaveProperty("quantity", 1)
    const step5 = changeOrderQty("OutpostStorageSolid01Large", "remove", step4)
    expect(step5.has("OutpostStorageSolid01Large")).toBe(false)
    expect(step5.get("OutpostStorageGas01Large")).toHaveProperty("quantity", 1)
  })
})

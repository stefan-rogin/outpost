import { ResourceId, Resource } from "@/models/resource"
import * as Resources from "@/service/resource"
import { testResources } from "../testObjects"
import {
  projectReducer,
  ProjectActionType,
  ProjectAction
} from "@/reducers/projectReducer"
import {
  testInititialState,
  testProjectState1,
  testProjectState2,
  testProjectState3
} from "../testStates"

jest.mock("@/service/resource", () => ({
  getResource: jest.fn()
}))
const getResource = Resources.getResource as jest.MockedFunction<
  (id: ResourceId) => Resource | undefined
>
getResource.mockImplementation(id => testResources[id])

describe("projectReducer tests", () => {
  test("handles INIT action by changing to loading", () => {
    const result = projectReducer(testInititialState, {
      type: ProjectActionType.INIT
    })
    expect(result).toStrictEqual({
      ...testInititialState,
      isLoading: true,
      isError: false
    })
  })

  test("handles RENAME action", () => {
    const result = projectReducer(testInititialState, {
      type: ProjectActionType.RENAME,
      payload: "New name test"
    })
    expect(result.project.name).toBe("New name test")
  })

  test("ignores RENAME action if empty or whitespace", () => {
    const result = projectReducer(testInititialState, {
      type: ProjectActionType.RENAME,
      payload: " "
    })
    expect(result.project.name).toBe("Project")
  })

  test("handles CLEAR action", () => {
    const result = projectReducer(testProjectState1, {
      type: ProjectActionType.DELETE
    })
    expect(result.project.name).toBe("Project")
    expect(result.project.id).toBe("1f8a4b0c-07e1-4dac-8114-b37b2e65f44b")
    expect(result.project.order.size).toBe(0)
    expect(result.project.deconstructed).toEqual([])
    expect(result.itemBill.size).toBe(0)
    expect(result.deconstructedBill.size).toBe(0)
  })

  test("handles CHANGE_ITEM_QTY action (add)", () => {
    const action: ProjectAction = {
      type: ProjectActionType.CHANGE_ITEM_QTY,
      payload: { id: "OutpostStorageSolid01Large", qtyChange: "add" }
    }
    const result = projectReducer(testProjectState1, action)
    expect(result.project.order.has("OutpostStorageSolid01Large")).toBe(true)
    expect(
      result.project.order.get("OutpostStorageSolid01Large")?.quantity
    ).toBe(1)
    expect(result.itemBill.get("Mfg_Tier01_AdaptiveFrame")?.quantity).toBe(35)
  })

  test("handles CHANGE_ITEM_QTY action (remove)", () => {
    const action: ProjectAction = {
      type: ProjectActionType.CHANGE_ITEM_QTY,
      payload: { id: "OutpostHarvesterGas_03_Large", qtyChange: "remove" }
    }
    expect(testProjectState2.project.deconstructed.length).toBe(2)
    const result = projectReducer(testProjectState2, action)
    expect(result.project.order.has("OutpostHarvesterGas_03_Large")).toBe(false)
    expect(result.project.deconstructed.length).toBe(0)
    expect(result.itemBill.get("Mfg_Tier01_AdaptiveFrame")?.quantity).toBe(20)
  })

  test("handles TOGGLE_DECONSTRUCT action (add)", () => {
    const action: ProjectAction = {
      type: ProjectActionType.TOGGLE_DECONSTRUCT,
      payload: "Mfg_Tier02_SterileNanotubes"
    }
    expect(testProjectState2.project.deconstructed.length).toBe(2)
    const result = projectReducer(testProjectState2, action)
    expect(result.project.deconstructed.length).toBe(3)
    expect(result.itemBill.get("InorgExoticIonicLiquids_L")?.quantity).toBe(12)
    expect(
      result.deconstructedBill.get("Mfg_Tier02_MolecularSieve")?.quantity
    ).toBe(6)
  })

  test("allows TOGGLE_DECONSTRUCT action only for constructibles", () => {
    const action: ProjectAction = {
      type: ProjectActionType.TOGGLE_DECONSTRUCT,
      payload: "InorgRareVanadium"
    }
    expect(testProjectState2.project.deconstructed.length).toBe(2)
    const result = projectReducer(testProjectState2, action)
    expect(result.project.deconstructed.length).toBe(2)
    expect(result.project.deconstructed).not.toContain("InorgRareVanadium")
  })

  test("handles TOGGLE_DECONSTRUCT action (remove)", () => {
    const action: ProjectAction = {
      type: ProjectActionType.TOGGLE_DECONSTRUCT,
      payload: "Mfg_Tier02_SterileNanotubes"
    }
    expect(testProjectState3.project.deconstructed.length).toBe(3)
    const result = projectReducer(testProjectState3, action)
    expect(result.project.deconstructed.length).toBe(2)
    expect(result.itemBill.get("InorgExoticIonicLiquids_L")?.quantity).toBe(4)
    expect(
      result.deconstructedBill.get("Mfg_Tier02_MolecularSieve")?.quantity
    ).toBe(2)
  })

  test("throws on unknown action", () => {
    expect(() => {
      // @ts-expect-error
      projectReducer(testInititialState, { type: "UNKNOWN" })
    }).toThrow()
  })
})

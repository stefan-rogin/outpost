import { testProject1 } from "../testObjects"
import { projectReducer, ProjectActionType, ProjectAction } from "@/reducers/projectReducer"
import { testInititialState, testProjectState1, testProjectState2, testProjectState3 } from "../testStates"
import { getNewProject } from "@/service/project"
import { storageMock } from "../mocks/localStorageMock"
import * as Resources from "@/service/resource"
import { testResources } from "../testObjects"
import { Resource, ResourceId } from "@/models/resource"

jest.mock("@/service/resource", () => ({
  getResource: jest.fn()
}))

const getResource = Resources.getResource as jest.MockedFunction<(id: ResourceId) => Resource | undefined>
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

  test("handles LOAD_OK action by computing Bom lists and persisting an updated lastOpened value", () => {
    const ish = 2000
    const result = projectReducer(testInititialState, {
      type: ProjectActionType.LOAD_OK,
      payload: testProject1
    })

    expect(result).toMatchObject({
      ...testProjectState1,
      project: expect.objectContaining({
        ...testProject1,
        lastOpened: expect.any(Date)
      })
    })
    const now = new Date()
    expect(Math.abs(result.project.lastOpened.getTime() - now.getTime())).toBeLessThanOrEqual(ish)
    expect(storageMock.setItem).toHaveBeenCalledWith(`o_${result.project.id}`, expect.any(String))
  })

  test("handles LOAD_ERR action", () => {
    const result = projectReducer(testInititialState, { type: ProjectActionType.LOAD_ERR })

    expect(result.isError).toBe(true)
    expect(result.isLoading).toBe(false)
  })

  test("handles CREATE action", () => {
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    const newProject = getNewProject()
    const now = new Date()
    const ish = 2000
    const result = projectReducer(testInititialState, { type: ProjectActionType.CREATE })

    expect(result.project).toMatchObject({
      ...newProject,
      id: expect.stringMatching(uuidV4Regex),
      created: expect.any(Date),
      lastOpened: expect.any(Date),
      lastChanged: expect.any(Date)
    })
    expect(Math.abs(result.project.created.getTime() - now.getTime())).toBeLessThanOrEqual(ish)
    expect(Math.abs(result.project.lastOpened.getTime() - now.getTime())).toBeLessThanOrEqual(ish)
    expect(Math.abs(result.project.lastChanged.getTime() - now.getTime())).toBeLessThanOrEqual(ish)
    expect(result.itemBill.size).toBe(0)
    expect(result.deconstructedBill.size).toBe(0)
    expect(result.isError).toBe(false)
    expect(result.isLoading).toBe(false)
    expect(result.isEmptyWorkspace).toBe(false)
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

  test("handles CHANGE_ITEM_QTY action, adding a new item type", () => {
    const action: ProjectAction = {
      type: ProjectActionType.CHANGE_ITEM_QTY,
      payload: { id: "OutpostStorageSolid01Large", qtyChange: "add" }
    }
    expect(testProjectState1.project.order.get("OutpostStorageSolid01Large")).toBe(undefined)

    const result = projectReducer(testProjectState1, action)

    expect(result.project.order.has("OutpostStorageSolid01Large")).toBe(true)
    expect(result.project.order.get("OutpostStorageSolid01Large")?.quantity).toBe(1)
    expect(result.itemBill.get("Mfg_Tier01_AdaptiveFrame")?.quantity).toBe(35)
  })

  test("handles CHANGE_ITEM_QTY action, increasing quantity of an existing item type", () => {
    const action: ProjectAction = {
      type: ProjectActionType.CHANGE_ITEM_QTY,
      payload: { id: "OutpostStorageGas01Large", qtyChange: "add" }
    }
    expect(testProjectState1.project.order.get("OutpostStorageGas01Large")?.quantity).toBe(2)

    const result = projectReducer(testProjectState1, action)

    expect(result.project.order.has("OutpostStorageGas01Large")).toBe(true)
    expect(result.project.order.get("OutpostStorageGas01Large")?.quantity).toBe(3)
    expect(result.itemBill.get("Mfg_Tier01_AdaptiveFrame")?.quantity).toBe(35)
  })

  test("handles CHANGE_ITEM_QTY action, decreasing quantity for an item type", () => {
    const action: ProjectAction = {
      type: ProjectActionType.CHANGE_ITEM_QTY,
      payload: { id: "OutpostStorageGas01Large", qtyChange: "remove" }
    }
    expect(testProjectState1.project.order.get("OutpostStorageGas01Large")?.quantity).toBe(2)

    const result = projectReducer(testProjectState1, action)

    expect(result.project.order.has("OutpostStorageGas01Large")).toBe(true)
    expect(result.project.order.get("OutpostStorageGas01Large")?.quantity).toBe(1)
    expect(result.itemBill.get("Mfg_Tier01_AdaptiveFrame")?.quantity).toBe(15)
  })

  test("handles CHANGE_ITEM_QTY action, removing an item type when removing its last item, and removing from deconstructed list any items dependent on the removed item type", () => {
    const action: ProjectAction = {
      type: ProjectActionType.CHANGE_ITEM_QTY,
      payload: { id: "OutpostHarvesterGas_03_Large", qtyChange: "remove" }
    }
    expect(testProjectState1.project.order.get("OutpostHarvesterGas_03_Large")?.quantity).toBe(1)
    expect(testProjectState1.project.deconstructed.length).toBe(3)

    const result = projectReducer(testProjectState1, action)

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
    expect(result.deconstructedBill.get("Mfg_Tier02_MolecularSieve")?.quantity).toBe(6)
  })

  test("TOGGLE_DECONSTRUCT returns state if resource does not exist", () => {
    const action: ProjectAction = {
      type: ProjectActionType.TOGGLE_DECONSTRUCT,
      payload: "missingResource"
    }
    expect(testProjectState2.project.deconstructed.length).toBe(2)

    const result = projectReducer(testProjectState2, action)

    expect(result.project.deconstructed.length).toBe(2)
    expect(result.project.deconstructed).not.toContain("missingResource")
  })

  test("TOGGLE_DECONSTRUCT returns state if resource is not constructible", () => {
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
    expect(result.deconstructedBill.get("Mfg_Tier02_MolecularSieve")?.quantity).toBe(2)
  })

  test("throws on unknown action", () => {
    expect(() => {
      // @ts-expect-error
      projectReducer(testInititialState, { type: "UNKNOWN" })
    }).toThrow()
  })
})

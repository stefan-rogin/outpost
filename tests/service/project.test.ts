import { ResourceId, Resource } from "@/models/resource"
import * as Resources from "@/service/resource"
import {
  testResources,
  testProject,
  serializedTestProject
} from "../testObjects"
import { getStoredProject, storeProject } from "@/service/project"

jest.mock("@/service/resource", () => ({
  getResource: jest.fn()
}))
const getResource = Resources.getResource as jest.MockedFunction<
  (id: ResourceId) => Resource | undefined
>
getResource.mockImplementation(id => testResources[id])

const getItemMock = jest.fn(() => serializedTestProject)
const setItem = jest.fn()
Object.defineProperty(global, "localStorage", {
  value: {
    getItem: getItemMock,
    setItem: setItem,
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn()
  },
  writable: true
})

// WARN: Potential for flakiness
describe("service/project", () => {
  test("loads a stored project", () => {
    expect(getStoredProject()).toStrictEqual(testProject)
  })

  test("stores a project", () => {
    storeProject(testProject)
    expect(setItem).toHaveBeenCalledWith("project", serializedTestProject)
  })

  test("falls back to a new project if serialization is invalid", () => {
    const notJSON = serializedTestProject.replace(
      '"order":{"OutpostHarvesterGas_03_Large":1,"OutpostStorageGas01Large":2}',
      '"order":'
    )
    getItemMock.mockImplementationOnce(() => notJSON)
    expect(typeof getStoredProject().id).toBe("string")
    expect(typeof getStoredProject().name).toBe("string")
    expect(typeof getStoredProject().order).toBe("object")
    expect(getStoredProject().order.keys.length).toBe(0)
  })

  test("falls back to a new project if stored is invalid", () => {
    const orderNotObject = serializedTestProject.replace(
      '"order":{"OutpostHarvesterGas_03_Large":1,"OutpostStorageGas01Large":2}',
      '"order": ""'
    )
    getItemMock.mockImplementationOnce(() => orderNotObject)
    expect(typeof getStoredProject().id).toBe("string")
    expect(typeof getStoredProject().name).toBe("string")
    expect(typeof getStoredProject().order).toBe("object")
    expect(getStoredProject().order.keys.length).toBe(0)
  })

  test("only allows constructible items in order", () => {
    const notConstructible = serializedTestProject.replace(
      '"order":{"OutpostHarvesterGas_03_Large":1,"OutpostStorageGas01Large":2}',
      '"order":{"OutpostHarvesterGas_03_Large":1,"OutpostStorageGas01Large":2, "InorgCommonNickel": 1}'
    )
    getItemMock.mockImplementationOnce(() => notConstructible)
    expect(getStoredProject()).toStrictEqual(testProject)
  })
})

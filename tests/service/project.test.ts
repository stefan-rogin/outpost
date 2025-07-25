import { ResourceId, Resource } from "@/models/resource"
import * as Resources from "@/service/resource"
import { testResources, testProject1, serializedTestProject1 } from "../testObjects"
import { deleteProject, getLatestProject, getRecentProjects, getStoredProject, storeProject } from "@/service/project"
import { Optional } from "@/types/common"
import { Project } from "@/models/project"
import { storageMock } from "../mocks/localStorageMock"

jest.mock("@/service/resource", () => ({
  getResource: jest.fn()
}))
const getResource = Resources.getResource as jest.MockedFunction<(id: ResourceId) => Resource | undefined>
getResource.mockImplementation(id => testResources[id])

// WARN: Potential for flakiness
describe("service/project", () => {
  test("loads a stored project", () => {
    storageMock.getItem.mockImplementationOnce(() => serializedTestProject1)
    expect(getStoredProject(testProject1.id)).toStrictEqual(testProject1)
  })

  test("stores a project", () => {
    storeProject(testProject1)
    expect(storageMock.setItem).toHaveBeenCalledWith(`o_${testProject1.id}`, serializedTestProject1)
  })

  test("returns undefined if serialization is invalid", () => {
    const notJSON = serializedTestProject1.replace(
      '"order":{"OutpostHarvesterGas_03_Large":1,"OutpostStorageGas01Large":2}',
      '"order":'
    )
    storageMock.getItem.mockImplementationOnce(() => notJSON)
    const result: Optional<Project> = getStoredProject(testProject1.id)
    expect(typeof result).toBe("undefined")
  })

  test("returns undefined if stored is invalid", () => {
    const orderNotObject = serializedTestProject1.replace(
      '"order":{"OutpostHarvesterGas_03_Large":1,"OutpostStorageGas01Large":2}',
      '"order": ""'
    )
    storageMock.getItem.mockImplementationOnce(() => orderNotObject)
    const result: Optional<Project> = getStoredProject(testProject1.id)
    expect(typeof result).toBe("undefined")
  })

  test("only allows constructible items in order", () => {
    const notConstructible = serializedTestProject1.replace(
      '"order":{"OutpostHarvesterGas_03_Large":1,"OutpostStorageGas01Large":2}',
      '"order":{"OutpostHarvesterGas_03_Large":1,"OutpostStorageGas01Large":2, "InorgCommonNickel": 1}'
    )
    storageMock.getItem.mockImplementationOnce(() => notConstructible)
    expect(getStoredProject(testProject1.id)).toStrictEqual(testProject1)
  })

  test("deletes a project", () => {
    deleteProject("1f8a4b0c-07e1-4dac-8114-b37b2e65f44b")
    expect(storageMock.removeItem).toHaveBeenCalledWith("o_1f8a4b0c-07e1-4dac-8114-b37b2e65f44b")
  })

  test("getLatestProject returns undefined for no projects stored", () => {
    const defaultMockValue = storageMock.length
    Object.defineProperty(storageMock, "length", { value: 0 })

    const result = getLatestProject()

    Object.defineProperty(storageMock, "length", { value: defaultMockValue })
    expect(result).toBe(undefined)
  })

  test("getLatestProject returns undefined when deserialization fails", () => {
    const defaultMockImpl = storageMock.getItem.getMockImplementation()
    // Expected for deserialization to fail
    storageMock.getItem.mockImplementation(() => "notJson")
    const result = getLatestProject()

    storageMock.getItem.mockImplementation(defaultMockImpl)
    expect(result).toBe(undefined)
  })

  test("getLatestProject retrives the latest opened project from storage", () => {
    const result = getLatestProject()

    expect(result?.name).toBe("Project2")
  })

  test("getRecentProjects retrieves projects sorted by lastOpened in descending order", () => {
    const result = getRecentProjects()

    expect(result.length).toBe(2)
    expect(result[0].name).toBe("Project2")
    expect(result[0].id).toBe("c66cc168-6ee1-46fc-b6de-7a9e50529d98")
    expect(result[0].created.toISOString()).toBe("2025-03-03T23:00:02.000Z")
    expect(result[0].lastOpened.toISOString()).toBe("2025-03-03T23:02:45.000Z")
    expect(result[0].lastChanged.toISOString()).toBe("2025-03-03T23:05:32.000Z")
  })
})

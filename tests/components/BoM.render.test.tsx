import { ResourceId, Resource } from "@/models/resource"
import * as Resources from "@/lib/resources"
import { BoM } from "@/components/BoM"
import { render, screen } from "@testing-library/react"
import { testResources, testOrder } from "../testObjects"

jest.mock("@/lib/resources", () => ({
  getResource: jest.fn()
}))
const getResource = Resources.getResource as jest.MockedFunction<
  (id: ResourceId) => Resource | undefined
>
getResource.mockImplementation(id => testResources[id])

describe("BoM render tests", () => {
  test("renders content", () => {
    render(<BoM order={testOrder} />)
    expect(screen.getByText("50 x Adaptive Frame")).toBeInTheDocument()
    expect(screen.getByText("88 x Aluminum")).toBeInTheDocument()
    expect(screen.getByText("32 x Nickel")).toBeInTheDocument()
    expect(screen.getByText("60 x Iron")).toBeInTheDocument()
  })
})

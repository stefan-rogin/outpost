import { ResourceId, Resource } from "@/models/resource"
import * as Resources from "@/service/resource"
import { BoM } from "@/components/BoM"
import { render, screen } from "@testing-library/react"
import { testResources, testOrder } from "../testObjects"

jest.mock("@/service/resource", () => ({
  getResource: jest.fn()
}))
const getResource = Resources.getResource as jest.MockedFunction<
  (id: ResourceId) => Resource | undefined
>
getResource.mockImplementation(id => testResources[id])

describe("BoM render tests", () => {
  test("renders content", () => {
    render(<BoM order={testOrder} />)
    expect(screen.getByText("Adaptive Frame")).toBeInTheDocument()
    expect(screen.getByText("Aluminum")).toBeInTheDocument()
    expect(screen.getByText("Nickel")).toBeInTheDocument()
    expect(screen.getByText("Iron")).toBeInTheDocument()
    expect(screen.getByText("50")).toBeInTheDocument()
    expect(screen.getByText("88")).toBeInTheDocument()
    expect(screen.getByText("32")).toBeInTheDocument()
    expect(screen.getByText("60")).toBeInTheDocument()
  })
})

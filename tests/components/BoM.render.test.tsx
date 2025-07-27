import { ResourceId, Resource } from "@/models/resource"
import * as Resources from "@/service/resource"
import { BoM } from "@/components/project/BoM"
import { render, screen } from "@testing-library/react"
import { testResources, testOrder, testProject1 } from "../testObjects"
import { getAggregatedItems, getAggregatedDeconstructed } from "@/service/bom"

jest.mock("@/service/resource", () => ({
  getResource: jest.fn()
}))
const getResource = Resources.getResource as jest.MockedFunction<
  (id: ResourceId) => Resource | undefined
>
getResource.mockImplementation(id => testResources[id])

describe("BoM render tests", () => {
  test("renders content", () => {
    render(
      <BoM
        order={testOrder}
        itemBill={getAggregatedItems(testOrder, testProject1.deconstructed)}
        deconstructedBill={getAggregatedDeconstructed(
          testOrder,
          testProject1.deconstructed
        )}
        onToggleDeconstruct={_ => () => {}}
      />
    )
    expect(screen.getByText("Substrate Molecular Sieve")).toBeInTheDocument()
    expect(screen.getByText("Sterile Nanotubes")).toBeInTheDocument()
    expect(screen.getByText("Mag Pressure Tank")).toBeInTheDocument()
    expect(screen.getByText("Memory Substrate")).toBeInTheDocument()
    expect(screen.getByText("2")).toBeInTheDocument() // Substrate Molecular Sieve (deconstructed)
    expect(screen.getByText("25")).toBeInTheDocument() // Adaptive Frame
    expect(screen.getByText("14")).toBeInTheDocument() // Vanadium
    expect(screen.getByText("8")).toBeInTheDocument() // Solvent
  })
})

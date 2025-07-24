import { ProjectState } from "@/models/project"
import * as to from "./testObjects"

export const testInititialState: ProjectState = {
  project: {
    id: "1f8a4b0c-07e1-4dac-8114-b37b2e65f44b",
    name: "Project",
    order: new Map(),
    deconstructed: [],
    created: new Date(0),
    lastOpened: new Date(0),
    lastChanged: new Date(0)
  },
  itemBill: new Map(),
  deconstructedBill: new Map(),
  isLoading: false,
  isError: false,
  isEmptyWorkspace: false
}

export const testProjectState1: ProjectState = {
  project: to.testProject,
  itemBill: to.testBillWithDeconstructItemSet,
  deconstructedBill: to.testBillWithDeconstructDeconstructedSet,
  isLoading: false,
  isError: false,
  isEmptyWorkspace: false
}

export const testProjectState2: ProjectState = {
  project: {
    ...to.testProject,
    deconstructed: to.testProject.deconstructed.toSpliced(
      to.testProject.deconstructed.indexOf("Mfg_Tier02_SterileNanotubes"),
      1
    )
  },
  itemBill: to.testBillWithDeconstructItemSet,
  deconstructedBill: to.testBillWithDeconstructCase2DeconstructedSet,
  isLoading: false,
  isError: false,
  isEmptyWorkspace: false
}

export const testProjectState3: ProjectState = {
  project: to.testProject,
  itemBill: to.testBillNoDeconstructItemSet,
  deconstructedBill: new Map(),
  isLoading: false,
  isError: false,
  isEmptyWorkspace: false
}

import {
  serializedTestProject1,
  serializedTestProject2,
  serializedLegacyOrder
} from "../testObjects"

const keyMock = jest.fn((index: number): string | undefined => {
  switch (index) {
    case 0:
      return "unrelated"
    case 1:
      return "o_1f8a4b0c-07e1-4dac-8114-b37b2e65f44b"
    case 2:
      return "o_c66cc168-6ee1-46fc-b6de-7a9e50529d98"
    case 3:
      return "order"
    default:
      return undefined
  }
})

const getItemMock = jest.fn((key: string): string => {
  switch (key) {
    case "unrelated":
      return "unrelated"
    case "o_1f8a4b0c-07e1-4dac-8114-b37b2e65f44b":
      return serializedTestProject1
    case "o_c66cc168-6ee1-46fc-b6de-7a9e50529d98":
      return serializedTestProject2
    case "order":
      return serializedLegacyOrder
    default:
      return ""
  }
})

export const storageMock = {
  getItem: getItemMock,
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 4,
  key: keyMock
}

Object.defineProperty(global, "localStorage", {
  value: storageMock,
  writable: true
})

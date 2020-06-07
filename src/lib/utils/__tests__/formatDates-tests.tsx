import { DateTime, Settings } from "luxon"
import { formatDate, formatDateTime } from "../formatDates"

const dateNow = 1525983752000 // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds
// @ts-ignore STRICTNESS_MIGRATION
let oneDayFromNow
// @ts-ignore STRICTNESS_MIGRATION
let oneYearFromNow
const realNow = Date.now

beforeEach(() => {
  jest.useFakeTimers()
  Settings.defaultZoneName = "America/New_York"

  // Thursday, May 10, 2018 8:22:32.000 PM UTC
  Date.now = () => dateNow

  oneDayFromNow = DateTime.fromMillis(dateNow)
    .plus({ days: 1 })
    .toISO()

  oneYearFromNow = DateTime.fromMillis(dateNow)
    .plus({ years: 1 })
    .toISO()
})

afterAll(() => (Date.now = realNow))

describe("formatDate", () => {
  it("shows month and day if year is the same as current year", () => {
    // @ts-ignore STRICTNESS_MIGRATION
    const date = formatDate(oneDayFromNow)
    expect(date).toEqual("May 11")
  })

  it("shows month, day, and year if year is not the same as current year", () => {
    // @ts-ignore STRICTNESS_MIGRATION
    const date = formatDate(oneYearFromNow)
    expect(date).toEqual("May 10, 2019")
  })
})

describe("formatDateTime", () => {
  it("shows month and day if year is the same as current year", () => {
    // @ts-ignore STRICTNESS_MIGRATION
    const date = formatDateTime(oneDayFromNow)
    expect(date).toEqual("May 11, 4:22pm EDT")
  })

  it("shows month, day, and year if year is not the same as current year", () => {
    // @ts-ignore STRICTNESS_MIGRATION
    const date = formatDateTime(oneYearFromNow)
    expect(date).toEqual("May 10, 2019, 4:22pm EDT")
  })

  it("adjusts according to timezone", () => {
    Settings.defaultZoneName = "America/Los_Angeles"
    // @ts-ignore STRICTNESS_MIGRATION
    const date = formatDateTime(oneDayFromNow)
    expect(date).toEqual("May 11, 1:22pm PDT")
  })
})

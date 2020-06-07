// Mock moment to always give back a formatted time string
jest.mock("moment", () => {
  const momentMock: any = jest.fn(() => ({ format: (format: string) => (format.length > 3 ? "Mon" : "7pm") }))
  momentMock.duration = jest.requireActual("moment").duration
  return momentMock
})

import { Flex, Sans, Spacer } from "@artsy/palette"
// @ts-ignore STRICTNESS_MIGRATION
import { render } from "enzyme"
import React from "react"
import { LabeledTicker } from ".."
import { CountdownProps, CountdownTimer } from "../CountdownTimer"

const dateString = (m: number) => new Date(m).toISOString()

const CountdownText: React.SFC<CountdownProps> = ({ duration, label }) => (
  <Flex justifyContent="center" alignItems="center">
    <LabeledTicker
      renderSeparator={() => <Spacer mr={0.5} />}
      textProps={{ color: "white", size: "3t" }}
      duration={duration}
    />
    <Sans size="1" color="white">
      {label}
    </Sans>
  </Flex>
)

describe("CountdownTimer", () => {
  beforeEach(() => {
    jest.useFakeTimers()
    Date.now = () => 1525983752000 // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds
  })

  it("renders upcoming properly", () => {
    const comp = render(
      <CountdownTimer
        formattedOpeningHours="Opens May 10 at 8:22pm"
        startAt="2018-05-10T20:22:42+00:00"
        endAt="2018-05-14T10:24:31+00:00"
        countdownComponent={CountdownText}
      />
    )
    expect(comp.text()).toContain("Opens May 10 at 8:22pm")
  })

  it("renders current properly", () => {
    const comp = render(
      <CountdownTimer
        formattedOpeningHours="Opens Apr 14 at 8:00pm"
        startAt="2018-04-14T20:00:00+00:00"
        endAt="2018-05-14T20:00:00+00:00"
        countdownComponent={CountdownText}
      />
    )
    expect(comp.text()).toContain("Opens Apr 14 at 8:00pm")
  })

  it("renders closed properly", () => {
    const comp = render(
      <CountdownTimer
        formattedOpeningHours="Closed"
        startAt={dateString(Date.now() - 2000)}
        endAt={dateString(Date.now() - 1000)}
        countdownComponent={CountdownText}
      />
    )
    expect(comp.text()).toContain("")
  })
})

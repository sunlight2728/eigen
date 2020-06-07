import React from "react"
import { CountdownProps } from "./CountdownTimer"
import { DurationProvider } from "./DurationProvider"

export interface TickerState {
  label?: string
  date?: string
  state: string
}

interface Props {
  CountdownComponent: React.ComponentType<CountdownProps>
  timeOffsetInMilliseconds?: number
  onCurrentTickerState: () => TickerState
  onNextTickerState: (currentState: TickerState) => TickerState
}

interface State {
  tickerState: TickerState
  previousTickerState: TickerState
}

export class StateManager extends React.Component<Props, State> {
  // @ts-ignore STRICTNESS_MIGRATION
  static getDerivedStateFromProps(props, state) {
    // If this component receives a new tickerState as props,
    // update to use the new props.
    if (props.onCurrentTickerState().date !== state.previousTickerState.date) {
      return { tickerState: props.onCurrentTickerState(), previousTickerState: props.onCurrentTickerState() }
    } else {
      return null
    }
  }

  state = { tickerState: this.props.onCurrentTickerState(), previousTickerState: this.props.onCurrentTickerState() }

  handleDurationEnd = () => {
    this.setState({ tickerState: this.props.onNextTickerState(this.state.tickerState) })
  }

  render() {
    const { CountdownComponent, timeOffsetInMilliseconds, ...props } = this.props
    const {
      tickerState: { label, date, state },
    } = this.state

    return (
      <DurationProvider
        // @ts-ignore STRICTNESS_MIGRATION
        startAt={date}
        timeOffsetInMilliseconds={timeOffsetInMilliseconds}
        onDurationEnd={this.handleDurationEnd}
      >
        <CountdownComponent
          label={label}
          // @ts-ignore STRICTNESS_MIGRATION
          duration={null}
          // @ts-ignore STRICTNESS_MIGRATION
          timerState={state}
          {...props}
        />
      </DurationProvider>
    )
  }
}

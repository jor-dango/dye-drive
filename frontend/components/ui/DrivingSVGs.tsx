import Svg, { NumberProp, Path } from 'react-native-svg'

export function GoBottom({ color, height }: { color: string, height: NumberProp }) {
  return (
    <Svg
      height={height}
      viewBox="0 0 100 70"
      fill={color}
      preserveAspectRatio="none"
    >
      <Path d="M100 70H0V45L50 3.05176e-05L100 45V70Z" />
    </Svg>

  )
}

export function GoTop({ color, height }: { color: string, height: NumberProp }) {
  return (
    <Svg
      height={height}
      viewBox="0 0 100 46"
      fill={color}
      preserveAspectRatio="none"
    >
      <Path d="M-4.02145e-06 1.63717e-05L100 7.62939e-06L100 46L50 16.4287L0 46L-4.02145e-06 1.63717e-05Z" />
    </Svg>
  )
}

export function StopBottom({ color, height }: { color: string, height: NumberProp }) {
  return (
    <Svg
      height={height}
      viewBox="0 0 100 70"
      fill={color}
      preserveAspectRatio="none"
    >
      <Path d="M100 70H0V0L50 45L100 0V70Z" />
    </Svg>

  )
}

export function StopTop({ color, height }: { color: string, height: NumberProp }) {
  return (
    <Svg
      height={height}
      viewBox="0 0 100 51"
      fill={color}
      preserveAspectRatio="none"
    >
      <Path d="M100 0H0V18.2139L50 51L100 18.2139V0Z" />
    </Svg>
  )
}

export function YieldBottom({ color, height }: { color: string, height: NumberProp }) {
  return (
    <Svg
      height={height}
      viewBox="0 0 158 70"
      fill={color}
      preserveAspectRatio="none"
    >
      <Path
        d="M157.5 70H0V45L27 0l25.324 44.042L78.75 0l26.425 44.042L130.5 0l27 45v25z"
      />
    </Svg>
  )
}

export function YieldTop({ color, height }: { color: string, height: NumberProp }) {
  return (
    <Svg
      height={height}
      viewBox="0 0 158 44"
      fill={color}
      preserveAspectRatio="none"
    >
      <Path fill-rule="evenodd" clip-rule="evenodd" d="M52.3245 16.3159L78.75 43.9998L105.176 16.3159L130.5 43.9998L157.5 15.7141V-0.000106812H0V15.714V15.7142H0.000143831L27 43.9997L52.3245 16.3159Z" />
    </Svg>

  )
}
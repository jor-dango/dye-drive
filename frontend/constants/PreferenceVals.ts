import { AudioAlertTypes, VisualAlertTypes } from "./types";

export const langs = [
  {
    key: "en",
    value: "English"
  },
  {
    key: "es",
    value: "Spanish"
  },
];

export const deficiencies = [
  {
    key: "deuteranopia",
    value: "Deuteranopia"
  },
  {
    key: "tritanopia",
    value: "Tritanopia"
  },
];

export const audioAlertStyles:
  {
    text: string,
    secondaryText: string | null,
    ref: AudioAlertTypes
  }[] = [
    {
      text: "Say the light color",
      secondaryText: "ex. Green, Yellow, Red",
      ref: "color"
    },
    {
      text: "Say the light action",
      secondaryText: "ex. Go, Yield, Stop",
      ref: "action"
    },
    {
      text: "Say nothing",
      secondaryText: null,
      ref: "nothing"
    },
  ]

export const visualAlertStyles:
  {
    text: string,
    ref: VisualAlertTypes
  }[] = [
    {
      text: "Shapes",
      ref: "shapes"
    },
    {
      text: "Words",
      ref: "words"
    },
    {
      text: "Both",
      ref: "both"
    },
  ]
interface Variable {
  type: "LABEL" | "TEXT" | "SELECT";
  name: string;
  displayName: string;
}

type ValueValidator = "NON_EMPTY" | "POSITIVE_NUMBER" | "DECIMAL" | "REGEX";

interface LabelVariable extends Variable {
  type: "LABEL";
}

interface TextVariable extends Variable {
  type: "TEXT";
  simpleValueType: boolean;
  defaultValue?: string | number;
  help?: string;
  valueHint?: string;
  valueValidators?: {
    type: ValueValidator;
    args?: string[];
  }[];
  alwaysInSummary?: boolean;
  notSetText?: string;
}

interface SelectVariable extends Variable {
  type: "SELECT";
  macrosInSelect: boolean;
  simpleValueType: boolean;
  defaultValue?: string;
  help?: string;
  valueHint?: string;
  selectItems: {
    value: string;
    displayValue: string;
  }[];
}

type Variables = (LabelVariable | TextVariable | SelectVariable)[];

export const variables: Variables = [
  {
    type: "TEXT",
    name: "token",
    displayName: "Saola Token",
    simpleValueType: true,
    alwaysInSummary: true,
    notSetText: "This tag can not work without the token",
    valueValidators: [
      {
        type: "REGEX",
        args: ["[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"]
      }
    ],
    valueHint: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
  },
  {
    type: "TEXT",
    name: "version",
    displayName: "SDK Version",
    simpleValueType: true,
    defaultValue: "latest",
    help: "Specify to use a specific version other than the latest",
    valueHint: "X.X.X"
  }
];

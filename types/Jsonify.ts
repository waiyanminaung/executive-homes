type JsonPrimitive = string | number | boolean | null;

type JsonArray = JsonValue[];

type JsonObject = { [key: string]: JsonValue };

type JsonValue = JsonPrimitive | JsonArray | JsonObject;

export type Jsonify<T> = T extends Date
  ? string
  : T extends (infer U)[]
    ? Jsonify<U>[]
    : T extends object
      ? { [K in keyof T]: Jsonify<T[K]> }
      : T;

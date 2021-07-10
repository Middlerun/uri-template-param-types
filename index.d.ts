// Normal parameter can have a single value, an array of values or an object of key-value pairs
type ParamValue<T> = T | Array<T> | { [key: string]: T }
// Composite parameter (i.e. with explode modifier *) can only have array or object values
type CompositeParamValue<T> = Array<T> | { [key: string]: T }

type ParamObject<Param extends string, SingleValueType> = {
  [param in Param]?: ParamValue<SingleValueType>;
}
type CompositeParamObject<Param extends string, SingleValueType> = {
  [param in Param]?: CompositeParamValue<SingleValueType>;
}

type ExtractParam<RawParam extends string, SingleValueType> =
  // Use modifiers to distinguish between simple and composite parameters
  RawParam extends `${infer Param}:${infer Chars}` ? ParamObject<Param, SingleValueType> :
  RawParam extends `${infer Param}*` ? CompositeParamObject<Param, SingleValueType> :
  ParamObject<RawParam, SingleValueType>

type CommaSeparatedParams<Params extends string, SingleValueType> =
  // Recursively extract each param from a comma-separated list
  Params extends `${infer Param},${infer Rest}` ? ExtractParam<Param, SingleValueType> & CommaSeparatedParams<Rest, SingleValueType> :
  Params extends '' ? {} :
  ExtractParam<Params, SingleValueType>

type ExpansionParams<Expansion extends string, SingleValueType> =
  // Handle each operator
  Expansion extends `+${infer Params}` ? CommaSeparatedParams<Params, SingleValueType> :
  Expansion extends `#${infer Params}` ? CommaSeparatedParams<Params, SingleValueType> :
  Expansion extends `.${infer Params}` ? CommaSeparatedParams<Params, SingleValueType> :
  Expansion extends `/${infer Params}` ? CommaSeparatedParams<Params, SingleValueType> :
  Expansion extends `;${infer Params}` ? CommaSeparatedParams<Params, SingleValueType> :
  Expansion extends `?${infer Params}` ? CommaSeparatedParams<Params, SingleValueType> :
  Expansion extends `&${infer Params}` ? CommaSeparatedParams<Params, SingleValueType> :
  CommaSeparatedParams<Expansion, SingleValueType>

type UriParamsIntersection<Template extends string, SingleValueType> =
  // Recursively find all expansions and join all the parameters from them
  Template extends `${infer Before}{${infer Expansion}}${infer After}` ?
    UriParamsIntersection<Before, SingleValueType> & ExpansionParams<Expansion, SingleValueType> & UriParamsIntersection<After, SingleValueType> :
    {}

// For strict adherence to the RFC6570 standard, in which values can only be strings or numbers
type StrictSingleParamValue = string | number

// For more permissive implementations that allow booleans and nulls
type PermissiveSingleParamValue = string | number | boolean | null

type URIParams<Template extends string> =
  // If we know the actual value of Template, extract the parameters
  // If Template is just a generic `string`, return simple key-value map
  Template extends `${infer Anything}` ?
    { [param in keyof UriParamsIntersection<Template, StrictSingleParamValue>]: UriParamsIntersection<Template, StrictSingleParamValue>[param] } :
    { [key: string]: any }

type PermissiveURIParams<Template extends string> =
  Template extends `${infer Anything}` ?
    { [param in keyof UriParamsIntersection<Template, PermissiveSingleParamValue>]: UriParamsIntersection<Template, PermissiveSingleParamValue>[param] } :
    { [key: string]: any }

export { URIParams, PermissiveURIParams, ParamValue, CompositeParamValue, StrictSingleParamValue, PermissiveSingleParamValue }

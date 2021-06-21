type SingleParamValue = string | number

type ParamValue = SingleParamValue | Array<SingleParamValue> | { [key: string]: SingleParamValue }
type CompositeParamValue = Array<SingleParamValue> | { [key: string]: SingleParamValue }

type ParamObject<Param extends string> = {
  [param in Param]?: ParamValue;
}
type CompositeParamObject<Param extends string> = {
  [param in Param]?: CompositeParamValue;
}

type ExtractParam<RawParam extends string> =
  // Use modifiers to distinguish between simple and composite parameters
  RawParam extends `${infer Param}:${infer Chars}` ? ParamObject<Param> :
  RawParam extends `${infer Param}*` ? CompositeParamObject<Param> :
  ParamObject<RawParam>

type CommaSeparatedParams<Params extends string> =
  // Recursively extract each param from a comma-separated list
  Params extends `${infer Param},${infer Rest}` ? ExtractParam<Param> & CommaSeparatedParams<Rest> :
  Params extends '' ? {} :
  ExtractParam<Params>

type ExpansionParams<Expansion extends string> =
  // Handle each operator
  Expansion extends `+${infer Params}` ? CommaSeparatedParams<Params> :
  Expansion extends `#${infer Params}` ? CommaSeparatedParams<Params> :
  Expansion extends `.${infer Params}` ? CommaSeparatedParams<Params> :
  Expansion extends `/${infer Params}` ? CommaSeparatedParams<Params> :
  Expansion extends `;${infer Params}` ? CommaSeparatedParams<Params> :
  Expansion extends `?${infer Params}` ? CommaSeparatedParams<Params> :
  Expansion extends `&${infer Params}` ? CommaSeparatedParams<Params> :
  CommaSeparatedParams<Expansion>

type UriParamsIntersection<Template extends string> =
  // Recursively find all expansions and join all the parameters from them
  Template extends `${infer Before}{${infer Expansion}}${infer After}` ?
    UriParamsIntersection<Before> & ExpansionParams<Expansion> & UriParamsIntersection<After> :
    {}

type URIParams<Template extends string> =
  // If we know the actual value of Template, extract the parameters
  // If Template is just a generic `string`, return simple key-value map
  Template extends `${infer Anything}` ?
    { [param in keyof UriParamsIntersection<Template>]: UriParamsIntersection<Template>[param] } :
    { [key: string]: any }

export { URIParams, ParamValue, CompositeParamValue }

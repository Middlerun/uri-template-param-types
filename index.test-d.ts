import { expectType, expectAssignable, expectNotAssignable } from 'tsd'
import {
  ParamValue,
  CompositeParamValue,
  URIParams,
  StrictSingleParamValue,
  PermissiveSingleParamValue,
  PermissiveURIParams,
} from './index'

// Basic test
{
  type TestParameters = URIParams<'/api/my-route/{id}/whatever{?foo,bar}'>

  type ExpectedType = {
    id?: ParamValue<StrictSingleParamValue>,
    foo?: ParamValue<StrictSingleParamValue>,
    bar?: ParamValue<StrictSingleParamValue>,
  }

  expectType<TestParameters>('dummyvalue' as ExpectedType)
}

// All operators
{
  type TestParameters = URIParams<'/api/{.dot}{+plus}{/slash}{;semicolon}{?question}{&ampersand}{#hash}'>

  type ExpectedType = {
    dot?: ParamValue<StrictSingleParamValue>,
    plus?: ParamValue<StrictSingleParamValue>,
    slash?: ParamValue<StrictSingleParamValue>,
    semicolon?: ParamValue<StrictSingleParamValue>,
    question?: ParamValue<StrictSingleParamValue>,
    ampersand?: ParamValue<StrictSingleParamValue>,
    hash?: ParamValue<StrictSingleParamValue>,
  }

  expectType<TestParameters>('dummyvalue' as ExpectedType)
}

// Modifiers
{
  type TestParameters = URIParams<'/api/my-route/{/path*}{?foo:8}'>

  type ExpectedType = {
    path?: CompositeParamValue<StrictSingleParamValue>,
    foo?: ParamValue<StrictSingleParamValue>,
  }

  expectType<TestParameters>('dummyvalue' as ExpectedType)

  // A CompositeParamValue must be either an array or an object
  expectNotAssignable<TestParameters>({
    path: 'simpleValue',
  })
}

// Strict version doesn't accept booleans or nulls
{
  type TestParameters = URIParams<'/api/whatever{?foo}'>

  expectNotAssignable<TestParameters>({ foo: true })
  expectNotAssignable<TestParameters>({ foo: null })
}

// Permissive version does accept booleans and nulls
{
  type TestParameters = PermissiveURIParams<'/api/whatever{?foo}'>

  expectAssignable<TestParameters>({ foo: true })
  expectAssignable<TestParameters>({ foo: null })
}

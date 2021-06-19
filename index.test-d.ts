import { expectType } from 'tsd'
import { ParamValue, URIParams } from './index'

export type CompositeValue = ParamValue | Array<ParamValue> | { [key: string]: ParamValue };

// Basic test
{
  type TestParameters = URIParams<'/api/my-route/{id}/whatever{?foo,bar}'>

  type ExpectedType = {
    id?: ParamValue,
    foo?: ParamValue,
    bar?: ParamValue,
  }

  expectType<TestParameters>('dummyvalue' as ExpectedType)
}

// All operators
{
  type TestParameters = URIParams<'/api/{.dot}{+plus}{/slash}{;semicolon}{?question}{&ampersand}{#hash}'>

  type ExpectedType = {
    dot?: ParamValue,
    plus?: ParamValue,
    slash?: ParamValue,
    semicolon?: ParamValue,
    question?: ParamValue,
    ampersand?: ParamValue,
    hash?: ParamValue,
  }

  expectType<TestParameters>('dummyvalue' as ExpectedType)
}

// Modifiers
{
  type TestParameters = URIParams<'/api/my-route/{/path*}{?foo:8}'>

  type ExpectedType = {
    path?: ParamValue,
    foo?: ParamValue,
  }

  expectType<TestParameters>('dummyvalue' as ExpectedType)
}

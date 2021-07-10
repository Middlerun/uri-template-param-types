# uri-template-param-types

This package defines a TypeScript type `URIParams` which represents the parameters of a URI template defined according to [RFC6570](https://datatracker.ietf.org/doc/html/rfc6570).

Requires TypeScript 4.1 or higher.

## Example

```typescript
type APIParameters = URIParams<'/api/my-route/{/path*}{?foo}'>

// Equivalent to:

type APIParameters = {
  path?: Array<string | number> | { [key: string]: string | number },
  foo?: string | number | Array<string | number> | { [key: string]: string | number },
}
```

## Usage example

Using `URIParams` while working with the [url-template](https://www.npmjs.com/package/url-template) library.

```typescript
import urlTemplate from 'url-template'
import { URIParams } from 'rfc6570-param-types'

const template = 'http://example.com/my-route/{id}/whatever{?foo,bar*}'

// TypeScript will check the object against the parameters in the template
const params: URIParams<typeof template> = {
  id: 5,
  foo: 'somevalue',
  bar: [1, 2, 3],
}

const uri = urlTemplate.parse(template).expand(params)
```

## Permissive version

By default, the basic type for a single value is `string | number`, as described by the RFC6570 standard. However some implementations also handle boolean and null values. For these cases there is an alternative type, `PermissiveURIParams`.

Example:

```typescript
type APIParameters = PermissiveURIParams<'/api/my-route{?foo}'>

// Equivalent to:

type APIParameters = {
  foo?: string | number | boolean | null | Array<string | number | boolean | null> | { [key: string]: string | number | boolean | null },
}
```

## License

Copyright 2021 Eddie McLean

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

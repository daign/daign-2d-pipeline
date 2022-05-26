# daign-2d-pipeline

[![CI][ci-icon]][ci-url]
[![Coverage][coveralls-icon]][coveralls-url]
[![NPM package][npm-icon]][npm-url]

#### Two dimensional graphics pipeline.

This library takes a document tree with layered transformations
and automatically calculates the transformation matrices for each element.
The transformation matrices can then be used to project element coordinates to view coordinates
and vice versa.

This package is the underlying core of the [daign-2d-graphics][daign-2d-graphics-url] library.

## Installation

```sh
npm install @daign/2d-pipeline --save
```

## Documentation
+ [Concept](./docs/concept.md)
+ [Order of transformations](./docs/transformations-order.md)
+ [Example code](./docs/example-code.md)

## Scripts

```bash
# Build
npm run build

# Run lint analysis
npm run lint

# Run unit tests with code coverage
npm run test

# Get a full lcov report
npm run coverage
```

[ci-icon]: https://github.com/daign/daign-2d-pipeline/workflows/CI/badge.svg
[ci-url]: https://github.com/daign/daign-2d-pipeline/actions
[coveralls-icon]: https://coveralls.io/repos/github/daign/daign-2d-pipeline/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/daign/daign-2d-pipeline?branch=master
[npm-icon]: https://img.shields.io/npm/v/@daign/2d-pipeline.svg
[npm-url]: https://www.npmjs.com/package/@daign/2d-pipeline
[daign-2d-graphics-url]: https://github.com/daign/daign-2d-graphics

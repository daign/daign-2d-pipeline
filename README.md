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

## Usage example

```typescript
import { expect } from 'chai';
import { Vector2 } from '@daign/math';
import { GraphicNode, MatrixTransform, View } from '@daign/2d-pipeline';

// Extend GraphicNode to create a class for your graphical elements.
class MyGraphicElement extends GraphicNode {
  // Add properties that define your element.
  public anchor: Vector2 = new Vector2();

  public constructor() {
    super();
  }
}

// Start your document tree by creating an element.
const node1 = new MyGraphicElement();
node1.anchor.set( 0, 0 );

// Append a child element.
const node2 = new MyGraphicElement();
node2.anchor.set( 1, 2 );
node1.appendChild( node2 );

// Set a transformation on the first element.
// The transformation will also apply on all children of the node.
const scaling = new MatrixTransform();
scaling.matrix.applyScaling( new Vector2( 3, 3 ) );
node1.transformation.push( scaling );

// Create a view.
const view = new View();

// Mount the sub tree of your document that you want to calculate to the view.
// This creates a copy of the sub tree and calculates all transformation matrices.
view.mountNode( node1 );

// Access the presentation node, which contains the transformation matrix for your element.
const presentationNode2 = node2.presentationNodes[ 0 ];
const transformationMatrix = presentationNode2.projectNodeToView;

// Calculate the position of the anchor point in the view by applying the matrix.
const transformedPoint = node2.anchor.clone().transform( transformationMatrix );

expect( transformedPoint.x ).to.equal( 3 );
expect( transformedPoint.y ).to.equal( 6 );
```

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

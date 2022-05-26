# Example code - daign-2d-pipeline

The complete example is part of the [unit tests](../test/usageExamples.spec.ts).

### Extend GraphicNode

Extend GraphicNode to create a class for your graphical elements.
Add properties that define your element.

You should add at least one Vector2 property
as these are the point coordinates that will be projected.

```typescript
import { Vector2 } from '@daign/math';
import { GraphicNode } from '@daign/2d-pipeline';

class MyGraphicElement extends GraphicNode {
  // Anchor position of the element.
  public anchor: Vector2 = new Vector2();

  public constructor() {
    super();
  }
}
```

### Document tree

Create your document tree.
Each node can have multiple children and multiple transformations.

The transformations will also apply on all children of a node.

```typescript
import { Vector2 } from '@daign/math';
import { MatrixTransform } from '@daign/2d-pipeline';
import { MyGraphicElement } from './myGraphicElement.ts';

// Start your document tree by creating an element.
const node1 = new MyGraphicElement();
node1.anchor.set( 0, 0 );

// Append a child element.
const node2 = new MyGraphicElement();
node2.anchor.set( 1, 2 );
node1.appendChild( node2 );

// Set a transformation on the first element.
const matrixTransform = new MatrixTransform();
matrixTransform.matrix.applyScaling( new Vector2( 3, 3 ) );
node1.transformation.push( matrixTransform );
```

### Projection

Create a view and mount the top of your document to it.
This creates a copy of the document tree and calculates all transformation matrices.

You can create multiple views and mount subtrees of your document to them,
in which case only transformations of the subtree apply.

The transformation matrices can then be used to project element coordinates to view coordinates
and vice versa.

```typescript
import { expect } from 'chai';
import { View } from '@daign/2d-pipeline';

// Create a view and mount the top of your document to it.
const view = new View();
view.mountNode( node1 );

// Access the presentation node, which contains the transformation matrix for your element.
const presentationNode2 = node2.presentationNodes[ 0 ];
const transformationMatrix = presentationNode2.projectNodeToView;

// Calculate the position of the anchor point in the view by applying the matrix.
const transformedPoint = node2.anchor.clone().transform( transformationMatrix );

expect( transformedPoint.x ).to.equal( 3 );
expect( transformedPoint.y ).to.equal( 6 );
```

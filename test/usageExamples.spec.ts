import { expect } from 'chai';

import { Vector2 } from '@daign/math';

import { GraphicNode, MatrixTransform, View } from '../lib';

describe( 'UsageExamples', (): void => {
  describe( 'basic example', (): void => {
    it( 'should calculate the position of points in the view', (): void => {
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
    } );
  } );
} );

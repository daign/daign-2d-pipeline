import { expect } from 'chai';

import { Matrix3 } from '@daign/math';

import { GraphicNode } from '../lib/graphicNode';
import { PresentationNode } from '../lib/presentationNode';
import { View } from '../lib/view';

describe( 'GraphicNode', (): void => {
  describe( 'constructor', (): void => {
    it( 'should initialize with an identity transformation', (): void => {
      // Act
      const g = new GraphicNode();

      // Assert
      const expected = new Matrix3().setIdentity();
      expect( g.transformation.transformMatrix.equals( expected ) ).to.be.true;
    } );
  } );

  describe( 'registerPresentationNode', (): void => {
    it( 'should add the node to the presentation nodes array', (): void => {
      // Arrange
      const view = new View();
      const graphicNode = new GraphicNode();
      const source = new GraphicNode();
      const presentationNode = new PresentationNode( view, source );

      // Act
      graphicNode.registerPresentationNode( presentationNode );

      // Assert
      expect( graphicNode.presentationNodes.length ).to.equal( 1 );
      expect( graphicNode.presentationNodes[ 0 ] ).to.equal( presentationNode );
    } );
  } );

  describe( 'removePresentationNode', (): void => {
    it( 'should remove the node from the presentation nodes array', (): void => {
      // Arrange
      const view = new View();
      const graphicNode = new GraphicNode();
      const source = new GraphicNode();
      const presentationNode1 = new PresentationNode( view, source );
      const presentationNode2 = new PresentationNode( view, source );
      graphicNode.registerPresentationNode( presentationNode1 );
      graphicNode.registerPresentationNode( presentationNode2 );

      // Act
      graphicNode.removePresentationNode( presentationNode1 );

      // Assert
      expect( graphicNode.presentationNodes.length ).to.equal( 1 );
      expect( graphicNode.presentationNodes[ 0 ] ).to.equal( presentationNode2 );
    } );

    it( 'should not remove a node when the given node is not in the array', (): void => {
      // Arrange
      const view = new View();
      const graphicNode = new GraphicNode();
      const source = new GraphicNode();
      const presentationNode1 = new PresentationNode( view, source );
      const presentationNode2 = new PresentationNode( view, source );
      graphicNode.registerPresentationNode( presentationNode2 );

      // Act
      graphicNode.removePresentationNode( presentationNode1 );

      // Assert
      expect( graphicNode.presentationNodes.length ).to.equal( 1 );
      expect( graphicNode.presentationNodes[ 0 ] ).to.equal( presentationNode2 );
    } );
  } );
} );

import { expect } from 'chai';
import { spy } from 'sinon';

import { Matrix3, Vector2 } from '@daign/math';

import {
  GraphicNode, MatrixTransform, NativeTranslateTransform, PresentationNode, View
} from '../lib';

describe( 'PresentationNode', (): void => {
  describe( 'constructor', (): void => {
    it( 'should register the node at the sourceNode', (): void => {
      // Arrange
      const view = new View();
      const source = new GraphicNode();

      // Act
      const node = new PresentationNode( view, source );

      // Assert
      expect( source.presentationNodes.length ).to.equal( 1 );
      expect( source.presentationNodes[ 0 ] ).to.equal( node );
    } );

    it( 'should call updateProjectionMatrices when transformation of sourceNode changes',
      (): void => {
        // Arrange
        const view = new View();
        const transformation = new MatrixTransform();
        const source = new GraphicNode();
        source.transformation.push( transformation );

        const node = new PresentationNode( view, source );
        const updateProjectionMatricesSpy = spy( node, 'updateProjectionMatrices' );

        // Act
        transformation.matrix.setTranslation( new Vector2( 1, 2 ) );

        // Assert
        expect( updateProjectionMatricesSpy.calledOnce ).to.be.true;
      }
    );

    it( 'should not call updateProjectionMatrices when subscription was removed',
      (): void => {
        // Arrange
        const view = new View();
        const transformation = new MatrixTransform();
        const source = new GraphicNode();
        source.transformation.push( transformation );

        const node = new PresentationNode( view, source );
        const updateProjectionMatricesSpy = spy( node, 'updateProjectionMatrices' );
        ( node as any ).removeSourceNodeSubscription();

        // Act
        transformation.matrix.setTranslation( new Vector2( 1, 2 ) );

        // Assert
        expect( updateProjectionMatricesSpy.notCalled ).to.be.true;
      }
    );

    it( 'should notify observers of projectNodeToView matrix when parents transformation changes',
      (): void => {
        // Arrange
        const parentTransformation = new MatrixTransform();
        parentTransformation.matrix.setTranslation( new Vector2( 1, 2 ) );
        const parent = new GraphicNode();
        parent.transformation.push( parentTransformation );

        const child = new GraphicNode();
        parent.appendChild( child );

        const view = new View();
        view.mountNode( parent );

        const presentationNode = child.presentationNodes[ 0 ];
        const spyCallback = spy();
        presentationNode.projectNodeToView.subscribeToChanges( (): void => {
          spyCallback();
        } );

        // Act
        parentTransformation.matrix.setTranslation( new Vector2( 2, 5 ) );

        // Assert
        expect( spyCallback.called ).to.be.true;
      }
    );
  } );

  describe( 'updateProjectionMatrices', (): void => {
    it( 'should copy the source node transformation when no parent exists', (): void => {
      // Arrange
      const view = new View();
      const translation = new Matrix3().setTranslation( new Vector2( 1, 2 ) );
      const transformation = new MatrixTransform();
      transformation.matrix.copy( translation );
      const source = new GraphicNode();
      source.transformation.push( transformation );
      const node = new PresentationNode( view, source );

      // Act
      node.updateProjectionMatrices();

      // Assert
      expect( node.projectNodeToView.equals( translation ) ).to.be.true;
    } );

    it( 'should combine transformation with the projection of the parent node', (): void => {
      // Arrange
      const view = new View();
      const translation1 = new Matrix3().setTranslation( new Vector2( 1, 2 ) );
      const translation2 = new Matrix3().setTranslation( new Vector2( 3, 4 ) );
      const combinedTranslation = new Matrix3().setTranslation( new Vector2( 4, 6 ) );

      const parentTransformation = new MatrixTransform();
      parentTransformation.matrix.copy( translation1 );
      const parentSource = new GraphicNode();
      parentSource.transformation.push( parentTransformation );
      const parent = new PresentationNode( view, parentSource );
      parent.updateProjectionMatrices();

      const transformation = new MatrixTransform();
      transformation.matrix.copy( translation2 );
      const source = new GraphicNode();
      source.transformation.push( transformation );
      const node = new PresentationNode( view, source );

      parent.appendChild( node );

      // Act
      node.updateProjectionMatrices();

      // Assert
      expect( node.projectNodeToView.equals( combinedTranslation ) ).to.be.true;
    } );

    it( 'should set the inverse projection', (): void => {
      // Arrange
      const view = new View();
      const translation = new Matrix3().setTranslation( new Vector2( 1, 2 ) );
      const inverseTranslation = new Matrix3().setTranslation( new Vector2( -1, -2 ) );
      const transformation = new MatrixTransform();
      transformation.matrix.copy( translation );
      const source = new GraphicNode();
      source.transformation.push( transformation );
      const node = new PresentationNode( view, source );

      // Act
      node.updateProjectionMatrices();

      // Assert
      expect( node.projectViewToNode.equals( inverseTranslation ) ).to.be.true;
    } );

    it( 'should set the non native projection', (): void => {
      // Arrange
      const view = new View();
      const translation1 = new Matrix3().setTranslation( new Vector2( 1, 2 ) );
      const transformation1 = new MatrixTransform();
      transformation1.matrix.copy( translation1 );
      const transformation2 = new NativeTranslateTransform();
      transformation2.translation.copy( new Vector2( 3, 4 ) );

      const source = new GraphicNode();
      source.transformation.push( transformation1 );
      source.transformation.push( transformation2 );
      const node = new PresentationNode( view, source );

      // Act
      node.updateProjectionMatrices();

      // Assert
      expect( node.projectNodeToViewNonNative.equals( translation1 ) ).to.be.true;
    } );

    it( 'should combine the non native projection with the projection of the parent node',
      (): void => {
        // Arrange
        const view = new View();
        const translation1 = new Matrix3().setTranslation( new Vector2( 1, 2 ) );
        const translation2 = new Matrix3().setTranslation( new Vector2( 3, 4 ) );
        const combinedTranslation = new Matrix3().setTranslation( new Vector2( 4, 6 ) );

        const parentTransformation = new MatrixTransform();
        parentTransformation.matrix.copy( translation1 );
        const parentSource = new GraphicNode();
        parentSource.transformation.push( parentTransformation );
        const parent = new PresentationNode( view, parentSource );
        parent.updateProjectionMatrices();

        const transformation1 = new MatrixTransform();
        transformation1.matrix.copy( translation2 );
        const transformation2 = new NativeTranslateTransform();
        transformation2.translation.copy( new Vector2( 7, 8 ) );

        const source = new GraphicNode();
        source.transformation.push( transformation1 );
        source.transformation.push( transformation2 );
        const node = new PresentationNode( view, source );

        parent.appendChild( node );

        // Act
        node.updateProjectionMatrices();

        // Assert
        expect( node.projectNodeToViewNonNative.equals( combinedTranslation ) ).to.be.true;
      }
    );

    it( 'should call updateProjectionMatrices on all children', (): void => {
      // Arrange
      const view = new View();
      const source = new GraphicNode();
      const node = new PresentationNode( view, source );

      const childSource1 = new GraphicNode();
      const child1 = new PresentationNode( view, childSource1 );
      node.appendChild( child1 );
      const updateProjectionMatricesSpy1 = spy( child1, 'updateProjectionMatrices' );

      const childSource2 = new GraphicNode();
      const child2 = new PresentationNode( view, childSource2 );
      node.appendChild( child2 );
      const updateProjectionMatricesSpy2 = spy( child2, 'updateProjectionMatrices' );

      // Act
      node.updateProjectionMatrices();

      // Assert
      expect( updateProjectionMatricesSpy1.calledOnce ).to.be.true;
      expect( updateProjectionMatricesSpy2.calledOnce ).to.be.true;
    } );
  } );

  describe( 'destroyNode', (): void => {
    it( 'should call clearChildren via super class method', (): void => {
      // Arrange
      const view = new View();
      const source = new GraphicNode();
      const node = new PresentationNode( view, source );
      const clearChildrenSpy = spy( node, 'clearChildren' );

      // Act
      node.destroyNode();

      // Assert
      expect( clearChildrenSpy.calledOnce ).to.be.true;
    } );

    it( 'should call removeSourceNodeSubscription', (): void => {
      // Arrange
      const view = new View();
      const source = new GraphicNode();
      const node = new PresentationNode( view, source );
      const removeSourceNodeSubscriptionSpy = spy( node as any, 'removeSourceNodeSubscription' );

      // Act
      node.destroyNode();

      // Assert
      expect( removeSourceNodeSubscriptionSpy.calledOnce ).to.be.true;
    } );

    it( 'should remove the node from the sourceNode', (): void => {
      // Arrange
      const view = new View();
      const source = new GraphicNode();
      const node = new PresentationNode( view, source );

      // Act
      node.destroyNode();

      // Assert
      expect( source.presentationNodes.length ).to.equal( 0 );
    } );
  } );
} );

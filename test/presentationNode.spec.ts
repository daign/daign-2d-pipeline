import { expect } from 'chai';
import * as sinon from 'sinon';

import { Matrix3, Vector2 } from '@daign/math';

import { MatrixTransform } from '../lib/transformations';

import { GraphicNode } from '../lib/graphicNode';
import { PresentationNode } from '../lib/presentationNode';
import { View } from '../lib/view';

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
        source.transformation.append( transformation );

        const node = new PresentationNode( view, source );
        const spy = sinon.spy( node, 'updateProjectionMatrices' );

        // Act
        transformation.matrix.setTranslation( new Vector2( 1, 2 ) );

        // Assert
        expect( spy.calledOnce ).to.be.true;
      }
    );

    it( 'should not call updateProjectionMatrices when subscription was removed',
      (): void => {
        // Arrange
        const view = new View();
        const transformation = new MatrixTransform();
        const source = new GraphicNode();
        source.transformation.append( transformation );

        const node = new PresentationNode( view, source );
        const spy = sinon.spy( node, 'updateProjectionMatrices' );
        ( node as any ).removeSourceNodeSubscription();

        // Act
        transformation.matrix.setTranslation( new Vector2( 1, 2 ) );

        // Assert
        expect( spy.notCalled ).to.be.true;
      }
    );

    it( 'should notify observers of projectNodeToView matrix when parents transformation changes',
      (): void => {
        // Arrange
        const parentTransformation = new MatrixTransform();
        parentTransformation.matrix.setTranslation( new Vector2( 1, 2 ) );
        const parent = new GraphicNode();
        parent.transformation.append( parentTransformation );

        const child = new GraphicNode();
        parent.appendChild( child );

        const view = new View();
        view.mountNode( parent );

        const presentationNode = child.presentationNodes[ 0 ];
        const spy = sinon.spy();
        presentationNode.projectNodeToView.subscribeToChanges( (): void => {
          spy();
        } );

        // Act
        parentTransformation.matrix.setTranslation( new Vector2( 2, 5 ) );

        // Assert
        expect( spy.called ).to.be.true;
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
      source.transformation.append( transformation );
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
      parentSource.transformation.append( parentTransformation );
      const parent = new PresentationNode( view, parentSource );
      parent.updateProjectionMatrices();

      const transformation = new MatrixTransform();
      transformation.matrix.copy( translation2 );
      const source = new GraphicNode();
      source.transformation.append( transformation );
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
      source.transformation.append( transformation );
      const node = new PresentationNode( view, source );

      // Act
      node.updateProjectionMatrices();

      // Assert
      expect( node.projectViewToNode.equals( inverseTranslation ) ).to.be.true;
    } );

    it( 'should call updateProjectionMatrices on all children', (): void => {
      // Arrange
      const view = new View();
      const source = new GraphicNode();
      const node = new PresentationNode( view, source );

      const childSource1 = new GraphicNode();
      const child1 = new PresentationNode( view, childSource1 );
      node.appendChild( child1 );
      const spy1 = sinon.spy( child1, 'updateProjectionMatrices' );

      const childSource2 = new GraphicNode();
      const child2 = new PresentationNode( view, childSource2 );
      node.appendChild( child2 );
      const spy2 = sinon.spy( child2, 'updateProjectionMatrices' );

      // Act
      node.updateProjectionMatrices();

      // Assert
      expect( spy1.calledOnce ).to.be.true;
      expect( spy2.calledOnce ).to.be.true;
    } );
  } );

  describe( 'destroyNode', (): void => {
    it( 'should call clearChildren via super class method', (): void => {
      // Arrange
      const view = new View();
      const source = new GraphicNode();
      const node = new PresentationNode( view, source );
      const spy = sinon.spy( node, 'clearChildren' );

      // Act
      node.destroyNode();

      // Assert
      expect( spy.calledOnce ).to.be.true;
    } );

    it( 'should call removeSourceNodeSubscription', (): void => {
      // Arrange
      const view = new View();
      const source = new GraphicNode();
      const node = new PresentationNode( view, source );
      const spy = sinon.spy( node as any, 'removeSourceNodeSubscription' );

      // Act
      node.destroyNode();

      // Assert
      expect( spy.calledOnce ).to.be.true;
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

    it( 'should set sourceNode to null', (): void => {
      // Arrange
      const view = new View();
      const source = new GraphicNode();
      const node = new PresentationNode( view, source );

      // Act
      node.destroyNode();

      // Assert
      expect( node.sourceNode ).to.be.null;
    } );

    it( 'should not throw error when sourceNode is null', (): void => {
      // Arrange
      const view = new View();
      const source = new GraphicNode();
      const node = new PresentationNode( view, source );
      node.sourceNode = null;

      // Act
      const badFn = (): void => {
        node.destroyNode();
      };

      // Assert
      expect( badFn ).to.not.throw();
    } );
  } );
} );

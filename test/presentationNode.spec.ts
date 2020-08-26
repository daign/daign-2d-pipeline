import { expect } from 'chai';
import * as sinon from 'sinon';

import { Matrix3, Vector2 } from '@daign/math';

import { MatrixTransform } from '../lib/transformations';

import { GraphicNode } from '../lib/graphicNode';
import { PresentationNode } from '../lib/presentationNode';

describe( 'PresentationNode', (): void => {
  describe( 'constructor', (): void => {
    it( 'should call updateProjectionMatrices when transformation of sourceNode changes',
      (): void => {
        // Arrange
        const transformation = new MatrixTransform();
        const source = new GraphicNode();
        source.transformation.append( transformation );

        const node = new PresentationNode( source );
        const spy = sinon.spy( node, 'updateProjectionMatrices' );

        // Act
        transformation.matrix.setTranslation( new Vector2( 1, 2 ) );

        // Assert
        expect( spy.calledOnce ).to.be.true;
      }
    );
  } );

  describe( 'updateProjectionMatrices', (): void => {
    it( 'should copy the source node transformation when no parent exists', (): void => {
      // Arrange
      const translation = new Matrix3().setTranslation( new Vector2( 1, 2 ) );
      const transformation = new MatrixTransform();
      transformation.matrix.copy( translation );
      const source = new GraphicNode();
      source.transformation.append( transformation );
      const node = new PresentationNode( source );

      // Act
      node.updateProjectionMatrices();

      // Assert
      expect( node.projectViewToNode.equals( translation ) ).to.be.true;
    } );

    it( 'should combine transformation with the projection of the parent node', (): void => {
      // Arrange
      const translation1 = new Matrix3().setTranslation( new Vector2( 1, 2 ) );
      const translation2 = new Matrix3().setTranslation( new Vector2( 3, 4 ) );
      const combinedTranslation = new Matrix3().setTranslation( new Vector2( 4, 6 ) );

      const parentTransformation = new MatrixTransform();
      parentTransformation.matrix.copy( translation1 );
      const parentSource = new GraphicNode();
      parentSource.transformation.append( parentTransformation );
      const parent = new PresentationNode( parentSource );
      parent.updateProjectionMatrices();

      const transformation = new MatrixTransform();
      transformation.matrix.copy( translation2 );
      const source = new GraphicNode();
      source.transformation.append( transformation );
      const node = new PresentationNode( source );

      parent.appendChild( node );

      // Act
      node.updateProjectionMatrices();

      // Assert
      expect( node.projectViewToNode.equals( combinedTranslation ) ).to.be.true;
    } );

    it( 'should set the inverse projection', (): void => {
      // Arrange
      const translation = new Matrix3().setTranslation( new Vector2( 1, 2 ) );
      const inverseTranslation = new Matrix3().setTranslation( new Vector2( -1, -2 ) );
      const transformation = new MatrixTransform();
      transformation.matrix.copy( translation );
      const source = new GraphicNode();
      source.transformation.append( transformation );
      const node = new PresentationNode( source );

      // Act
      node.updateProjectionMatrices();

      // Assert
      expect( node.projectNodeToView.equals( inverseTranslation ) ).to.be.true;
    } );

    it( 'should call updateProjectionMatrices on all children', (): void => {
      // Arrange
      const source = new GraphicNode();
      const node = new PresentationNode( source );

      const childSource1 = new GraphicNode();
      const child1 = new PresentationNode( childSource1 );
      node.appendChild( child1 );
      const spy1 = sinon.spy( child1, 'updateProjectionMatrices' );

      const childSource2 = new GraphicNode();
      const child2 = new PresentationNode( childSource2 );
      node.appendChild( child2 );
      const spy2 = sinon.spy( child2, 'updateProjectionMatrices' );

      // Act
      node.updateProjectionMatrices();

      // Assert
      expect( spy1.calledOnce ).to.be.true;
      expect( spy2.calledOnce ).to.be.true;
    } );
  } );
} );

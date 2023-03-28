import { expect } from 'chai';
import { spy } from 'sinon';

import { Matrix3, Vector2 } from '@daign/math';

import { MatrixTransform } from '../../lib';

describe( 'MatrixTransform', (): void => {
  describe( 'getter matrix', (): void => {
    it( 'should return the matrix', (): void => {
      // Arrange
      const matrixTransform = new MatrixTransform();
      matrixTransform.matrix.setTranslation( new Vector2( 1, 2 ) );

      // Act
      const matrix = matrixTransform.matrix;

      // Assert
      const expected = new Matrix3().setTranslation( new Vector2( 1, 2 ) );
      expect( matrix.equals( expected ) ).to.be.true;
    } );
  } );

  describe( 'getter matrixNonNative', (): void => {
    it( 'should return the matrix', (): void => {
      // Arrange
      const matrixTransform = new MatrixTransform();
      matrixTransform.matrix.setTranslation( new Vector2( 1, 2 ) );

      // Act
      const matrixNonNative = matrixTransform.matrixNonNative;

      // Assert
      const expected = new Matrix3().setTranslation( new Vector2( 1, 2 ) );
      expect( matrixNonNative.equals( expected ) ).to.be.true;
    } );
  } );

  describe( 'getter nativeSvgTransform', (): void => {
    it( 'should return null', (): void => {
      // Arrange
      const matrixTransform = new MatrixTransform();
      matrixTransform.matrix.setTranslation( new Vector2( 1, 2 ) );

      // Act
      const transformCommand = matrixTransform.nativeSvgTransform;

      // Assert
      expect( transformCommand ).to.be.null;
    } );
  } );

  describe( 'constructor', (): void => {
    it( 'should initialize with identity matrix', (): void => {
      // Act
      const matrixTransform = new MatrixTransform();

      // Assert
      const expected = new Matrix3().setIdentity();
      expect( matrixTransform.matrix.equals( expected ) ).to.be.true;
    } );

    it( 'should notify observers if matrix changes', (): void => {
      // Arrange
      const matrixTransform = new MatrixTransform();
      const notifyObserversSpy = spy( matrixTransform as any, 'notifyObservers' );

      // Act
      matrixTransform.matrix.setTranslation( new Vector2( 1, 2 ) );

      // Assert
      expect( notifyObserversSpy.calledOnce ).to.be.true;
    } );
  } );
} );

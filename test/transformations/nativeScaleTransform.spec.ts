import { expect } from 'chai';
import { spy } from 'sinon';

import { Matrix3, Vector2 } from '@daign/math';

import { NativeScaleTransform } from '../../lib';

describe( 'NativeScaleTransform', (): void => {
  describe( 'getter matrix', (): void => {
    it( 'should return the matrix', (): void => {
      // Arrange
      const transform = new NativeScaleTransform();
      transform.scaling.set( 2, 3 );

      // Act
      const matrix = transform.matrix;

      // Assert
      const expected = new Matrix3().setScaling( new Vector2( 2, 3 ) );
      expect( matrix.equals( expected ) ).to.be.true;
    } );
  } );

  describe( 'getter matrixNonNative', (): void => {
    it( 'should return the identity matrix', (): void => {
      // Arrange
      const transform = new NativeScaleTransform();
      transform.scaling.set( 2, 3 );

      // Act
      const matrixNonNative = transform.matrixNonNative;

      // Assert
      const expected = new Matrix3().setIdentity();
      expect( matrixNonNative.equals( expected ) ).to.be.true;
    } );
  } );

  describe( 'getter nativeSvgTransform', (): void => {
    it( 'should return the transform command', (): void => {
      // Arrange
      const transform = new NativeScaleTransform();
      transform.scaling.set( 1, 3 );

      // Act
      const transformCommand = transform.nativeSvgTransform;

      // Assert
      expect( transformCommand ).to.equal( 'scale(1, 3)' );
    } );

    it( 'should return null if scaling is one', (): void => {
      // Arrange
      const transform = new NativeScaleTransform();
      transform.scaling.set( 1, 1 );

      // Act
      const transformCommand = transform.nativeSvgTransform;

      // Assert
      expect( transformCommand ).to.be.null;
    } );
  } );

  describe( 'constructor', (): void => {
    it( 'should notify observers if scaling vector changes', (): void => {
      // Arrange
      const transform = new NativeScaleTransform();
      const notifyObserversSpy = spy( transform as any, 'notifyObservers' );

      // Act
      transform.scaling.set( 1, 2 );

      // Assert
      expect( notifyObserversSpy.calledOnce ).to.be.true;
    } );
  } );
} );

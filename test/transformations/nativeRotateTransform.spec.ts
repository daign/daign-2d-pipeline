import { expect } from 'chai';
import { spy } from 'sinon';

import { Angle, Matrix3, Vector2 } from '@daign/math';

import { NativeRotateTransform } from '../../lib';

describe( 'NativeRotateTransform', (): void => {
  describe( 'getter matrix', (): void => {
    it( 'should return the matrix', (): void => {
      // Arrange
      const transform = new NativeRotateTransform();
      transform.angle.degrees = 10;
      transform.center.set( 1, 2 );

      // Act
      const matrix = transform.matrix;

      // Assert
      const expected = new Matrix3()
        .setRotation( new Angle().setDegrees( 10 ), new Vector2( 1, 2 ) );
      expect( matrix.equals( expected ) ).to.be.true;
    } );
  } );

  describe( 'getter matrixNonNative', (): void => {
    it( 'should return the identity matrix', (): void => {
      // Arrange
      const transform = new NativeRotateTransform();
      transform.angle.degrees = 10;
      transform.center.set( 1, 2 );

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
      const transform = new NativeRotateTransform();
      transform.angle.degrees = 10;
      transform.center.set( 1, 2 );

      // Act
      const transformCommand = transform.nativeSvgTransform;

      // Assert
      expect( transformCommand ).to.equal( 'rotate(10, 1, 2)' );
    } );

    it( 'should return short command if center is not given', (): void => {
      // Arrange
      const transform = new NativeRotateTransform();
      transform.angle.degrees = 10;

      // Act
      const transformCommand = transform.nativeSvgTransform;

      // Assert
      expect( transformCommand ).to.equal( 'rotate(10)' );
    } );

    it( 'should return null if angle is zero', (): void => {
      // Arrange
      const transform = new NativeRotateTransform();
      transform.center.set( 1, 2 );

      // Act
      const transformCommand = transform.nativeSvgTransform;

      // Assert
      expect( transformCommand ).to.be.null;
    } );
  } );

  describe( 'constructor', (): void => {
    it( 'should notify observers if angle changes', (): void => {
      // Arrange
      const transform = new NativeRotateTransform();
      const notifyObserversSpy = spy( transform as any, 'notifyObservers' );

      // Act
      transform.angle.degrees = 10;

      // Assert
      expect( notifyObserversSpy.calledOnce ).to.be.true;
    } );

    it( 'should notify observers if center vector changes', (): void => {
      // Arrange
      const transform = new NativeRotateTransform();
      const notifyObserversSpy = spy( transform as any, 'notifyObservers' );

      // Act
      transform.center.set( 1, 2 );

      // Assert
      expect( notifyObserversSpy.calledOnce ).to.be.true;
    } );
  } );
} );

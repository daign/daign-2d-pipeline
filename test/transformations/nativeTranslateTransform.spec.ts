import { expect } from 'chai';
import { spy } from 'sinon';

import { Matrix3, Vector2 } from '@daign/math';

import { NativeTranslateTransform } from '../../lib';

describe( 'NativeTranslateTransform', (): void => {
  describe( 'getter matrix', (): void => {
    it( 'should return the matrix', (): void => {
      // Arrange
      const transform = new NativeTranslateTransform();
      transform.translation.set( 1, 2 );

      // Act
      const matrix = transform.matrix;

      // Assert
      const expected = new Matrix3().setTranslation( new Vector2( 1, 2 ) );
      expect( matrix.equals( expected ) ).to.be.true;
    } );
  } );

  describe( 'getter matrixNonNative', (): void => {
    it( 'should return the identity matrix', (): void => {
      // Arrange
      const transform = new NativeTranslateTransform();
      transform.translation.set( 1, 2 );

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
      const transform = new NativeTranslateTransform();
      transform.translation.set( 1, 2 );

      // Act
      const transformCommand = transform.nativeSvgTransform;

      // Assert
      expect( transformCommand ).to.equal( 'translate(1, 2)' );
    } );

    it( 'should return null if translation is zero', (): void => {
      // Arrange
      const transform = new NativeTranslateTransform();
      transform.translation.set( 0, 0 );

      // Act
      const transformCommand = transform.nativeSvgTransform;

      // Assert
      expect( transformCommand ).to.be.null;
    } );
  } );

  describe( 'constructor', (): void => {
    it( 'should notify observers if translation vector changes', (): void => {
      // Arrange
      const transform = new NativeTranslateTransform();
      const notifyObserversSpy = spy( transform as any, 'notifyObservers' );

      // Act
      transform.translation.set( 1, 2 );

      // Assert
      expect( notifyObserversSpy.calledOnce ).to.be.true;
    } );
  } );
} );

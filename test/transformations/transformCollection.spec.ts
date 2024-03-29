import { expect } from 'chai';
import { spy } from 'sinon';

import { Angle, Matrix3, Vector2 } from '@daign/math';

import {
  MatrixTransform, NativeRotateTransform, NativeTranslateTransform, TransformCollection
} from '../../lib';

describe( 'TransformCollection', (): void => {
  describe( 'constructor', (): void => {
    it( 'should initialize with identity matrices', (): void => {
      // Act
      const t = new TransformCollection();

      // Assert
      const expected = new Matrix3().setIdentity();
      expect( t.transformMatrix.equals( expected ) ).to.be.true;
      expect( t.inverseTransformMatrix.equals( expected ) ).to.be.true;
    } );

    it( 'should call combineTransformations when a transformation is added', (): void => {
      // Arrange
      const t = new TransformCollection();
      const combineTransformationsSpy = spy( t as any, 'combineTransformations' );

      // Act
      const m = new MatrixTransform();
      m.matrix.setTranslation( new Vector2( 1, 2 ) );
      t.push( m );

      // Assert
      expect( combineTransformationsSpy.calledOnce ).to.be.true;
    } );

    it( 'should call combineTransformations when a transformation changes', (): void => {
      // Arrange
      const t = new TransformCollection();
      const m = new MatrixTransform();
      t.push( m );
      const combineTransformationsSpy = spy( t as any, 'combineTransformations' );

      // Act
      m.matrix.setTranslation( new Vector2( 1, 2 ) );

      // Assert
      expect( combineTransformationsSpy.calledOnce ).to.be.true;
    } );

    it( 'should combine transformations before alerting other observers', (): void => {
      // Arrange
      const t = new TransformCollection();
      const m = new MatrixTransform();
      t.push( m );
      const translationMatrix = new Matrix3().setTranslation( new Vector2( 1, 2 ) );

      /* Using a subscription like the callback which executes combineTransformations. Upon
       * notification the combined matrix should already be in the transformMatrix property. */
      t.subscribeToChanges( (): void => {
        // Assert
        expect( t.transformMatrix.equals( translationMatrix ) ).to.be.true;
      } );

      // Act
      m.matrix.copy( translationMatrix );
    } );
  } );

  describe( 'combineTransformations', (): void => {
    it( 'should combine transformations when transformations are added', (): void => {
      // Arrange
      const t = new TransformCollection();
      const m1 = new MatrixTransform();
      m1.matrix.setScaling( new Vector2( 2, 3 ) );
      const m2 = new MatrixTransform();
      m2.matrix.setTranslation( new Vector2( 1, 2 ) );

      // Act
      // Order of append is important.
      t.push( m1 );
      t.push( m2 );

      // Assert
      const expected = new Matrix3( 2, 0, 2, 0, 3, 6, 0, 0, 1 );
      expect( t.transformMatrix.equals( expected ) ).to.be.true;
    } );

    it( 'should combine transformations in the correct order', (): void => {
      // Arrange
      const t = new TransformCollection();
      const m1 = new MatrixTransform();
      m1.matrix.setScaling( new Vector2( 2, 3 ) );
      const m2 = new MatrixTransform();
      m2.matrix.setTranslation( new Vector2( 1, 2 ) );
      // Order of append is important.
      t.push( m1 );
      t.push( m2 );

      // Act
      const v = new Vector2();
      v.transform( t.transformMatrix );

      // Assert
      const expected = new Vector2( 2, 6 );
      expect( v.equals( expected ) ).to.be.true;
    } );

    it( 'should calculate the correct inverse transformation', (): void => {
      // Arrange
      const t = new TransformCollection();
      const m1 = new MatrixTransform();
      m1.matrix.setScaling( new Vector2( 2, 3 ) );
      const m2 = new MatrixTransform();
      m2.matrix.setTranslation( new Vector2( 1, 2 ) );
      // Order of append is important.
      t.push( m1 );
      t.push( m2 );

      // Act
      const v = new Vector2( 2, 6 );
      v.transform( t.inverseTransformMatrix );

      // Assert
      const expected = new Vector2( 0, 0 );
      expect( v.equals( expected ) ).to.be.true;
    } );

    it( 'should calculate the correct non native transformation', (): void => {
      // Arrange
      const t = new TransformCollection();
      const matrixTransform = new MatrixTransform();
      matrixTransform.matrix.setScaling( new Vector2( 2, 3 ) );
      const nativeTransform = new NativeTranslateTransform();
      nativeTransform.translation.copy( new Vector2( 4, 5 ) );
      t.push( matrixTransform );
      t.push( nativeTransform );

      // Act
      const v = new Vector2( 1, 2 );
      v.transform( t.transformMatrixNonNative );

      // Assert
      const expected = new Vector2( 2, 6 );
      expect( v.equals( expected ) ).to.be.true;
    } );

    it( 'should calculate the correct native transform command', (): void => {
      // Arrange
      const t = new TransformCollection();
      const nativeTransform1 = new NativeTranslateTransform();
      nativeTransform1.translation.copy( new Vector2( 1, 2 ) );
      const nativeTransform2 = new NativeRotateTransform();
      nativeTransform2.angle.copy( new Angle().setDegrees( 30 ) );
      nativeTransform2.center.copy( new Vector2( 4, 5 ) );
      t.push( nativeTransform1 );
      t.push( nativeTransform2 );

      // Act
      const nativeTransformCommand = t.nativeSvgTransform;

      // Assert
      expect( nativeTransformCommand ).to.equal(
        'translate(1, 2), rotate(29.999999999999996, 4, 5)'
      );
    } );

    it( 'should return null if there are no native transform commands', (): void => {
      // Arrange
      const t = new TransformCollection();
      const matrixTransform = new MatrixTransform();
      matrixTransform.matrix.setScaling( new Vector2( 2, 3 ) );
      t.push( matrixTransform );

      // Act
      const nativeTransformCommand = t.nativeSvgTransform;

      // Assert
      expect( nativeTransformCommand ).to.be.null;
    } );

    it( 'should combine transformations when the transformations change', (): void => {
      // Arrange
      const t = new TransformCollection();
      const m1 = new MatrixTransform();
      const m2 = new MatrixTransform();
      t.push( m1 );
      t.push( m2 );

      // Act
      // Order of modification is not important.
      m2.matrix.setTranslation( new Vector2( 1, 2 ) );
      m1.matrix.setScaling( new Vector2( 2, 3 ) );

      // Assert
      const expected = new Matrix3( 2, 0, 2, 0, 3, 6, 0, 0, 1 );
      expect( t.transformMatrix.equals( expected ) ).to.be.true;
    } );

    it( 'should keep the previous inverse matrix if the current can not be inverted', (): void => {
      // Arrange
      const t = new TransformCollection();
      const m = new MatrixTransform();
      t.push( m );
      const translation = new Vector2( 1, 2 );
      m.matrix.setTranslation( translation );

      // Act
      // This matrix can not be inverted.
      const singularMatrix = new Matrix3( 1, 2, 3, 4, 0, 4, 0, 0, 0 );
      m.matrix.copy( singularMatrix );

      // Assert
      // The transform matrix has changed to the singular matrix.
      expect( t.transformMatrix.equals( singularMatrix ) ).to.be.true;

      // But the inverse transform matrix is still the inverse of the previous translation.
      const inverseTranslation = translation.clone().multiplyScalar( -1 );
      const expected = new Matrix3().setTranslation( inverseTranslation );
      expect( t.inverseTransformMatrix.equals( expected ) ).to.be.true;
    } );
  } );
} );

import { expect } from 'chai';

import { Matrix3, Vector2 } from '@daign/math';

import { MatrixTransform, TransformCollection } from '../../lib/transformations';

describe( 'TransformCollection', () => {
  describe( 'constructor', () => {
    it( 'should initialize with identity matrices', () => {
      // Act
      const t = new TransformCollection();

      // Assert
      const expected = new Matrix3().setIdentity();
      expect( t.transformMatrix.equals( expected ) ).to.be.true;
      expect( t.inverseTransformMatrix.equals( expected ) ).to.be.true;
    } );
  } );

  describe( 'onItemUpdate', () => {
    it( 'should combine transformations when transformations are added', () => {
      // Arrange
      const t = new TransformCollection();
      const m1 = new MatrixTransform();
      m1.matrix.setTranslation( new Vector2( 1, 2 ) );
      const m2 = new MatrixTransform();
      m2.matrix.setScaling( new Vector2( 2, 3 ) );

      // Act
      // Order of append is important.
      t.append( m1 );
      t.append( m2 );

      // Assert
      const expected = new Matrix3( 2, 0, 2, 0, 3, 6, 0, 0, 1 );
      expect( t.transformMatrix.equals( expected ) ).to.be.true;
    } );

    it( 'should combine transformations in the correct order', () => {
      // Arrange
      const t = new TransformCollection();
      const m1 = new MatrixTransform();
      m1.matrix.setTranslation( new Vector2( 1, 2 ) );
      const m2 = new MatrixTransform();
      m2.matrix.setScaling( new Vector2( 2, 3 ) );
      // Order of append is important.
      t.append( m1 );
      t.append( m2 );

      // Act
      const v = new Vector2();
      v.transform( t.transformMatrix );

      // Assert
      const expected = new Vector2( 2, 6 );
      expect( v.equals( expected ) ).to.be.true;
    } );

    it( 'should calculate the correct inverse transformation', () => {
      // Arrange
      const t = new TransformCollection();
      const m1 = new MatrixTransform();
      m1.matrix.setTranslation( new Vector2( 1, 2 ) );
      const m2 = new MatrixTransform();
      m2.matrix.setScaling( new Vector2( 2, 3 ) );
      // Order of append is important.
      t.append( m1 );
      t.append( m2 );

      // Act
      const v = new Vector2( 2, 6 );
      v.transform( t.inverseTransformMatrix );

      // Assert
      const expected = new Vector2( 0, 0 );
      expect( v.equals( expected ) ).to.be.true;
    } );

    it( 'should combine transformations when the transformations change', () => {
      // Arrange
      const t = new TransformCollection();
      const m1 = new MatrixTransform();
      const m2 = new MatrixTransform();
      t.append( m1 );
      t.append( m2 );

      // Act
      // Order of modification is not important.
      m2.matrix.setScaling( new Vector2( 2, 3 ) );
      m1.matrix.setTranslation( new Vector2( 1, 2 ) );

      // Assert
      const expected = new Matrix3( 2, 0, 2, 0, 3, 6, 0, 0, 1 );
      expect( t.transformMatrix.equals( expected ) ).to.be.true;
    } );

    it( 'should keep the previous inverse matrix if the current can not be inverted', () => {
      // Arrange
      const t = new TransformCollection();
      const m = new MatrixTransform();
      t.append( m );
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

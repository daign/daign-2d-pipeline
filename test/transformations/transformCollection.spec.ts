import {expect} from 'chai';

import {Matrix3, Vector2} from '@daign/math';

import {MatrixTransform} from '../../lib/transformations';
import {TransformCollection} from '../../lib/transformations';

describe( 'TransformCollection', () => {
  describe( 'constructor', () => {
    it( 'should initialize with identity matrices', () => {
      // act
      const t = new TransformCollection();

      // assert
      const expected = new Matrix3().setIdentity();
      expect( t.transformMatrix.equals( expected ) ).to.be.true;
      expect( t.inverseTransformMatrix.equals( expected ) ).to.be.true;
    } );
  } );

  describe( 'onItemUpdate', () => {
    it( 'should combine transformations when transformations are added', () => {
      // arrange
      const t = new TransformCollection();
      const m1 = new MatrixTransform();
      m1.matrix.setTranslation( new Vector2( 1, 2 ) );
      const m2 = new MatrixTransform();
      m2.matrix.setScaling( new Vector2( 2, 3 ) );

      // act
      // Order of append is important.
      t.append( m1 );
      t.append( m2 );

      // assert
      const expected = new Matrix3( 2, 0, 2, 0, 3, 6, 0, 0, 1 );
      expect( t.transformMatrix.equals( expected ) ).to.be.true;
    } );

    it( 'should combine transformations in the correct order', () => {
      // arrange
      const t = new TransformCollection();
      const m1 = new MatrixTransform();
      m1.matrix.setTranslation( new Vector2( 1, 2 ) );
      const m2 = new MatrixTransform();
      m2.matrix.setScaling( new Vector2( 2, 3 ) );
      // Order of append is important.
      t.append( m1 );
      t.append( m2 );

      // act
      const v = new Vector2();
      v.transform( t.transformMatrix );

      // assert
      const expected = new Vector2( 2, 6 );
      expect( v.equals( expected ) ).to.be.true;
    } );

    it( 'should calculate the correct inverse transformation', () => {
      // arrange
      const t = new TransformCollection();
      const m1 = new MatrixTransform();
      m1.matrix.setTranslation( new Vector2( 1, 2 ) );
      const m2 = new MatrixTransform();
      m2.matrix.setScaling( new Vector2( 2, 3 ) );
      // Order of append is important.
      t.append( m1 );
      t.append( m2 );

      // act
      const v = new Vector2( 2, 6 );
      v.transform( t.inverseTransformMatrix );

      // assert
      const expected = new Vector2( 0, 0 );
      expect( v.equals( expected ) ).to.be.true;
    } );

    it( 'should combine transformations when the transformations change', () => {
      // arrange
      const t = new TransformCollection();
      const m1 = new MatrixTransform();
      const m2 = new MatrixTransform();
      t.append( m1 );
      t.append( m2 );

      // act
      // Order of modification is not important.
      m2.matrix.setScaling( new Vector2( 2, 3 ) );
      m1.matrix.setTranslation( new Vector2( 1, 2 ) );

      // assert
      const expected = new Matrix3( 2, 0, 2, 0, 3, 6, 0, 0, 1 );
      expect( t.transformMatrix.equals( expected ) ).to.be.true;
    } );

    it( 'should keep the previous inverse matrix if the current can not be inverted', () => {
      // arrange
      const t = new TransformCollection();
      const m = new MatrixTransform();
      t.append( m );
      const translation = new Vector2( 1, 2 );
      m.matrix.setTranslation( translation );

      // act
      // This matrix can not be inverted.
      const singularMatrix = new Matrix3( 1, 2, 3, 4, 0, 4, 0, 0, 0 );
      m.matrix.copy( singularMatrix );

      // assert
      // The transform matrix has changed to the singular matrix.
      expect( t.transformMatrix.equals( singularMatrix ) ).to.be.true;

      // But the inverse transform matrix is still the inverse of the previous translation.
      const inverseTranslation = translation.clone().multiplyScalar( -1 );
      const expected = new Matrix3().setTranslation( inverseTranslation );
      expect( t.inverseTransformMatrix.equals( expected ) ).to.be.true;
    } );
  } );
} );

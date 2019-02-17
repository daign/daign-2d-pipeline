import {expect} from 'chai';
import * as sinon from 'sinon';

import {Matrix3, Vector2} from '@daign/math';

import {MatrixTransform} from '../../lib/transformations/matrixTransform';

describe( 'MatrixTransform', () => {
  describe( 'constructor', () => {
    it( 'should initialize with identity matrix', () => {
      // act
      const m = new MatrixTransform();

      // assert
      const expected = new Matrix3().setIdentity();
      expect( m.matrix.equals( expected ) ).to.be.true;
    } );

    it( 'should notify observers if matrix changes', () => {
      // arrange
      const m = new MatrixTransform();
      const spy = sinon.spy( m as any, 'notifyObservers' );

      // act
      m.matrix.setTranslation( new Vector2( 1, 2 ) );

      // assert
      expect( spy.calledOnce ).to.be.true;
    } );
  } );
} );

import { expect } from 'chai';
import * as sinon from 'sinon';

import { Matrix3, Vector2 } from '@daign/math';

import { MatrixTransform } from '../../lib/transformations';

describe( 'MatrixTransform', () => {
  describe( 'constructor', () => {
    it( 'should initialize with identity matrix', () => {
      // Act
      const m = new MatrixTransform();

      // Assert
      const expected = new Matrix3().setIdentity();
      expect( m.matrix.equals( expected ) ).to.be.true;
    } );

    it( 'should notify observers if matrix changes', () => {
      // Arrange
      const m = new MatrixTransform();
      const spy = sinon.spy( m as any, 'notifyObservers' );

      // Act
      m.matrix.setTranslation( new Vector2( 1, 2 ) );

      // Assert
      expect( spy.calledOnce ).to.be.true;
    } );
  } );
} );

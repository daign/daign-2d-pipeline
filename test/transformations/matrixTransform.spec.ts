import { expect } from 'chai';
import * as sinon from 'sinon';

import { Matrix3, Vector2 } from '@daign/math';

import { MatrixTransform } from '../../lib/transformations';

describe( 'MatrixTransform', (): void => {
  describe( 'constructor', (): void => {
    it( 'should initialize with identity matrix', (): void => {
      // Act
      const m = new MatrixTransform();

      // Assert
      const expected = new Matrix3().setIdentity();
      expect( m.matrix.equals( expected ) ).to.be.true;
    } );

    it( 'should notify observers if matrix changes', (): void => {
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

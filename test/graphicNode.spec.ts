import { expect } from 'chai';

import { Matrix3 } from '@daign/math';

import { GraphicNode } from '../lib/graphicNode';

describe( 'GraphicNode', (): void => {
  describe( 'constructor', (): void => {
    it( 'should initialize with an identity transformation', (): void => {
      // Act
      const g = new GraphicNode();

      // Assert
      const expected = new Matrix3().setIdentity();
      expect( g.transformation.transformMatrix.equals( expected ) ).to.be.true;
    } );
  } );
} );

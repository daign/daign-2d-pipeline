import {expect} from 'chai';

import {Matrix3} from '@daign/math';

import {GraphicNode} from '../lib/graphicNode';

describe( 'GraphicNode', () => {
  describe( 'constructor', () => {
    it( 'should initialize with an identity transformation', () => {
      // act
      const g = new GraphicNode();

      // assert
      const expected = new Matrix3().setIdentity();
      expect( g.transformation.transformMatrix.equals( expected ) ).to.be.true;
    } );
  } );
} );

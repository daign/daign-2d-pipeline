import { expect } from 'chai';
import * as sinon from 'sinon';

import { GraphicNode } from '../lib/graphicNode';
import { View } from '../lib/view';

describe( 'View', () => {
  describe( 'mountNode', () => {
    it( 'should call replicateDocumentTree', () => {
      // Arrange
      const anchor = new GraphicNode();
      const view = new View();
      const spy = sinon.spy( view, 'replicateDocumentTree' );

      // Act
      view.mountNode( anchor );

      // Assert
      expect( spy.calledOnce ).to.be.true;
    } );
  } );
} );

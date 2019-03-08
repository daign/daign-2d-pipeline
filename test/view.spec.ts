import { expect } from 'chai';
import * as sinon from 'sinon';

import { GraphicNode } from '../lib/graphicNode';
import { PresentationNode } from '../lib/presentationNode';
import { View } from '../lib/view';

describe( 'View', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach( () => {
    sandbox = sinon.createSandbox();
  } );

  afterEach( () => {
    sandbox.restore();
  } );

  describe( 'replicateRecursive', () => {
    it( 'should create a PresentationNode under parent with the right sourceNode', () => {
      // Arrange
      const parentSource = new GraphicNode();
      const parent = new PresentationNode( parentSource );

      const sourceNode = new GraphicNode();

      // Act
      ( View as any ).replicateRecursive( parent, sourceNode );

      // Assert
      expect( parent.children.length ).to.equal( 1 );
      expect( parent.children[ 0 ] ).to.be.instanceof( PresentationNode );
      expect( ( parent.children[ 0 ] as any ).sourceNode ).to.equal( sourceNode );
    } );

    it( 'should call replicateRecursive with every child node of the source', () => {
      // Arrange
      const parentSource = new GraphicNode();
      const parent = new PresentationNode( parentSource );

      const sourceNode = new GraphicNode();
      const child1 = new GraphicNode();
      const child2 = new GraphicNode();
      sourceNode.appendChild( child1 );
      sourceNode.appendChild( child2 );

      const spy = sandbox.spy( ( View as any ), 'replicateRecursive' );

      // Act
      ( View as any ).replicateRecursive( parent, sourceNode );

      // Assert
      expect( spy.callCount ).to.equal( 3 );
      expect( spy.getCall( 1 ).args[ 1 ] ).to.equal( child1 );
      expect( spy.getCall( 2 ).args[ 1 ] ).to.equal( child2 );
    } );
  } );

  describe( 'mountNode', () => {
    it( 'should call anchorNodeSubscriptionRemover', () => {
      // Arrange
      const anchor = new GraphicNode();
      const view = new View();
      const spy = sinon.spy();
      ( view as any ).anchorNodeSubscriptionRemover = spy;

      // Act
      view.mountNode( anchor );

      // Assert
      expect( spy.calledOnce ).to.be.true;
    } );

    it( 'should call replicateDocumentTree', () => {
      // Arrange
      const anchor = new GraphicNode();
      const view = new View();
      const spy = sinon.spy( ( view as any ), 'replicateDocumentTree' );

      // Act
      view.mountNode( anchor );

      // Assert
      expect( spy.calledOnce ).to.be.true;
    } );

    it( 'should call replicateDocumentTree when the original document changes', () => {
      // Arrange
      const parent = new GraphicNode();
      const child = new GraphicNode();
      parent.appendChild( child );

      const view = new View();
      view.mountNode( parent );
      const spy = sinon.spy( ( view as any ), 'replicateDocumentTree' );

      // Act
      const grandChild = new GraphicNode();
      child.appendChild( grandChild );

      // Assert
      expect( spy.calledOnce ).to.be.true;
    } );
  } );

  describe( 'replicateDocumentTree', () => {
    it( 'should call destroyDocumentTree', () => {
      // Arrange
      const view = new View();
      const spy = sinon.spy( ( view as any ), 'destroyDocumentTree' );

      // Act
      ( view as any ).replicateDocumentTree();

      // Assert
      expect( spy.calledOnce ).to.be.true;
    } );

    it( 'should create the viewPresentationNode', () => {
      // Arrange
      const anchor = new GraphicNode();
      const view = new View();
      view.mountNode( anchor );

      // Act
      ( view as any ).replicateDocumentTree();

      // Assert
      expect( ( view as any ).viewPresentationNode ).to.be.instanceof( PresentationNode );
    } );

    it( 'should not create a viewPresentationNode when anchorNode is null', () => {
      // Arrange
      const view = new View();

      // Act
      ( view as any ).replicateDocumentTree();

      // Assert
      expect( ( view as any ).viewPresentationNode ).to.be.null;
    } );

    it( 'should call replicateRecursive with viewPresentationNode and anchorNode', () => {
      // Arrange
      const anchor = new GraphicNode();
      const view = new View();
      view.mountNode( anchor );
      const spy = sandbox.spy( ( View as any ), 'replicateRecursive' );

      // Act
      ( view as any ).replicateDocumentTree();

      // Assert
      expect( spy.calledOnce ).to.be.true;
      const anchorNode = ( view as any ).anchorNode;
      const viewPresentationNode = ( view as any ).viewPresentationNode;
      expect( spy.getCall( 0 ).calledWithExactly( viewPresentationNode, anchorNode ) ).to.be.true;
    } );
  } );

  describe( 'destroyDocumentTree', () => {
    it( 'should call destroyRecursive on viewPresentationNode', () => {
      // Arrange
      const anchor = new GraphicNode();
      const view = new View();
      view.mountNode( anchor );
      const viewPresentationNode = ( view as any ).viewPresentationNode;
      const spy = sinon.spy( viewPresentationNode, 'destroyRecursive' );

      // Act
      ( view as any ).destroyDocumentTree();

      // Assert
      expect( spy.calledOnce ).to.be.true;
    } );

    it( 'should set viewPresentationNode to null', () => {
      // Arrange
      const anchor = new GraphicNode();
      const view = new View();
      view.mountNode( anchor );

      // Act
      ( view as any ).destroyDocumentTree();

      // Assert
      expect( ( view as any ).viewPresentationNode ).to.be.null;
    } );

    it( 'should not throw error when viewPresentationNode is null', () => {
      // Arrange
      const view = new View();

      // Act
      const badFn = (): void => {
        ( view as any ).destroyDocumentTree();
      };

      // Assert
      expect( badFn ).to.not.throw();
    } );
  } );
} );

import {expect} from 'chai';
import * as sinon from 'sinon';

import {GenericNode} from '../lib/genericNode';

class TestClass extends GenericNode<TestClass> {
  constructor() {
    super();
  }
}

describe( 'GenericNode', () => {
  describe( 'appendChild', () => {
    it( 'should remove child from former parent', () => {
      // arrange
      const parent1 = new TestClass();
      const parent2 = new TestClass();
      const child = new TestClass();
      parent1.appendChild( child );

      // act
      parent2.appendChild( child );

      // assert
      expect( parent1.children.length ).to.equal( 0 );
    } );

    it( 'should remove child from namedMapping of former parent', () => {
      // arrange
      const name = 'SomeName';
      const parent1 = new TestClass();
      const parent2 = new TestClass();
      const child = new TestClass();
      parent1.appendChild( child, name );

      // act
      parent2.appendChild( child );

      // assert
      const badFn = () => {
        parent1.getChildByName( name );
      };
      expect( badFn ).to.throw( 'No child exists for the given name.' );
    } );

    it( 'should remove mappingName from child if append to new parent is without name', () => {
      // arrange
      const parent1 = new TestClass();
      const parent2 = new TestClass();
      const child = new TestClass();
      parent1.appendChild( child, 'SomeName' );

      // act
      parent2.appendChild( child );

      // assert
      expect( child.mappingName ).to.be.null;
    } );

    it( 'should add to children property of child', () => {
      // arrange
      const parent = new TestClass();
      const child = new TestClass();

      // act
      parent.appendChild( child );

      // assert
      expect( parent.children[ 0 ] ).to.equal( child );
    } );

    it( 'should set parent property of child', () => {
      // arrange
      const parent = new TestClass();
      const child = new TestClass();

      // act
      parent.appendChild( child );

      // assert
      expect( child.parent ).to.equal( parent );
    } );

    it( 'should set mappingName property of child when name is passed', () => {
      // arrange
      const name = 'SomeName';
      const parent = new TestClass();
      const child = new TestClass();

      // act
      parent.appendChild( child, name );

      // assert
      expect( child.mappingName ).to.equal( name );
    } );

    it( 'should not set mappingName property of child when no name is passed', () => {
      // arrange
      const parent = new TestClass();
      const child = new TestClass();

      // act
      parent.appendChild( child );

      // assert
      expect( child.mappingName ).to.be.null;
    } );

    it( 'should add to namedMapping when name is passed', () => {
      // arrange
      const name = 'SomeName';
      const parent = new TestClass();
      const child = new TestClass();

      // act
      parent.appendChild( child, name );
      const result = parent.getChildByName( name );

      // assert
      expect( result ).to.equal( child );
    } );

    it( 'should not add to namedMapping when no name is passed', () => {
      // arrange
      const name = 'SomeName';
      const parent = new TestClass();
      const child = new TestClass();

      // act
      parent.appendChild( child );

      // assert
      const badFn = () => {
        parent.getChildByName( name );
      };
      expect( badFn ).to.throw( 'No child exists for the given name.' );
    } );

    it( 'should throw error if name already exists in mapping', () => {
      // arrange
      const parent = new TestClass();
      const child1 = new TestClass();
      const child2 = new TestClass();
      const name = 'SomeName';
      parent.appendChild( child1, name );

      // act
      const badFn = () => {
        parent.appendChild( child2, name );
      };

      // assert
      expect( badFn ).to.throw( 'Name is not unique.' );
    } );

    it( 'should call notifyObservers of parent', () => {
      // arrange
      const parent = new TestClass();
      const child = new TestClass();
      const spy = sinon.spy( parent as any, 'notifyObservers' );

      // act
      parent.appendChild( child );

      // assert
      expect( spy.calledOnce ).to.be.true;
    } );

    it( 'should call notifyObservers of child', () => {
      // arrange
      const parent = new TestClass();
      const child = new TestClass();
      const spy = sinon.spy( child as any, 'notifyObservers' );

      // act
      parent.appendChild( child );

      // assert
      expect( spy.calledOnce ).to.be.true;
    } );
  } );

  describe( 'removeChild', () => {
    it( 'should remove child from parent', () => {
      // arrange
      const parent = new TestClass();
      const child = new TestClass();
      parent.appendChild( child );

      // act
      parent.removeChild( child );

      // assert
      expect( parent.children.length ).to.equal( 0 );
    } );

    it( 'should remove parent property from child', () => {
      // arrange
      const parent = new TestClass();
      const child = new TestClass();
      parent.appendChild( child );

      // act
      parent.removeChild( child );

      // assert
      expect( child.parent ).to.be.null;
    } );

    it( 'should remove child from namedMapping of parent', () => {
      // arrange
      const name = 'SomeName';
      const parent = new TestClass();
      const child = new TestClass();
      parent.appendChild( child, name );

      // act
      parent.removeChild( child );

      // assert
      const badFn = () => {
        parent.getChildByName( name );
      };
      expect( badFn ).to.throw( 'No child exists for the given name.' );
    } );

    it( 'should remove mappingName property from child', () => {
      // arrange
      const parent = new TestClass();
      const child = new TestClass();
      parent.appendChild( child, 'SomeName' );

      // act
      parent.removeChild( child );

      // assert
      expect( child.mappingName ).to.be.null;
    } );

    it( 'should call notifyObservers of parent', () => {
      // arrange
      const parent = new TestClass();
      const child = new TestClass();
      parent.appendChild( child );
      const spy = sinon.spy( parent as any, 'notifyObservers' );

      // act
      parent.removeChild( child );

      // assert
      expect( spy.calledOnce ).to.be.true;
    } );

    it( 'should call notifyObservers of child', () => {
      // arrange
      const parent = new TestClass();
      const child = new TestClass();
      parent.appendChild( child );
      const spy = sinon.spy( child as any, 'notifyObservers' );

      // act
      parent.removeChild( child );

      // assert
      expect( spy.calledOnce ).to.be.true;
    } );

    it( 'should not remove child from parent when remove is called on a different parent', () => {
      // arrange
      const parent1 = new TestClass();
      const parent2 = new TestClass();
      const child = new TestClass();
      parent1.appendChild( child );

      // act
      parent2.removeChild( child );

      // assert
      expect( parent1.children[ 0 ] ).to.equal( child );
    } );

    it( 'should not remove parent property when it is not a child of the parent', () => {
      // arrange
      const parent1 = new TestClass();
      const parent2 = new TestClass();
      const child = new TestClass();
      parent1.appendChild( child );

      // act
      parent2.removeChild( child );

      // assert
      expect( child.parent ).to.equal( parent1 );
    } );

    it( 'should not remove child from namedMapping of different parent', () => {
      // arrange
      const name = 'SomeName';
      const parent1 = new TestClass();
      const parent2 = new TestClass();
      const child = new TestClass();
      parent1.appendChild( child, name );

      // act
      parent2.removeChild( child );

      // assert
      const result = parent1.getChildByName( name );
      expect( result ).to.equal( child );
    } );

    it( 'should not remove mappingName property from child of different parent', () => {
      // arrange
      const name = 'SomeName';
      const parent1 = new TestClass();
      const parent2 = new TestClass();
      const child = new TestClass();
      parent1.appendChild( child, name );

      // act
      parent2.removeChild( child );

      // assert
      expect( child.mappingName ).to.equal( name );
    } );

    it( 'should not call notifyObservers of parent if its not a child of this node', () => {
      // arrange
      const parent1 = new TestClass();
      const parent2 = new TestClass();
      const child = new TestClass();
      parent1.appendChild( child );
      const spy = sinon.spy( parent2 as any, 'notifyObservers' );

      // act
      parent2.removeChild( child );

      // assert
      expect( spy.notCalled ).to.be.true;
    } );

    it( 'should not call notifyObservers of child if its not a child of this node', () => {
      // arrange
      const parent1 = new TestClass();
      const parent2 = new TestClass();
      const child = new TestClass();
      parent1.appendChild( child );
      const spy = sinon.spy( child as any, 'notifyObservers' );

      // act
      parent2.removeChild( child );

      // assert
      expect( spy.notCalled ).to.be.true;
    } );
  } );

  describe( 'clearChildren', () => {
    it( 'should remove children from parent', () => {
      // arrange
      const parent = new TestClass();
      const child1 = new TestClass();
      const child2 = new TestClass();
      parent.appendChild( child1 );
      parent.appendChild( child2 );

      // act
      parent.clearChildren();

      // assert
      expect( parent.children.length ).to.equal( 0 );
    } );

    it( 'should remove parent property from children', () => {
      // arrange
      const parent = new TestClass();
      const child1 = new TestClass();
      const child2 = new TestClass();
      parent.appendChild( child1 );
      parent.appendChild( child2 );

      // act
      parent.clearChildren();

      // assert
      expect( child1.parent ).to.be.null;
      expect( child2.parent ).to.be.null;
    } );

    it( 'should remove children from namedMapping of parent', () => {
      // arrange
      const name1 = 'SomeName1';
      const name2 = 'SomeName2';
      const parent = new TestClass();
      const child1 = new TestClass();
      const child2 = new TestClass();
      parent.appendChild( child1, name1 );
      parent.appendChild( child2, name2 );

      // act
      parent.clearChildren();

      // assert
      const badFn1 = () => {
        parent.getChildByName( name1 );
      };
      expect( badFn1 ).to.throw( 'No child exists for the given name.' );

      const badFn2 = () => {
        parent.getChildByName( name2 );
      };
      expect( badFn2 ).to.throw( 'No child exists for the given name.' );
    } );

    it( 'should remove mappingName property from children', () => {
      // arrange
      const name1 = 'SomeName1';
      const name2 = 'SomeName2';
      const parent = new TestClass();
      const child1 = new TestClass();
      const child2 = new TestClass();
      parent.appendChild( child1, name1 );
      parent.appendChild( child2, name2 );

      // act
      parent.clearChildren();

      // assert
      expect( child1.mappingName ).to.be.null;
      expect( child2.mappingName ).to.be.null;
    } );

    it( 'should call notifyObservers of parent', () => {
      // arrange
      const parent = new TestClass();
      const child1 = new TestClass();
      const child2 = new TestClass();
      parent.appendChild( child1 );
      parent.appendChild( child2 );
      const spy = sinon.spy( parent as any, 'notifyObservers' );

      // act
      parent.clearChildren();

      // assert
      expect( spy.calledOnce ).to.be.true;
    } );

    it( 'should call notifyObservers of children', () => {
      // arrange
      const parent = new TestClass();
      const child1 = new TestClass();
      const child2 = new TestClass();
      parent.appendChild( child1 );
      parent.appendChild( child2 );
      const spy1 = sinon.spy( child1 as any, 'notifyObservers' );
      const spy2 = sinon.spy( child2 as any, 'notifyObservers' );

      // act
      parent.clearChildren();

      // assert
      expect( spy1.calledOnce ).to.be.true;
      expect( spy2.calledOnce ).to.be.true;
    } );
  } );

  describe( 'removeFromParent', () => {
    it( 'should not throw error when node has no parent', () => {
      // arrange
      const node = new TestClass();

      // act
      const goodFn = () => {
        node.removeFromParent();
      };

      // assert
      expect( goodFn ).to.not.throw();
    } );

    it( 'should call removeChild on parent if node has a parent', () => {
      // arrange
      const node = new TestClass();
      const parent = new TestClass();
      parent.appendChild( node );
      const spy = sinon.spy( parent, 'removeChild' );

      // act
      node.removeFromParent();

      // assert
      expect( spy.calledOnce ).to.be.true;
      expect( spy.calledWith( node ) ).to.be.true;
    } );
  } );

  describe( 'destroyNode', () => {
    it( 'should call clearChildren', () => {
      // arrange
      const node = new TestClass();
      const spy = sinon.spy( node, 'clearChildren' );

      // act
      node.destroyNode();

      // assert
      expect( spy.calledOnce ).to.be.true;
    } );

    it( 'should call removeFromParent', () => {
      // arrange
      const node = new TestClass();
      const spy = sinon.spy( node, 'removeFromParent' );

      // act
      node.destroyNode();

      // assert
      expect( spy.calledOnce ).to.be.true;
    } );

    it( 'should call clearObservers', () => {
      // arrange
      const node = new TestClass();
      const spy = sinon.spy( ( node as any ), 'clearObservers' );

      // act
      node.destroyNode();

      // assert
      expect( spy.calledOnce ).to.be.true;
    } );
  } );

  describe( 'getChildByName', () => {
    it( 'should return the right child', () => {
      // arrange
      const name1 = 'SomeName1';
      const name2 = 'SomeName2';
      const parent = new TestClass();
      const child1 = new TestClass();
      const child2 = new TestClass();
      parent.appendChild( child1, name1 );
      parent.appendChild( child2, name2 );

      // act
      const result = parent.getChildByName( name1 );

      // assert
      expect( result ).to.equal( child1 );
    } );

    it( 'should throw error when there is no child with the given name', () => {
      // arrange
      const name1 = 'SomeName1';
      const name2 = 'SomeName2';
      const parent = new TestClass();
      const child1 = new TestClass();
      const child2 = new TestClass();
      parent.appendChild( child1, name1 );
      parent.appendChild( child2, name2 );

      // act
      const badFn = () => {
        parent.getChildByName( 'SomeOtherName' );
      };

      // assert
      expect( badFn ).to.throw( 'No child exists for the given name.' );
    } );
  } );
} );

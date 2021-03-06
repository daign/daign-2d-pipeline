import { expect } from 'chai';
import * as sinon from 'sinon';

import { GenericNode } from '../lib/genericNode';

class TestClass extends GenericNode<TestClass> {
  public constructor() {
    super();
  }
}

describe( 'GenericNode', (): void => {
  describe( 'appendChild', (): void => {
    it( 'should remove child from former parent', (): void => {
      // Arrange
      const parent1 = new TestClass();
      const parent2 = new TestClass();
      const child = new TestClass();
      parent1.appendChild( child );

      // Act
      parent2.appendChild( child );

      // Assert
      expect( parent1.children.length ).to.equal( 0 );
    } );

    it( 'should remove child from namedMapping of former parent', (): void => {
      // Arrange
      const name = 'SomeName';
      const parent1 = new TestClass();
      const parent2 = new TestClass();
      const child = new TestClass();
      parent1.appendChild( child, name );

      // Act
      parent2.appendChild( child );

      // Assert
      const badFn = (): void => {
        parent1.getChildByName( name );
      };
      expect( badFn ).to.throw( 'No child exists for the given name.' );
    } );

    it( 'should remove mappingName from child if append to new parent is without name',
      (): void => {
        // Arrange
        const parent1 = new TestClass();
        const parent2 = new TestClass();
        const child = new TestClass();
        parent1.appendChild( child, 'SomeName' );

        // Act
        parent2.appendChild( child );

        // Assert
        expect( child.mappingName ).to.be.null;
      }
    );

    it( 'should add to children property of child', (): void => {
      // Arrange
      const parent = new TestClass();
      const child = new TestClass();

      // Act
      parent.appendChild( child );

      // Assert
      expect( parent.children[ 0 ] ).to.equal( child );
    } );

    it( 'should set parent property of child', (): void => {
      // Arrange
      const parent = new TestClass();
      const child = new TestClass();

      // Act
      parent.appendChild( child );

      // Assert
      expect( child.parent ).to.equal( parent );
    } );

    it( 'should set mappingName property of child when name is passed', (): void => {
      // Arrange
      const name = 'SomeName';
      const parent = new TestClass();
      const child = new TestClass();

      // Act
      parent.appendChild( child, name );

      // Assert
      expect( child.mappingName ).to.equal( name );
    } );

    it( 'should not set mappingName property of child when no name is passed', (): void => {
      // Arrange
      const parent = new TestClass();
      const child = new TestClass();

      // Act
      parent.appendChild( child );

      // Assert
      expect( child.mappingName ).to.be.null;
    } );

    it( 'should add to namedMapping when name is passed', (): void => {
      // Arrange
      const name = 'SomeName';
      const parent = new TestClass();
      const child = new TestClass();

      // Act
      parent.appendChild( child, name );
      const result = parent.getChildByName( name );

      // Assert
      expect( result ).to.equal( child );
    } );

    it( 'should not add to namedMapping when no name is passed', (): void => {
      // Arrange
      const name = 'SomeName';
      const parent = new TestClass();
      const child = new TestClass();

      // Act
      parent.appendChild( child );

      // Assert
      const badFn = (): void => {
        parent.getChildByName( name );
      };
      expect( badFn ).to.throw( 'No child exists for the given name.' );
    } );

    it( 'should throw error if name already exists in mapping', (): void => {
      // Arrange
      const parent = new TestClass();
      const child1 = new TestClass();
      const child2 = new TestClass();
      const name = 'SomeName';
      parent.appendChild( child1, name );

      // Act
      const badFn = (): void => {
        parent.appendChild( child2, name );
      };

      // Assert
      expect( badFn ).to.throw( 'Name is not unique.' );
    } );

    it( 'should call notifyObservers of parent', (): void => {
      // Arrange
      const parent = new TestClass();
      const child = new TestClass();
      const spy1 = sinon.spy( parent as any, 'propagateNotifyObservers' );
      const spy2 = sinon.spy( parent as any, 'notifyObservers' );

      // Act
      parent.appendChild( child );

      // Assert
      expect( spy1.calledOnce ).to.be.true;
      expect( spy2.calledOnce ).to.be.true;
    } );
  } );

  describe( 'removeChild', (): void => {
    it( 'should remove child from parent', (): void => {
      // Arrange
      const parent = new TestClass();
      const child = new TestClass();
      parent.appendChild( child );

      // Act
      parent.removeChild( child );

      // Assert
      expect( parent.children.length ).to.equal( 0 );
    } );

    it( 'should remove parent property from child', (): void => {
      // Arrange
      const parent = new TestClass();
      const child = new TestClass();
      parent.appendChild( child );

      // Act
      parent.removeChild( child );

      // Assert
      expect( child.parent ).to.be.null;
    } );

    it( 'should remove child from namedMapping of parent', (): void => {
      // Arrange
      const name = 'SomeName';
      const parent = new TestClass();
      const child = new TestClass();
      parent.appendChild( child, name );

      // Act
      parent.removeChild( child );

      // Assert
      const badFn = (): void => {
        parent.getChildByName( name );
      };
      expect( badFn ).to.throw( 'No child exists for the given name.' );
    } );

    it( 'should remove mappingName property from child', (): void => {
      // Arrange
      const parent = new TestClass();
      const child = new TestClass();
      parent.appendChild( child, 'SomeName' );

      // Act
      parent.removeChild( child );

      // Assert
      expect( child.mappingName ).to.be.null;
    } );

    it( 'should call notifyObservers of parent', (): void => {
      // Arrange
      const parent = new TestClass();
      const child = new TestClass();
      parent.appendChild( child );
      const spy1 = sinon.spy( parent as any, 'propagateNotifyObservers' );
      const spy2 = sinon.spy( parent as any, 'notifyObservers' );

      // Act
      parent.removeChild( child );

      // Assert
      expect( spy1.calledOnce ).to.be.true;
      expect( spy2.calledOnce ).to.be.true;
    } );

    it( 'should not remove child from parent when remove is called on a different parent',
      (): void => {
        // Arrange
        const parent1 = new TestClass();
        const parent2 = new TestClass();
        const child = new TestClass();
        parent1.appendChild( child );

        // Act
        parent2.removeChild( child );

        // Assert
        expect( parent1.children[ 0 ] ).to.equal( child );
      }
    );

    it( 'should not remove parent property when it is not a child of the parent', (): void => {
      // Arrange
      const parent1 = new TestClass();
      const parent2 = new TestClass();
      const child = new TestClass();
      parent1.appendChild( child );

      // Act
      parent2.removeChild( child );

      // Assert
      expect( child.parent ).to.equal( parent1 );
    } );

    it( 'should not remove child from namedMapping of different parent', (): void => {
      // Arrange
      const name = 'SomeName';
      const parent1 = new TestClass();
      const parent2 = new TestClass();
      const child = new TestClass();
      parent1.appendChild( child, name );

      // Act
      parent2.removeChild( child );

      // Assert
      const result = parent1.getChildByName( name );
      expect( result ).to.equal( child );
    } );

    it( 'should not remove mappingName property from child of different parent', (): void => {
      // Arrange
      const name = 'SomeName';
      const parent1 = new TestClass();
      const parent2 = new TestClass();
      const child = new TestClass();
      parent1.appendChild( child, name );

      // Act
      parent2.removeChild( child );

      // Assert
      expect( child.mappingName ).to.equal( name );
    } );

    it( 'should not call notifyObservers of parent if its not a child of this node', (): void => {
      // Arrange
      const parent1 = new TestClass();
      const parent2 = new TestClass();
      const child = new TestClass();
      parent1.appendChild( child );
      const spy1 = sinon.spy( parent2 as any, 'propagateNotifyObservers' );
      const spy2 = sinon.spy( parent2 as any, 'notifyObservers' );

      // Act
      parent2.removeChild( child );

      // Assert
      expect( spy1.notCalled ).to.be.true;
      expect( spy2.notCalled ).to.be.true;
    } );
  } );

  describe( 'clearChildren', (): void => {
    it( 'should remove children from parent', (): void => {
      // Arrange
      const parent = new TestClass();
      const child1 = new TestClass();
      const child2 = new TestClass();
      parent.appendChild( child1 );
      parent.appendChild( child2 );

      // Act
      parent.clearChildren();

      // Assert
      expect( parent.children.length ).to.equal( 0 );
    } );

    it( 'should remove parent property from children', (): void => {
      // Arrange
      const parent = new TestClass();
      const child1 = new TestClass();
      const child2 = new TestClass();
      parent.appendChild( child1 );
      parent.appendChild( child2 );

      // Act
      parent.clearChildren();

      // Assert
      expect( child1.parent ).to.be.null;
      expect( child2.parent ).to.be.null;
    } );

    it( 'should remove children from namedMapping of parent', (): void => {
      // Arrange
      const name1 = 'SomeName1';
      const name2 = 'SomeName2';
      const parent = new TestClass();
      const child1 = new TestClass();
      const child2 = new TestClass();
      parent.appendChild( child1, name1 );
      parent.appendChild( child2, name2 );

      // Act
      parent.clearChildren();

      // Assert
      const badFn1 = (): void => {
        parent.getChildByName( name1 );
      };
      expect( badFn1 ).to.throw( 'No child exists for the given name.' );

      const badFn2 = (): void => {
        parent.getChildByName( name2 );
      };
      expect( badFn2 ).to.throw( 'No child exists for the given name.' );
    } );

    it( 'should remove mappingName property from children', (): void => {
      // Arrange
      const name1 = 'SomeName1';
      const name2 = 'SomeName2';
      const parent = new TestClass();
      const child1 = new TestClass();
      const child2 = new TestClass();
      parent.appendChild( child1, name1 );
      parent.appendChild( child2, name2 );

      // Act
      parent.clearChildren();

      // Assert
      expect( child1.mappingName ).to.be.null;
      expect( child2.mappingName ).to.be.null;
    } );

    it( 'should call notifyObservers of parent', (): void => {
      // Arrange
      const parent = new TestClass();
      const child1 = new TestClass();
      const child2 = new TestClass();
      parent.appendChild( child1 );
      parent.appendChild( child2 );
      const spy1 = sinon.spy( parent as any, 'propagateNotifyObservers' );
      const spy2 = sinon.spy( parent as any, 'notifyObservers' );

      // Act
      parent.clearChildren();

      // Assert
      expect( spy1.calledOnce ).to.be.true;
      expect( spy2.calledOnce ).to.be.true;
    } );
  } );

  describe( 'removeFromParent', (): void => {
    it( 'should not throw error when node has no parent', (): void => {
      // Arrange
      const node = new TestClass();

      // Act
      const goodFn = (): void => {
        node.removeFromParent();
      };

      // Assert
      expect( goodFn ).to.not.throw();
    } );

    it( 'should call removeChild on parent if node has a parent', (): void => {
      // Arrange
      const node = new TestClass();
      const parent = new TestClass();
      parent.appendChild( node );
      const spy = sinon.spy( parent, 'removeChild' );

      // Act
      node.removeFromParent();

      // Assert
      expect( spy.calledOnce ).to.be.true;
      expect( spy.calledWith( node ) ).to.be.true;
    } );
  } );

  describe( 'getChildByName', (): void => {
    it( 'should return the right child', (): void => {
      // Arrange
      const name1 = 'SomeName1';
      const name2 = 'SomeName2';
      const parent = new TestClass();
      const child1 = new TestClass();
      const child2 = new TestClass();
      parent.appendChild( child1, name1 );
      parent.appendChild( child2, name2 );

      // Act
      const result = parent.getChildByName( name1 );

      // Assert
      expect( result ).to.equal( child1 );
    } );

    it( 'should throw error when there is no child with the given name', (): void => {
      // Arrange
      const name1 = 'SomeName1';
      const name2 = 'SomeName2';
      const parent = new TestClass();
      const child1 = new TestClass();
      const child2 = new TestClass();
      parent.appendChild( child1, name1 );
      parent.appendChild( child2, name2 );

      // Act
      const badFn = (): void => {
        parent.getChildByName( 'SomeOtherName' );
      };

      // Assert
      expect( badFn ).to.throw( 'No child exists for the given name.' );
    } );
  } );

  describe( 'destroyNode', (): void => {
    it( 'should call clearChildren', (): void => {
      // Arrange
      const node = new TestClass();
      const spy = sinon.spy( node, 'clearChildren' );

      // Act
      node.destroyNode();

      // Assert
      expect( spy.calledOnce ).to.be.true;
    } );

    it( 'should call removeFromParent', (): void => {
      // Arrange
      const node = new TestClass();
      const spy = sinon.spy( node, 'removeFromParent' );

      // Act
      node.destroyNode();

      // Assert
      expect( spy.calledOnce ).to.be.true;
    } );

    it( 'should call clearObservers', (): void => {
      // Arrange
      const node = new TestClass();
      const spy = sinon.spy( ( node as any ), 'clearObservers' );

      // Act
      node.destroyNode();

      // Assert
      expect( spy.calledOnce ).to.be.true;
    } );
  } );

  describe( 'destroyRecursive', (): void => {
    it( 'should call destroyNode on itself', (): void => {
      // Arrange
      const node = new TestClass();
      const child = new TestClass();
      node.appendChild( child );
      const spy = sinon.spy( child, 'destroyNode' );

      // Act
      node.destroyRecursive();

      // Assert
      expect( spy.calledOnce ).to.be.true;
    } );

    it( 'should call destroyRecursive on all children', (): void => {
      // Arrange
      const node = new TestClass();
      const child1 = new TestClass();
      const child2 = new TestClass();
      node.appendChild( child1 );
      node.appendChild( child2 );
      const spy1 = sinon.spy( child1, 'destroyRecursive' );
      const spy2 = sinon.spy( child2, 'destroyRecursive' );

      // Act
      node.destroyRecursive();

      // Assert
      expect( spy1.calledOnce ).to.be.true;
      expect( spy2.calledOnce ).to.be.true;
    } );
  } );

  describe( 'propagateNotifyObservers', (): void => {
    it( 'should call notifyObservers on itself', (): void => {
      // Arrange
      const node = new TestClass();
      const spy = sinon.spy( ( node as any ), 'notifyObservers' );

      // Act
      ( node as any ).propagateNotifyObservers();

      // Assert
      expect( spy.calledOnce ).to.be.true;
    } );

    it( 'should call notifyObservers on ancestors', (): void => {
      // Arrange
      const node = new TestClass();
      const parent = new TestClass();
      const grandparent = new TestClass();
      parent.appendChild( node );
      grandparent.appendChild( parent );

      const spy1 = sinon.spy( ( parent as any ), 'notifyObservers' );
      const spy2 = sinon.spy( ( grandparent as any ), 'notifyObservers' );

      // Act
      ( node as any ).propagateNotifyObservers();

      // Assert
      expect( spy1.calledOnce ).to.be.true;
      expect( spy2.calledOnce ).to.be.true;
    } );
  } );
} );

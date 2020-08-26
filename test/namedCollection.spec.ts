import { expect } from 'chai';
import * as sinon from 'sinon';

import { Observable } from '@daign/observable';

import { NamedCollection } from '../lib/namedCollection';

class TestItem extends Observable {
  public constructor() {
    super();
  }

  public change(): void {
    this.notifyObservers();
  }
}

class TestCollection extends NamedCollection<TestItem> {
  public constructor() {
    super();
  }
}

describe( 'NamedCollection', (): void => {
  describe( 'append', (): void => {
    it( 'should append item to array', (): void => {
      // Arrange
      const collection = new TestCollection();
      const item = new TestItem();

      // Act
      collection.append( item );

      // Assert
      expect( collection.items[ 0 ] ).to.equal( item );
    } );

    it( 'should call notifyObservers', (): void => {
      // Arrange
      const collection = new TestCollection();
      const item = new TestItem();
      const spy = sinon.spy( collection as any, 'notifyObservers' );

      // Act
      collection.append( item );

      // Assert
      expect( spy.calledOnce ).to.be.true;
    } );

    it( 'should call onItemUpdate', (): void => {
      // Arrange
      const collection = new TestCollection();
      const item = new TestItem();
      const spy = sinon.spy( collection as any, 'onItemUpdate' );

      // Act
      collection.append( item );

      // Assert
      expect( spy.calledOnce ).to.be.true;
    } );

    it( 'should add to namedMapping when name is passed', (): void => {
      // Arrange
      const name = 'SomeName';
      const collection = new TestCollection();
      const item = new TestItem();

      // Act
      collection.append( item, name );

      // Assert
      expect( ( collection as any ).namedMapping[ name ] ).to.equal( item );
    } );

    it( 'should not add to namedMapping when no name is passed', (): void => {
      // Arrange
      const name = 'SomeName';
      const collection = new TestCollection();
      const item = new TestItem();

      // Act
      collection.append( item );

      // Assert
      expect( ( collection as any ).namedMapping[ name ] ).to.be.undefined;
    } );

    it( 'should throw error if name already exists in mapping', (): void => {
      // Arrange
      const name = 'SomeName';
      const collection = new TestCollection();
      const item1 = new TestItem();
      const item2 = new TestItem();
      collection.append( item1, name );

      // Act
      const badFn = (): void => {
        collection.append( item2, name );
      };

      // Assert
      expect( badFn ).to.throw( 'Name is not unique.' );
    } );

    it( 'should notify observers if item changes', (): void => {
      // Arrange
      const collection = new TestCollection();
      const item = new TestItem();
      collection.append( item );
      const spy = sinon.spy( collection as any, 'notifyObservers' );

      // Act
      item.change();

      // Assert
      expect( spy.calledOnce ).to.be.true;
    } );

    it( 'should call onItemUpdate if item changes', (): void => {
      // Arrange
      const collection = new TestCollection();
      const item = new TestItem();
      collection.append( item );
      const spy = sinon.spy( collection as any, 'onItemUpdate' );

      // Act
      item.change();

      // Assert
      expect( spy.calledOnce ).to.be.true;
    } );
  } );

  describe( 'byName', (): void => {
    it( 'should return item', (): void => {
      // Arrange
      const name = 'SomeName';
      const collection = new TestCollection();
      const item = new TestItem();
      collection.append( item, name );

      // Act
      const result = collection.byName( name );

      // Assert
      expect( result ).to.equal( item );
    } );

    it( 'should throw error when item is not in the named mapping', (): void => {
      // Arrange
      const name = 'SomeName';
      const collection = new TestCollection();
      const item = new TestItem();
      collection.append( item );

      // Act
      const badFn = (): void => {
        collection.byName( name );
      };

      // Assert
      expect( badFn ).to.throw( 'No item exists for the given name.' );
    } );
  } );
} );

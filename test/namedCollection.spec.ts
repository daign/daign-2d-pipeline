import {expect} from 'chai';
import * as sinon from 'sinon';

import {Observable} from '@daign/observable';

import {NamedCollection} from '../lib/namedCollection';

class TestItem extends Observable {
  constructor() {
    super();
  }

  public change(): void {
    this.notifyObservers();
  }
}

class TestCollection extends NamedCollection<TestItem> {
  constructor() {
    super();
  }
}

describe( 'NamedCollection', () => {
  describe( 'append', () => {
    it( 'should append item to array', () => {
      // arrange
      const collection = new TestCollection();
      const item = new TestItem();

      // act
      collection.append( item );

      // assert
      expect( collection.items[ 0 ] ).to.equal( item );
    } );

    it( 'should call notifyObservers', () => {
      // arrange
      const collection = new TestCollection();
      const item = new TestItem();
      const spy = sinon.spy( collection as any, 'notifyObservers' );

      // act
      collection.append( item );

      // assert
      expect( spy.calledOnce ).to.be.true;
    } );

    it( 'should call onItemUpdate', () => {
      // arrange
      const collection = new TestCollection();
      const item = new TestItem();
      const spy = sinon.spy( collection as any, 'onItemUpdate' );

      // act
      collection.append( item );

      // assert
      expect( spy.calledOnce ).to.be.true;
    } );

    it( 'should add to namedMapping when name is passed', () => {
      // arrange
      const name = 'SomeName';
      const collection = new TestCollection();
      const item = new TestItem();

      // act
      collection.append( item, name );

      // assert
      expect( ( collection as any ).namedMapping[ name ] ).to.equal( item );
    } );

    it( 'should not add to namedMapping when no name is passed', () => {
      // arrange
      const name = 'SomeName';
      const collection = new TestCollection();
      const item = new TestItem();

      // act
      collection.append( item );

      // assert
      expect( ( collection as any ).namedMapping[ name ] ).to.be.undefined;
    } );

    it( 'should throw error if name already exists in mapping', () => {
      // arrange
      const name = 'SomeName';
      const collection = new TestCollection();
      const item1 = new TestItem();
      const item2 = new TestItem();
      collection.append( item1, name );

      // act
      const badFn = () => {
        collection.append( item2, name );
      };

      // assert
      expect( badFn ).to.throw( 'Name is not unique.' );
    } );

    it( 'should notify observers if item changes', () => {
      // arrange
      const collection = new TestCollection();
      const item = new TestItem();
      collection.append( item );
      const spy = sinon.spy( collection as any, 'notifyObservers' );

      // act
      item.change();

      // assert
      expect( spy.calledOnce ).to.be.true;
    } );

    it( 'should call onItemUpdate if item changes', () => {
      // arrange
      const collection = new TestCollection();
      const item = new TestItem();
      collection.append( item );
      const spy = sinon.spy( collection as any, 'onItemUpdate' );

      // act
      item.change();

      // assert
      expect( spy.calledOnce ).to.be.true;
    } );
  } );

  describe( 'byName', () => {
    it( 'should return item', () => {
      // arrange
      const name = 'SomeName';
      const collection = new TestCollection();
      const item = new TestItem();
      collection.append( item, name );

      // act
      const result = collection.byName( name );

      // assert
      expect( result ).to.equal( item );
    } );

    it( 'should throw error when item is not in the named mapping', () => {
      // arrange
      const name = 'SomeName';
      const collection = new TestCollection();
      const item = new TestItem();
      collection.append( item );

      // act
      const badFn = () => {
        collection.byName( name );
      };

      // assert
      expect( badFn ).to.throw( 'No item exists for the given name.' );
    } );
  } );
} );

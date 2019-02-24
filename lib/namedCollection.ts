import { Observable } from '@daign/observable';

/**
 * Abstract class for collections that can be accessed by index and optionally by name.
 * The collection object as well as its collection items implement an observable pattern.
 */
export abstract class NamedCollection<T extends Observable> extends Observable {
  /**
   * The collection items kept in an array.
   */
  public items: T[] = [];

  /**
   * The collection items optionally referenced by name.
   */
  private namedMapping: { [ name: string ]: T } = {};

  /**
   * Constructor
   */
  public constructor() {
    super();
  }

  /**
   * Append an item to the collection.
   * Will throw an error when a name is passed that is not unique within the collection.
   * @param item The item object.
   * @param name The name of the item for the mapping. Optional.
   */
  public append( item: T, name?: string ): void {
    if ( name && this.namedMapping[ name ] ) {
      throw new Error( 'Name is not unique.' );
    }

    this.items.push( item );

    if ( name ) {
      this.namedMapping[ name ] = item;
    }

    this.onItemUpdate();
    this.notifyObservers();

    // Notify observers when the item has changes
    const callback = (): void => {
      this.onItemUpdate();
      this.notifyObservers();
    };
    item.subscribeToChanges( callback );
  }

  /**
   * Get an item by its name in the mapping.
   * Will throw an error if an item by this name does not exist.
   * @param name The name of the item.
   * @returns The item object.
   */
  public byName( name: string ): T {
    if ( !this.namedMapping[ name ] ) {
      throw new Error( 'No item exists for the given name.' );
    }

    return this.namedMapping[ name ];
  }

  /**
   * Method called when an item changes. Can be overwritten in subclasses.
   */
  protected onItemUpdate(): void {}
}

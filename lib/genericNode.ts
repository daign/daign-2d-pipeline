import { Observable } from '@daign/observable';

/**
 * Class that describes a node in a tree data structure.
 */
export abstract class GenericNode<T extends GenericNode<any>> extends Observable {
  /**
   * Reference to the parent node.
   */
  public parent: T | null = null;

  /**
   * References to the child nodes.
   */
  public children: T[] = [];

  /**
   * Name that is used by the parent as a unique identifier for the child.
   */
  public mappingName: string | null = null;

  /**
   * The child nodes referenced by their mapping name.
   */
  private namedMapping: { [ name: string ]: T } = {};

  /**
   * Constructor.
   */
  public constructor() {
    super();
  }

  /**
   * Append child node to this node.
   * Will throw an error when a name is passed that is not unique within the parent.
   * @param childNode The child node.
   * @param name The name of the child for the mapping. Optional.
   */
  public appendChild( childNode: T, name?: string ): void {
    if ( name && this.namedMapping[ name ] ) {
      throw new Error( 'Name is not unique.' );
    }

    // Remove from previous parent if necessary.
    if ( childNode.parent ) {
      childNode.removeFromParent();
    }

    this.children.push( childNode );
    childNode.parent = this;

    if ( name ) {
      childNode.mappingName = name;
      this.namedMapping[ name ] = childNode;
    }
    this.propagateNotifyObservers();
  }

  /**
   * Remove child node from this node.
   * Will do nothing if the given node is not one of the child nodes.
   * @param childNode The child node.
   */
  public removeChild( childNode: T ): void {
    const index = this.children.indexOf( childNode );

    if ( index === -1 ) {
      // The given node is not one of the child nodes.
      return;
    }

    this.children.splice( index, 1 );
    childNode.parent = null;

    if ( childNode.mappingName ) {
      delete this.namedMapping[ childNode.mappingName ];
      childNode.mappingName = null;
    }
    this.propagateNotifyObservers();
  }

  /**
   * Remove all child nodes from this node.
   */
  public clearChildren(): void {
    this.children.forEach( ( child: T ): void => {
      child.parent = null;
      child.mappingName = null;
    } );
    this.children = [];
    this.namedMapping = {};

    this.propagateNotifyObservers();
  }

  /**
   * Remove this node from its parent.
   * Will do nothing if node has no parent.
   */
  public removeFromParent(): void {
    if ( this.parent !== null ) {
      this.parent.removeChild( this );
    }
  }

  /**
   * Get a child node by its name in the mapping.
   * Will throw an error if a child by this name does not exist.
   * @param name The name of the child.
   * @returns The child node.
   */
  public getChildByName( name: string ): T {
    if ( !this.namedMapping[ name ] ) {
      throw new Error( 'No child exists for the given name.' );
    }

    return this.namedMapping[ name ];
  }

  /**
   * Destroy this node and all its references.
   */
  public destroyNode(): void {
    this.clearChildren();
    this.removeFromParent();
    this.clearObservers();
  }

  /**
   * Destroy this node and all of its children.
   */
  public destroyRecursive(): void {
    // Copy the references first because destroying clears the children.
    const childReferencesCopy = this.children.slice();

    this.destroyNode();

    childReferencesCopy.forEach( ( child: T ): void => {
      child.destroyRecursive();
    } );
  }

  /**
   * Call notifyObservers and propagate up the chain of ancestors.
   */
  private propagateNotifyObservers(): void {
    this.notifyObservers();
    if ( this.parent !== null ) {
      this.parent.propagateNotifyObservers();
    }
  }
}

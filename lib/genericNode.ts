import {Observable} from '@daign/observable';

/**
 * Class that describes a node in a tree data structure.
 */
export abstract class GenericNode extends Observable {
  /**
   * Reference to the parent node.
   */
  public parent: GenericNode | null = null;

  /**
   * References to the child nodes.
   */
  public children: GenericNode[] = [];

  /**
   * Name that is used by the parent as a unique identifier for the child.
   */
  public mappingName: string | null = null;

  /**
   * The child nodes referenced by their mapping name.
   */
  private namedMapping: { [ name: string ]: GenericNode; } = {};

  /**
   * Constructor.
   */
  constructor() {
    super();
  }

  /**
   * Append child node to this node.
   * Will throw an error when a name is passed that is not unique within the parent.
   * @param childNode The child node.
   * @param name The name of the child for the mapping. Optional.
   */
  public appendChild( childNode: GenericNode, name?: string ): void {
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
    this.notifyObservers();
    childNode.notifyObservers();
  }

  /**
   * Remove child node from this node.
   * Will do nothing if the given node is not one of the child nodes.
   * @param childNode The child node.
   */
  public removeChild( childNode: GenericNode ): void {
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
    this.notifyObservers();
    childNode.notifyObservers();
  }

  /**
   * Remove all child nodes from this node.
   */
  public clearChildren(): void {
    this.children.forEach( ( child: GenericNode ): void => {
      child.parent = null;
      child.mappingName = null;
      child.notifyObservers();
    } );
    this.children = [];
    this.namedMapping = {};

    this.notifyObservers();
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
   * Destroy this node and all its references.
   */
  public destroyNode(): void {
    this.clearChildren();
    this.removeFromParent();
    this.clearObservers();
  }

  /**
   * Get a child node by its name in the mapping.
   * Will throw an error if a child by this name does not exist.
   * @param name The name of the child.
   * @returns The child node.
   */
  public getChildByName( name: string ): GenericNode {
    if ( !this.namedMapping[ name ] ) {
      throw new Error( 'No child exists for the given name.' );
    }

    return this.namedMapping[ name ];
  }
}

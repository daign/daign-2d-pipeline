import { GenericNode } from './genericNode';
import { PresentationNode } from './presentationNode';
import { TransformCollection } from './transformations';

/**
 * Class for nodes in a graphic document.
 */
export class GraphicNode extends GenericNode<GraphicNode> {
  /**
   * The transformation applied to the node.
   */
  public transformation: TransformCollection = new TransformCollection();

  /**
   * The presentation node copies that originated from this graphic node.
   */
  public presentationNodes: PresentationNode[] = [];

  /**
   * Constructor.
   */
  public constructor() {
    super();
  }

  /**
   * Add a node to the list of known presentation node copies of this node.
   */
  public registerPresentationNode( presentationNode: PresentationNode ): void {
    this.presentationNodes.push( presentationNode );
  }

  /**
   * Remove a node from the list of known presentation node copies of this node.
   */
  public removePresentationNode( presentationNode: PresentationNode ): void {
    const i = this.presentationNodes.indexOf( presentationNode );
    if ( i > -1 ) {
      this.presentationNodes.splice( i, 1 );
    }
  }
}

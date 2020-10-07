import { GraphicNode } from './graphicNode';
import { PresentationNode } from './presentationNode';

/**
 * The view class that replicates a subtree of the graphic document and prepares it for rendering.
 */
export class View extends GraphicNode {
  /**
   * Recursively create copies of all graphic nodes.
   * @param parent The node that will be the parent of the source node's copy.
   * @param sourceNode The graphic node to copy.
   */
  private static replicateRecursive( parent: PresentationNode, sourceNode: GraphicNode ): void {
    const presentationNode = new PresentationNode( sourceNode );
    parent.appendChild( presentationNode );

    sourceNode.children.forEach( ( sourceChild: GraphicNode ): void => {
      View.replicateRecursive( presentationNode, sourceChild );
    } );
  }

  /**
   * The root of the subtree to be rendered.
   */
  protected anchorNode: GraphicNode | null = null;

  /**
   * Callback to remove subscriptions when the source node changes.
   */
  private anchorNodeSubscriptionRemover: ( () => void ) | null = null;

  /**
   * The representation of the view and root of the replicated tree.
   */
  public viewPresentationNode: PresentationNode | null = null;

  /**
   * Constructor.
   */
  public constructor() {
    super();
  }

  /**
   * Set the anchor node of the view, that is the root of the subtree to be rendered.
   * @param anchorNode The anchor node.
   */
  public mountNode( anchorNode: GraphicNode ): void {
    // Remove subscriptions on previous anchor node.
    if ( this.anchorNodeSubscriptionRemover !== null ) {
      this.anchorNodeSubscriptionRemover();
    }

    this.anchorNode = anchorNode;

    // Rebuild the copy of the tree when the original document changes.
    const callback = (): void => {
      this.replicateDocumentTree();
    };
    this.anchorNodeSubscriptionRemover = this.anchorNode.subscribeToChanges( callback );

    this.replicateDocumentTree();
  }

  /**
   * Creates a copy of the graphic document starting from the source node.
   */
  private replicateDocumentTree(): void {
    // Remove previously created copy.
    this.destroyDocumentTree();

    // Start the creation if an anchor node exists.
    if ( this.anchorNode !== null ) {
      this.viewPresentationNode = new PresentationNode( this );
      View.replicateRecursive( this.viewPresentationNode, this.anchorNode );

      // Update the projection matrices when the tree has been created.
      this.viewPresentationNode.updateProjectionMatrices();
    }
  }

  /**
   * Remove a previously created presentation tree.
   */
  private destroyDocumentTree(): void {
    if ( this.viewPresentationNode !== null ) {
      this.viewPresentationNode.destroyRecursive();
      this.viewPresentationNode = null;
    }
  }
}

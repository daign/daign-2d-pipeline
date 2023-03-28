import { Matrix3 } from '@daign/math';

import { GenericNode } from './genericNode';
import { GraphicNode } from './graphicNode';
import { View } from './view';

/**
 * A concrete, renderable copy of a graphic node, belonging to a view.
 */
export class PresentationNode extends GenericNode<PresentationNode> {
  /**
   * The projection from view coordinates to the coordinates of the element.
   */
  public projectViewToNode: Matrix3 = new Matrix3().setIdentity();

  /**
   * The projection from the coordinates of the element to view coordinates.
   */
  public projectNodeToView: Matrix3 = new Matrix3().setIdentity();

  /**
   * The projection from the coordinates of the element to view coordinates, not including native
   * transforms.
   */
  public projectNodeToViewNonNative: Matrix3 = new Matrix3().setIdentity();

  /**
   * The view to which this node belongs.
   */
  public view: View | null;

  /**
   * The source from which this node is copied.
   */
  public sourceNode: GraphicNode | null;

  /**
   * Method to remove the subscription on the source node.
   */
  private removeSourceNodeSubscription: () => void;

  /**
   * Constructor.
   * @param view The view to which the node belongs.
   * @param sourceNode The source from which this node is copied.
   */
  public constructor( view: View, sourceNode: GraphicNode ) {
    super();

    this.view = view;

    this.sourceNode = sourceNode;
    this.sourceNode.registerPresentationNode( this );

    // Recalculate projections when the transformation of the source node changes.
    const callback = (): void => {
      this.updateProjectionMatrices();
    };
    this.removeSourceNodeSubscription = this.sourceNode.transformation.subscribeToChanges(
      callback );
  }

  /**
   * Update the projection matrices of the node and of its children.
   */
  public updateProjectionMatrices(): void {
    if ( this.sourceNode !== null ) {
      if ( this.parent !== null ) {
        // The projection of the parent combined with the own transformation.
        this.projectNodeToView.copy( this.sourceNode.transformation.transformMatrix );
        this.projectNodeToView.transform( this.parent.projectNodeToView );

        // The projection not including native transforms.
        this.projectNodeToViewNonNative.copy(
          this.sourceNode.transformation.transformMatrixNonNative
        );
        this.projectNodeToViewNonNative.transform( this.parent.projectNodeToViewNonNative );
      } else {
        // When no parent exists the projection is equal to the own transformation.
        this.projectNodeToView.copy( this.sourceNode.transformation.transformMatrix );

        // The projection not including native transforms.
        this.projectNodeToViewNonNative.copy(
          this.sourceNode.transformation.transformMatrixNonNative
        );
      }

      this.projectViewToNode.setToInverse( this.projectNodeToView );

      this.children.forEach( ( child: PresentationNode ): void => {
        child.updateProjectionMatrices();
      } );
    }
  }

  /**
   * Destroy this node and also remove the links from the source node.
   */
  public destroyNode(): void {
    super.destroyNode();

    this.view = null;

    this.removeSourceNodeSubscription();
    if ( this.sourceNode !== null ) {
      this.sourceNode.removePresentationNode( this );
      this.sourceNode = null;
    }
  }
}

import { Matrix3 } from '@daign/math';

import { GenericNode } from './genericNode';
import { GraphicNode } from './graphicNode';

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
   * The source from which this node is copied.
   */
  public sourceNode: GraphicNode;

  /**
   * Constructor.
   * @param sourceNode The source from which this node is copied.
   */
  public constructor( sourceNode: GraphicNode ) {
    super();

    this.sourceNode = sourceNode;

    // Recalculate projections when the transformation of the source node changes.
    const callback = (): void => {
      this.updateProjectionMatrices();
    };
    this.sourceNode.transformation.subscribeToChanges( callback );
  }

  /**
   * Update the projection matrices of the node and of its children.
   */
  public updateProjectionMatrices(): void {
    if ( this.parent !== null ) {
      // The projection of the parent combined with the own transformation.
      this.projectNodeToView.copy( this.parent.projectNodeToView );
      this.projectNodeToView.transform( this.sourceNode.transformation.transformMatrix );
    } else {
      // When no parent exists the projection is equal to the own transformation.
      this.projectNodeToView.copy( this.sourceNode.transformation.transformMatrix );
    }

    this.projectViewToNode.setToInverse( this.projectNodeToView );

    this.children.forEach( ( child: PresentationNode ): void => {
      child.updateProjectionMatrices();
    } );
  }
}

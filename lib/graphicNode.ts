import { GenericNode } from './genericNode';
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
   * Constructor.
   */
  public constructor() {
    super();
  }
}

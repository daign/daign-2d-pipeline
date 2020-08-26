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
   * Differentiate between different type of nodes.
   */
  public type: string | null = null;

  /**
   * Constructor.
   */
  public constructor() {
    super();
  }
}

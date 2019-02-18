import {GenericNode} from './genericNode';
import {TransformCollection} from './transformations/transformCollection';

/**
 * Class for nodes in a graphic document.
 */
export class GraphicNode extends GenericNode {
  /**
   * The transformation applied to the node.
   */
  public transformation: TransformCollection = new TransformCollection();

  /**
   * Constructor.
   */
  constructor() {
    super();
  }
}

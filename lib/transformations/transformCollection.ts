import { GenericArray, Matrix3 } from '@daign/math';

import { Transform } from './transform';

/**
 * Collection of transformations combined into a single transformation.
 * The transformations are applied in order from highest to lowest index.
 */
export class TransformCollection extends GenericArray<Transform> {
  /**
   * The transformation matrix.
   */
  public transformMatrix: Matrix3 = new Matrix3().setIdentity();

  /**
   * The matrix of the inverse transformation.
   */
  public inverseTransformMatrix: Matrix3 = new Matrix3().setIdentity();

  /**
   * The transformation matrix, not including native transforms.
   */
  public transformMatrixNonNative: Matrix3 = new Matrix3().setIdentity();

  /**
   * The native SVG transform attribute string.
   */
  public nativeSvgTransform: string | null = null;

  /**
   * Constructor.
   */
  public constructor() {
    super();

    this.subscribeToChanges( (): void => {
      this.combineTransformations();
    } );
  }

  /**
   * Combine all transformations in the collection into a single transformation matrix.
   */
  private combineTransformations(): void {
    this.transformMatrix.setIdentity();
    this.transformMatrixNonNative.setIdentity();
    this.nativeSvgTransform = null;

    const nativeTransformsArray: string[] = [];

    this.iterate( ( item: Transform ): void => {
      this.transformMatrix.multiply( item.matrix );
      this.transformMatrixNonNative.multiply( item.matrixNonNative );

      // Put the native transforms in an array in opposite order.
      if ( item.nativeSvgTransform ) {
        nativeTransformsArray.unshift( item.nativeSvgTransform );
      }
    } );

    // Create the joined native SVG transform command if the array is not empty.
    if ( nativeTransformsArray.length > 0 ) {
      this.nativeSvgTransform = nativeTransformsArray.join( ', ' );
    }

    try {
      this.inverseTransformMatrix.setToInverse( this.transformMatrix );
    } catch ( e ) {
      // Keep the previous inverse matrix if the current can not be inverted.
    }
  }
}

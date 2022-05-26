# Concept - daign-2d-pipeline

This library takes a document tree with layered transformations
and automatically calculates the transformation matrices for each element.
The transformation matrices can then be used to project element coordinates to view coordinates
and vice versa.

In SVG documents this can be achieved with the transform attribute.
The SVG viewer will then calculate the final position of the circle.

```svg
<svg version="1.1"
     xmlns="http://www.w3.org/2000/svg"
     width="200" height="200" viewBox="0 0 20 20">
  <g transform="scale(3,2)">
    <g transform="translate(4,1)">
      <g transform="translate(-3,3)">
        <circle cx="1" cy="2" r="1" fill="red"/>
      </g>
    </g>
  </g>
</svg>
```

The same can be calculated with matrices,
because each transformation in an SVG document can be represented by a matrix.
Multiplying the matrices together
will result in a single matrix for the complete projection
from element coordinates to view coordinates.

With the inverse matrix the view coordinates can also be projected to element coordinates.
This is useful because mouse events are happening in screen coordinates.
If we want to know where a point that was dragged across the screen ends up
for an element that has transformations applied on it,
then we have to know the inverse transformation matrix.

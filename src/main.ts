type Point2D = {
  x: number;
  y: number;
}

const Point2D = (x: number, y: number): Point2D => ({
  x: x,
  y: y
})

class Point2DImpl implements Point2D{
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}


const p1: Point2D = Point2D(10,0)

const p2: Point2D = new Point2DImpl(20,15)

console.log(p1)
console.log(p2)


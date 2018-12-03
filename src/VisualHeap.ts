import Heap from './Heap';
import HeapObject from './HeapObject';

export default class VisualHeap {
  public ctx: CanvasRenderingContext2D | null;
  constructor(public heap: Heap, public canvas: HTMLCanvasElement) {
    this.ctx = this.canvas.getContext('2d');
    // const canvasclick = this.canvasclick;
    this.canvas.addEventListener('click', (evt) => {
      //   console.log(evt);
      const trueCoords = interpolate(this.canvas.width, this.canvas.clientWidth, evt.offsetX);
      this.canvasclick(trueCoords);
    });
  }
  public canvasclick(offset: number) {
    console.log('canv width', this.canvas.width, 'offsetX', offset);
    // floor because can't start on fraction. must exist to left a little if partial
    const heapLoc = Math.floor(interpolate(this.heap.size, this.canvas.width, offset));
    console.log('heap location:', heapLoc);
    const heapObj = this.heap.objAtLoc(heapLoc);
    console.table(heapObj);
    if (heapObj) {
      this.heap.removeObject(heapObj);
      this.drawHeap();
    }
  }

  public visualAllocate(heapObj: HeapObject) {
    try {
      this.heap.allocate(heapObj);
      console.log('visualallocate made it past heap.allocate');
      console.log(heapObj);

      this.drawObj(heapObj);
    } catch (e) {
      console.log('visual heap could not allocate:', e);
    }
  }

  public drawObj(heapObj: HeapObject, color = 'green') {
    const totalpx = this.canvas.width;
    console.log(this.canvas.width);
    const leftOffset = interpolate(totalpx, this.heap.size, heapObj.position);
    const rightOffset = interpolate(totalpx, this.heap.size, heapObj.end);
    console.log('left:', leftOffset, 'right:', rightOffset);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(leftOffset, 0, rightOffset - leftOffset, this.canvas.height);

    this.ctx.strokeStyle = 'black';
    this.ctx.strokeRect(leftOffset, 0, rightOffset - leftOffset, this.canvas.height);
    // ctx.fillRect(10, 10, 150, 100);
  }

  public drawHeap() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < this.heap.objects.length; i++) {
      const element = this.heap.objects[i];
      this.drawObj(element);
    }
  }
}

function interpolate(w: number, wi: number, xi: number): number {
  return (w * xi) / wi;
}

// let visualheap: VisualHeap = new VisualHeap(heap, canvas);

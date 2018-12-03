import Heap from "./Heap";
import HeapObject from "./HeapObject";

export default class HeapController {
  constructor(public heap: Heap) {}
  setAllocationMethod(method: string): (heapObj: HeapObject) => HeapObject {
    return this.heap.setAllocationMethod(method);
  }
  continuesim: boolean = true;
  simulate(delay: number, createDeleteRatio: number, averageObSize: number) {
    if (!this.continuesim) {
      return;
    }

    let create = Math.random() > 1 / (1 + createDeleteRatio);
    if (create) {
      let size = Math.round(randn_bm() * averageObSize);
      this.heap.addRandom(size);
    } else {
      this.heap.removeRandom();
    }

    setTimeout(() => this.simulate(delay, createDeleteRatio, averageObSize), delay);
  }
}

// Standard Normal variate using Box-Muller transform.
function randn_bm() {
  var u = 0,
    v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

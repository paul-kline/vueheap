import HeapObject from "./HeapObject";
// Array.prototype.insert = function(index, item) {
//   this.splice(index, 0, item);
// };

export default class Heap {
  public objects: HeapObject[];
  public allocate: (heapobj: HeapObject) => HeapObject;
  constructor(public size: number = 100, public allocationMethod = "first-fit") {
    this.objects = [];
    this.allocate = this.setAllocationMethod(allocationMethod);
  }
  public setAllocationMethod(method: string): (heapObj: HeapObject) => HeapObject {
    switch (method) {
      case "first-fit":
        this.allocate = this.firstfit;
        break;
      case "best-fit":
        this.allocate = this.bestfit;
        break;
      case "worst-fit":
        this.allocate = this.worstfit;
        break;
      default:
        this.allocate = this.firstfit;
        break;
    }
    return this.allocate;
  }
  public addRandom(size?: number) {
    if (!size) {
      size = Math.ceil(Math.random() * (this.size / 4));
    }
    const o = new HeapObject(size);
    this.allocate(o);
  }
  public setSize(newSize: number) {
    if (newSize >= this.size) {
      //everything is fine
      this.size = newSize;
      return { success: true };
    } else {
      //we are shrinking. dat cool?
      const end = () => this.objects[this.objects.length - 1].end;
      if (this.objects.length == 0 || end() <= newSize) {
        //all is well.
        this.size = newSize;
        return { success: true };
      } else {
        return { success: false, desiredSize: newSize, currentSize: this.size, maxSpace: end() - 1 };
      }
    }
  }
  public addObject(heapObj: HeapObject): HeapObject {
    return this.allocate(heapObj);
  }
  public removeRandom() {
    if (this.objects.length == 0) {
      console.log("can't delete. it's empty!");
      return;
    }
    this.removeObjectAtIndex(Math.floor(Math.random() * this.objects.length));
  }
  public insertBefore(index: number, heapobj: HeapObject): HeapObject {
    let gap;
    // each scenario should set 2 things:
    // 1. the gap
    // 2. the position of heapobj

    // check the special case that this is the first object being allocated ever.
    if (this.objects.length == 0) {
      // console.log("first allocation");
      gap = this.size; // 1
      heapobj.position = 0; // 2
    } else if (index >= this.objects.length) {
      // this is going to be the new last object.
      const previousLast = this.objects[this.objects.length - 1];
      gap = this.size - previousLast.end; // 1
      heapobj.position = previousLast.end; // 2
    } else if (index <= 0) {
      // new first object.
      const previousLast = this.objects[0];
      gap = previousLast.position; // 1
      heapobj.position = 0; // 2
    } else {
      // the index is somewhere in the middle of the array:
      const rightObj = this.objects[index];
      const leftObj = this.objects[index - 1];
      gap = rightObj.position - leftObj.end; // 1
      heapobj.position = leftObj.end; // 2
    }

    if (gap >= heapobj.size) {
      // insert
      //   this.objects.insert(index, heapobj);
      this.objects.splice(index, 0, heapobj);
      return heapobj;
    } else {
      throw new Error(`ALLOCATION INSERTION ERROR: Object had size: ${heapobj.size}, but available gap was: ${gap}. Needed: ${heapobj.size - gap} more spaces.`);
    }
  }
  public objAtLoc(loc: number): HeapObject | null {
    for (let i = 0; i < this.objects.length; i++) {
      const o = this.objects[i];
      if (loc >= o.position && loc < o.end) {
        return o;
      }
    }
    return null;
  }
  public removeObject(heapObj: HeapObject): void {
    this.removeObjectAtIndex(this.objects.indexOf(heapObj));
  }
  public removeObjectAtIndex(i: number): void {
    this.objects.splice(i, 1);
    return;
  }

  public firstfit(heapobj: HeapObject): HeapObject {
    for (let i = 0; i <= this.objects.length; i++) {
      try {
        this.insertBefore(i, heapobj);
        // if the previous method doesn't throw an error, success!
        return heapobj;
      } catch (e) {
        // console.log(e);
        // not much to do here, didn't fit! try the next slot.
        // unless the final attempt also failed!
        if (i == this.objects.length) {
          throw e;
        }
      }
    }
    return heapobj;
  }

  public bestfit(heapobj: HeapObject): HeapObject {
    if (this.objects.length == 0) {
      this.insertBefore(0, heapobj);
      return heapobj;
    }
    let bestindex = 0;
    let bestdiff = this.size;
    let gap;
    for (let i = 1; i < this.objects.length; i++) {
      if (this.objects[i].position != null) {
        const element = this.objects[i];
        gap = this.objects[i].position - this.objects[i - 1].end;
        if (gap >= heapobj.size && gap - heapobj.size < bestdiff) {
          bestindex = i;
          bestdiff = gap - heapobj.size;
        }
      } else {
        throw new Error("the position property is not set!!!");
      }
    }
    const lst = this.objects[this.objects.length - 1];
    gap = this.size - lst.end;
    if (gap >= heapobj.size && gap - heapobj.size < bestdiff) {
      bestindex = this.objects.length;
    }
    this.insertBefore(bestindex, heapobj);
    return heapobj;
  }

  public worstfit(heapobj: HeapObject): HeapObject {
    if (this.objects.length == 0) {
      this.insertBefore(0, heapobj);
      return heapobj;
    }
    let bestindex = 0;
    let bestdiff = -1;
    let gap;
    for (let i = 1; i < this.objects.length; i++) {
      const element = this.objects[i];
      gap = this.objects[i].position - this.objects[i - 1].end;
      if (gap >= heapobj.size && gap - heapobj.size > bestdiff) {
        bestindex = i;
        bestdiff = gap - heapobj.size;
      }
    }
    const lst = this.objects[this.objects.length - 1];
    gap = this.size - lst.end;
    if (gap >= heapobj.size && gap - heapobj.size > bestdiff) {
      // console.log("setting new best index! it was last!");
      bestindex = this.objects.length;
    }
    // console.log("worst gap:", gap, "worst index:", bestindex);
    this.insertBefore(bestindex, heapobj);
    return heapobj;
  }
}

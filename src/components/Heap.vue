<template>
  <div class="container">
    <h4>Heap size: 100</h4>Allocation Method:
    <select
      v-model="allocationMethod"
      id="allocation-method"
      v-on:change="heapFitSelected()"
      class="form-control form-control-sm"
      style="width:max-content; display: inline-block;"
    >
      <option value="first-fit">First Fit</option>
      <option value="best-fit">Best Fit</option>
      <option value="worst-fit">Worst Fit</option>
    </select>
    <div class="mt-3">
      <button class="btn mr-2" v-on:click="addObject()">add object</button> Object size:
      <input
        v-model.number="size"
        class="form-control"
        id="objsize1"
        type="number"
        style="width:5em; display:inline-block"
      >
    </div>
    <p>Click in heap to manually "delete" a heap object.</p>

    <canvas
      class="mt-2"
      ref="heapcanvas"
      width="1000"
      height="50"
      style="background-color: lightgray; width:100%; height: 5em;"
    ></canvas>
  </div>
</template>

<script>
import HeapController from "../HeapController";

let x = new HeapController();
import Heap from "../Heap";
import HeapObject from "../HeapObject";
import VisualHeap from "../VisualHeap";

// let heap = new Heap();
console.log("efiejfiejfiefjeifjefij");bluetoo
// console.log(this.$refs.heapcanvas);
// let heapcontroller = new HeapController();

export default Vue.extend {
  data: function() {
    return {
      greeting: "Hello",
      size: 10,
      heap: new Heap(100),
      visualheap: null,
      allocationMethod: "first-fit",
      heapcontroller: null
    };
  },
  methods: {
    addObject: function(sizeid) {
      console.log("made it");
      console.log("size", this.size);
      console.log("heap", this.heap);
      this.visualheap.visualAllocate(new HeapObject(this.size));
      this.size = Math.ceil(Math.random() * 20);
    },
    heapFitSelected: function() {
      this.heapcontroller.setAllocationMethod(this.allocationMethod);
    }
  },
  mounted: function() {
    console.log("nounted");
    this.visualheap = new VisualHeap(this.heap, this.$refs.heapcanvas);
    this.heapcontroller = new HeapController(this.heap, this.visualheap);
    console.log(this.heapcontroller, "fiejfiejheapcontroller was");
  }
};
</script>

<style scoped>
p {
  /* font-size: 1em; */
  text-align: left;
}
</style>
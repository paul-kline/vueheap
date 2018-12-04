<template>
  <div class="container">
    <div v-if="canchangesize">
      <h4>
        Heap size:
        <input v-model="heapSize" style="width:4em;" type="number">
      </h4>
    </div>
    <div v-if="canchangeallocation">
      Allocation Method:
      <select
        v-model="allocationMethod"
        id="allocation-method"
        v-on:change="heapFitSelected(allocationMethod)"
        class="form-control form-control-sm"
        style="width:max-content; display: inline-block;"
      >
        <option value="first-fit">First Fit</option>
        <option value="best-fit">Best Fit</option>
        <option value="worst-fit">Worst Fit</option>
      </select>
    </div>

    <div class="mt-3" v-if="canaddobject">
      <button class="btn mr-2" v-on:click="addObjectFromInput()">add object</button> Object size:
      <input
        v-model.number="objSize"
        class="form-control"
        id="objsize1"
        type="number"
        style="width:5em; display:inline-block"
      >
    </div>
    <div class="align-left" v-bind:style="{color: simon? 'black' : 'grey'}">
      <span style="font-size:1.3em;">Simulation</span>
      <input style="display:inline-block" v-model="simon" type="checkbox">
      <div>Create/Delete ratio:</div>

      <input type="number" v-model.number="createDeleteRatio" style="width:3em">
    </div>
    <span v-if="clicktodelete">Click in heap to manually "delete" a heap object.</span>
    <heap-canvas v-bind:heap="heap" v-on:shrink-error="shrinkError"></heap-canvas>
    <div>{{message}}</div>
  </div>
</template>

<script lang="ts">
import HeapController from "../HeapController";
import Vue from "vue";
import HeapCanvas from "./HeapCanvas.vue";
import Heap from "../Heap";
import HeapObject from "../HeapObject";

export default {
  components: {
    HeapCanvas
  },
  props: {
    canchangesize: {
      type: Boolean,
      default: true
    },
    heapsize: {
      type: Number,
      default: 100
    },
    clicktodelete: {
      type: Boolean,
      default: true
    },
    canaddobject: {
      type: Boolean,
      default: true
    },
    canchangeallocation: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {
      message: "messages appear here.",
      objSize: 10,
      heap: new Heap(100),
      allocationMethod: "first-fit",
      heapsizechangeHandled: false,
      heapSize: null,
      createDeleteRatio: 1,
      simon: false
    };
  },
  computed: {},
  methods: {
    addObjectFromInput: function() {
      const ho = new HeapObject(this.objSize);
      this.addObject(ho);
      this.objSize = Math.ceil(Math.random() * 20);
    },
    addObject(ho: HeapObject) {
      try {
        ho = this.heap.addObject(ho);
        if (ho.position !== null) {
          //placed successfully
          this.message = `Placed object of size: ${ho.size} at position: ${
            ho.position
          }`;
        }
        return ho;
      } catch (e) {
        this.message = e.message;
        return false;
      }
    },
    shrinkError(arg) {
      console.log("shrink error", arg);
    },
    heapFitSelected: function(fit: string) {
      // console.log("heap fit changed", fit);
      this.heap.setAllocationMethod(fit);
    },
    simulate(delay: number, createDeleteRatio: number, averageObSize: number) {
      if (!this.simon) {
        return;
      }
      // console.log("sim tick");

      const create = Math.random() > 1 / (1 + this.createDeleteRatio);
      // console.log("create delete ratio", this.createDeleteRatio);
      if (create || this.heap.objects.length == 0) {
        console.log("creating", this.heap.objects.length);
        // const size = Math.round(averageObSize + randn_bm() * 3);
        const size = Math.round(Math.ceil(Math.random() * 20));

        console.log("random sizeddds", size);

        const result = this.addObject(new HeapObject(size));
        if (!result) {
          // this.message = e.message;
          this.simon = false;
        }
      } else {
        console.log("deleting");
        this.heap.removeRandom();
      }

      setTimeout(
        () => this.simulate(delay, this.createDeleteRatio, averageObSize),
        delay
      );
    }
  },
  watch: {
    heapSize: function(newsize: number, oldsize: number) {
      console.log("heap.vue detected heapsize change", newsize, oldsize);
      if (this.heapsizechangeHandled) {
        this.heapsizechangeHandled = !this.heapsizechangeHandled;
        return;
      }

      const word = newsize > oldsize ? "Increased" : "Shrunk";
      const result = this.heap.setSize(newsize);
      if (result.success) {
        this.message = `${word} heap to size: ${newsize}`;
        // this.heapSize = newsize;
      } else {
        //{ success: false, desiredSize: newSize, currentSize: this.size, maxSpace: end }
        console.table(result);
        this.message = `Can't shrink to: ${
          result.desiredSize
        }. Last object occupies location: ${result.maxSpace} `;
        this.heapsizechangeHandled = true;
        this.heapSize = oldsize;
      }
    },
    simon: function(newer: boolean, older: boolean) {
      if (newer) {
        this.simulate(200, this.createDeleteRatio, this.heapSize / 8);
      }
    }
  },
  mounted: function() {},
  created: function() {
    console.log("created");
    this.heapSize = this.heapsize;
  }
};

function randn_bm() {
  let u = 0,
    v = 0;
  while (u === 0) {
    u = Math.random();
  } // Converting [0,1) to (0,1)
  while (v === 0) {
    v = Math.random();
  }
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}
</script>

<style scoped>
p {
  /* font-size: 1em; */
  text-align: left;
}
</style>
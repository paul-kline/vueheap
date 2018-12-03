<template>
  <canvas
    ref="heapcanvas"
    width="1000"
    height="50"
    style="background-color: lightgray; width:100%; height: 5em;"
    v-on:click="clicked"
  ></canvas>
</template>

<script lang="ts">
import Heap from "../Heap";
import HeapObject from "../HeapObject";
function interpolate(w: number, wi: number, xi: number): number {
  return (w * xi) / wi;
}
export default {
  props: {
    heap: {
      type: Heap,
      default: () => new Heap()
    },
    objectcolor: {
      type: String,
      default: "green"
    }
  },
  data: function() {
    return {
      canvas: <HTMLCanvasElement>null,
      ctx: <CanvasRenderingContext2D>null
    };
  },
  computed: {
    heapObjects: function() {
      return this.heap.objects;
    }
  },
  methods: {
    clicked(evt) {
      // console.log("got clicked", evt);
      const trueCoords = interpolate(
        this.canvas.width,
        this.canvas.clientWidth,
        evt.offsetX
      );
      this.canvasclick(trueCoords);
    },
    alloc(heapObj: HeapObject) {
      try {
        this.heap.allocate(heapObj);
        this.drawObj(heapObj);
      } catch (e) {
        this.$emit("alloc-error", e);
        console.log("visual heap could not allocate:", e);
      }
    },
    drawObj(heapObj: HeapObject, color = this.objectcolor) {
      const totalpx = this.canvas.width;
      // console.log(this.canvas.width);
      const leftOffset = interpolate(totalpx, this.heap.size, heapObj.position);
      const rightOffset = interpolate(totalpx, this.heap.size, heapObj.end);
      // console.log("left:", leftOffset, "right:", rightOffset);
      this.ctx.fillStyle = color;
      this.ctx.fillRect(
        leftOffset,
        0,
        rightOffset - leftOffset,
        this.canvas.height
      );

      this.ctx.strokeStyle = "black";
      this.ctx.strokeRect(
        leftOffset,
        0,
        rightOffset - leftOffset,
        this.canvas.height
      );
      // ctx.fillRect(10, 10, 150, 100);
    },
    canvasclick(offset: number) {
      // console.log("canv width", this.canvas.width, "offsetX", offset);
      //floor because can't start on fraction. must exist to left a little if partial
      const heapLoc = Math.floor(
        interpolate(this.heap.size, this.canvas.width, offset)
      );
      // console.log("heap location:", heapLoc);
      const heapObj = this.heap.objAtLoc(heapLoc);
      // console.table(heapObj);
      if (heapObj) {
        this.heap.removeObject(heapObj);
        this.drawHeap();
      }
    },
    drawHeap() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      for (let i = 0; i < this.heap.objects.length; i++) {
        const element = this.heap.objects[i];
        this.drawObj(element);
      }
    }
  },
  mounted: function() {
    this.canvas = this.$refs.heapcanvas;
    this.ctx = this.canvas.getContext("2d");
    // console.log("my heap is", this.heap);
    this.heap.addRandom();
    setTimeout(() => {
      // console.log("adding elem in settimeout");
      this.heap.addRandom();
    }, 2000);
    // this.drawHeap();
  },
  watch: {
    heapObjects: function(oldheap, newheap) {
      console.log("heap changed!! I love you");
      this.drawHeap();
    }
  }
};
</script>

<style scoped>
p {
  font-size: 2em;
  text-align: center;
}
</style>
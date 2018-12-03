export default class HeapObject {
  position: number | null = null;
  constructor(public size: number) {}
  get end(): number {
    if (this.position !== null) {
      return this.position + this.size;
    } else {
      console.trace();
      console.log("my position is:", this.position);
      throw new Error("Position property was never set.");
    }
  }
}

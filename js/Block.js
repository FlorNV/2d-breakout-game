class Block {

    blockWidth = 100;
    blockHeight = 20;

    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis];
        this.bottomRight = [xAxis + this.blockWidth, yAxis];
        this.topLeft = [xAxis, yAxis + this.blockHeight];
        this.topRight = [xAxis + this.blockWidth, yAxis + this.blockHeight];
    }
}
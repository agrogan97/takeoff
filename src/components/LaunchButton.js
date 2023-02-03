class LaunchButton {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 100;
        this.h = 100;
        this.p = createVector(x, y)
    }

    draw() {
        push();
        translate(this.x, this.y);
        fill(51);
        rect(0, 0, this.w, this.h);
        pop();
    }
}
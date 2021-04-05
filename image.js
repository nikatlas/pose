const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const posenet = require('@tensorflow-models/posenet');
const config = require('./config');

class Image {
    constructor(filename, w, h, net) {
        this.filename = filename;
        this.width = w;
        this.height = h;
        this.pose = undefined;
        this.net = net;
    }

    async draw() {
        this.canvas = createCanvas(this.width, this.height)
        this.ctx = this.canvas.getContext('2d')

        const image = await loadImage(this.filename);
        this.image = image;
        console.log(image);
        this.ctx.drawImage(image, 0, 0, this.width, this.height)
    }

    async estimatePose() {
        return await this.estimatePoseOnImage(this.canvas);
    }

    async estimatePoseOnImage(imageElement) {
      // load the posenet model from a checkpoint
      const pose = await this.net.estimateSinglePose(imageElement, {
          flipHorizontal: false,

      });
      this.pose = pose;
      return pose;
    }

    async save(output, withKP = false) {
        var buf = withKP ? this.posecanvas.toBuffer() : this.canvas.toBuffer();
        fs.writeFileSync(output, buf);
    }

    async drawKeypoints() {
        if (!this.pose)
            await this.estimatePose()
        this.posecanvas = createCanvas(this.width, this.height)
        this.posectx = this.posecanvas.getContext('2d')

        this.posectx.drawImage(this.image, 0, 0, this.width, this.height)
        this.posectx.fillStyle = "black";

        this.pose.keypoints?.forEach((kp) => {
            this.posectx.fillRect(kp.position.x-3, kp.position.y-3, 6, 6);
        })
    }
}

module.exports = Image;
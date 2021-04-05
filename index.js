// const tfgpu = require('@tensorflow/tfjs-node-gpu');
const tf = require('@tensorflow/tfjs-node');
const posenet = require('@tensorflow-models/posenet');
const Video = require('./video');
const Image = require('./image');

async function start() {
  // const image = new Image('temp/videos/idle.mp4/idle.mp4_1920x956_0001_1.jpg', 1920, 956);
  //
  // await image.draw();
  // await image.drawKeypoints();
  // await image.save('test-test-withkp.png', true)
  //
  // console.log(image.pose.keypoints[4].position)
  const net = await posenet.load({
          architecture: 'ResNet50',
          outputStride: 16,
          inputResolution: 801,
          quantBytes: 4,
          multiplier: 1

      });

  const vid = new Video("./videos/idle.mp4", 1920, 956, net, 1);
  await vid.extractFrames();
  await vid.compute();

  // vid.save();

    // console.(JSON.stringify(vid.images[0].pose));
  vid.images.forEach((image, ind) => {
    console.log(`#${ind} - `);
    console.debug(image.pose.keypoints)
  })


  // const poses = [];

  // let image = images[0];
  // console.log(image);
  // drawImageOnCanvas(image);
  // let pose = await estimatePoseOnImage(canvas);
  // poses.push(pose);
  // console.log(pose.keypoints[5])
  // var buf = canvas.toBuffer();
  // fs.writeFileSync("./test.png", buf);
}



start()
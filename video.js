const fs = require('fs');
const ffmpeg = require('ffmpeg');
const Image = require('./image');
const { createCanvas, loadImage } = require('canvas');

class Video {
    constructor(filename, w, h, net, maxFrames = 5) {
        this.filename = filename;
        this.width = w;
        this.height = h;
        this.images = [];
        this.net = net;
        this.maxFrames = maxFrames;
    }

    extractFrames() {
        const destpath = "./temp/" + this.filename + "/";
        const filename = this.filename;
        return new Promise((res,rej) => {
            try {
                var process = new ffmpeg(filename);
                process.then((video) => {
                    // Callback mode
                    video.fnExtractFrameToJPG(destpath, {
                        every_n_frames: 1,
                        number: this.maxFrames,
                        keep_pixel_aspect_ratio: true,
                        keep_aspect_ratio: true,
                        file_name: filename + "_%s_%04d.4"
                    }, (error, files) => {
                        if (error) {
                            console.log("THERE WAS ERROR Extracting the files", error)
                            return
                        }
                        this.files = files;
                        console.log("Files extracted", this.files)
                        res(files)
                    });
                }, function (err) {
                    console.log('Error: ' + err);
                });
            } catch (e) {
                console.log(e.code);
                console.log(e.msg);
                rej(e);
            }
        });

    }

    async compute() {
        for(let i = 0; i < this.files.length; i++ ) {
            const image = new Image(this.files[i], this.width, this.height, this.net)
            await image.draw();
            await image.drawKeypoints();
            this.images[i] = image;
        }
    }

    async saveFrame(index, output) {
        await this.images[index].save(output, true)
    }

    async save() {
        for(var i in this.files) {
            const paths = this.files[i].split('/');
            const filename = paths.pop();
            console.log(paths, filename)
            fs.mkdir(paths.join('/') + "_KP", { recursive: true }, (err) => {
                  if (err) rej(err);
            })
            await this.saveFrame(i, "./temp/videos/" + paths[paths.length-1] + "_KP/" + filename);
        }
    }
}

module.exports = Video;
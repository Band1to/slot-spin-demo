
'use strict';

const $ = require('jquery');
const Spritely = require('./jquery.spritely.js');

export default class SlotCell {
	constructor(options) {
	    options = (options || {});
		this.speed = 0; //speed of the slot at any point of time
        this.step = options.step; //speed will increase at this rate
        this.si = null; //holds setInterval object for the given slot
        this.el = options.el; //dom element of the slot
        this.maxSpeed = options.max; //max speed this slot can have
        this.pos = null; //final position of the slot
		this.completed = 0;
		this.imgHeight = 1374;
        this.posArr = [
            0, //orange
            80, //number 7
            165, //bar
            237, //guava
            310, //banana
            378, //cherry
            454, //orange
            539, //number 7
            624, //bar
            696, //guava
            769, //banana
            837, //cherry
            913, //orange
            1000, //number 7
            1085, //bar
            1157, //guava
            1230, //banana
            1298 //cherry
        ];

        $(this.el).pan({
            fps: 30,
            dir: 'down'
        });
        $(this.el).spStop();
	}

	start() {
        let self = this;
        $(self.el).addClass('motion');
        $(self.el).spStart();
        self.si = window.setInterval(() => {
            if (self.speed < self.maxSpeed) {
                self.speed += self.step;
                $(self.el).spSpeed(self.speed);
            }
        }, 100);
	}

	stop() {
		let self = this,
            limit = 30;
        clearInterval(self.si);
        self.si = window.setInterval(() => {
            if (self.speed > limit) {
                self.speed -= self.step;
                $(self.el).spSpeed(self.speed);
            } else {
                self.finalPos();
                $(self.el).spSpeed(0);
                $(self.el).spStop();
                clearInterval(self.si);
                $(self.el).removeClass('motion');
                self.speed = 0;
            }
        }, 100);
	}

	finalPos() {
		let el = this.el,
            el_id,
            pos,
            posMin = 2000000000,
            best,
            bgPos,
            i,
            j,
            k;
		let self = this;
        el_id = $(el).attr('id');
        pos = document.getElementById(el_id).style.backgroundPosition;
        pos = pos.split(' ')[1];
        pos = parseInt(pos, 10);

        for (i = 0; i < this.posArr.length; i++) {
            for (j = 0;;j++) {
                k = this.posArr[i] + (this.imgHeight * j);
                if (k > pos) {
                    if ((k - pos) < posMin) {
                        posMin = k - pos;
                        best = k;
                        this.pos = this.posArr[i]; //update the final position of the slot
                    }
                    break;
                }
            }
        }

        best += this.imgHeight + 4;
        bgPos = '0 ' + best + 'px';
        $(el).animate({
            backgroundPosition: "(" + bgPos + ")"
        }, {
            duration: 200,
            complete: () => {
                self.completed++;
            }
        });
	}

	reset() {
		let el_id = $(this.el).attr('id');
        $._spritely.instances[el_id].t = 0;
        $(this.el).css('background-position', '0px 4px');
        this.speed = 0;
        this.completed = 0;
	}

	hasCompleted() {
	    return this.speed === 0 && this.completed === 1;
    }

    hasReachedMaxSpeed() {
	    return this.speed >= this.maxSpeed;
    }

}

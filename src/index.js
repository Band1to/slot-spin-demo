
const $ = require('jquery');
window.jQuery = $;
window.$ = $;

import SlotCell from './slotcell.js';
import * as BackgroundPosition from './jquery.backgroundPosition.js';
import * as Styles from './main.scss';

$(() => {

    // used to determine win condition.
    // Normally this would be on the server.
    let win = [];
    win[0] = win[454] = win[913] = 1;
    win[80] = win[539] = win[1000] = 2;
    win[165] = win[624] = win[1085] = 3;
    win[237] = win[696] = win[1157] = 4;
    win[310] = win[769] = win[1230] = 5;
    win[378] = win[837] = win[1298] = 6;

    function enableControl() {
        $('#slots-control').attr('disabled', false);
    }

    function disableControl() {
        $('#slots-control').attr('disabled', true);
    }

    function testWinCondition() {
       return ([win[a.pos], win[b.pos], win[c.pos]].every(function (v, i, a) {
        return (
            v === a[0] &&
            v !== null
          );
        }));
    }

    function printResult() {
        let res = testWinCondition() ? 'winner!!' : 'sorry, try again';
        $('#slots-result').html(res);
    }

    // create slot objects
    let a = new SlotCell({el: '#slot-left', max: 30, step: 1});
    let b = new SlotCell({el: '#slot-mid', max: 45, step: 2});
    let c = new SlotCell({el: '#slot-right', max: 70, step: 3});

    /**
    * Slot machine controller
    */
    $('#slots-control').click((e) => {
        let x;
        if (e.currentTarget.innerHTML === 'Start') {
            a.start();
            b.start();
            c.start();
            e.currentTarget.innerHTML = 'Stop';
            $('#slots-control').removeClass('btn-success').addClass('btn-danger');

            // disable control until the slots reach max speed
            disableControl();
            
            // check every 100ms if slots have reached max speed
            // if so, enable the control
            x = window.setInterval(() => {
                if (a.hasReachedMaxSpeed() && b.hasReachedMaxSpeed() && c.hasReachedMaxSpeed()) {
                    enableControl();
                    window.clearInterval(x);
                }
            }, 100);
        } else if (e.currentTarget.innerHTML === 'Stop') {
            a.stop();
            b.stop();
            c.stop();
            e.currentTarget.innerHTML = 'Reset';
            $('#slots-control').removeClass('btn-danger').addClass('btn-warning');

            // disable control until the slots stop
            disableControl();
            
            // check every 100ms if slots have stopped
            // if so, enable the control
            x = window.setInterval(() => {
                if (a.hasCompleted() && b.hasCompleted() && c.hasCompleted()) {
                    enableControl();
                    window.clearInterval(x);
                    printResult();
                }
            }, 100);
        } else { // reset
            a.reset();
            b.reset();
            c.reset();
            $('#slots-result').html('');
            e.currentTarget.innerHTML = 'Start';
            $('#slots-control').removeClass('btn-warning').addClass('btn-success');
        }
    });
});

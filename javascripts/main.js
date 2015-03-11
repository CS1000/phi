document.addEventListener("click", nomore, false);
document.addEventListener("keyup", nomore, false);

var enough = 0, 
    levels=10,
    startTime=Date.now(); //millisec

function formatMSec(ms) {
    var sec = (ms / 1000) | 0;
    if (sec===0) return ms + 'ms';
    
    var min = (ms / 60000) | 0;
    if (min===0) return sec + 'seconds and ' + (ms-sec*1000) + 'ms';
    
    var h = (ms / 3600000) | 0;
    if (h===0) return min + 'minutes and ' + (sec-min*60) + 'sec';
    return h + 'hours and ' + (min-h*60) + 'min';
}

function out(txt, append) {
    if (!append) document.getElementById('content').innerHTML = '';
    document.getElementById('content').innerHTML += txt;
}

//bleah
function term(fibId, fibNo, time, ending) {
    document.getElementById('tty0').innerHTML = '$ Fibonacci #' 
        + fibId + '\t (' + fibNo + ') ';
    if (!ending) {
        document.getElementById('tty0')
            .innerHTML += '\t generated in ' + time + "ms\n" 
                +"$ Press (Mouse + Esc + Esc + C + Z + Q) to stop...\n\n";
    } else {
        document.getElementById('tty0').innerHTML += '\n$ Wasted ' 
                + formatMSec(Date.now()-startTime) 
                + ' to compute all this';
    }
}


//so when you click or bash your keyboard furiously (4 times)
//this nice little defunctor will use magic to give you your peace
function nomore() { 
    if (enough++ == 4) {
        clearInterval(comp); //abracadaber
        out('...', true);

        term(--ith, last[0] + 'e' + --last.length, 0, true);
    }
}

//special case, Do Not Use! look: starts with 1.
function bcdiv(num, divisor, precision) {
    var r='1.', p=0, i=2, temp, halt=true;
    
    num=bigInt(num);
    while (p++ < precision) {
        num=num.mod(divisor).multiply(10);
        temp=num.divide(divisor).toString();
        r+=temp;
        if (halt) {
            if (temp !== phi[i++]) halt=false;
        } else break;
    }
    return r;
}

function makeColor(x) {
    var r=Math.min(~~(x/1) + 16, 255),
        g=Math.min(~~(x/1), 128);
    return '#' + r.toString(16).replace(/^(.)$/, '0$1') 
               + (128-g).toString(16).replace(/^(.)$/, '0$1') 
               + '00';
}

function alerting(ms, fib) {
    var slowness = (ms+'').length-2,
        slow = ['slowing', 
                'slow', 
                'crawling', 
                'is squeezing every tranzistor',
                'running for days now'],
        extra = ['', 
                 'Please insert CPU...', 
                 'We should stop now!', 
                 'Bro do you even read this?',
                 'Heloooooo ?!?!??!?'];
        console.log('Computation ' + slow[slowness] 
                    +' at ' + fib + 'th Fibonacci no. ' 
                    + ms + 'ms. ' + extra[slowness]);
}

var n0=bigInt(1), 
    n1=bigInt(1), 
    phi = '1',
    last = '1',
    ith=2;

var comp = setInterval(function () {
    var newphi=n1;
    n1 = n0.add(n1);
    n0 = newphi;
    last=n1.toString();

    var perf=Date.now();
    newphi = bcdiv(n1, n0, phi.length);
    perf=Date.now()-perf;

    if (perf > levels) {
        alerting(perf, ith);
        levels*=phi; //because PHI
    }
    //replacing everything? wth, it's supposed to be ineffective
    out(
        //hacked line to break line
        newphi.split('').join('<wbr>') // or '&#173;'
    );

    ith % 7 === 0 && term(ith, last[0] + 'e' + --last.length, perf);

    ith++;
    phi = newphi;
}, 5);

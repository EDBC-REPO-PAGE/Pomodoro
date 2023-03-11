window.state = new device.state({
    b_sessn: [12,0], b_break: [5,0],
    sessn: [12,0], break: [5,0],
    prog: 100, state: 'stoped'
}); let interval;

/*--──────────────────────────────────────────────────────────────────────────────────--*/

function progress( state ){
    const act = window.state.get(state);
    const bsd = window.state.get(`b_${state}`);
    const err = (act[0]*60+act[1]) / (bsd[0]*60);
    window.state.set({ prog: (err*100-.5).toFixed(4) });
}

function clock(){
    if( window.state.get('sessn').some(x=>x) ){
        window.state.set(state=>({ sessn: [ 
            !state.sessn[1] ? state.sessn[0]-1 : state.sessn[0],
            !state.sessn[1] ? 60 : state.sessn[1]-1,
        ] })); progress( 'sessn' );
    } else if( window.state.get('break').some(x=>x) ) {
        window.state.set(state=>({ break: [ 
            !state.break[1] ? state.break[0]-1 : state.break[0],
            !state.break[1] ? 60 : state.break[1]-1,
        ] })); progress( 'break' );
    } else { window.resetClock(false) }
}

/*--──────────────────────────────────────────────────────────────────────────────────--*/

window.state.observeField('sessn',( prv,act )=>{
    if( !act[0] && !act[1] )
         $('body').setAttribute('invert',true);
    else $('body').setAttribute('invert',false);
});

window.state.observeField('state',( prv, act )=>{
    if( prv == act ) return 0;
    if( act!='playing' ) clearInterval(interval);
    else interval = setInterval(clock,1000);
});

/*--──────────────────────────────────────────────────────────────────────────────────--*/

// ScrollTrigger.create({
//     trigger: '.el',
//     onEnter: ()=> playTl(),
//     onEnterBack: ()=> playTl(),
//     onLeave: ()=> pausedTL(),
//     onLeaveBack: ()=> pausedTL(),
// })
// let tl = gsap.timeline({paused: true});
// function playTl() {
//     if (tl.progress() > 0 ) {
//         tl.resume()
//     } else {
//         tl.play();
//     }
// }
// function pausedTL() {
//     tl.pause();
// }
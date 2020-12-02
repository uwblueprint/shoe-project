export function arrow(angle: number){
    const rotation = angle + 140;
    const icon = `
    <svg width='70' height='70' viewBox='0 0 70 70' fill='none' xmlns='http://www.w3.org/2000/svg' >
        <path transform='scale(0.3) translate(70, 0) rotate(` + rotation + `) ' transform-origin="50% 40%" fill-rule='evenodd' clip-rule='evenodd' d='M38.5463 16.1776C33.5865 17.6799 28.9816 20.5656 25.3539 24.7875C21.7261 29.0095 19.5666 33.9967 18.8281 39.1265L9.85928 11.474L38.5463 16.1776Z' fill='#E44343'/>
    </svg>`;
    return encodeURI("data:image/svg+xml," + icon).replace('#','%23');
}

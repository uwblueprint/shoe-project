export function arrow(angle: number): string {
  const rotation = angle + 140;
  const unit = 100;

  const rad = (angle * Math.PI) / 180;

  const x = unit * Math.sin(rad);
  const y = unit * Math.cos(rad);

  const icon =
    `
    <svg width='70' height='70' viewBox='-10 -10 80 80' fill='none' xmlns='http://www.w3.org/2000/svg' >
        <path transform='scale(0.3) translate(` +
    y +
    `, ` +
    x +
    `) rotate(` +
    rotation +
    `) ' transform-origin="40% 40%" fill-rule='evenodd' clip-rule='evenodd' d='M38.5463 16.1776C33.5865 17.6799 28.9816 20.5656 25.3539 24.7875C21.7261 29.0095 19.5666 33.9967 18.8281 39.1265L9.85928 11.474L38.5463 16.1776Z' fill='#E44343'/>
        <svg width="58" height="66" viewBox="0 0 58 66" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d)">
        <path d="M36.8779 52.5683C46.5066 49.2905 53.4331 40.1707 53.4331 29.4331C53.4331 15.9391 42.494 5 29 5C15.506 5 4.56693 15.9391 4.56693 29.4331C4.56693 40.6245 12.0913 50.0585 22.3571 52.9523L23.556 53.4454C25.9873 54.4454 29 58.5 29 58.5C29 58.5 32.4974 54.5086 34.8976 53.4455L36.8779 52.5683Z" fill="#E44343"/>
        </g>
        <circle cx="29" cy="63" r="3" fill="#E44343"/>
        <path d="M34.8976 34.4882L36.5827 35.3307V21.8504C36.5827 20.9236 35.8244 20.1653 34.8976 20.1653H26.464C25.5372 20.1653 24.7874 20.9236 24.7874 21.8504H33.2126C34.1394 21.8504 34.8976 22.6087 34.8976 23.5354V34.4882ZM31.5276 23.5354H23.1024C22.1756 23.5354 21.4173 24.2937 21.4173 25.2205V38.7008L27.315 36.1732L33.2126 38.7008V25.2205C33.2126 24.2937 32.4543 23.5354 31.5276 23.5354Z" fill="white"/>
        <defs>
        <filter id="filter0_d" x="0.354326" y="0.787401" width="57.2913" height="61.9252" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
        <feOffset/>
        <feGaussianBlur stdDeviation="2.1063"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
        </filter>
        </defs>
        </svg>
    </svg>`;
  const blob = new Blob([icon], { type: "image/svg+xml" });
  return URL.createObjectURL(blob);
}
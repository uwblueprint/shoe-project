export function rotatedArrowSVG(angle: number): string {
  const rotation = angle + 140;
  const unit = 100;

  const rad = (angle * Math.PI) / 180;

  const x = unit * Math.sin(rad);
  const y = unit * Math.cos(rad);

  const icon = `<svg width='70' height='70' viewBox='-10 -10 80 80' fill='none' xmlns='http://www.w3.org/2000/svg' >
        <path transform='scale(0.3) translate(${y}, ${x}) rotate(${rotation}) ' transform-origin="30% 30%" fill-rule='evenodd' clip-rule='evenodd' d='M38.5463 16.1776C33.5865 17.6799 28.9816 20.5656 25.3539 24.7875C21.7261 29.0095 19.5666 33.9967 18.8281 39.1265L9.85928 11.474L38.5463 16.1776Z' fill='#E44343'/>
        <svg width="58" height="66" viewBox="0 0 58 66" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d)">
        <path d="M29.8711 42.4308C37.4478 39.8516 42.8982 32.6753 42.8982 24.226C42.8982 13.6078 34.2904 5 23.6721 5C13.0539 5 4.44611 13.6078 4.44611 24.226C4.44611 33.0324 10.3669 40.4559 18.4449 42.7329L19.3883 43.121C21.3015 43.9078 23.6721 47.0984 23.6721 47.0984C23.6721 47.0984 26.4242 43.9576 28.3129 43.121L29.8711 42.4308Z" fill="#E44343"/>
        </g>
        <ellipse cx="23.6721" cy="50.6393" rx="2.36066" ry="2.36066" fill="#E44343"/>
        <path d="M14.0667 21.0898L29.9609 35.1697L28.8942 36.3738L13.1605 22.4362L14.0667 21.0898Z" fill="white"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M20.4313 19.5647C21.8897 20.8567 23.8955 20.9762 24.9196 19.8351C24.9858 20.1492 25.5268 21.2551 26.2671 22.6816L25.1058 23.9925C24.9094 24.2142 24.9299 24.5531 25.1516 24.7494C25.3733 24.9458 25.7122 24.9253 25.9085 24.7036L26.7994 23.698C27.0573 24.1868 27.3288 24.6969 27.6053 25.2134L26.4016 26.5723C26.2052 26.794 26.2257 27.1329 26.4474 27.3292C26.669 27.5256 27.0079 27.5051 27.2043 27.2834L28.1461 26.2203C28.4208 26.7305 28.695 27.2376 28.9602 27.7275L27.6265 29.233C27.4302 29.4547 27.4507 29.7935 27.6724 29.9899C27.894 30.1863 28.2329 30.1658 28.4293 29.9441L29.504 28.7309L29.5389 28.7953L29.5389 28.7953L29.5389 28.7954C30.4729 30.5183 31.192 31.8446 31.2514 32.0132C31.4348 32.5338 31.4537 32.8099 31.3308 33.2981C31.1818 33.8902 30.4202 34.5688 30.4202 34.5688L14.6062 20.56C14.6062 20.56 15.8407 19.0297 16.7395 18.1518C17.6632 17.2497 19.1538 15.9925 19.1538 15.9925L19.1554 15.9936C18.8204 17.1213 19.2892 18.553 20.4313 19.5647Z" fill="white"/>
        <defs>
        <filter id="filter0_d" x="0.233507" y="0.787401" width="46.8773" height="50.5236" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
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

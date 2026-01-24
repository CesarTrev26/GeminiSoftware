/// <reference path="../.astro/types.d.ts" />

// GSAP type declarations
declare module 'gsap' {
  export const gsap: any;
  export default gsap;
}

declare module 'gsap/ScrollTrigger' {
  export const ScrollTrigger: any;
  export default ScrollTrigger;
}
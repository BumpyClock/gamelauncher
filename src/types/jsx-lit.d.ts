import 'react';

declare module 'react' { export namespace JSX { interface IntrinsicElements { 'sidebar-element': any; } } }

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'sidebar-element': any;
    }
  }
}

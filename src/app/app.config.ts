import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

type BrandPalette = 'brand' | 'accent' | 'iris' | 'crimson';

function makeSeverity(palette: BrandPalette) {
  return {
    background:        `{${palette}.500}`,
    hoverBackground:   `{${palette}.600}`,
    activeBackground:  `{${palette}.700}`,
    borderColor:       `{${palette}.500}`,
    hoverBorderColor:  `{${palette}.600}`,
    activeBorderColor: `{${palette}.700}`,
    color:             '#ffffff',
    hoverColor:        '#ffffff',
    activeColor:       '#ffffff',
    focusRing: { color: `{${palette}.500}`, shadow: 'none' },
  };
}

function makeOutlined(palette: BrandPalette, mode: 'light' | 'dark') {
  if (mode === 'light') {
    return {
      hoverBackground:  `{${palette}.50}`,
      activeBackground: `{${palette}.100}`,
      borderColor:      `{${palette}.200}`,
      color:            `{${palette}.500}`,
    };
  }
  return {
    hoverBackground:  `color-mix(in srgb, {${palette}.400}, transparent 96%)`,
    activeBackground: `color-mix(in srgb, {${palette}.400}, transparent 84%)`,
    borderColor:      `{${palette}.700}`,
    color:            `{${palette}.400}`,
  };
}

function makeText(palette: BrandPalette, mode: 'light' | 'dark') {
  if (mode === 'light') {
    return {
      hoverBackground:  `{${palette}.50}`,
      activeBackground: `{${palette}.100}`,
      color:            `{${palette}.500}`,
    };
  }
  return {
    hoverBackground:  `color-mix(in srgb, {${palette}.400}, transparent 96%)`,
    activeBackground: `color-mix(in srgb, {${palette}.400}, transparent 84%)`,
    color:            `{${palette}.400}`,
  };
}

const EnerconPreset = definePreset(Aura, {
  primitive: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    borderRadius: { sm: '4px', md: '4px', lg: '4px', xl: '4px' },
    brand: {
      50:  '#e6f5f3', 100: '#c2e8e3', 200: '#87d2c8', 300: '#4cbbac',
      400: '#11a591', 500: '#007a70', 600: '#006259', 700: '#004a44',
      800: '#003330', 900: '#001b1a', 950: '#000d0c',
    },
    accent: {
      50:  '#e7faf3', 100: '#c5f3df', 200: '#8be7c0', 300: '#51dba2',
      400: '#2dd198', 500: '#11be8c', 600: '#0e9870', 700: '#0b7256',
      800: '#074c3a', 900: '#04261e', 950: '#02130f',
    },
    iris: {
      50:  '#edeefb', 100: '#d6d8f5', 200: '#adafeb', 300: '#8487e1',
      400: '#5c5fd9', 500: '#484ad2', 600: '#393ba8', 700: '#2b2c7e',
      800: '#1c1e54', 900: '#0e0f2a', 950: '#070815',
    },
    crimson: {
      50:  '#fdebed', 100: '#fbcdd1', 200: '#f69ba2', 300: '#f26974',
      400: '#ee4554', 500: '#ed2939', 600: '#c41f2c', 700: '#9b1722',
      800: '#710f17', 900: '#48070d', 950: '#240407',
    },
  },
  semantic: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    primary: {
      50: '{brand.50}', 100: '{brand.100}', 200: '{brand.200}',
      300: '{brand.300}', 400: '{brand.400}', 500: '{brand.500}',
      600: '{brand.600}', 700: '{brand.700}', 800: '{brand.800}',
      900: '{brand.900}', 950: '{brand.950}',
    },
    colorScheme: {
      light: { primary: { color: '{primary.500}', contrastColor: '#ffffff', hoverColor: '{primary.600}', activeColor: '{primary.700}' } },
      dark:  { primary: { color: '{primary.500}', contrastColor: '#ffffff', hoverColor: '{primary.400}', activeColor: '{primary.300}' } },
    },
    formField: { borderRadius: '4px' },
    content: { borderRadius: '4px' },
    overlay: { modal: { borderRadius: '4px' }, popover: { borderRadius: '4px' }, select: { borderRadius: '4px' } },
  },
  components: {
    card: { root: { borderRadius: '4px' } },
    button: {
      colorScheme: {
        light: {
          root: { secondary: makeSeverity('accent'), success: makeSeverity('accent'), info: makeSeverity('iris'), help: makeSeverity('iris'), danger: makeSeverity('crimson') },
          outlined: { secondary: makeOutlined('accent','light'), success: makeOutlined('accent','light'), info: makeOutlined('iris','light'), help: makeOutlined('iris','light'), danger: makeOutlined('crimson','light') },
          text: { secondary: makeText('accent','light'), success: makeText('accent','light'), info: makeText('iris','light'), help: makeText('iris','light'), danger: makeText('crimson','light') },
        },
        dark: {
          root: { secondary: makeSeverity('accent'), success: makeSeverity('accent'), info: makeSeverity('iris'), help: makeSeverity('iris'), danger: makeSeverity('crimson') },
          outlined: { secondary: makeOutlined('accent','dark'), success: makeOutlined('accent','dark'), info: makeOutlined('iris','dark'), help: makeOutlined('iris','dark'), danger: makeOutlined('crimson','dark') },
          text: { secondary: makeText('accent','dark'), success: makeText('accent','dark'), info: makeText('iris','dark'), help: makeText('iris','dark'), danger: makeText('crimson','dark') },
        },
      },
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: EnerconPreset,
        options: { darkModeSelector: '.dark-mode', cssLayer: false },
      },
    }),
  ],
};

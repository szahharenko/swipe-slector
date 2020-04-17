# swipe-slector

## Preview:
See [how it works](https://swipe-selector-ts.netlify.app/).

## Latest build:
[![Netlify Status](https://api.netlify.com/api/v1/badges/0d20d9ca-ec86-47f9-9e90-85cd7312a10d/deploy-status)](https://app.netlify.com/sites/swipe-selector-ts/deploys)

## Dev:
- setup : npm install
- run : npm run serve
- build : npm run build

## Comments
- A nice, self-contained component that is easy to configure.
```vue
<SelectBox :list="Array<any>" :settings="{ name: string, unit?: string, value?: any }"/>
```

- The Swiper dependency is very heavy and we would like to get rid of it.
Replaced with fully custom written PointerEventDispatcher handler, allowing to bind Swipe, Tap, Drag events

- Should work well with touch, mouse, and keyboard.
Mouse and touch are implemented

## Todo
- #done - Center slector on current value
- #done - Keyboard controls
- #partialy done - Better animation effects
- Fetch data and then embed component

## Bugs
- Unfocus all other selectors on focusing another

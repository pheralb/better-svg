# Better SVG

<img width="2746" height="1564" alt="image" src="https://github.com/user-attachments/assets/e0b0dbc6-454b-4989-8016-0ed5ca646cd1" />

A Visual Studio Code extension for editing SVG files with live preview and integrated optimization.

## Features

- ✨ **Editor with side preview**: Edit your SVG in a textarea with real-time preview in the Explorer panel
- 🎨 **currentColor control**: Change the `currentColor` value to preview different color schemes
- 🌓 **Dark background**: Toggle dark background to better visualize SVGs with light colors
- 🔍 **Zoom and pan**: Zoom in/out with click or Alt+click, scroll with Alt, and drag to pan
- ⚡ **SVGO optimization**: Integrated toolbar button to optimize your SVG
- 📐 **Grid background**: Preview includes a grid background to better see transparent SVGs

## Usage

1. Open any `.svg` file
2. The extension will automatically open the custom editor with:
   - Code editor taking up the full panel
   - Preview panel
3. Click the ⚡ icon in the toolbar to optimize the SVG

### Preview controls

- **Drag panel**: Click on the "Preview" header and drag
- **Resize**: Use the resize handle in the bottom right corner
- **Zoom in**: Normal click on the preview
- **Zoom out**: Hold Alt + Click
- **Zoom with scroll**: Hold Alt + use mouse wheel
- **Pan**: When zoomed, drag the SVG with left button
- **Change currentColor**: Click the palette icon + color circle
- **Dark background**: Click the moon icon

## Configuration

The extension includes the following configurable options (accessible from Settings → Extensions → Better SVG):

### `betterSvg.autoReveal`

- **Type**: `boolean`
- **Default value**: `true`
- **Description**: Automatically expand the "SVG Preview" panel in Explorer when opening an SVG file. If disabled, you'll need to manually open the panel each time.

### `betterSvg.autoCollapse`

- **Type**: `boolean`
- **Default value**: `true`
- **Description**: Automatically collapse the "SVG Preview" panel when closing all SVG files or switching to a non-SVG file. If disabled, the panel will remain open even when no SVG files are active.

### `betterSvg.defaultColor`

- **Type**: `string`
- **Default value**: `"#ffffff"`
- **Description**: Default color for `currentColor` in the SVG preview. Must be a valid hexadecimal color (e.g., `#ffffff`, `#000`, `#ff5733`). This color will be applied when opening an SVG file and can be manually changed using the color picker in the preview panel.

### Example configuration in `settings.json`

```json
{
  "betterSvg.autoReveal": true,
  "betterSvg.autoCollapse": true,
  "betterSvg.defaultColor": "#ffffff"
}
```

## Project structure

```text
better-svg/
├── src/
│   ├── extension.ts           # Extension entry point
│   ├── svgEditorProvider.ts   # Custom editor provider
│   └── webview/               # Webview files
│       ├── index.html         # HTML template
│       ├── styles.css         # CSS styles
│       └── main.js            # Webview JavaScript logic
└── package.json
```

## Development installation

```bash
cd better-svg
npm install
npm run compile
```

Then press `F5` in VS Code to open an extension window for testing.

## Build

### Development

```bash
# Single compilation
npm run compile

# Watch mode (automatically recompiles on save)
npm run watch
```

### Production

```bash
# Optimized production build (minified)
npm run package
```

The extension uses **esbuild** for bundling, which means:

- ✅ **Faster**: Bundle loads instantly
- ✅ **Smaller**: ~500KB vs multiple files
- ✅ **Web compatible**: Works on github.dev and vscode.dev
- ✅ **Type checking**: TypeScript verifies types without emitting files

## Package

```bash
npm install -g @vscode/vsce
vsce package
```

This will create a `.vsix` file that can be installed or published to the marketplace.

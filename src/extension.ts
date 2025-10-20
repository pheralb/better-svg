/**
 * Copyright 2025 Miguel Ángel Durán
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as vscode from 'vscode'
import { SvgPreviewProvider } from './svgEditorProvider'
import { optimize } from 'svgo'

let previewProvider: SvgPreviewProvider

export function activate (context: vscode.ExtensionContext) {
  try {
    if (!context.extensionUri) {
      vscode.window.showErrorMessage('Better SVG: Extension context.extensionUri is undefined!')
      throw new Error('Extension context.extensionUri is undefined')
    }

    // Initialize context for view visibility
    vscode.commands.executeCommand('setContext', 'betterSvg.hasSvgOpen', false)

    // Register preview provider
    previewProvider = new SvgPreviewProvider(context)
    context.subscriptions.push(
      vscode.window.registerWebviewViewProvider(
        'betterSvg.preview',
        previewProvider,
        { webviewOptions: { retainContextWhenHidden: true } }
      )
    )

    // Auto-reveal panel when SVG file is opened
    context.subscriptions.push(
      vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor && editor.document.fileName.endsWith('.svg')) {
        // Show the view
          vscode.commands.executeCommand('setContext', 'betterSvg.hasSvgOpen', true)

          const config = vscode.workspace.getConfiguration('betterSvg')
          const autoReveal = config.get<boolean>('autoReveal', true)

          if (autoReveal) {
            vscode.commands.executeCommand('betterSvg.preview.focus')
          }

          if (previewProvider) {
            previewProvider.updatePreview(editor.document)
          }
        } else {
        // If we switched to a non-SVG file, collapse the panel
          const config = vscode.workspace.getConfiguration('betterSvg')
          const autoCollapse = config.get<boolean>('autoCollapse', true)

          if (autoCollapse) {
            vscode.commands.executeCommand('setContext', 'betterSvg.hasSvgOpen', false)

            if (previewProvider) {
              previewProvider.clearPreview()
            }
          }
        }
      })
    )

    // Update preview when document changes
    context.subscriptions.push(
      vscode.workspace.onDidChangeTextDocument(e => {
        const editor = vscode.window.activeTextEditor
        if (editor &&
          editor.document === e.document &&
          editor.document.fileName.endsWith('.svg') &&
          previewProvider) {
          previewProvider.updatePreview(e.document)
        }
      })
    )

    // Collapse preview when SVG file is closed
    context.subscriptions.push(
      vscode.workspace.onDidCloseTextDocument(document => {
        if (document.fileName.endsWith('.svg')) {
          const config = vscode.workspace.getConfiguration('betterSvg')
          const autoCollapse = config.get<boolean>('autoCollapse', true)

          if (!autoCollapse) {
            return
          }

          // Check if there are any other SVG files still open
          const hasOpenSvg = vscode.window.visibleTextEditors.some(
            editor => editor.document.fileName.endsWith('.svg')
          )

          // If no SVG files are open, hide the view
          if (!hasOpenSvg) {
            vscode.commands.executeCommand('setContext', 'betterSvg.hasSvgOpen', false)

            if (previewProvider) {
              previewProvider.clearPreview()
            }
          }
        }
      })
    )

    // Auto-reveal if an SVG is already open on activation
    const activeEditor = vscode.window.activeTextEditor
    if (activeEditor && activeEditor.document.fileName.endsWith('.svg')) {
      vscode.commands.executeCommand('setContext', 'betterSvg.hasSvgOpen', true)

      const config = vscode.workspace.getConfiguration('betterSvg')
      const autoReveal = config.get<boolean>('autoReveal', true)

      if (autoReveal) {
        vscode.commands.executeCommand('betterSvg.preview.focus')
      }

      if (previewProvider) {
        previewProvider.updatePreview(activeEditor.document)
      }
    }

    // Register optimize command
    context.subscriptions.push(
      vscode.commands.registerCommand('betterSvg.optimize', async () => {
        const editor = vscode.window.activeTextEditor
        if (!editor) {
          vscode.window.showErrorMessage('No active editor')
          return
        }

        const document = editor.document
        if (!document.fileName.endsWith('.svg')) {
          vscode.window.showErrorMessage('Not an SVG file')
          return
        }

        const svgContent = document.getText()

        try {
          const result = optimize(svgContent, {
            multipass: true,
            plugins: [
              'preset-default',
              'removeDoctype',
              'removeComments',
              'removeViewBox'
            ]
          })

          const edit = new vscode.WorkspaceEdit()
          const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(svgContent.length)
          )
          edit.replace(document.uri, fullRange, result.data)

          await vscode.workspace.applyEdit(edit)
          vscode.window.showInformationMessage('SVG optimized successfully!')
        } catch (error) {
          vscode.window.showErrorMessage(`Failed to optimize SVG: ${error}`)
        }
      })
    )
  } catch (error: any) {
    vscode.window.showErrorMessage(
      'Better SVG: Failed to activate extension!\n' +
      `Error: ${error.message}\n` +
      `Stack: ${error.stack?.substring(0, 200)}`
    )
    throw error
  }
}

export function deactivate () {}

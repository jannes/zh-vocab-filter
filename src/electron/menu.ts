import { App, BrowserWindow, MenuItem, MenuItemConstructorOptions } from 'electron';
import { getFileFromUser } from './utils';
import { ngCmdExport } from './ng-ipc';


export function getMenuTemplate(isMac: boolean, app: App, win: BrowserWindow): Array<(MenuItemConstructorOptions) | (MenuItem)> {
  const template = [
    ...(isMac ? [{
      label: app.name,
      submenu: [
        {role: 'about'},
        {type: 'separator'},
        {role: 'services'},
        {type: 'separator'},
        {role: 'hide'},
        {role: 'hideothers'},
        {role: 'unhide'},
        {type: 'separator'},
        {role: 'quit'}
      ]
    }] : []),
    {
      label: 'File',
      submenu: [
        {
          label: 'Open',
          accelerator: 'CommandOrControl+O',
          click(): void {
            getFileFromUser(win);
          }
        },
        {
          label: 'Export selected',
          accelerator: 'CommandOrControl+E',
          click(): void {
            ngCmdExport(win);
          }
        }
      ]
    },
  ];
  // TODO: check what is wrong here with the template type
  // @ts-ignore
  return template;
}

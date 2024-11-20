// tive que criar esse tipo alternativo porque meu typescript tá dando algum pitaco com o lib.dom.d.ts do vscode,
// que está sobrescrevendo o WebSocket do RN que está definido em global.d.ts

export interface RNWebSocket extends Omit<WebSocket, "new"> {
  new (
    uri: string | URL,
    protocols?: string | string[],
    options?: {
      headers: { [headerName: string]: string };
      [optionName: string]: any;
    }
  ): RNWebSocket;
}
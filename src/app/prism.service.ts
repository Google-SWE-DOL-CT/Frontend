import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

// import 'clipboard';
// import * as Prism from 'prismjs';
import 'prismjs';
import 'prismjs/plugins/toolbar/prism-toolbar';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
// import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';
import 'prismjs/components/prism-css';
// import 'prismjs/components/prism-html';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-sass';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-dart';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-handlebars';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-lua';
import 'prismjs/components/prism-mongodb';
import 'prismjs/components/prism-objectivec';
import 'prismjs/components/prism-protobuf';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-r';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-soy';
import 'prismjs/components/prism-swift';

declare var Prism: any;


@Injectable({
  providedIn: 'root'
})
export class PrismService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  getAllLang(): void {
    console.log(Prism.languages);
  }

  highlightAll(): void {
    Prism.highlightAll();
  }

  convertHtmlIntoString(text: string): string {
    return text
    .replace(new RegExp('&', 'g'), '&amp;')
    .replace(new RegExp('<', 'g'), '&lt;');
  }

  // constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  // highlightAll() {
  //   if (isPlatformBrowser(this.platformId)) {
  //     Prism.highlightAll();
  //   }
  // }

  // convertHtmlIntoString(text: string): string {
  //   return text
  //   .replace(new RegExp('&', 'g'), '&amp;')
  //   .replace(new RegExp('<', 'g'), '&lt;')
  // }
}

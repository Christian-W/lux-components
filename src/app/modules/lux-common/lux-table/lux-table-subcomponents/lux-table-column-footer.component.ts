import { Component, ContentChild, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'lux-table-column-footer',
  template: ''
})
export class LuxTableColumnFooterComponent {
  @ContentChild(TemplateRef, { static: false }) tempRef: TemplateRef<any>;
}

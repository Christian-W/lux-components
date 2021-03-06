import { Component, Input } from '@angular/core';
import { LuxMediaQueryObserverService } from '../../lux-util/lux-media-query-observer.service';
import { LuxAppFooterButtonInfo } from './lux-app-footer-button-info';
import { LuxAppFooterButtonService } from './lux-app-footer-button.service';
import { LuxAppFooterLinkInfo } from './lux-app-footer-link-info';
import { LuxAppFooterLinkService } from './lux-app-footer-link.service';

@Component({
  selector: 'lux-app-footer',
  templateUrl: './lux-app-footer.component.html',
  styleUrls: ['./lux-app-footer.component.scss']
})
export class LuxAppFooterComponent {
  @Input() luxVersion: string;

  constructor(
    public buttonService: LuxAppFooterButtonService,
    private linkService: LuxAppFooterLinkService,
    private mediaObserver: LuxMediaQueryObserverService
  ) {}

  isMediumOrLargerDevice() {
    return (
      this.mediaObserver.isSM() || this.mediaObserver.isMD() || this.mediaObserver.isLG() || this.mediaObserver.isXL()
    );
  }

  getButtons(): LuxAppFooterButtonInfo[] {
    return this.buttonService.buttonInfos;
  }

  sendButtonCommand(cmd: string) {
    this.buttonService.sendButtonCommand(cmd);
  }

  getLinks(): LuxAppFooterLinkInfo[] {
    return this.linkService.linkInfos;
  }
}

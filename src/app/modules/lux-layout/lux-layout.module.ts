// tslint:disable:max-line-length
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule,
  MatCardModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatStepperModule,
  MatTabsModule
} from '@angular/material';
import { LuxActionModule } from '../lux-action/lux-action.module';
import { LuxDirectivesModule } from '../lux-directives/lux-directives.module';
import { LuxIconModule } from '../lux-icon/lux-icon.module';
import { LuxIconComponent } from '../lux-icon/lux-icon/lux-icon.component';
import { LuxPipesModule } from '../lux-pipes/lux-pipes.module';
import { LuxMediaQueryObserverService } from '../lux-util/lux-media-query-observer.service';
import { LuxAccordionComponent } from './lux-accordion/lux-accordion.component';
import { LuxAppFooterComponent } from './lux-app-footer/lux-app-footer.component';
import { LuxAppHeaderRightNavComponent } from './lux-app-header/lux-app-header-subcomponents/lux-app-header-right-nav/lux-app-header-right-nav.component';
import { LuxAppHeaderComponent } from './lux-app-header/lux-app-header.component';
import { LuxCardActionsComponent } from './lux-card/lux-card-subcomponents/lux-card-actions.component';
import { LuxCardContentExpandedComponent } from './lux-card/lux-card-subcomponents/lux-card-content-expanded.component';
import { LuxCardContentComponent } from './lux-card/lux-card-subcomponents/lux-card-content.component';
import { LuxCardInfoComponent } from './lux-card/lux-card-subcomponents/lux-card-info.component';
import { LuxCardComponent } from './lux-card/lux-card.component';
import { LuxDividerComponent } from './lux-divider/lux-divider.component';
import { LuxListItemContentComponent } from './lux-list/lux-list-subcomponents/lux-list-item-content.component';
import { LuxListItemIconComponent } from './lux-list/lux-list-subcomponents/lux-list-item-icon.component';
import { LuxListItemComponent } from './lux-list/lux-list-subcomponents/lux-list-item.component';
import { LuxListComponent } from './lux-list/lux-list.component';
import { LuxDetailViewComponent } from './lux-master-detail/lux-master-detail-subcomponents/lux-detail-view/lux-detail-view.component';
import { LuxMasterFooterComponent } from './lux-master-detail/lux-master-detail-subcomponents/lux-master-footer/lux-master-footer.component';
import { LuxMasterHeaderContentComponent } from './lux-master-detail/lux-master-detail-subcomponents/lux-master-header/lux-master-header-content.component';
import { LuxMasterHeaderComponent } from './lux-master-detail/lux-master-detail-subcomponents/lux-master-header/lux-master-header.component';
import { LuxMasterSimpleComponent } from './lux-master-detail/lux-master-detail-subcomponents/lux-master-simple/lux-master-simple.component';
import { LuxMasterViewComponent } from './lux-master-detail/lux-master-detail-subcomponents/lux-master-view/lux-master-view.component';
import { LuxMasterDetailComponent } from './lux-master-detail/lux-master-detail.component';
import { LuxPanelActionComponent } from './lux-panel/lux-panel-subcomponents/lux-panel-action.component';
import { LuxPanelContentComponent } from './lux-panel/lux-panel-subcomponents/lux-panel-content.component';
import { LuxPanelHeaderDescriptionComponent } from './lux-panel/lux-panel-subcomponents/lux-panel-header-description.component';
import { LuxPanelHeaderTitleComponent } from './lux-panel/lux-panel-subcomponents/lux-panel-header-title.component';
import { LuxPanelComponent } from './lux-panel/lux-panel.component';
import { LuxStepContentComponent } from './lux-stepper/lux-stepper-subcomponents/lux-step-content.component';
import { LuxStepHeaderComponent } from './lux-stepper/lux-stepper-subcomponents/lux-step-header.component';
import { LuxStepComponent } from './lux-stepper/lux-stepper-subcomponents/lux-step.component';
import { LuxStepperComponent } from './lux-stepper/lux-stepper.component';
import { LuxTabComponent } from './lux-tabs/lux-tabs-subcomponents/lux-tab.component';
import { LuxTabsComponent } from './lux-tabs/lux-tabs.component';
import { LuxTileComponent } from './lux-tile/lux-tile.component';
import { LuxDetailWrapperComponent } from './lux-master-detail/lux-master-detail-subcomponents/lux-detail-view/lux-detail-wrapper.component';
import { LuxSideNavComponent } from './lux-app-header/lux-app-header-subcomponents/lux-side-nav/lux-side-nav.component';
import { LuxSideNavFooterComponent } from './lux-app-header/lux-app-header-subcomponents/lux-side-nav/lux-side-nav-subcomponents/lux-side-nav-footer.component';
import { LuxSideNavHeaderComponent } from './lux-app-header/lux-app-header-subcomponents/lux-side-nav/lux-side-nav-subcomponents/lux-side-nav-header.component';
import { LuxSideNavItemComponent } from './lux-app-header/lux-app-header-subcomponents/lux-side-nav/lux-side-nav-subcomponents/lux-side-nav-item.component';
import { LuxComponentsConfigModule } from '../lux-components-config/lux-components-config.module';
import { LuxAppContentComponent } from './lux-app-content/lux-app-content.component';
import { LuxStepperHorizontalComponent } from './lux-stepper/lux-stepper-subcomponents/lux-stepper-horizontal/lux-stepper-horizontal.component';
import { LuxStepperNavButtonsComponent } from './lux-stepper/lux-stepper-subcomponents/lux-stepper-nav-buttons/lux-stepper-nav-buttons.component';
import { LuxStepperVerticalComponent } from './lux-stepper/lux-stepper-subcomponents/lux-stepper-vertical/lux-stepper-vertical.component';
import { LuxAppHeaderActionNavComponent } from './lux-app-header/lux-app-header-subcomponents/lux-app-header-action-nav/lux-app-header-action-nav.component';
import { LuxAppHeaderActionNavItemComponent } from './lux-app-header/lux-app-header-subcomponents/lux-app-header-action-nav/lux-app-header-action-nav-item/lux-app-header-action-nav-item.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatTabsModule,
    MatExpansionModule,
    MatStepperModule,
    MatDividerModule,
    LuxIconModule,
    LuxActionModule,
    LuxDirectivesModule,
    LuxPipesModule,
    LuxComponentsConfigModule,
    MatProgressSpinnerModule
  ],
  declarations: [
    LuxAppHeaderComponent,
    LuxAppFooterComponent,
    LuxListItemComponent,
    LuxListItemIconComponent,
    LuxListItemContentComponent,
    LuxListComponent,
    LuxMasterDetailComponent,
    LuxMasterViewComponent,
    LuxDetailViewComponent,
    LuxMasterSimpleComponent,
    LuxMasterFooterComponent,
    LuxMasterHeaderComponent,
    LuxMasterHeaderContentComponent,
    LuxTabComponent,
    LuxTabsComponent,
    LuxCardComponent,
    LuxCardInfoComponent,
    LuxCardContentComponent,
    LuxCardContentExpandedComponent,
    LuxCardActionsComponent,
    LuxAccordionComponent,
    LuxPanelComponent,
    LuxPanelContentComponent,
    LuxPanelActionComponent,
    LuxPanelHeaderTitleComponent,
    LuxPanelHeaderDescriptionComponent,
    LuxStepperComponent,
    LuxStepComponent,
    LuxStepHeaderComponent,
    LuxStepContentComponent,
    LuxDividerComponent,
    LuxAppHeaderRightNavComponent,
    LuxTileComponent,
    LuxDetailWrapperComponent,
    LuxSideNavComponent,
    LuxSideNavFooterComponent,
    LuxSideNavHeaderComponent,
    LuxSideNavItemComponent,
    LuxAppContentComponent,
    LuxStepperHorizontalComponent,
    LuxStepperNavButtonsComponent,
    LuxStepperVerticalComponent,
    LuxAppHeaderActionNavComponent,
    LuxAppHeaderActionNavItemComponent
  ],
  exports: [
    LuxAppHeaderComponent,
    LuxAppFooterComponent,
    LuxListItemComponent,
    LuxListItemIconComponent,
    LuxListItemContentComponent,
    LuxListComponent,
    LuxMasterDetailComponent,
    LuxMasterViewComponent,
    LuxDetailViewComponent,
    LuxMasterSimpleComponent,
    LuxMasterFooterComponent,
    LuxMasterHeaderComponent,
    LuxMasterHeaderContentComponent,
    LuxTabComponent,
    LuxTabsComponent,
    LuxCardComponent,
    LuxCardInfoComponent,
    LuxCardContentComponent,
    LuxCardContentExpandedComponent,
    LuxCardActionsComponent,
    LuxAccordionComponent,
    LuxPanelComponent,
    LuxPanelContentComponent,
    LuxPanelActionComponent,
    LuxPanelHeaderTitleComponent,
    LuxPanelHeaderDescriptionComponent,
    LuxStepperComponent,
    LuxStepComponent,
    LuxStepHeaderComponent,
    LuxStepContentComponent,
    LuxDividerComponent,
    LuxAppHeaderRightNavComponent,
    LuxTileComponent,
    LuxDetailWrapperComponent,
    LuxSideNavComponent,
    LuxSideNavFooterComponent,
    LuxSideNavHeaderComponent,
    LuxSideNavItemComponent,
    LuxAppContentComponent,
    LuxStepperHorizontalComponent,
    LuxStepperNavButtonsComponent,
    LuxStepperVerticalComponent,
    LuxAppHeaderActionNavComponent,
    LuxAppHeaderActionNavItemComponent
  ],
  providers: [LuxMediaQueryObserverService],
  entryComponents: [LuxIconComponent, LuxDetailWrapperComponent]
})
export class LuxLayoutModule {}

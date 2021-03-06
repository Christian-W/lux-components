import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { ILuxFileListActionConfig } from '../lux-file-model/lux-file-list-action-config.interface';

import { LuxFileListComponent } from './lux-file-list.component';
import { LuxTestHelper } from '../../../lux-util/testing/lux-test-helper';
import { LuxConsoleService } from '../../../lux-util/lux-console.service';
import { HttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { LuxFileErrorCause } from '../lux-file-model/lux-file-error.interface';
import { Component } from '@angular/core';
import { ILuxFileActionConfig } from '../lux-file-model/lux-file-action-config.interface';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LuxFormFileBase } from '../../lux-form-model/lux-form-file-base.class';
import { ILuxFileObject } from '../lux-file-model/lux-file-object.interface';
import { LuxStorageService } from '../../../lux-util/lux-storage.service';

describe('LuxFileListComponent', () => {
  LuxTestHelper.configureTestSuite();

  beforeAll(async () => {
    LuxTestHelper.configureTestModule(
      [
        LuxConsoleService,
        {
          provide: HttpClient,
          useClass: MockHttp
        },
        {
          provide: LuxStorageService,
          useClass: MockStorage
        }
      ],
      [FileComponent, FileFormComponent]
    );
  });

  describe('[ReactiveForm]', () => {
    let fixture: ComponentFixture<FileFormComponent>;
    let testComponent: FileFormComponent;
    let fileComponent: LuxFileListComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(FileFormComponent);
      testComponent = fixture.componentInstance;
      fileComponent = fixture.debugElement.query(By.directive(LuxFileListComponent)).componentInstance;

      // den LiveAnnouncer abklemmen
      fileComponent['liveAnnouncer'] = <any>{ announce: (...args) => {} };

      // Wir mocken hier den FileReader weg, da er nicht mit fakeAsync kompatibel ist
      spyOn(fileComponent, 'readFile').and.returnValue(Promise.resolve('base64-dummy'));
      // Den read-Delay für die Ladeanzeige wegmocken
      fileComponent.defaultReadFileDelay = 0;
      fixture.detectChanges();
    });

    it('Sollte den Startwert korrekt setzen', fakeAsync(() => {
      // Vorbedingungen prüfen
      const localFixture = TestBed.createComponent(FileFormComponent);
      const localTestComponent = localFixture.componentInstance;
      const localFileComponent = localFixture.debugElement.query(By.directive(LuxFileListComponent)).componentInstance;

      expect(localFixture.debugElement.query(By.css('.lux-file-list-entry-label'))).toBeFalsy();
      expect(localTestComponent.formControl.value).toBe(null);
      expect(localFileComponent.luxSelectedFiles).toBe(undefined);

      // Änderungen durchführen
      const fileObject = { name: 'mockfile.txt', type: 'text/txt', content: 'base64-dummy' };
      localTestComponent.formControl.setValue(fileObject);
      LuxTestHelper.wait(localFixture);

      // Nachbedingungen prüfen
      expect(
        localFixture.debugElement.query(By.css('.lux-file-list-entry-label')).nativeElement.textContent.trim()
      ).toEqual('mockfile.txt');
      expect(localTestComponent.formControl.value).toEqual(fileObject);
      expect(localFileComponent.luxSelectedFiles).toEqual(fileObject);
      expect(localFileComponent.formControl.value).toEqual(fileObject);
    }));

    it('Sollte den Wert an das FormControl übergeben', fakeAsync(() => {
      // Vorbedingungen prüfen
      expect(testComponent.formControl.value).toBeFalsy();
      expect(fileComponent.formControl.value).toBeFalsy();

      // Änderungen durchführen
      fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')]);
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(testComponent.formControl.value.content).toEqual('base64-dummy');
      expect(fileComponent.formControl.value.content).toEqual('base64-dummy');

      flush();
    }));

    it('Sollte alle Werte an das FormControl übergeben', fakeAsync(() => {
      // Vorbedingungen prüfen
      testComponent.multiple = true;
      fixture.detectChanges();

      expect(testComponent.formControl.value).toBeFalsy();
      expect(fileComponent.formControl.value).toBeFalsy();

      // Änderungen durchführen
      fileComponent.selectFiles([
        LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt'),
        LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')
      ]);
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(testComponent.formControl.value[0].content).toEqual('base64-dummy');
      expect(testComponent.formControl.value[1].content).toEqual('base64-dummy');
      expect(fileComponent.formControl.value[0].content).toEqual('base64-dummy');
      expect(fileComponent.formControl.value[1].content).toEqual('base64-dummy');

      flush();
    }));

    it('Sollte required sein', fakeAsync(() => {
      // Vorbedingungen prüfen
      expect(fileComponent.formControl.errors).toBe(null);
      expect(fileComponent.formControl.valid).toBe(true);
      expect(fixture.debugElement.query(By.css('mat-error'))).toBe(null);

      // Änderungen durchführen
      testComponent.formControl.setValidators(Validators.required);
      LuxTestHelper.wait(fixture);
      fileComponent.formControl.markAsTouched();
      fileComponent.formControl.updateValueAndValidity();
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fileComponent.formControl.errors).not.toBe(null);
      expect(fileComponent.formControl.valid).toBe(false);
      expect(fixture.debugElement.query(By.css('mat-error'))).not.toBe(null);
    }));
  });

  describe('[Allgemein]', () => {
    let fixture: ComponentFixture<FileComponent>;
    let testComponent: FileComponent;
    let fileComponent: LuxFileListComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(FileComponent);
      testComponent = fixture.componentInstance;
      fileComponent = fixture.debugElement.query(By.directive(LuxFileListComponent)).componentInstance;

      // den LiveAnnouncer abklemmen
      fileComponent['liveAnnouncer'] = <any>{ announce: (...args) => {} };

      // Wir mocken hier den FileReader weg, da er nicht mit fakeAsync kompatibel ist
      spyOn(fileComponent, 'readFile').and.returnValue(Promise.resolve('base64-dummy'));
      // Den read-Delay für die Ladeanzeige wegmocken
      fileComponent.defaultReadFileDelay = 0;
      fixture.detectChanges();
    });

    it('wenn zusätzliche Punkt im Dateinamen sind', fakeAsync(() => {
      // Vorbedingungen prüfen
      LuxTestHelper.wait(fixture);
      expect(fileComponent.formControl.errors).toBe(null);
      expect(fileComponent.formControl.valid).toBe(true);
      expect(fixture.debugElement.query(By.css('mat-error'))).toBe(null);

      // Änderungen durchführen,
      testComponent.accept = '.pdf,.txt';
      testComponent.multiple = true;
      LuxTestHelper.wait(fixture);

      // Änderungen durchführen,
      fileComponent.selectFiles([
        LuxTestHelper.createFileBrowserSafe('mock.file1.PDF', 'text/Pdf'),
        LuxTestHelper.createFileBrowserSafe('mock.file.2.Txt', 'text/plain'),
        LuxTestHelper.createFileBrowserSafe('Hi...........pdf', 'text/pdf'),
        LuxTestHelper.createFileBrowserSafe('Hi......pdf', 'text/plain')
      ]);
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fileComponent.formControl.errors).toBe(null);
      expect(fileComponent.formControl.valid).toBe(true);
      expect(fixture.debugElement.query(By.css('mat-error'))).toBe(null);

      flush();
    }));

    it('Sollte Label und Hint korrekt setzen', fakeAsync(() => {
      // Vorbedingungen prüfen
      expect(fixture.debugElement.query(By.css('.lux-card-title-container')).nativeElement.textContent.trim()).toBe('');
      expect(fixture.debugElement.query(By.css('mat-hint'))).toBe(null);

      // Änderungen durchführen
      testComponent.label = 'Label';
      testComponent.hint = 'Hint';
      LuxTestHelper.wait(fixture);

      // // Nachbedingungen prüfen
      expect(fixture.debugElement.query(By.css('.lux-card-title-container')).nativeElement.textContent.trim()).toBe(
        'Label'
      );
      expect(fixture.debugElement.query(By.css('mat-hint')).nativeElement.textContent.trim()).toEqual('Hint');
    }));

    it('Sollte required sein', fakeAsync(() => {
      // Vorbedingungen prüfen
      expect(fileComponent.formControl.errors).toBe(null);
      expect(fileComponent.formControl.valid).toBe(true);
      expect(fixture.debugElement.query(By.css('mat-error'))).toBe(null);

      // Änderungen durchführen
      testComponent.required = true;
      LuxTestHelper.wait(fixture);
      fileComponent.formControl.markAsTouched();
      fileComponent.formControl.updateValueAndValidity();
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fileComponent.formControl.errors).not.toBe(null);
      expect(fileComponent.formControl.valid).toBe(false);
      expect(fixture.debugElement.query(By.css('mat-error'))).not.toBe(null);
    }));

    it('Sollte disabled sein', fakeAsync(() => {
      // Vorbedingungen prüfen
      expect(fileComponent.formControl.disabled).toBe(false);

      // Änderungen durchführen
      testComponent.disabled = true;
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fileComponent.formControl.disabled).toBe(true);
    }));

    it('Sollte readonly sein', fakeAsync(() => {
      // Vorbedingungen prüfen
      expect(fixture.debugElement.query(By.css('.lux-form-control-readonly'))).toBe(null);

      // Änderungen durchführen
      testComponent.readonly = true;
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fixture.debugElement.query(By.css('.lux-form-control-readonly'))).not.toBe(null);
    }));

    it('Sollte die Dateien an die entsprechende luxUploadUrl hochladen', fakeAsync(() => {
      // Vorbedingungen prüfen
      const httpClient = fixture.debugElement.injector.get(HttpClient);
      const spy = spyOn(httpClient, 'post').and.returnValue(of('ok'));

      testComponent.multiple = true;
      LuxTestHelper.wait(fixture);

      fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')]);
      LuxTestHelper.wait(fixture);

      expect(spy).toHaveBeenCalledTimes(0);
      expect(fileComponent.luxSelectedFiles).toBeTruthy();

      // Änderungen durchführen
      testComponent.uploadUrl = '/test/api/';
      LuxTestHelper.wait(fixture);
      fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')]);
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(spy).toHaveBeenCalledTimes(1);
      expect(fileComponent.luxSelectedFiles['length']).toBe(2);
      flush();
    }));

    it('Sollte den Startwert korrekt setzen', fakeAsync(() => {
      // Vorbedingungen prüfen
      const localFixture = TestBed.createComponent(FileComponent);
      const localTestComponent = localFixture.componentInstance;
      const localFileComponent = localFixture.debugElement.query(By.directive(LuxFileListComponent)).componentInstance;

      expect(localFixture.debugElement.query(By.css('.lux-file-list-entry-label'))).toBeFalsy();
      expect(localTestComponent.selected).toBe(undefined);
      expect(localFileComponent.luxSelectedFiles).toBe(undefined);

      // Änderungen durchführen
      const fileObject = { name: 'mockfile.txt', type: 'text/txt', content: 'base64-dummy' };
      localTestComponent.selected = fileObject;
      LuxTestHelper.wait(localFixture);

      // Nachbedingungen prüfen
      expect(
        localFixture.debugElement.query(By.css('.lux-file-list-entry-label')).nativeElement.textContent.trim()
      ).toEqual('mockfile.txt');
      expect(localTestComponent.selected).toEqual(fileObject);
      expect(localFileComponent.luxSelectedFiles).toEqual(fileObject);
      expect(localFileComponent.formControl.value).toEqual(fileObject);
    }));

    it('Sollte beim Klick auf den Entfernen-Button die Selektion leeren', fakeAsync(() => {
      // Vorbedingungen prüfen
      testComponent.multiple = true;
      LuxTestHelper.wait(fixture);

      testComponent.selected = [
        { name: 'mockfile1.txt', type: 'text/txt', content: 'base64-dummy' },
        { name: 'mockfile2.txt', type: 'text/txt', content: 'base64-dummy' }
      ];
      LuxTestHelper.wait(fixture);

      expect(fileComponent.luxSelectedFiles).toEqual(testComponent.selected);
      expect(
        fixture.debugElement.queryAll(By.css('.lux-file-list-entry-label'))[0].nativeElement.textContent.trim()
      ).toEqual('mockfile1.txt');
      expect(
        fixture.debugElement.queryAll(By.css('.lux-file-list-entry-label'))[1].nativeElement.textContent.trim()
      ).toEqual('mockfile2.txt');

      // Änderungen durchführen
      fixture.debugElement.query(By.css('.lux-file-list-header-clear button')).nativeElement.click();
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fileComponent.luxSelectedFiles).toEqual(undefined);
      expect(fixture.debugElement.queryAll(By.css('.lux-file-list-entry-label')).length).toBe(0);
    }));

    it('Sollte das Background-Icon + Hint darstellen, wenn keine Dateien geladen sind', fakeAsync(() => {
      // Vorbedingungen prüfen
      testComponent.hint = 'Hint';
      testComponent.bgIconName = 'fas fa-cloud-upload-alt';
      LuxTestHelper.wait(fixture);

      expect(fileComponent.luxSelectedFiles).toBeFalsy();
      expect(fixture.debugElement.query(By.css('.lux-file-icon'))).not.toBe(null);
      expect(fixture.debugElement.query(By.css('mat-hint'))).not.toBe(null);

      // Änderungen durchführen
      fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')]);
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fileComponent.luxSelectedFiles).toBeTruthy();
      expect(fixture.debugElement.query(By.css('.lux-file-icon'))).toBe(null);
      expect(fixture.debugElement.query(By.css('mat-hint'))).toBe(null);

      flush();
    }));

    it('Sollte die Drag-and-Drop Events aufrufen (eine Datei)', fakeAsync(() => {
      const spyDrag = spyOn(LuxFormFileBase.prototype, 'onDragOver').and.callThrough();
      const spyDrop = spyOn(LuxFormFileBase.prototype, 'onDrop').and.callThrough();

      const fileInputNode = fixture.debugElement.query(By.css('lux-file-list')).nativeElement;
      LuxTestHelper.dispatchFakeEvent(fileInputNode, 'dragover', true);
      LuxTestHelper.wait(fixture);

      const mockDropEvent = LuxTestHelper.createFakeEvent('drop', true);
      mockDropEvent['dataTransfer'] = {
        files: [LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')]
      };
      LuxTestHelper.dispatchEvent(fileInputNode, mockDropEvent);
      LuxTestHelper.wait(fixture);

      expect(spyDrag).toHaveBeenCalledTimes(1);
      expect(spyDrop).toHaveBeenCalledTimes(1);
      expect(testComponent.selected['name']).toEqual('mockfile1.txt');
      expect(testComponent.selected['content']).toEqual('base64-dummy');
      expect(fileComponent.luxSelectedFiles['name']).toEqual('mockfile1.txt');
      expect(fileComponent.luxSelectedFiles['content']).toEqual('base64-dummy');

      flush();
    }));

    it('Sollte die Drag-and-Drop Events aufrufen (mehrere Dateien)', fakeAsync(() => {
      testComponent.multiple = true;
      const spyDrag = spyOn(LuxFormFileBase.prototype, 'onDragOver').and.callThrough();
      const spyDrop = spyOn(LuxFormFileBase.prototype, 'onDrop').and.callThrough();

      const fileInputNode = fixture.debugElement.query(By.css('lux-file-list')).nativeElement;
      LuxTestHelper.dispatchFakeEvent(fileInputNode, 'dragover', true);
      LuxTestHelper.wait(fixture);

      const mockDropEvent = LuxTestHelper.createFakeEvent('drop', true);
      mockDropEvent['dataTransfer'] = {
        files: [
          LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt'),
          LuxTestHelper.createFileBrowserSafe('mockfile2.pdf', 'text/pdf')
        ]
      };
      LuxTestHelper.dispatchEvent(fileInputNode, mockDropEvent);
      LuxTestHelper.wait(fixture);

      expect(spyDrag).toHaveBeenCalledTimes(1);
      expect(spyDrop).toHaveBeenCalledTimes(1);
      expect(testComponent.selected[0]['name']).toEqual('mockfile1.txt');
      expect(testComponent.selected[0]['content']).toEqual('base64-dummy');
      expect(fileComponent.luxSelectedFiles[0]['name']).toEqual('mockfile1.txt');
      expect(fileComponent.luxSelectedFiles[0]['content']).toEqual('base64-dummy');
      expect(testComponent.selected[1]['name']).toEqual('mockfile2.pdf');
      expect(testComponent.selected[1]['content']).toEqual('base64-dummy');
      expect(fileComponent.luxSelectedFiles[1]['name']).toEqual('mockfile2.pdf');
      expect(fileComponent.luxSelectedFiles[1]['content']).toEqual('base64-dummy');

      flush();
    }));

    it('Sollte eine einzelne Datei updaten', fakeAsync(() => {
      // Vorbedingungen prüfen
      testComponent.multiple = true;
      LuxTestHelper.wait(fixture);

      const spy = spyOn(testComponent, 'selectedChange').and.callThrough();

      fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')]);
      flush();
      LuxTestHelper.wait(fixture);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(testComponent.selected['name']).toEqual('mockfile1.txt');
      expect(testComponent.selected['content']).toEqual('base64-dummy');
      expect(fileComponent.luxSelectedFiles['name']).toEqual('mockfile1.txt');
      expect(fileComponent.luxSelectedFiles['content']).toEqual('base64-dummy');

      // Änderungen durchführen
      fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/html')]);
      flush();
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(spy).toHaveBeenCalledTimes(2);
      expect(testComponent.selected['name']).toEqual('mockfile1.txt');
      expect(testComponent.selected['content']).toEqual('base64-dummy');
      expect(fileComponent.luxSelectedFiles['name']).toEqual('mockfile1.txt');
      expect(fileComponent.luxSelectedFiles['content']).toEqual('base64-dummy');
    }));

    it('Sollte Image-Preview für Bilder anzeigen', fakeAsync(() => {
      // Vorbedingungen prüfen
      const localFixture = TestBed.createComponent(FileComponent);
      const localTestComponent = localFixture.componentInstance;
      const localFileComponent = localFixture.debugElement.query(By.directive(LuxFileListComponent)).componentInstance;

      // Wir mocken hier den FileReader weg, da er nicht mit fakeAsync kompatibel ist
      spyOn(localFileComponent, 'readFile').and.returnValue(Promise.resolve('data:image/png;base64-dummy'));
      localFixture.detectChanges();

      localTestComponent.multiple = true;
      LuxTestHelper.wait(localFixture);
      localFileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.png', 'image/png')]);
      LuxTestHelper.wait(localFixture);

      expect(localFixture.debugElement.queryAll(By.css('img')).length).toBe(0);

      // Änderungen durchführen
      localTestComponent.showPreview = true;
      flush();
      LuxTestHelper.wait(localFixture);

      // Nachbedingungen prüfen
      expect(localFixture.debugElement.queryAll(By.css('img')).length).toBe(1);
    }));

    it('Sollte den Base64-String via Base64-Callback füllen', fakeAsync(() => {
      // Vorbedingungen prüfen
      testComponent.selected = {
        name: 'mockfile.txt',
        type: 'text/txt',
        contentCallback: () => 'callback base64-dummy'
      };
      LuxTestHelper.wait(fixture);

      expect(fixture.debugElement.query(By.css('.lux-file-list-entry-label')).nativeElement.textContent.trim()).toEqual(
        'mockfile.txt'
      );
      expect(fileComponent.luxSelectedFiles['name']).toEqual('mockfile.txt');
      expect(fileComponent.luxSelectedFiles['content']).toEqual(undefined);

      // Änderungen durchführen
      fixture.debugElement
        .queryAll(By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-view] button'))[0]
        .nativeElement.click();
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fixture.debugElement.query(By.css('.lux-file-list-entry-label')).nativeElement.textContent.trim()).toEqual(
        'mockfile.txt'
      );
      expect(fileComponent.luxSelectedFiles['name']).toEqual('mockfile.txt');
      expect(fileComponent.luxSelectedFiles['content']).toEqual('callback base64-dummy');
    }));

    it('Sollte statt des Base64-Strings den Dateityp Blob nutzen', fakeAsync(() => {
      // Vorbedingungen prüfen
      fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.png', 'image/png')]);
      LuxTestHelper.wait(fixture);

      expect(typeof fileComponent.luxSelectedFiles['content']).toEqual('string');

      // Änderungen durchführen
      testComponent.contentsAsBlob = true;
      LuxTestHelper.wait(fixture);
      fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.png', 'image/png')]);
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fileComponent.luxSelectedFiles['content'] instanceof Blob).toBe(true);
    }));

    it('Sollte eine Datei auswählen, löschen und erneut auswählen können', fakeAsync(() => {
      // Vorbedingungen prüfen
      const spy = spyOn(testComponent, 'selectedChange').and.callThrough();
      fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.png', 'image/png')]);
      LuxTestHelper.wait(fixture);

      expect(fileComponent.luxSelectedFiles['name']).toEqual('mockfile1.png');
      expect(fileComponent.luxSelectedFiles['content']).toEqual('base64-dummy');
      expect(spy).toHaveBeenCalledTimes(1);

      // Änderungen durchführen
      fixture.debugElement
        .query(By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-remove] button'))
        .nativeElement.click();
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fileComponent.luxSelectedFiles).toBe(undefined);
      expect(spy).toHaveBeenCalledTimes(2);

      // Änderungen durchführen
      fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.png', 'image/png')]);
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fileComponent.luxSelectedFiles['name']).toEqual('mockfile1.png');
      expect(fileComponent.luxSelectedFiles['content']).toEqual('base64-dummy');
      expect(spy).toHaveBeenCalledTimes(3);

      flush();
    }));

    describe('Sollte die Events mit passenden Werten emitten,', () => {
      it('wenn Dateien korrekt selektiert wurden', fakeAsync(() => {
        // Vorbedingungen prüfen
        const selectedChange = spyOn(testComponent, 'selectedChange').and.callThrough();
        testComponent.multiple = true;
        LuxTestHelper.wait(fixture);

        expect(selectedChange).toHaveBeenCalledTimes(0);

        // Änderungen durchführen
        fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')]);
        LuxTestHelper.wait(fixture);

        // Nachbedingungen prüfen
        expect(selectedChange).toHaveBeenCalledTimes(1);
        expect((<any>testComponent.selected).name).toEqual('mockfile1.txt');
        expect((<any>testComponent.selected).content).toEqual('base64-dummy');

        // Änderungen durchführen
        fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')]);
        LuxTestHelper.wait(fixture);

        // Nachbedingungen prüfen
        expect(selectedChange).toHaveBeenCalledTimes(2);
        expect(testComponent.selected[0].name).toEqual('mockfile1.txt');
        expect(testComponent.selected[0].content).toEqual('base64-dummy');
        expect(testComponent.selected[1].name).toEqual('mockfile2.txt');
        expect(testComponent.selected[1].content).toEqual('base64-dummy');

        flush();
      }));

      it('wenn ein Fehler aufgetreten ist', fakeAsync(() => {
        // Vorbedingungen prüfen
        const selectedChange = spyOn(testComponent, 'selectedChange');
        const files = [LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')];

        LuxTestHelper.wait(fixture);

        expect(selectedChange).toHaveBeenCalledTimes(0);

        // Änderungen durchführen
        testComponent.accept = '.pdf';
        LuxTestHelper.wait(fixture);
        fileComponent.selectFiles(files);
        LuxTestHelper.wait(fixture);

        // Nachbedingungen prüfen
        expect(selectedChange).toHaveBeenCalledTimes(0);
      }));
    });

    describe('Sollte eine passende Fehlermeldung abgeben,', () => {
      it('wenn die maximale Dateigröße überschritten wird', fakeAsync(() => {
        // Vorbedingungen prüfen
        testComponent.multiple = true;
        LuxTestHelper.wait(fixture);
        let files = [LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')];
        // wir mocken erstmal 2MB Dateigröße
        spyOnProperty(files[0], 'size', 'get').and.returnValue(200000);

        fileComponent.selectFiles(files);
        LuxTestHelper.wait(fixture);

        expect(fileComponent.formControl.errors).toBe(null);
        expect(fileComponent.formControl.valid).toBe(true);
        expect(fileComponent.luxSelectedFiles).toBeTruthy();
        expect(fixture.debugElement.query(By.css('mat-error'))).toBe(null);

        // Änderungen durchführen
        testComponent.maxSizeMb = 5;
        LuxTestHelper.wait(fixture);

        files = [LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')];
        // wir mocken hier jetzt 20MB Dateigröße
        spyOnProperty(files[0], 'size', 'get').and.returnValue(20000000);

        fileComponent.selectFiles(files);
        LuxTestHelper.wait(fixture);

        // Nachbedingungen prüfen
        expect(fileComponent.formControl.errors).not.toBe(null);
        expect(fileComponent.formControl.errors[LuxFileErrorCause.MaxSizeError]).toBeDefined();
        expect(fileComponent.formControl.valid).toBe(false);
        expect(fileComponent.luxSelectedFiles['length']).toBe(undefined);
        expect(fileComponent.luxSelectedFiles['name']).toEqual('mockfile1.txt');
        expect(fixture.debugElement.query(By.css('mat-error'))).not.toBe(null);
        expect(fixture.debugElement.query(By.css('mat-error')).nativeElement.textContent.trim()).toEqual(
          'Die Datei "mockfile2.txt" überschreitet mit 20MB die erlaubte Dateigröße von 5MB'
        );
      }));

      it('die luxUploadUrl nicht erreichbar ist', fakeAsync(() => {
        // Vorbedingungen prüfen
        const httpClient = fixture.debugElement.injector.get(HttpClient);
        const spy = spyOn(httpClient, 'post').and.returnValue(throwError('404'));
        testComponent.multiple = true;
        fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')]);
        LuxTestHelper.wait(fixture);

        expect(spy).toHaveBeenCalledTimes(0);
        expect(fileComponent.formControl.errors).toBe(null);
        expect(fileComponent.formControl.valid).toBe(true);
        expect(fixture.debugElement.query(By.css('mat-error'))).toBe(null);

        // Änderungen durchführen
        testComponent.uploadUrl = '/test/api/';
        LuxTestHelper.wait(fixture);
        fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')]);
        LuxTestHelper.wait(fixture);

        // Nachbedingungen prüfen
        expect(spy).toHaveBeenCalledTimes(1);
        expect(fileComponent.formControl.errors).not.toBe(null);
        expect(fileComponent.formControl.errors[LuxFileErrorCause.UploadFileError]).toBeDefined();
        expect(fileComponent.formControl.valid).toBe(false);
        expect(fileComponent.luxSelectedFiles['length']).toBe(undefined);
        expect(fileComponent.luxSelectedFiles['name']).toEqual('mockfile1.txt');
        expect(fixture.debugElement.query(By.css('mat-error'))).not.toBe(null);
        expect(fixture.debugElement.query(By.css('mat-error')).nativeElement.textContent.trim()).toEqual(
          'Das Hochladen der ausgewählten Datei ist fehlgeschlagen'
        );
      }));

      it('wenn luxMultiple false ist und n > 1 Dateien ausgewählt werden', fakeAsync(() => {
        // Vorbedingungen prüfen
        expect(fileComponent.formControl.errors).toBe(null);
        expect(fileComponent.formControl.valid).toBe(true);
        expect(fixture.debugElement.query(By.css('mat-error'))).toBe(null);
        expect(fileComponent.luxSelectedFiles).toBeFalsy();

        // Änderungen durchführen
        const files = [
          LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt'),
          LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')
        ];
        fileComponent.selectFiles(files);
        LuxTestHelper.wait(fixture);

        // Nachbedingungen prüfen
        expect(fileComponent.formControl.errors).not.toBe(null);
        expect(fileComponent.formControl.errors[LuxFileErrorCause.MultipleForbidden]).toBeDefined();
        expect(fileComponent.formControl.valid).toBe(false);
        expect(fileComponent.luxSelectedFiles).toBeFalsy();
        expect(fixture.debugElement.query(By.css('mat-error'))).not.toBe(null);
        expect(fixture.debugElement.query(By.css('mat-error')).nativeElement.textContent.trim()).toEqual(
          'Es darf nur eine Datei ausgewählt werden'
        );

        // Änderungen durchführen
        fileComponent.selectFiles([files[0]]);
        LuxTestHelper.wait(fixture);

        // Nachbedingungen prüfen
        expect(fileComponent.formControl.errors).toBe(null);
        expect(fileComponent.formControl.valid).toBe(true);
        expect(fixture.debugElement.query(By.css('mat-error'))).toBe(null);
        expect(fileComponent.luxSelectedFiles).toBeTruthy();

        // Änderungen durchführen
        testComponent.multiple = true;
        LuxTestHelper.wait(fixture);
        fileComponent.selectFiles(files);
        LuxTestHelper.wait(fixture);

        // Nachbedingungen prüfen
        expect(fileComponent.formControl.errors).toBe(null);
        expect(fileComponent.formControl.valid).toBe(true);
        expect(fixture.debugElement.query(By.css('mat-error'))).toBe(null);
        expect(fileComponent.luxSelectedFiles).toBeTruthy();

        flush();
      }));

      it('wenn ein Dateityp sich in der Groß- und Kleinschreibung unterscheidet', fakeAsync(() => {
        // Vorbedingungen prüfen
        LuxTestHelper.wait(fixture);
        expect(fileComponent.formControl.errors).toBe(null);
        expect(fileComponent.formControl.valid).toBe(true);
        expect(fixture.debugElement.query(By.css('mat-error'))).toBe(null);

        // Änderungen durchführen,
        testComponent.accept = '.html,.pdf,image/*,.txt';
        testComponent.multiple = true;
        LuxTestHelper.wait(fixture);

        // Änderungen durchführen,
        fileComponent.selectFiles([
          LuxTestHelper.createFileBrowserSafe('mockfile1.PDF', 'text/Pdf'),
          LuxTestHelper.createFileBrowserSafe('mockfile2.Txt', 'text/plain'),
          LuxTestHelper.createFileBrowserSafe('mockfile3.PnG', 'image/pnG')
        ]);
        LuxTestHelper.wait(fixture);

        // Nachbedingungen prüfen
        expect(fileComponent.formControl.errors).toBe(null);
        expect(fileComponent.formControl.valid).toBe(true);
        expect(fixture.debugElement.query(By.css('mat-error'))).toBe(null);

        flush();
      }));

      it('wenn ein Dateityp nicht unter luxAccept geführt wird', fakeAsync(() => {
        // Vorbedingungen prüfen
        LuxTestHelper.wait(fixture);
        expect(fileComponent.formControl.errors).toBe(null);
        expect(fileComponent.formControl.valid).toBe(true);
        expect(fixture.debugElement.query(By.css('mat-error'))).toBe(null);

        // Änderungen durchführen,
        testComponent.accept = '.html,.pdf,/image/*';
        LuxTestHelper.wait(fixture);
        fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile.txt', 'text/txt')]);
        LuxTestHelper.wait(fixture);

        // Nachbedingungen prüfen
        expect(fileComponent.formControl.errors).not.toBe(null);
        expect(fileComponent.formControl.errors[LuxFileErrorCause.FileNotAccepted]).toBeDefined();
        expect(fileComponent.formControl.valid).toBe(false);
        expect(fixture.debugElement.query(By.css('mat-error'))).not.toBe(null);
        expect(fixture.debugElement.query(By.css('mat-error')).nativeElement.textContent.trim()).toEqual(
          'Die Datei "mockfile.txt" hat einen nicht akzeptierten Dateityp'
        );

        // Änderungen durchführen,
        fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.pdf', 'text/pdf')]);
        LuxTestHelper.wait(fixture);

        // Nachbedingungen prüfen
        expect(fileComponent.formControl.errors).toBe(null);
        expect(fileComponent.formControl.valid).toBe(true);
        expect(fixture.debugElement.query(By.css('mat-error'))).toBe(null);

        flush();
      }));
    });

    describe('Sollte Action-Konfigurationen korrekt behandeln', () => {
      beforeEach(() => {
        testComponent.multiple = true;
        fixture.detectChanges();
      });

      describe('[uploadActionConfig]', () => {
        it('Sollte die Upload-Buttons verstecken', fakeAsync(() => {
          // Vorbedingungen prüfen
          testComponent.multiple = true;
          LuxTestHelper.wait(fixture);
          const files = [
            LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt'),
            LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')
          ];
          fileComponent.selectFiles(files);
          LuxTestHelper.wait(fixture);

          flush();

          LuxTestHelper.wait(fixture);

          expect(fixture.debugElement.query(By.css('.lux-file-list-header-add'))).not.toBe(null);
          expect(
            fixture.debugElement.queryAll(By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-upload]')).length
          ).toBe(2);

          // Änderungen durchführen
          testComponent.uploadActionConfig.hidden = true;
          testComponent.uploadActionConfig.hiddenHeader = true;
          LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(fixture.debugElement.query(By.css('.lux-file-list-header-add'))).toBe(null);
          const debugElements = fixture.debugElement.queryAll(
            By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-upload]')
          );
          debugElements.forEach(debugElement => {
            expect(debugElement.nativeElement.classList.toString()).toContain('lux-display-none');
          });
        }));

        it('Sollte die Upload-Buttons deaktivieren', fakeAsync(() => {
          // Vorbedingungen prüfen
          const files = [
            LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt'),
            LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')
          ];
          fileComponent.selectFiles(files);
          LuxTestHelper.wait(fixture);

          expect(
            fixture.debugElement.query(By.css('lux-button.lux-file-list-header-add button')).nativeElement.disabled
          ).toBe(false);
          expect(
            fixture.debugElement.queryAll(
              By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-upload] button')
            )[0].nativeElement.disabled
          ).toBe(false);
          expect(
            fixture.debugElement.queryAll(
              By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-upload] button')
            )[1].nativeElement.disabled
          ).toBe(false);

          // Änderungen durchführen
          testComponent.uploadActionConfig.disabled = true;
          testComponent.uploadActionConfig.disabledHeader = true;
          LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(
            fixture.debugElement.query(By.css('lux-button.lux-file-list-header-add button')).nativeElement.disabled
          ).toBe(true);
          expect(
            fixture.debugElement.queryAll(
              By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-upload] button')
            )[0].nativeElement.disabled
          ).toBe(true);
          expect(
            fixture.debugElement.queryAll(
              By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-upload] button')
            )[1].nativeElement.disabled
          ).toBe(true);
        }));

        it('Sollte den Callback aufrufen', fakeAsync(() => {
          // Vorbedingungen prüfen
          const files = [LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')];
          const spy = spyOn(testComponent.uploadActionConfig, 'onClick');
          LuxTestHelper.wait(fixture);

          expect(spy).toHaveBeenCalledTimes(0);

          // Änderungen durchführen
          fileComponent.selectFiles(files);
          LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith(fileComponent.luxSelectedFiles);

          // Änderungen durchführen
          fileComponent.selectFiles([LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt')]);
          LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(spy).toHaveBeenCalledTimes(2);
          expect(spy).toHaveBeenCalledWith(fileComponent.luxSelectedFiles);
        }));
      });

      describe('[downloadActionConfig]', () => {
        it('Sollte die Download-Buttons verstecken', fakeAsync(() => {
          // Vorbedingungen prüfen
          const files = [
            LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt'),
            LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')
          ];
          fileComponent.selectFiles(files);
          LuxTestHelper.wait(fixture);

          expect(
            fixture.debugElement.queryAll(By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-download]'))
              .length
          ).toBe(2);

          // Änderungen durchführen
          testComponent.downloadActionConfig.hidden = true;
          LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          const debugElements = fixture.debugElement.queryAll(
            By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-download]')
          );
          debugElements.forEach(debugElement => {
            expect(debugElement.nativeElement.classList.toString()).toContain('lux-display-none');
          });
        }));

        it('Sollte die Download-Buttons deaktivieren', fakeAsync(() => {
          // Vorbedingungen prüfen
          const files = [
            LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt'),
            LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')
          ];
          fileComponent.selectFiles(files);
          LuxTestHelper.wait(fixture);

          expect(
            fixture.debugElement.queryAll(
              By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-download] button')
            )[0].nativeElement.disabled
          ).toBe(false);
          expect(
            fixture.debugElement.queryAll(
              By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-download] button')
            )[1].nativeElement.disabled
          ).toBe(false);

          // Änderungen durchführen
          testComponent.downloadActionConfig.disabled = true;
          LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(
            fixture.debugElement.queryAll(
              By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-download] button')
            )[0].nativeElement.disabled
          ).toBe(true);
          expect(
            fixture.debugElement.queryAll(
              By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-download] button')
            )[1].nativeElement.disabled
          ).toBe(true);
        }));

        it('Sollte den Callback aufrufen', fakeAsync(() => {
          // Vorbedingungen prüfen
          // den Download für den Test verhindern
          spyOn(fileComponent.downloadLink.nativeElement, 'click');

          const files = [
            LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt'),
            LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')
          ];
          const spy = spyOn(testComponent.downloadActionConfig, 'onClick');
          LuxTestHelper.wait(fixture);

          expect(spy).toHaveBeenCalledTimes(0);

          // Änderungen durchführen
          fileComponent.selectFiles(files);
          LuxTestHelper.wait(fixture);
          fixture.debugElement
            .queryAll(By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-download] button'))[0]
            .nativeElement.click();
          LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith(fileComponent.luxSelectedFiles[0]);

          // Änderungen durchführen
          fixture.debugElement
            .queryAll(By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-download] button'))[1]
            .nativeElement.click();
          LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(spy).toHaveBeenCalledTimes(2);
          expect(spy).toHaveBeenCalledWith(fileComponent.luxSelectedFiles[1]);
        }));
      });

      describe('[deleteActionConfig]', () => {
        it('Sollte die Delete-Buttons verstecken', fakeAsync(() => {
          // Vorbedingungen prüfen
          const files = [
            LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt'),
            LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')
          ];
          fileComponent.selectFiles(files);
          LuxTestHelper.wait(fixture);

          expect(fixture.debugElement.query(By.css('lux-button.lux-file-list-header-clear'))).not.toBe(null);
          expect(
            fixture.debugElement.queryAll(By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-remove]')).length
          ).toBe(2);

          // Änderungen durchführen
          testComponent.deleteActionConfig.hidden = true;
          testComponent.deleteActionConfig.hiddenHeader = true;
          LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          const debugElements = fixture.debugElement.queryAll(
            By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-remove]')
          );
          debugElements.forEach(debugElement => {
            expect(debugElement.nativeElement.classList.toString()).toContain('lux-display-none');
          });
        }));

        it('Sollte die Delete-Buttons deaktivieren', fakeAsync(() => {
          // Vorbedingungen prüfen
          expect(
            fixture.debugElement.query(By.css('lux-button.lux-file-list-header-clear button')).nativeElement.disabled
          ).toBe(true);

          // Änderungen durchführen
          const files = [
            LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt'),
            LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')
          ];
          fileComponent.selectFiles(files);
          LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(
            fixture.debugElement.query(By.css('lux-button.lux-file-list-header-clear button')).nativeElement.disabled
          ).toBe(false);
          expect(
            fixture.debugElement.queryAll(
              By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-remove] button')
            )[0].nativeElement.disabled
          ).toBe(false);
          expect(
            fixture.debugElement.queryAll(
              By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-remove] button')
            )[1].nativeElement.disabled
          ).toBe(false);

          // Änderungen durchführen
          testComponent.deleteActionConfig.disabled = true;
          testComponent.deleteActionConfig.disabledHeader = true;
          LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(
            fixture.debugElement.query(By.css('lux-button.lux-file-list-header-clear button')).nativeElement.disabled
          ).toBe(true);
          expect(
            fixture.debugElement.queryAll(
              By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-remove] button')
            )[0].nativeElement.disabled
          ).toBe(true);
          expect(
            fixture.debugElement.queryAll(
              By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-remove] button')
            )[1].nativeElement.disabled
          ).toBe(true);
        }));

        it('Sollte den Callback aufrufen', fakeAsync(() => {
          // Vorbedingungen prüfen
          const files = [
            LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt'),
            LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')
          ];
          const spy = spyOn(testComponent.deleteActionConfig, 'onClick');
          LuxTestHelper.wait(fixture);
          fileComponent.selectFiles(files);
          LuxTestHelper.wait(fixture);

          expect(spy).toHaveBeenCalledTimes(0);
          expect(fixture.debugElement.queryAll(By.css('.lux-file-list-entry')).length).toBe(2);

          // Änderungen durchführen
          fixture.debugElement.query(By.css('lux-button.lux-file-list-header-clear button')).nativeElement.click();
          LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(spy).toHaveBeenCalledTimes(1);
          expect(fixture.debugElement.queryAll(By.css('.lux-file-list-entry')).length).toBe(0);

          // Änderungen durchführen
          fileComponent.selectFiles(files);
          LuxTestHelper.wait(fixture);
          fixture.debugElement
            .queryAll(By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-remove] button'))[0]
            .nativeElement.click();
          LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(spy).toHaveBeenCalledTimes(2);
          expect(fixture.debugElement.queryAll(By.css('.lux-file-list-entry')).length).toBe(1);

          // Änderungen durchführen
          fixture.debugElement
            .queryAll(By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-remove] button'))[0]
            .nativeElement.click();
          LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(spy).toHaveBeenCalledTimes(3);
          expect(fixture.debugElement.queryAll(By.css('.lux-file-list-entry')).length).toBe(0);
        }));
      });

      describe('[viewActionConfig]', () => {
        it('Sollte die View-Buttons verstecken', fakeAsync(() => {
          // Vorbedingungen prüfen
          const files = [
            LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt'),
            LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')
          ];
          fileComponent.selectFiles(files);
          LuxTestHelper.wait(fixture);

          expect(
            fixture.debugElement.queryAll(By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-view]')).length
          ).toBe(2);

          // Änderungen durchführen
          testComponent.viewActionConfig.hidden = true;
          LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          const debugElements = fixture.debugElement.queryAll(
            By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-view]')
          );
          debugElements.forEach(debugElement => {
            expect(debugElement.nativeElement.classList.toString()).toContain('lux-display-none');
          });
        }));

        it('Sollte die View-Buttons deaktivieren', fakeAsync(() => {
          // Vorbedingungen prüfen
          const files = [
            LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt'),
            LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')
          ];
          fileComponent.selectFiles(files);
          LuxTestHelper.wait(fixture);

          expect(
            fixture.debugElement.queryAll(
              By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-view] button')
            )[0].nativeElement.disabled
          ).toBe(false);
          expect(
            fixture.debugElement.queryAll(
              By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-view] button')
            )[1].nativeElement.disabled
          ).toBe(false);

          // Änderungen durchführen
          testComponent.viewActionConfig.disabled = true;
          LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(
            fixture.debugElement.queryAll(
              By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-view] button')
            )[0].nativeElement.disabled
          ).toBe(true);
          expect(
            fixture.debugElement.queryAll(
              By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-view] button')
            )[1].nativeElement.disabled
          ).toBe(true);
        }));

        it('Sollte den Callback aufrufen', fakeAsync(() => {
          // Vorbedingungen prüfen
          const files = [
            LuxTestHelper.createFileBrowserSafe('mockfile1.txt', 'text/txt'),
            LuxTestHelper.createFileBrowserSafe('mockfile2.txt', 'text/txt')
          ];
          const spy = spyOn(testComponent.viewActionConfig, 'onClick');
          LuxTestHelper.wait(fixture);

          expect(spy).toHaveBeenCalledTimes(0);

          // Änderungen durchführen
          fileComponent.selectFiles(files);
          LuxTestHelper.wait(fixture);
          fixture.debugElement
            .queryAll(By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-view] button'))[0]
            .nativeElement.click();
          LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith(fileComponent.luxSelectedFiles[0]);

          // Änderungen durchführen
          fixture.debugElement
            .queryAll(By.css('lux-button[ng-reflect-lux-tag-id=lux-file-list-entry-view] button'))[1]
            .nativeElement.click();
          LuxTestHelper.wait(fixture);

          // Nachbedingungen prüfen
          expect(spy).toHaveBeenCalledTimes(2);
          expect(spy).toHaveBeenCalledWith(fileComponent.luxSelectedFiles[1]);
        }));
      });
    });
  });
});

@Component({
  template: `
    <lux-file-list
      [luxLabel]="label"
      [luxHint]="hint"
      [luxRequired]="required"
      [luxReadonly]="readonly"
      [luxDisabled]="disabled"
      [luxAccept]="accept"
      [luxCapture]="capture"
      [luxMaxSizeMB]="maxSizeMb"
      [luxUploadUrl]="uploadUrl"
      [luxSelectedFiles]="selected"
      [luxShowPreview]="showPreview"
      [luxMultiple]="multiple"
      [luxBackgroundIconName]="bgIconName"
      [luxUploadActionConfig]="uploadActionConfig"
      [luxDownloadActionConfig]="downloadActionConfig"
      [luxDeleteActionConfig]="deleteActionConfig"
      [luxViewActionConfig]="viewActionConfig"
      [luxContentsAsBlob]="contentsAsBlob"
      (luxSelectedFilesChange)="selectedChange($event)"
    >
    </lux-file-list>
  `
})
class FileComponent {
  label;
  hint;
  required;
  readonly;
  disabled;
  accept;
  capture;
  iconName;
  maxSizeMb = 10;
  uploadUrl;
  bgIconName: string;
  showPreview;
  multiple;
  contentsAsBlob;

  selected: ILuxFileObject | ILuxFileObject[];

  uploadActionConfig: ILuxFileListActionConfig = {
    disabled: false,
    disabledHeader: false,
    hidden: false,
    hiddenHeader: false,
    iconName: 'fas fa-cloud-upload-alt',
    iconNameHeader: 'fas fa-cloud-upload-alt',
    label: 'Hochladen',
    labelHeader: 'Neue Dateien hochladen',
    onClick: $event => null
  };
  deleteActionConfig: ILuxFileListActionConfig = {
    disabled: false,
    disabledHeader: false,
    hidden: false,
    hiddenHeader: false,
    iconName: 'fas fa-trash',
    iconNameHeader: 'fas fa-trash',
    label: 'Löschen',
    labelHeader: 'Alle Dateien entfernen',
    onClick: $event => null
  };
  viewActionConfig: ILuxFileActionConfig = {
    disabled: false,
    hidden: false,
    iconName: 'fas fa-eye',
    label: 'Anzeigen',
    onClick: $event => null
  };
  downloadActionConfig: ILuxFileActionConfig = {
    disabled: false,
    hidden: false,
    iconName: 'fas fa-download',
    label: 'Downloaden',
    onClick: $event => null
  };

  selectedChange($event) {
    this.selected = $event;
  }
}

@Component({
  template: `
    <div [formGroup]="form">
      <lux-file-list
        [luxLabel]="label"
        [luxHint]="hint"
        [luxControlBinding]="'file'"
        [luxReadonly]="readonly"
        [luxDisabled]="disabled"
        [luxAccept]="accept"
        [luxCapture]="capture"
        [luxMultiple]="multiple"
        [luxMaxSizeMB]="maxSizeMb"
        [luxUploadUrl]="uploadUrl"
      >
      </lux-file-list>
    </div>
  `
})
class FileFormComponent {
  form: FormGroup;
  formControl: AbstractControl;

  label;
  hint;
  readonly;
  disabled;
  accept;
  capture;
  iconName;
  maxSizeMb = 10;
  uploadUrl;
  multiple: boolean;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      file: []
    });
    this.formControl = this.form.get('file');
  }
}

class MockHttp {
  post(...any) {
    return of(null);
  }
}

class MockStorage {
  getItem(...any): string {
    return '';
  }

  setItem(...any) {}
}

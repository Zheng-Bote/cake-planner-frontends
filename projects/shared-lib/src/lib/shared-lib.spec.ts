/**
 * @file shared-lib.spec.ts
 * @brief Unit tests for the SharedLib component.
 * @version 1.0.0
 * @date 2026-01-25
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedLib } from './shared-lib';

describe('SharedLib', () => {
  let component: SharedLib;
  let fixture: ComponentFixture<SharedLib>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedLib]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedLib);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
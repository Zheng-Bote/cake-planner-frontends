/**
 * @file two-factor-setup.spec.ts
 * @brief Unit tests for the TwoFactorSetup component.
 * @version 1.0.0
 * @date 2026-01-25
 *
 * @author ZHENG Robert (robert@hase-zheng.net)
 * @copyright Copyright (c) 2026 ZHENG Robert
 *
 * @license MIT License
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoFactorSetup } from './two-factor-setup';

describe('TwoFactorSetup', () => {
  let component: TwoFactorSetup;
  let fixture: ComponentFixture<TwoFactorSetup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwoFactorSetup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TwoFactorSetup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});